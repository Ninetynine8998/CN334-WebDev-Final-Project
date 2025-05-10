# ในไฟล์ user_service/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate # Import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # Import ตัวนี้

User = get_user_model()

# Serializer สำหรับลงทะเบียน (โค้ดเดิม)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

# Serializer สำหรับดูข้อมูลผู้ใช้ (โค้ดเดิม)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined')
        read_only_fields = ('username', 'date_joined')


# *** เพิ่มโค้ดส่วนนี้เข้ามา ***
# Serializer สำหรับ Login ที่รองรับ username หรือ email
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    # เราไม่ต้องกำหนด field 'username' และ 'password' ที่นี่
    # เพราะ TokenObtainPairSerializer มี fields เหล่านี้อยู่แล้ว
    # แต่เราจะ override เมธอด validate

    @classmethod
    def get_token(cls, user):
        # เมธอดนี้ใช้สร้าง Token จาก User
        # โดยปกติไม่ต้องแก้ไข แต่ถ้าต้องการเพิ่ม claim พิเศษใน token สามารถทำได้ที่นี่
        token = super().get_token(user)

        # ตัวอย่าง: เพิ่ม custom claims
        # token['name'] = user.first_name + ' ' + user.last_name
        # token['email'] = user.email

        return token

    def validate(self, attrs):
        # เมธอดนี้ใช้ตรวจสอบข้อมูลและยืนยันตัวตน
        # attrs คือ dictionary ที่มีข้อมูลที่ส่งมา เช่น {'username': '...', 'password': '...'}

        # ดึง username (หรือ email) และ password ออกมา
        # simplejwt คาดหวัง field ชื่อ 'username' ตามค่าเริ่มต้น
        username_or_email = attrs.get('username')
        password = attrs.get('password')

        # ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่ (simplejwt serializer อาจจะทำให้อยู่แล้ว)
        if not username_or_email or not password:
             # ถ้าไม่มี ให้เรียก validate ของคลาสแม่เพื่อจัดการ Error
            return super().validate(attrs)

        # ลองหา User โดยใช้ username_or_email
        # ตรวจสอบว่าเป็น email หรือไม่ (อย่างง่ายๆ คือมี @)
        if '@' in username_or_email:
            # ถ้าดูเหมือน email ลองหา user จาก email (case-insensitive)
            try:
                user = User.objects.get(email__iexact=username_or_email)
                # ถ้าเจอ user ด้วย email ให้ใช้ username ของ user นั้นในการ authenticate
                username_for_auth = user.username
            except User.DoesNotExist:
                # ถ้าไม่เจอ user ด้วย email ให้ตั้ง username เป็น None หรือ input เดิมก็ได้
                # การเรียก authenticate ด้วย username ที่ไม่มีอยู่จะทำให้ authentication ล้มเหลว
                username_for_auth = username_or_email # หรือ None ก็ได้

        else:
            # ถ้าไม่เหมือน email ให้ถือว่าเป็น username และใช้ username_or_email ในการ authenticate
            username_for_auth = username_or_email

        # ทำการยืนยันตัวตนโดยใช้ authenticate
        # Django's authenticate จะใช้ AUTHENTICATION_BACKENDS ใน settings.py
        # ตรวจสอบว่า AUTHENTICATION_BACKENDS มี ModelBackend หรือ Custom Backend ที่รองรับการหา User ด้วย email หรือ username แล้ว
        user = authenticate(
            request=self.context.get('request'), # ส่ง request เข้าไปด้วย
            username=username_for_auth,
            password=password
        )

        # ตรวจสอบผลการ authenticate
        if user is None:
            # ถ้า authenticate ไม่ผ่าน (user เป็น None)
            # เราสามารถใช้ ValidationError หรือเรียก validate ของคลาสแม่เพื่อให้มัน raise error
            raise serializers.ValidationError('No active account found with the given credentials')
            # หรือ return super().validate(attrs) # simplejwt จะ raise error 'No active account found with the given credentials' เอง

        # ถ้า authenticate ผ่านแล้ว (user ไม่ใช่ None)
        # ให้เรียก validate ของคลาสแม่ เพื่อให้มันสร้าง access และ refresh token ให้
        # เราต้องส่ง user object ที่ authenticate ได้ เข้าไปใน context หรือ attrs ให้คลาสแม่ด้วย
        # simplejwt's validate คาดหวังว่า self.user จะถูก set หลังจาก authenticate สำเร็จ
        self.user = user # กำหนด self.user เป็น user ที่ authenticate ได้

        # เรียก validate ของคลาสแม่เพื่อสร้าง tokens
        # Note: super().validate(attrs) จะใช้ self.user ที่เรากำหนดไว้
        refresh_and_access = super().validate(attrs)

        return refresh_and_access # คืน tokens ที่ได้จากคลาสแม่
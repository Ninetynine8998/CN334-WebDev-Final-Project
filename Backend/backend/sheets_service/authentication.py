from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from django.conf import settings
import datetime # นำเข้า datetime เพิ่มเติม ถ้ายังไม่มี

# นำเข้า Custom Token Model ของคุณ (ตรวจสอบชื่อและ path ให้ถูกต้อง)
from .models import ExpiringToken # ใช้ชื่อตามที่คุณตั้งไว้

class ExpiringTokenAuthentication(TokenAuthentication):
    # เมธอดนี้ถูกเรียกเมื่อมี Header Authorization: Token <key> หรือ Bearer <key>
    # DRF จะแยกเอาเฉพาะ <key> มาให้ใน parameter 'key'
    def authenticate_credentials(self, key):
        # --- เพิ่มบรรทัด print เพื่อตรวจสอบ ---
        print(f"--- Authenticate Credentials ---")
        print(f"Received Token Key: '{key}'") # พิมพ์ Token key ที่รับมา (มี ' ครอบเพื่อดูว่ามีช่องว่างติดมาไหม)
        # ------------------------------------

        try:
            # ค้นหา Token จาก key ที่รับมาในฐานข้อมูล โดยใช้ Custom Model ของคุณ
            # ตรวจสอบว่าใช้ชื่อ Model ที่ถูกต้องตรงนี้
            token = ExpiringToken.objects.select_related('user').get(key=key)
            # หรือถ้าใช้ alias 'as Token'
            # token = Token.objects.select_related('user').get(key=key)

            # --- เพิ่มบรรทัด print หากค้นหา Token เจอ ---
            print(f"Token found in DB for user: {token.user.username}")
            print(f"Token created at: {token.created} ({token.created.tzinfo})") # แสดง Timezone ด้วย
            # ----------------------------------------

        except ExpiringToken.DoesNotExist: # จับ exception ถ้าค้นหา Token ไม่เจอ
             # หรือถ้าใช้ alias 'as Token'
             # except Token.DoesNotExist:
            # --- เพิ่มบรรทัด print หากค้นหา Token ไม่เจอ ---
            print(f"Token key '{key}' NOT found in database.")
            # ------------------------------------------
            # โยน exception บอกว่า Token ไม่ถูกต้อง
            raise AuthenticationFailed('Invalid token.')
        except Exception as e:
            # --- เพิ่มบรรทัด print หากเกิดข้อผิดพลาดอื่นๆ ระหว่างค้นหา ---
            print(f"An unexpected error occurred during token lookup: {e}")
            # ----------------------------------------------------------
            # โยน exception บอกว่า Token ไม่ถูกต้อง (หรือจะโยน error อื่นก็ได้)
            raise AuthenticationFailed('Invalid token.')


        # --- ส่วนตรวจสอบการหมดอายุ ---
        # ตรวจสอบว่า token.created เป็น datetime object ที่มี timezone หรือไม่
        if token.created.tzinfo is None:
             print("Warning: Token created time has no timezone info.")
             # อาจจะต้องพิจารณาว่าควรทำอย่างไร ถ้า created time ไม่มี timezone
             # เช่น asssume เป็น UTC เหมือน now() หรือแปลงให้มี timezone
             # สำหรับตอนนี้ สมมติว่ามันควรจะมี timezone หรือเปรียบเทียบได้
             # ถ้าเปรียบเทียบไม่ได้ อาจเกิด error ในบรรทัดถัดไป

        now = timezone.now() # เวลาปัจจุบัน (เป็น UTC)
        token_creation_time = token.created # เวลาที่สร้าง Token

        # ตรวจสอบว่าเวลาทั้งสองมี timezone หรือไม่ และเปรียบเทียบกันได้หรือไม่
        # ถ้า now มี timezone แต่ token_creation_time ไม่มี จะเปรียบเทียบกันไม่ได้
        if now.tzinfo is not None and token_creation_time.tzinfo is None:
             # ถ้าเวลาสร้าง Token ไม่มี timezone ให้ถือว่าเป็นเวลา UTC เหมือน now()
             # หรือจัดการตามนโยบายของคุณ
             print("Adjusting token created time to UTC for comparison.")
             token_creation_time = timezone.make_aware(token_creation_time, timezone=timezone.utc)
        elif now.tzinfo is None and token_creation_time.tzinfo is not None:
             print("Warning: Current time has no timezone info, but token time does.")
             # กรณีนี้ไม่ควรเกิดขึ้นถ้า USE_TZ=True ใน settings

        # คำนวณว่า Token นี้มีอายุเท่าไรแล้ว (เวลาปัจจุบัน - เวลาที่สร้าง)
        token_age = now - token_creation_time


        # ดึงระยะเวลาหมดอายุจาก settings และสร้าง timedelta
        # ตรวจสอบชื่อ setting TOKEN_EXPIRY_TIME อีกครั้งว่าตรงไหม
        expiry_time_seconds = getattr(settings, 'TOKEN_EXPIRY_TIME', 86400) # default 24 ชม.
        # ตรวจสอบว่า expiry_time_seconds เป็นตัวเลข
        if not isinstance(expiry_time_seconds, (int, float)):
             print(f"Warning: TOKEN_EXPIRY_TIME setting is not a number: {expiry_time_seconds}")
             # ถ้าไม่ใช่ตัวเลข ให้ใช้ค่า default
             expiry_time_seconds = 86400

        expiry_time_delta = timezone.timedelta(seconds=expiry_time_seconds)

        # --- เพิ่มบรรทัด print เกี่ยวกับเวลาและอายุ ---
        print(f"Current time (UTC): {now}") # W เวลาปัจจุบัน (DRF ใช้ UTC)
        print(f"Token created time (UTC): {token_creation_time}") # เวลาสร้าง Token (หลังปรับ TZ ถ้าจำเป็น)
        print(f"Calculated Token Age: {token_age}") # อายุ Token
        print(f"Expiry Delta: {expiry_time_delta}") # ระยะเวลาหมดอายุ
        # ------------------------------------

        # ตรวจสอบอายุ Token
        if token_age > expiry_time_delta:
            # --- เพิ่มบรรทัด print หาก Token หมดอายุ ---
            print("Token has expired based on age calculation.")
            # -------------------------------------------
            # โยน exception บอกว่า Token หมดอายุ
            raise AuthenticationFailed('Token has expired.')

        # ตรวจสอบผู้ใช้ active
        if not token.user.is_active:
            # --- เพิ่มบรรทัด print หากผู้ใช้ไม่ active ---
            print(f"User {token.user.username} is inactive.")
            # --------------------------------------------
            raise AuthenticationFailed('User inactive or deleted.')

        # --- เพิ่มบรรทัด print หาก Authentication สำเร็จ ---
        print(f"Authentication Successful for user: {token.user.username}")
        # -----------------------------------------------
        # ถ้าทุกอย่างถูกต้อง ให้คืนค่า (user, token)
        return (token.user, token)
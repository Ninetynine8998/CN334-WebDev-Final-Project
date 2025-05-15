// export const YELLOW_COLOR = "#F6B154";
// export const BLUE_COLOR = "#086886";
// export const DARK_BLUE_COLOR = "#0C2756";
// export const LIGHT_BLUE_COLOR = "#05C1B9";
// export const WHITE_COLOR = "#FFFFFF";
// export const RED_COLOR = "#EE7E50";


// export const API_IP = 'http://127.0.0.1:8000';


// export const CONFIG = () => {
//   if (typeof window === 'undefined') return {}; // ป้องกัน SSR
//   const token = localStorage.getItem('token');
//   return {
//     headers: {
//       'Authorization': `Token ${token}`,
//       'Content-Type': 'application/json',
//     }
//   };
// };
// components/Constant.js

export const YELLOW_COLOR = "#F6B154";
export const BLUE_COLOR = "#086B86";
export const DARK_BLUE_COLOR = "#0C2756";
export const LIGHT_BLUE_COLOR = "#05C1B9";
export const WHITE_COLOR = "#FFFFFF";
export const RED_COLOR = "#EE7E50";

// เปลี่ยน API_IP ให้อ่านค่ามาจาก Environment Variable แทน
// ใช้ process.env.NEXT_PUBLIC_... สำหรับ Environment Variable ที่ Client-side เข้าถึงได้ใน Next.js
export const API_IP = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'; // เพิ่มค่า default สำหรับ Local Development

// โค้ดส่วน CONFIG เดิม
export const CONFIG = () => {
    if (typeof window === 'undefined') return {}; // ป้องกัน Error ในระหว่าง SSR
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

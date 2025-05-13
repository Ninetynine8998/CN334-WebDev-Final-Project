export const YELLOW_COLOR = "#F6B154";
export const BLUE_COLOR = "#086886";
export const DARK_BLUE_COLOR = "#0C2756";
export const LIGHT_BLUE_COLOR = "#05C1B9";
export const WHITE_COLOR = "#FFFFFF";
export const RED_COLOR = "#EE7E50";


export const API_IP = 'http://127.0.0.1:8000';
// export const API_IP = 'http://localhost:8000'; // ใช้เฉพาะตอนพัฒนาที่เครื่องเดียวกัน


export const CONFIG = {
    headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }
};
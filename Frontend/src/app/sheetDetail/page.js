// "use client";

// import { useEffect, useState } from 'react';
// // import { useRouter, useSearchParams } from 'next/navigation';
// import Image from "next/image";
// import Container from "@/components/Container";
// import { YELLOW_COLOR, WHITE_COLOR, BLUE_COLOR, LIGHT_BLUE_COLOR, API_IP } from "@/components/Constant";
// import axios from 'axios';
// import { Suspense } from 'react';

// const mockData = {
//     sheed_id: 1,
//     subject_id: 1,
//     subject_name: "การอ่าน และจับใจคาม",
//     name: 'อ่านอย่างไรให้เข้าใจ',
//     subject_code: "TH112",
//     level: "ม.4",
//     price: 20,
//     description: 'ชีทนี้เป็นการแบ่งปันวิธีการอ่าน อ่านอย่างไรให้เข้าใจ ภายในเวลาสั้นๆ ทั้งเทคนิคการจำและการจดสรุป',
//     image: 'sheet1.svg',
//     modify_date: '4-05-2025',
//     create_date: "4-05-2025"
// };

// const initData = {
//     sheed_id: 0,
//     subject_id: 0,
//     name: "",
//     subject_code: "",
//     level: "",
//     price: 0,
//     description: '',
//     image: '',
//     modify_date: '',
//     create_date: ""
// };

// export default function SheetDetail() {
//     const router = useRouter();
//     // const searchParams = useSearchParams();
//     const sheet_id = searchParams.get("sheet_id");
//     const [sheet, setSheet] = useState(initData);

//     useEffect(() => {
//         setSheet(mockData);
//         console.log(sheet_id)
//     }, [sheet_id]);

//     useEffect(() => {
//         if (!sheet_id) return;

//         const fetchData = async () => {
//             try {
//                 const res = await axios.get(API_IP + `/api/sheet_detail/${sheet_id}/`);
//                 setSheet(res.data.sheet);
//                 console.log('sheet:', res.data.sheet);
//             } catch (err) {
//                 console.error('can not get subject:', err);
//             }
//         };

//         fetchData();
//     }, [sheet_id]);

//     const onAddToCart = async (sheet_id) => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             alert("กรุณาเข้าสู่ระบบก่อนเพิ่มลงตะกร้า");
//             router.push('/login'); // ✅ ทำงานต่อหลัง alert ถูกปิด
//             return;
//         }

//         const config = {
//             headers: {
//                 'Authorization': `Token ${token}`,
//                 'Content-Type': 'application/json'
//             }
//         };
//         const data = { sheet_id };

//         await axios.post(API_IP + '/api/add_to_cart/', data, config)
//             .then(res => {
//                 console.log(res.data);
//                 alert(res.data.message); // "Item added to cart"
//                 router.push('/cart'); // ✅ ทำงานต่อหลัง alert ถูกปิด

//             })
//             .catch((err) => {
//                 console.error(err);
//                 if (err.response.data.detail === 'Invalid token.' || err.response.data.detail === 'Token has expired.') {
//                     alert("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
//                     router.push('/login'); // ✅ ทำงานต่อหลัง alert ถูกปิด

//                 } else {
//                     alert("เกิดข้อผิดพลาดในการเพิ่มชีท");
//                 }
//             })

//     };


//     return (
//         <div className="contend">
//             <Container>
//                 <div className="detail-section" style={{
//                     paddingInline: "10%",

//                 }}>
//                     <div className="sheet-img">
//                         <Image
//                             src={`/${sheet.image || 'sheet1.svg'}`}
//                             alt="sheet image"
//                             width={400}
//                             height={400}
//                             style={{
//                                 width: "100%",
//                                 // height: "auto",
//                                 objectFit: "cover",
//                                 borderRadius: "10px"
//                             }}
//                         />
//                     </div>

//                     <div className="text"
//                         style={{
//                             width: '50%',
//                             padding: '20px',
//                             display: 'grid',
//                             rowGap: '20px',
//                             width: '100%',
//                             // backgroundColor: 'red'
//                         }}
//                     >
//                         <p style={{ fontWeight: "normal" }}>
//                             {`ระดับชั้น ${sheet.level}`}
//                         </p>
//                         <h1 style={{ fontSize: "1.5rem", margin: "0" }}>
//                             {sheet?.name || sheet?.title || "ไม่ทราบชื่อ"}
//                         </h1>
//                         <p style={{ fontWeight: "500", marginTop: "5px" }}>
//                             {sheet.subject_code.toUpperCase()} {sheet.subject?.name}
//                         </p>
//                         <p style={{ fontWeight: "bold", marginTop: "5px" }}>
//                             {sheet.price} บาท
//                         </p>
//                         <p style={{ marginTop: "10px", color: "#444" }}>
//                             {sheet.description.length < 5 ? 'ไม่มีคำอธิบายสำหรับชีทนี้' : sheet.description}
//                         </p>

//                         <button
//                             onClick={() => {
//                                 onAddToCart(sheet.sheet_id)
//                             }}
//                             style={{
//                                 marginTop: "20px",
//                                 backgroundColor: LIGHT_BLUE_COLOR,
//                                 padding: "10px 20px",

//                                 borderRadius: "5px",
//                                 border: "none",

//                                 color: WHITE_COLOR,
//                                 fontWeight: "bold",
//                                 fontSize: '110%',

//                                 cursor: "pointer",
//                                 width: '100%'
//                             }}
//                         >
//                             เพิ่มชีท
//                         </button>
//                     </div>
//                 </div>

//                 <style jsx>{`
//                     .detail-section {
//                         display: flex;
//                         flex-direction: row;
//                         gap: 30px;
//                         padding-top: 5%;
//                     }

//                     .sheet-img {
//                         width: 50%;
//                     }

                    

//                     @media (max-width: 768px) {
//                         .detail-section {
//                         flex-direction: column;
//                         }

//                         .sheet-img,
//                         .text {
//                         width: 100%;
//                         }

//                         .text {
//                         padding-top: 20px;
//                         }
//                     }
//                 `}</style>

//             </Container>
//         </div>
//     );
// }

// app/sheetDetail/page.js
'use client'; // Component นี้ต้องเป็น Client Component ทั้งไฟล์

import { useEffect, useState, Suspense } from 'react'; // Import Suspense ที่นี่
import { useRouter, useSearchParams } from 'next/navigation'; // Import Hooks ที่นี่
import Image from "next/image";
import Container from "@/components/Container";
import { YELLOW_COLOR, WHITE_COLOR, BLUE_COLOR, LIGHT_BLUE_COLOR, API_IP } from "@/components/Constant";
import axios from 'axios';

// คงที่ mockData และ initData เหมือนเดิม
const mockData = {
    sheed_id: 1,
    subject_id: 1,
    subject_name: "การอ่าน และจับใจคาม",
    name: 'อ่านอย่างไรให้เข้าใจ',
    subject_code: "TH112",
    level: "ม.4",
    price: 20,
    description: 'ชีทนี้เป็นการแบ่งปันวิธีการอ่าน อ่านอย่างไรให้เข้าใจ ภายในเวลาสั้นๆ ทั้งเทคนิคการจำและการจดสรุป',
    image: 'sheet1.svg',
    modify_date: '4-05-2025',
    create_date: "4-05-2025"
};

const initData = {
    sheed_id: 0,
    subject_id: 0,
    name: "",
    subject_code: "",
    level: "",
    price: 0,
    description: '',
    image: '',
    modify_date: '',
    create_date: ""
};

// สร้าง Functional Component ตัวใหม่ภายในไฟล์นี้ เพื่อใช้ Logic เดิม
function SheetDetailContentWithSearchParams() {
    // เรียกใช้ Hooks ที่นี่
    const router = useRouter();
    // useSearchParams ถูกเรียกใช้ภายใน Component นี้
    const searchParams = useSearchParams();
    const sheet_id = searchParams.get("sheet_id");

    const [sheet, setSheet] = useState(initData);

    // Hooks และ Function อื่นๆ เหมือนเดิม
    useEffect(() => {
        // setSheet(mockData); // พิจารณาว่ายังต้องการ mock data อยู่หรือไม่
        console.log("sheet_id from URL (inner component):", sheet_id);
    }, [sheet_id]); // Dependency array

    useEffect(() => {
        if (!sheet_id) {
             console.warn("No sheet_id found in URL in inner component.");
             return;
        }
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_IP}/api/sheet_detail/${sheet_id}/`);
                setSheet(res.data.sheet);
                console.log('sheet data fetched (inner component):', res.data.sheet);
            } catch (err) {
                console.error('Error fetching sheet detail (inner component):', err);
            }
        };
        fetchData();
    }, [sheet_id, API_IP]); // Dependency array

     const onAddToCart = async (sheet_id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("กรุณาเข้าสู่ระบบก่อนเพิ่มลงตะกร้า");
            router.push('/login');
            return;
        }
        const config = {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const data = { sheet_id };
        try {
            const res = await axios.post(`${API_IP}/api/add_to_cart/`, data, config);
            console.log(res.data);
            alert(res.data.message);
            // ตรวจสอบว่า /cart เป็น Path ที่ถูกต้องใน Frontend
            router.push('/cart');
        } catch (err) {
             console.error('Error adding to cart (inner component):', err);
             if (err.response && (err.response.data.detail === 'Invalid token.' || err.response.data.detail === 'Token has expired.')) {
                 alert("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
                 router.push('/login');
            } else {
                 alert("เกิดข้อผิดพลาดในการเพิ่มชีท");
            }
        }
    };

    // Return ส่วน JSX ทั้งหมดเหมือนเดิม
    return (
        <div className="contend">
            <Container>
                <div className="detail-section" style={{
                    paddingInline: "10%",
                }}>
                    <div className="sheet-img">
                         {/* ตรวจสอบ path ของรูปภาพใน production */}
                        <Image
                            src={`/${sheet.image || 'sheet1.svg'}`}
                            alt="sheet image"
                            width={400}
                            height={400}
                            style={{
                                width: "100%",
                                objectFit: "cover",
                                borderRadius: "10px"
                            }}
                        />
                    </div>

                    <div className="text"
                        style={{
                            width: '50%',
                            padding: '20px',
                            display: 'grid',
                            rowGap: '20px',
                            width: '100%',
                        }}
                    >
                        <p style={{ fontWeight: "normal" }}>
                            {`ระดับชั้น ${sheet.level}`}
                        </p>
                        <h1 style={{ fontSize: "1.5rem", margin: "0" }}>
                            {sheet?.name || sheet?.title || "ไม่ทราบชื่อ"}
                        </h1>
                        <p style={{ fontWeight: "500", marginTop: "5px" }}>
                            {sheet.subject_code.toUpperCase()} {sheet.subject?.name}
                        </p>
                        <p style={{ fontWeight: "bold", marginTop: "5px" }}>
                            {sheet.price} บาท
                        </p>
                        <p style={{ marginTop: "10px", color: "#444" }}>
                            {sheet.description.length < 5 ? 'ไม่มีคำอธิบายสำหรับชีทนี้' : sheet.description}
                        </p>

                        <button
                            onClick={() => {
                                onAddToCart(sheet.sheet_id)
                            }}
                            style={{
                                marginTop: "20px",
                                backgroundColor: LIGHT_BLUE_COLOR,
                                padding: "10px 20px",
                                borderRadius: "5px",
                                border: "none",
                                color: WHITE_COLOR,
                                fontWeight: "bold",
                                fontSize: '110%',
                                cursor: "pointer",
                                width: '100%'
                            }}
                        >
                            เพิ่มชีท
                        </button>
                    </div>
                </div>

                {/* Style JSX คงไว้ที่นี่ */}
                <style jsx>{`
                    .detail-section {
                        display: flex;
                        flex-direction: row;
                        gap: 30px;
                        padding-top: 5%;
                    }

                    .sheet-img {
                        width: 50%;
                    }

                    @media (max-width: 768px) {
                        .detail-section {
                            flex-direction: column;
                        }

                        .sheet-img,
                        .text {
                            width: 100%;
                        }

                        .text {
                            padding-top: 20px;
                        }
                    }
                `}</style>

            </Container>
        </div>
    );
}


// Functional Component หลักที่ถูก export ออกไป
export default function SheetDetail() {
    // Render Suspense และเรียกใช้ Component ย่อยที่สร้างขึ้น
    return (
        <Suspense fallback={<div>กำลังโหลดรายละเอียดชีท...</div>}>
            {/* เรียก Component ย่อยที่ใช้ useSearchParams ที่นี่ */}
            <SheetDetailContentWithSearchParams />
        </Suspense>
    );
}

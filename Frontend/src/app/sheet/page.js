// "use client";

// import { redirect, useSearchParams } from 'next/navigation'
// import { useRouter } from 'next/navigation';

// import Image from "next/image";
// import Container from "@/components/Container";

// import { YELLOW_COLOR, WHITE_COLOR, DARK_BLUE_COLOR, API_IP } from "@/components/Constant";
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { IoLogoDropbox } from "react-icons/io";


// // mock data
// const mockData = [
//     { sheed_id: 1, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
//     { sheed_id: 2, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
//     { sheed_id: 3, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
//     { sheed_id: 4, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
//     { sheed_id: 5, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
//     { sheed_id: 6, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
//     { sheed_id: 7, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
//     { sheed_id: 8, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
//     { sheed_id: 9, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
//     { sheed_id: 10, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
//     { sheed_id: 11, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
//     { sheed_id: 12, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
//     { sheed_id: 13, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
//     { sheed_id: 14, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
//     { sheed_id: 15, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
//     { sheed_id: 16, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
//     { sheed_id: 17, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
//     { sheed_id: 18, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
//     { sheed_id: 19, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
//     { sheed_id: 20, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
//     { sheed_id: 21, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
//     { sheed_id: 22, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
//     { sheed_id: 23, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
//     { sheed_id: 24, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
//     { sheed_id: 25, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
//     { sheed_id: 26, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
//     { sheed_id: 27, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
//     { sheed_id: 28, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
//     { sheed_id: 29, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
// ];

// export default function Sheet() {

//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const subject_id = searchParams.get("subject_id");
//     const subject_name = searchParams.get("subject_name");

//     const [sheet, setSheet] = useState(null);

//     // useEffect(() => {
//     //     console.log("subject_id", subject_id);
//     //     console.log("subject_name", subject_name);
//     //     // fetch data from API using subject_id
//     // }, [subject_id]);

//     useEffect(() => {
//         if (!subject_id) return;

//         const fetchData = async () => {
//             try {
//                 const res = await axios.get(API_IP + `/api/select_sheet/?subject_id=${subject_id}`);
//                 console.log('sheet:', res.data.sheet);
//                 setSheet(res.data.sheet);
//             } catch (err) {
//                 console.error('can not get subject:', err);
//             }
//         };

//         fetchData();
//     }, [subject_id]);




//     // ✅ Group data by level
//     // const groupedByLevel = mockData.reduce((acc, item) => {
//     const groupedByLevel = sheet?.reduce((acc, item) => {
//         if (!acc[item.level]) acc[item.level] = []; // ถ้ายังไม่มี key ของระดับชั้นนี้ ให้สร้าง array ว่าง
//         acc[item.level].push(item); // ใส่ item เข้าไปใน array ของ level นั้น
//         return acc; // คืนค่าผลสะสมไปยังรอบถัดไป
//     }, {});

//     const dateFormat = (isoDate) => {
//         const date = new Date(isoDate);

//         // แปลงให้ได้วันที่เป็น วัน-เดือน-ปี
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() เริ่มที่ 0
//         const year = date.getFullYear();

//         const formattedDate = `${day}-${month}-${year}`;
//         // console.log(formattedDate); // ✅ "11-05-2025"
//         return formattedDate

//     }

//     const renderSheetCard = (sheet) => (
//         <div
//             key={sheet.sheet_id}
//             // onClick={() => router.push(`/sheetDetail/${sheet.sheed_id}`)}  // ✅ เปลี่ยนหน้า
//             onClick={() =>
//                 router.push(`/sheetDetail?sheet_id=${sheet.sheet_id}`)
//             }  // ✅ เปลี่ยนหน้า
//             className="sheet-card"
//             style={{
//                 backgroundColor: YELLOW_COLOR,
//                 color: WHITE_COLOR,
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "space-between", // ✅ ดันส่วนล่างไปสุด

//                 display: 'flex',
//                 alignItems: "start",

//                 fontWeight: "bold",
//                 minWidth: "200px", //  ความกว้างคงที่เพื่อ scroll ได้
//                 minHeight: "200px",
//                 flexShrink: 0       //  ห้ามบีบการ์ดอัตโนมัติ
//             }}
//         >
//             <div
//                 className='contend'
//                 style={{
//                     padding: "10px",
//                     flexGrow: 1, // ✅ ให้เต็มพื้นที่เพื่อดันปุ่มด้านล่าง
//                 }}
//             >

//                 <div style={{ fontSize: "120%" }}>
//                     <h1>
//                         {sheet.subject_code.toUpperCase() || "AA101"}
//                     </h1>
//                 </div>

//                 <div style={{
//                     fontWeight: 'normal',
//                     display: 'grid',
//                     rowGap: '10%'
//                 }}>

//                     <p>
//                         {/* {sheet.name || "Sheet"} */}
//                         {sheet?.name || sheet?.title || "Sheet"}
//                     </p>
//                     <p>
//                         {
//                             // sheet.create_date
//                             dateFormat(sheet.create_date)
//                         }
//                     </p>
//                 </div>
//             </div>

//             <div
//                 style={{
//                     marginTop: "10px",
//                     backgroundColor: DARK_BLUE_COLOR,
//                     // padding: "5px 10px",
//                     padding: "5%",
//                     display: 'flex',
//                     justifyContent: 'center',

//                     // borderRadius: "5px",
//                     color: "white",
//                     width: "100%"
//                 }}
//             >
//                 {sheet.price} Baht
//             </div>

//             <style jsx>{`
//                 .sheet-card {
//                     -webkit-box-shadow: 3px 3px 10px 3px #dddddd;
//                     -moz-box-shadow: 3px 3px 10px 3px #dddddd;
//                     box-shadow: 3px 3px 10px 3px #dddddd;
//                 }
//                 `}
//             </style>
//         </div>
//     );

//     return (
//         <div>
//             <Container>
//                 <div className="image-section" style={{
//                     height: "10%",

//                 }}>
//                     <Image
//                         aria-hidden
//                         src="/image2.svg"
//                         alt="icon icon"
//                         width={250}
//                         height={400}
//                         style={{
//                             objectFit: "cover",
//                             objectPosition: "100% 70%",
//                             width: "100%",
//                             zIndex: 0,

//                         }}
//                     />
//                     {/* ✅ ตัวหนังสือซ้อนกลาง */}
//                     <h1
//                         style={{
//                             position: "absolute",
//                             top: "30%",
//                             color: "white",
//                             fontSize: "3rem",
//                             fontWeight: "bold",
//                             zIndex: 0,
//                             textShadow: "0 0 5px #000",
//                             width: '100%',
//                             display: 'flex',
//                             justifyContent: 'center',

//                             scale: '1.5',
//                         }}
//                     >
//                         {subject_name}
//                     </h1>
//                 </div>

//                 {Object.keys(groupedByLevel || {}).length > 0 ? (
//                     Object.keys(groupedByLevel).map((level) => (
//                         <div key={level} style={{ marginTop: "30px", paddingInline: "10%" }}>
//                             <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>
//                                 {'ระดับชั้น'} {level}
//                             </h2>

//                             <div
//                                 className="scroll-container"
//                                 style={{
//                                     display: "flex",
//                                     flexDirection: 'row',
//                                     overflowX: "auto",
//                                     gap: "20px",
//                                     paddingBottom: "10px",
//                                 }}
//                             >
//                                 {groupedByLevel[level]?.length > 0 ? (
//                                     groupedByLevel[level].map(renderSheetCard)
//                                 ) : (
//                                     <div style={{ padding: "20px", color: "gray", fontSize: "1.2rem" }}>
//                                         ไม่มีข้อมูลในระดับชั้นนี้
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ))
//                 ) : (

//                     // <div style={{ textAlign: "center", marginTop: "40px", color: "gray" }}>
//                     //     ไม่มีข้อมูลชีทในรายวิชานี้
//                     // </div>
//                     <div
//                         style={{
//                             // backgroundColor: 'red',
//                             width: "100%",
//                             display: 'flex',
//                             justifyContent: 'center',
//                         }}
//                     >
//                         <div style={{
//                             alignItems: 'center'
//                         }}>
//                             <div style={{
//                                 // backgroundColor: 'green',
//                                 opacity: "0.6",
//                                 color: DARK_BLUE_COLOR,
//                                 width: "100%",
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                             }} >
//                                 <IoLogoDropbox size="50%"
//                                     style={{
//                                         width: "50%"
//                                     }} />
//                             </div>
//                             <h1 style={{
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 opacity: "0.6",
//                                 color: DARK_BLUE_COLOR,
//                             }}>ไม่มีข้อมูลชีทในรายวิชานี้</h1>
//                         </div>
//                     </div>
//                 )}



//             </Container>

//             <style jsx>{`
//             .scroll-container {
//                 scrollbar-width: none; /* Firefox */
//                 -ms-overflow-style: none; /* IE 10+ */
//                 }

//             .scroll-container::-webkit-scrollbar {
//                 width: 0px; /* Chrome, Safari, Edge */
//                 height: 0px;
                  
//             }

//             .scroll-container:hover {
//                 scrollbar-width: thin;
//             }

//             .scroll-container:hover::-webkit-scrollbar {
//                 height: 6px;
//             }

//             .scroll-container:hover::-webkit-scrollbar-thumb {
//                 background: #888;
//                 border-radius: 4px;
//             }

//             .scroll-container:hover::-webkit-scrollbar-track {
//                 background: transparent;
//             }

            

//             `}</style>
//         </div>
//     )
// }

// app/sheet/page.js
'use client'; // ต้องมีที่บรรทัดแรกสุด

// นำเข้า Modules ที่จำเป็น รวมถึง Suspense
import { useEffect, useState, Suspense } from 'react';
import { redirect, useSearchParams, useRouter } from 'next/navigation'; // นำเข้า Hooks ที่นี่

import Image from "next/image";
import Container from "@/components/Container";

import { YELLOW_COLOR, WHITE_COLOR, DARK_BLUE_COLOR, API_IP } from "@/components/Constant";
import axios from 'axios';
import { IoLogoDropbox } from "react-icons/io";


// mock data (คงไว้เผื่อใช้งาน หรือจะลบทิ้งถ้าไม่ใช้ใน Production)
const mockData = [
    { sheed_id: 1, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
    { sheed_id: 2, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
    { sheed_id: 3, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
    { sheed_id: 4, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
    { sheed_id: 5, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
    { sheed_id: 6, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
    { sheed_id: 7, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
    { sheed_id: 8, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
    { sheed_id: 9, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
    { sheed_id: 10, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
    { sheed_id: 11, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
    { sheed_id: 12, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
    { sheed_id: 13, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
    { sheed_id: 14, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
    { sheed_id: 15, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
    { sheed_id: 16, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
    { sheed_id: 17, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
    { sheed_id: 18, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
    { sheed_id: 19, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
    { sheed_id: 20, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
    { sheed_id: 21, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
    { sheed_id: 22, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
    { sheed_id: 23, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
    { sheed_id: 24, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
    { sheed_id: 25, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
    { sheed_id: 26, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.6", price: 20, date: "4-05-2025" },
    { sheed_id: 27, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
    { sheed_id: 28, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.5", price: 20, date: "4-05-2025" },
    { sheed_id: 29, name: "การอ่าน และจับใจคาม", subject_code: "TH112", level: "ม.4", price: 20, date: "4-05-2025" },
];


// สร้าง Functional Component ตัวใหม่ภายในไฟล์นี้ เพื่อใช้ Logic เดิมทั้งหมด
function SheetContentWithSearchParams() {
    // Hooks และ State เดิม ย้ายมาไว้ที่นี่
    const router = useRouter();
    // useSearchParams ถูกเรียกใช้ภายใน Component นี้ (ซึ่งอยู่ภายใต้ Suspense)
    const searchParams = useSearchParams();
    // อ่านค่า search params
    const subject_id = searchParams.get("subject_id");
    const subject_name = searchParams.get("subject_name");

    const [sheet, setSheet] = useState(null); // ใช้ null แทน [] หรือ mockData เพื่อเช็ค loading state ได้ง่ายขึ้น

    // useEffect Hook เดิม ย้ายมาไว้ที่นี่
    useEffect(() => {
        if (!subject_id) {
             console.warn("No subject_id found in URL. Cannot fetch sheets.");
             // พิจารณา redirect หรือแสดงข้อความให้ผู้ใช้เห็น
             // ตัวอย่าง: redirect('/'); // ถ้าต้องการกลับหน้าหลัก
             return;
        }

        const fetchData = async () => {
            try {
                // ใช้ API_IP + /api/ ตามที่ Deploy Backend ไว้
                const res = await axios.get(`${API_IP}/api/select_sheet/?subject_id=${subject_id}`);
                console.log('Sheets data fetched:', res.data.sheet);
                setSheet(res.data.sheet); // Assuming res.data.sheet is an array of sheets
            } catch (err) {
                console.error('Error fetching sheets data:', err);
                 setSheet([]); // ตั้งค่าเป็น array ว่าง เพื่อแสดงว่าไม่มีข้อมูล หรือจะ set เป็น null แล้วแสดง error message
            }
        };

        fetchData();
    }, [subject_id, API_IP]); // Dependencies

    // Helper function สำหรับจัดรูปแบบวันที่
    const dateFormat = (isoDate) => {
        if (!isoDate) return ''; // Handle cases with no date
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Helper function เพื่อ Render Sheet Card
    const renderSheetCard = (sheet) => (
        <div
            key={sheet.sheet_id}
            onClick={() => router.push(`/sheetDetail?sheet_id=${sheet.sheet_id}`)}
            className="sheet-card"
            style={{
                backgroundColor: YELLOW_COLOR,
                color: WHITE_COLOR,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "start",
                fontWeight: "bold",
                minWidth: "200px",
                minHeight: "200px", // Fixed height for consistent layout in scroll view
                flexShrink: 0,
                cursor: 'pointer', // Add cursor pointer to indicate it's clickable
                borderRadius: '8px', // Added border radius for better look
                overflow: 'hidden', // Ensure content stays within bounds
                 boxShadow: '3px 3px 10px 3px #dddddd', // Moved box-shadow here or use the jsx style
            }}
        >
             {/* Content div */}
            <div
                className='contend'
                style={{
                    padding: "10px",
                    flexGrow: 1,
                     width: '100%', // Ensure content takes full width within card
                }}
            >
                <div style={{ fontSize: "120%" }}>
                    <h1>
                        {sheet.subject_code?.toUpperCase() || "AA101"} {/* Added optional chaining */}
                    </h1>
                </div>

                <div style={{
                    fontWeight: 'normal',
                    display: 'grid',
                    rowGap: '10%'
                }}>
                    <p>
                        {sheet?.name || sheet?.title || "Sheet"} {/* Added optional chaining */}
                    </p>
                    <p>
                        {dateFormat(sheet.create_date)}
                    </p>
                </div>
            </div>

             {/* Price div */}
            <div
                style={{
                    // marginTop: "10px", // No need for margin-top if flex column space-between is used well
                    backgroundColor: DARK_BLUE_COLOR,
                    padding: "5%",
                    display: 'flex',
                    justifyContent: 'center',
                    color: "white",
                    width: "100%" // Take full width of the card
                }}
            >
                {sheet.price} Baht
            </div>

            {/* Move card-specific styles here or keep in global/module styles if preferred */}
             {/* <style jsx>{`
                 .sheet-card {
                     // styles here
                 }
             `}</style> */}
        </div>
    );


    // Group data by level (ใช้ state 'sheet' แทน mockData โดยตรง)
    const groupedByLevel = sheet?.reduce((acc, item) => { // Use sheet state
        const level = item.level || 'ไม่ระบุระดับชั้น'; // Handle potential missing level
        if (!acc[level]) acc[level] = [];
        acc[level].push(item);
        return acc;
    }, {});


    // Return ส่วน JSX สำหรับโครงสร้างหน้าทั้งหมด
    // นี่คือ RETURN เดียวสำหรับ Component นี้
    return (
        <div> {/* Outer container for the entire page content */}
            <Container>
                {/* Image section */}
                <div className="image-section" style={{
                    height: "10%", // อาจจะต้องปรับความสูงนี้ ขึ้นอยู่กับการแสดงผลจริง
                    position: 'relative', // Added for absolute positioning of h1
                    width: '100%', // Ensure container takes full width
                    overflow: 'hidden', // Hide overflow if image goes beyond bounds
                }}>
                    <Image
                        aria-hidden
                        src="/image2.svg" // ตรวจสอบ path ของรูปภาพใน production
                        alt="icon icon"
                        // width={250} // Width/Height for Image component is tricky with responsive
                        // height={400} // Consider layout='fill' or adjust sizing strategy
                        layout='fill' // Use fill to cover the container div
                        objectFit="cover"
                        objectPosition="100% 70%"
                        // width: "100%", // These styles might conflict with layout='fill'
                        zIndex={0}
                        // position: 'absolute', // layout='fill' makes it absolute
                    />
                     {/* ตัวหนังสือซ้อนกลาง */}
                    <h1
                        style={{
                            position: "absolute",
                            top: "50%", // Center vertically
                            left: "50%", // Center horizontally
                            transform: "translate(-50%, -50%)", // Adjust for exact centering
                            color: "white",
                            fontSize: "3rem",
                            fontWeight: "bold",
                            zIndex: 1, // Ensure text is above image
                            textShadow: "0 0 5px #000",
                            width: '100%', // Take full width for centering text
                            textAlign: 'center', // Center text horizontally
                            // scale: '1.5', // Scale might distort text, reconsider
                             margin: 0, // Remove default margin
                        }}
                    >
                        {subject_name || 'ชื่อวิชา'} {/* แสดงชื่อวิชา หรือ Default */}
                    </h1>
                </div>

                {/* Conditional rendering based on sheet data */}
                {sheet === null ? (
                    // Loading state or initial state
                    <div style={{ textAlign: "center", marginTop: "40px", color: "gray", fontSize: "1.2rem" }}>
                        กำลังโหลดข้อมูลชีท...
                    </div>
                ) : Object.keys(groupedByLevel || {}).length > 0 ? (
                    // Data available, render grouped sheets
                    Object.keys(groupedByLevel).map((level) => (
                        <div key={level} style={{ marginTop: "30px", paddingInline: "10%" }}>
                            <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                                {'ระดับชั้น'} {level}
                            </h2>
                            <div
                                className="scroll-container"
                                style={{
                                    display: "flex",
                                    flexDirection: 'row',
                                    overflowX: "auto",
                                    gap: "20px",
                                    paddingBottom: "10px",
                                }}
                            >
                                {groupedByLevel[level]?.length > 0 ? (
                                     // Map through sheets and render cards
                                    groupedByLevel[level].map(renderSheetCard)
                                ) : (
                                     // No sheets in this level
                                    <div style={{ padding: "20px", color: "gray", fontSize: "1.2rem" }}>
                                        ไม่มีข้อมูลในระดับชั้นนี้
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    // No sheets available at all
                     <div
                        style={{
                            width: "100%",
                            display: 'flex',
                            justifyContent: 'center',
                             marginTop: '40px', // Add some space
                        }}
                    >
                         <div style={{ alignItems: 'center', textAlign: 'center' }}> {/* Added text align */}
                             <div style={{ opacity: "0.6", color: DARK_BLUE_COLOR }}>
                                <IoLogoDropbox size="50%" style={{ width: "50%" }} /> {/* Adjust size/styling */}
                             </div>
                             <h1 style={{
                                display: 'flex', justifyContent: 'center', opacity: "0.6", color: DARK_BLUE_COLOR,
                                fontSize: '1.5rem', // Adjusted font size
                                marginTop: '10px', // Added margin
                             }}>ไม่มีข้อมูลชีทในรายวิชานี้</h1>
                         </div>
                    </div>
                )}

            </Container>

            {/* Style JSX เดิม */}
            <style jsx>{`
                .scroll-container {
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* IE 10+ */
                }

                .scroll-container::-webkit-scrollbar {
                    width: 0px; /* Chrome, Safari, Edge */
                    height: 0px;
                }

                .scroll-container:hover {
                    scrollbar-width: thin;
                }

                .scroll-container:hover::-webkit-scrollbar {
                    height: 6px;
                }

                .scroll-container:hover::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 4px;
                }

                .scroll-container:hover::-webkit-scrollbar-track {
                    background: transparent;
                }

                /* Optional: Add styles for sheet-card if not already defined elsewhere */
                .sheet-card {
                    border-radius: 8px;
                     box-shadow: 3px 3px 10px 3px #dddddd;
                     cursor: pointer;
                }
            `}</style>
        </div>
    );
}


// Component หลักที่ถูก export ออกไป (ทำหน้าที่แค่ Render Suspense และ Component ย่อย)
export default function Sheet() {
    // Render Suspense และเรียกใช้ Component ย่อยที่ใช้ useSearchParams
    return (
        <Suspense fallback={<div>กำลังโหลดหน้าชีท...</div>}>
            {/* เรียก Component ย่อยที่ใช้ useSearchParams ที่นี่ */}
            <SheetContentWithSearchParams />
        </Suspense>
    );
}

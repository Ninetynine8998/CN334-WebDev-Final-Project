"use client";

import { redirect, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';

import Image from "next/image";
import Container from "@/components/Container";

import { YELLOW_COLOR, WHITE_COLOR, DARK_BLUE_COLOR, API_IP } from "@/components/Constant";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoLogoDropbox } from "react-icons/io";


// mock data
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

export default function Sheet() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const subject_id = searchParams.get("subject_id");
    const subject_name = searchParams.get("subject_name");

    const [sheet, setSheet] = useState(null);

    // useEffect(() => {
    //     console.log("subject_id", subject_id);
    //     console.log("subject_name", subject_name);
    //     // fetch data from API using subject_id
    // }, [subject_id]);

    useEffect(() => {
        if (!subject_id) return;

        const fetchData = async () => {
            try {
                const res = await axios.get(API_IP + `/api/select_sheet/?subject_id=${subject_id}`);
                console.log('sheet:', res.data.sheet);
                setSheet(res.data.sheet);
            } catch (err) {
                console.error('can not get subject:', err);
            }
        };

        fetchData();
    }, [subject_id]);




    // ✅ Group data by level
    // const groupedByLevel = mockData.reduce((acc, item) => {
    const groupedByLevel = sheet?.reduce((acc, item) => {
        if (!acc[item.level]) acc[item.level] = []; // ถ้ายังไม่มี key ของระดับชั้นนี้ ให้สร้าง array ว่าง
        acc[item.level].push(item); // ใส่ item เข้าไปใน array ของ level นั้น
        return acc; // คืนค่าผลสะสมไปยังรอบถัดไป
    }, {});

    const dateFormat = (isoDate) => {
        const date = new Date(isoDate);

        // แปลงให้ได้วันที่เป็น วัน-เดือน-ปี
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() เริ่มที่ 0
        const year = date.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;
        // console.log(formattedDate); // ✅ "11-05-2025"
        return formattedDate

    }

    const renderSheetCard = (sheet) => (
        <div
            key={sheet.sheet_id}
            // onClick={() => router.push(`/sheetDetail/${sheet.sheed_id}`)}  // ✅ เปลี่ยนหน้า
            onClick={() =>
                router.push(`/sheetDetail?sheet_id=${sheet.sheet_id}`)
            }  // ✅ เปลี่ยนหน้า
            className="sheet-card"
            style={{
                backgroundColor: YELLOW_COLOR,
                color: WHITE_COLOR,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between", // ✅ ดันส่วนล่างไปสุด

                display: 'flex',
                alignItems: "start",

                fontWeight: "bold",
                minWidth: "200px", //  ความกว้างคงที่เพื่อ scroll ได้
                minHeight: "200px",
                flexShrink: 0       //  ห้ามบีบการ์ดอัตโนมัติ
            }}
        >
            <div
                className='contend'
                style={{
                    padding: "10px",
                    flexGrow: 1, // ✅ ให้เต็มพื้นที่เพื่อดันปุ่มด้านล่าง
                }}
            >

                <div style={{ fontSize: "120%" }}>
                    <h1>
                        {sheet.subject_code.toUpperCase() || "AA101"}
                    </h1>
                </div>

                <div style={{
                    fontWeight: 'normal',
                    display: 'grid',
                    rowGap: '10%'
                }}>

                    <p>
                        {/* {sheet.name || "Sheet"} */}
                        {sheet?.name || sheet?.title || "Sheet"}
                    </p>
                    <p>
                        {
                            // sheet.create_date
                            dateFormat(sheet.create_date)
                        }
                    </p>
                </div>
            </div>

            <div
                style={{
                    marginTop: "10px",
                    backgroundColor: DARK_BLUE_COLOR,
                    // padding: "5px 10px",
                    padding: "5%",
                    display: 'flex',
                    justifyContent: 'center',

                    // borderRadius: "5px",
                    color: "white",
                    width: "100%"
                }}
            >
                {sheet.price} Baht
            </div>

            <style jsx>{`
                .sheet-card {
                    -webkit-box-shadow: 3px 3px 10px 3px #dddddd;
                    -moz-box-shadow: 3px 3px 10px 3px #dddddd;
                    box-shadow: 3px 3px 10px 3px #dddddd;
                }
                `}
            </style>
        </div>
    );

    return (
        <div>
            <Container>
                <div className="image-section" style={{
                    height: "10%",

                }}>
                    <Image
                        aria-hidden
                        src="/image2.svg"
                        alt="icon icon"
                        width={250}
                        height={400}
                        style={{
                            objectFit: "cover",
                            objectPosition: "100% 70%",
                            width: "100%",
                            zIndex: 0,

                        }}
                    />
                    {/* ✅ ตัวหนังสือซ้อนกลาง */}
                    <h1
                        style={{
                            position: "absolute",
                            top: "30%",
                            color: "white",
                            fontSize: "3rem",
                            fontWeight: "bold",
                            zIndex: 0,
                            textShadow: "0 0 5px #000",
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',

                            scale: '1.5',
                        }}
                    >
                        {subject_name}
                    </h1>
                </div>

                {Object.keys(groupedByLevel || {}).length > 0 ? (
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
                                    groupedByLevel[level].map(renderSheetCard)
                                ) : (
                                    <div style={{ padding: "20px", color: "gray", fontSize: "1.2rem" }}>
                                        ไม่มีข้อมูลในระดับชั้นนี้
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (

                    // <div style={{ textAlign: "center", marginTop: "40px", color: "gray" }}>
                    //     ไม่มีข้อมูลชีทในรายวิชานี้
                    // </div>
                    <div
                        style={{
                            // backgroundColor: 'red',
                            width: "100%",
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <div style={{
                            alignItems: 'center'
                        }}>
                            <div style={{
                                // backgroundColor: 'green',
                                opacity: "0.6",
                                color: DARK_BLUE_COLOR,
                                width: "100%",
                                display: 'flex',
                                justifyContent: 'center',
                            }} >
                                <IoLogoDropbox size="50%"
                                    style={{
                                        width: "50%"
                                    }} />
                            </div>
                            <h1 style={{
                                display: 'flex',
                                justifyContent: 'center',
                                opacity: "0.6",
                                color: DARK_BLUE_COLOR,
                            }}>ไม่มีข้อมูลชีทในรายวิชานี้</h1>
                        </div>
                    </div>
                )}



            </Container>

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

            

            `}</style>
        </div>
    )
}

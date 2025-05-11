"use client";

import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation';

import Image from "next/image";
import Container from "@/components/Container";

import { YELLOW_COLOR, WHITE_COLOR, DARK_BLUE_COLOR } from "@/components/Constant";

// mock data
const mockData = [
    { 
        sheed_id: 1, 
        name: "การอ่าน และจับใจคาม", 
        subject_code: "TH112", 
        level: "ม.4", 
        price: 20, 
        date: "4-05-2025" },


        
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

    // ✅ Group data by level
    const groupedByLevel = mockData.reduce((acc, item) => {
        if (!acc[item.level]) acc[item.level] = []; // ถ้ายังไม่มี key ของระดับชั้นนี้ ให้สร้าง array ว่าง
        acc[item.level].push(item); // ใส่ item เข้าไปใน array ของ level นั้น
        return acc; // คืนค่าผลสะสมไปยังรอบถัดไป
    }, {});

    const renderSheetCard = (sheet) => (
        <div
            key={sheet.sheed_id}
            // onClick={() => router.push(`/sheetDetail/${sheet.sheed_id}`)}  // ✅ เปลี่ยนหน้า
            onClick={() => router.push(`/sheetDetail`)}  // ✅ เปลี่ยนหน้า
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
                        {sheet.subject_code}
                    </h1>
                </div>

                <div style={{
                    fontWeight: 'normal',
                    display: 'grid',
                    rowGap: '10%'
                }}>

                    <p>
                        {sheet.name}
                    </p>
                    <p>
                        {sheet.date}
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
                        {'ภาษาไทย'}
                    </h1>
                </div>


                {Object.keys(groupedByLevel).map((level) => (

                    <div key={level}
                        style={{
                            marginTop: "30px",
                            paddingInline: "10%",
                            //   backgroundColor:'red'
                        }}>

                        <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                            {'ระดับชั้น'} {level}
                        </h2>

                        {/* ✅ Scrollable horizontal area */}
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
                            {groupedByLevel[level].map(renderSheetCard)}
                        </div>
                    </div>
                ))}

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

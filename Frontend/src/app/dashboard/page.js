"use client";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Container from "@/components/Container";
import { BLUE_COLOR, DARK_BLUE_COLOR, LIGHT_BLUE_COLOR, WHITE_COLOR, YELLOW_COLOR } from "@/components/Constant";
import { useEffect, useState } from 'react';
import { MdDownloadForOffline } from "react-icons/md";
import { IoLogoDropbox } from "react-icons/io";

const mockUser = {
    user_id: 1,
    name: 'ข้าเจ้าคือสาวเจียงใหม่',
    subject_code: "TH112",
};

const mockSheet = [
    {
        sheet_id: 1,
        name: 'อ่านอย่างไรให้เข้าใจ',
        subject_code: "TH112",
        image: 'sheet1.svg',
        pdf: 'test_sheet.pdf',
    },
    {
        sheet_id: 2,
        name: 'เขียนกันเถอะ',
        subject_code: "CN101",
        image: 'sheet1.svg',
        pdf: 'test_sheet.pdf',
    },
    {
        sheet_id: 3,
        name: 'อ่านอย่างไรให้เข้าใจ',
        subject_code: "TH112",
        image: 'sheet1.svg',
        pdf: 'test_sheet.pdf',
    },
    {
        sheet_id: 4,
        name: 'เขียนกันเถอะ',
        subject_code: "CN101",
        image: 'sheet1.svg',
        pdf: 'test_sheet.pdf',
    },
    {
        sheet_id: 5,
        name: 'อ่านอย่างไรให้เข้าใจ',
        subject_code: "TH112",
        image: 'sheet1.svg',
        pdf: 'test_sheet.pdf',
    },
    {
        sheet_id: 6,
        name: 'เขียนกันเถอะ',
        subject_code: "CN101",
        image: 'sheet1.svg',
        pdf: 'test_sheet.pdf',
    },
    {
        sheet_id: 7,
        name: 'เขียนกันเถอะ',
        subject_code: "CN101",
        image: 'sheet1.svg',
        pdf: 'test_sheet.pdf',
    },
    {
        sheet_id: 8,
        name: 'อ่านอย่างไรให้เข้าใจ',
        subject_code: "TH112",
        image: 'sheet1.svg',
        pdf: 'test_sheet.pdf',
    },
    {
        sheet_id: 9,
        name: 'เขียนกันเถอะ',
        subject_code: "CN101",
        image: 'sheet1.svg',
        pdf: 'test_sheet.pdf',
    },
    {
        sheet_id: 10,
        name: 'เขียนกันเถอะ',
        subject_code: "CN101",
        image: 'sheet1.svg',
        pdf: 'test_sheet.pdf',
    },
    {
        sheet_id: 11,
        name: 'อ่านอย่างไรให้เข้าใจ',
        subject_code: "TH112",
        image: 'sheet1.svg',
        pdf: 'test_sheet.pdf',
    },
    {
        sheet_id: 12,
        name: 'เขียนกันเถอะ',
        subject_code: "CN101",
        image: 'sheet1.svg',
        pdf: 'test_sheet.pdf',
    },
]

export default function Dashboard() {
    const route = useRouter();

    const [user, setUser] = useState(mockUser);
    const [sheet, setSheet] = useState(mockSheet);
    const [searchText, setSearchText] = useState('');

    const filteredSheets = sheet.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.subject_code.toLowerCase().includes(searchText.toLowerCase())
    );


    const renderSheetCard = (sheet) => (
        <div
            key={sheet.sheet_id}
            className="sheet-card"
            style={{
                backgroundColor: YELLOW_COLOR,
                color: WHITE_COLOR,
                display: "flex",
                flexDirection: "column",
                fontWeight: "bold",
                width: "200px",
                position: "relative", // สำคัญสำหรับปุ่มดาวน์โหลดที่ลอยอยู่
            }}
        >
            <div className="contend">
                <div>
                    <Image
                        src={`/${sheet.image}`}
                        alt="sheet"
                        width={200}
                        height={200}
                        style={{
                            objectFit: 'cover',
                            borderRadius: '8px',

                        }}
                    />
                </div>

                <div style={{
                    backgroundColor: DARK_BLUE_COLOR,
                    color: "white",
                    width: "100%",
                    padding: "10px",

                    display: 'grid',
                    gap: '10px'
                }}>
                    <h4 style={{}}>{sheet.subject_code}</h4>
                    <p style={{}}>{sheet.name}</p>
                </div>
            </div>


            {/* ✅ ปุ่มดาวน์โหลด (ลอย) */}
            <div className="download-button">
                <a
                    href={`/pdfs/${sheet.pdf}`}
                    download
                    target="_blank"
                >
                    <MdDownloadForOffline size={200} color={BLUE_COLOR} />
                </a>
            </div>

            <style jsx>{`
                .sheet-card {
                    position: relative;
                    transition: transform 0.2s;
                    box-shadow: 3px 3px 10px 3px #dddddd;
                    overflow: hidden;
                }

                .sheet-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(128, 128, 128, 0); /* เริ่มโปร่งใส */
                    transition: background-color 0.3s ease;
                    z-index: 1; /* อยู่ใต้ปุ่มดาวน์โหลด */
                }

                .sheet-card:hover::before {
                    background-color: rgba(128, 128, 128, 0.4); /* เทาทับเมื่อ hover */
                }

                .download-button {
                    display: none;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    scale: 0.4;
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 2;
                }

                .sheet-card:hover .download-button {
                    display: block;
                }
            `}</style>

        </div>
    );


    return (
        <div>
            <Container>

                <div style={{
                    marginTop: "5%",
                    marginInline: "10%",
                }}>
                    {/* หัวเรื่อง Dashboard */}
                    <h1 style={{ marginBottom: '10px', fontSize: "500%" }}>
                        {'Dashboard'}
                    </h1>

                    {/* ชื่อผู้ใช้ชิดขวา */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '5px',
                    }}>
                        <h2 style={{ margin: 0, fontWeight: 'bold' }}>{user.name}</h2>
                    </div>

                    {/* ช่องค้นหา */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '20px',
                    }}>
                        <input
                            type='text'
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder='ค้นหา'
                            style={{
                                padding: "10px 16px",
                                borderRadius: "25px",
                                border: "1px solid #ccc",
                                fontSize: "1rem",
                                width: "30%",
                                outline: "none",
                            }}
                        />
                    </div>

                    <div style={{
                        display: "flex",
                        gap: "20px",
                        flexWrap: "wrap",
                        justifyContent: 'space-evenly',
                        // backgroundColor: 'red',

                    }}>
                        {filteredSheets.length !== 0 ? (
                            filteredSheets.map(renderSheetCard)
                        ) : (
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
                                    }}>ไม่พบข้อมูล</h1>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

            </Container>
        </div>
    );
}


"use client";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Container from "@/components/Container";
import { LIGHT_BLUE_COLOR, RED_COLOR } from "@/components/Constant";
import { useEffect, useState } from 'react';

const mockData = [
    {
        sheet_id: 1,
        name: 'อ่านอย่างไรให้เข้าใจ',
        subject_code: "TH112",
        level: "ม.4",
        price: 20,
        image: 'sheet1.svg',
    },
    {
        sheet_id: 2,
        name: 'อ่านอย่างไรให้เข้าใจ',
        subject_code: "TH112",
        level: "ม.4",
        price: 20,
        image: 'sheet1.svg',
    },
];

export default function Cart() {
    const router = useRouter();
    const [sheets, setSheets] = useState(mockData);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const total = sheets.reduce((sum, item) => sum + item.price, 0);
        setTotalPrice(total);
    }, [sheets]);

    const handleRemove = (id) => {
        const filtered = sheets.filter((item) => item.sheet_id !== id);
        setSheets(filtered);
    };

    const render_orderList = (order) => (
        <div key={order.sheet_id} style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
        }}>
            <div>
                <Image
                    src={`/${order.image}`}
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
                height: '100%',
                width: '90%',

                display: 'flex',
                flexDirection: 'column',
                gap: '5%',
                padding: '5px',
            }}>
                <h3>{order.name}</h3>
                <p>ระดับชั้น {order.level}</p>
            </div>


            <div style={{
                height: '100%',
                width: '10%',
            }}>
                <button
                    onClick={() => handleRemove(order.sheet_id)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: RED_COLOR,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: "100%",
                        height: "10%",

                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                    }}
                >
                    นำออก
                </button>
                <p style={{
                    fontWeight: 'bold',
                    fontSize: '150%',
                    height: '90%',

                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                }}>
                    {order.price} บาท
                </p>
            </div>
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
                        src="/image3.svg"
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
                        {'ตะกร้าของฉัน'}
                    </h1>
                </div>

                <div style={{
                    paddingInline: "10%",
                    marginTop: "5%",
                }}>

                    <div style={{ display: 'grid', rowGap: '20px' }}>
                        {sheets.map(render_orderList)}
                    </div>

                    <div style={{
                        width: "100%",
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                        <div style={{
                            marginTop: '10%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            textAlign: 'end',
                            gap: '20px',
                            width: '30%',
                        }}>
                            <p style={{ fontSize: "150%" }}>รวม {totalPrice} บาท</p>
                            <button
                                onClick={() => router.push(`/checkout`)}
                                style={{
                                    backgroundColor: LIGHT_BLUE_COLOR,
                                    padding: "10px 20px",
                                    borderRadius: "5px",
                                    border: "none",
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: '1rem',
                                    cursor: "pointer",
                                }}
                            >
                                สั่งซื้อ
                            </button>
                        </div>
                    </div>
                </div>

            </Container>
        </div>
    );
}
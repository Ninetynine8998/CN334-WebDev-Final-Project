

"use client";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Container from "@/components/Container";
import { API_IP, CONFIG, DARK_BLUE_COLOR, LIGHT_BLUE_COLOR, RED_COLOR } from "@/components/Constant";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoLogoDropbox } from 'react-icons/io';

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
const initData = [
    {
        sheet_id: 0,
        name: '',
        subject_code: "",
        level: "",
        price: 0,
        image: 'sheet1.svg',
    },
];

export default function Cart() {
    const router = useRouter();
    const [sheets, setSheets] = useState(initData);
    const [totalPrice, setTotalPrice] = useState(0);


    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get(API_IP + `/api/my_cart/`,CONFIG);
            console.log('sheet:', res.data);
            setSheets(res.data.items);
            setTotalPrice(res.data.total_price)
        } catch (err) {
            console.error('can not get subject:', err);
        }
    };

    const handleRemove = async (id) => {

        let data = {
            sheet_id: id
        }

        await axios.delete(API_IP + '/api/delete_item/', {
            data,
            ...CONFIG,
        })
            .then(res => {
                console.log(res)
                fetchCart();
            })
            .catch(err => console.log(err));

    };

    const render_orderList = (order) => {
        const sheetItem = order.sheet
        console.log("data: ", sheetItem)
        if (!sheetItem) return;
        return (
            // <div key={order.sheet_id} style={{
            <div key={sheetItem.sheet_id} style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center'
            }}>

                <div>
                    <Image
                        // src={`/${order.image}`}
                        src={`/${sheetItem?.image || 'sheet1.svg'}`}
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
                    {/* <h3>{order.name}</h3> */}
                    <h3>{sheetItem?.name}</h3>
                    {/* <p>ระดับชั้น {order.level}</p> */}
                    <p>ระดับชั้น {sheetItem?.level}</p>
                </div>


                <div style={{
                    height: '100%',
                    width: '10%',
                }}>
                    <button
                        // onClick={() => handleRemove(order.sheet_id)}
                        onClick={() => handleRemove(sheetItem?.sheet_id)}
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
                        textAlign: 'right',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        width: '100%',

                    }}>
                        {sheetItem?.price} บาท
                        {/* {order.price} บาท */}
                    </p>
                </div>
            </div>
        )
    };



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

                {sheets.length !== 0 ?
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
                    : <div
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
                            }}>ตะกร้ายังว่างอยู่</h1>
                        </div>
                    </div>
                }
            </Container>
        </div>
    );
}
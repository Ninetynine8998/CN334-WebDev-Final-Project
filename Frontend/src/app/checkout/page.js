"use client";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Container from "@/components/Container";
import { API_IP, CONFIG, LIGHT_BLUE_COLOR } from "@/components/Constant";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
        name: 'ไม่มีชื่อ',
        subject_code: "AA111",
        level: "มัธยมปลาย",
        price: 0,
        image: 'sheet1.svg',
    },
];

export default function Checkout() {
    const route = useRouter();
    const [onPay, setOnPay] = useState(false);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [countdown, setCountdown] = useState(120);
    const [error, setError] = useState('');


    const [sheets, setSheets] = useState(initData);
    const [totalPrice, setTotalPrice] = useState(0);
    const [cartID, setCartID] = useState(0);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get(API_IP + `/api/my_cart/`, CONFIG);
            console.log('sheet:', res.data);
            setSheets(res.data.items);
            setTotalPrice(res.data.total_price);
            setCartID(res.data.cart_id);
        } catch (err) {
            console.error('can not get subject:', err);
        }
    };

    // นับถอยหลัง
    useEffect(() => {
        let timer;
        if (onPay && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }

        if (countdown == 0) {
            // finishProcess();
            toast.error(`order cancelled`);
        }

        return () => clearTimeout(timer);
    }, [onPay, countdown]);

    const finishProcess = () => {
        toast.success("จ่ายเงินสำเร็จ");
        route.push("/dashboard");
    }

    const handleSubmit = async () => {
        if (!/^\d{10}$/.test(phone)) {
            setError("กรุณากรอกเบอร์โทร 10 หลักให้ถูกต้อง");
            return;
        }
        setError('');

        let data = {
            "tel": phone,
            "email": email,
            "cart_id": cartID
        }

        await axios.post(API_IP + "/api/confirm_order/", data, CONFIG)
            .then(res => {
                console.log(res)
                setOnPay(true);
            })
            .catch(err => {
                console.log(err)
            toast.success(err.message);

            })

    };

    const render_order = (order) => {
        const sheet = order.sheet
        console.log("order: ", sheet)
        return (
            // <div key={order.sheet_id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div key={sheet?.sheet_id || initData[0].sheet_id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Image
                    // src={`/${order.image}`}
                    src={`/${sheet?.image || initData[0].image}`}
                    alt="sheet"
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
                <div>
                    {/* <p style={{ margin: 0, fontWeight: 'bold' }}>{order.name}</p> */}
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{sheet?.name || initData[0].name}</p>
                    {/* <p style={{ margin: 0 }}>{order.price} บาท</p> */}
                    <p style={{ margin: 0 }}>{sheet?.price || initData[0].price} บาท</p>
                </div>
            </div>
        )
    };

    return (
        <div>
            <Container>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '40px',

                    marginTop: "10%",
                    paddingInline: "10%",
                }}>
                    {/* ซ้าย: Billing หรือ QR */}
                    <div style={{
                        width: '100%',
                        maxWidth: '400px',

                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        {!onPay ? (
                            <div style={{
                                width: '100%',
                            }}>
                                <h1>Billing Detail</h1>
                                <p>โทรศัพท์</p>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    maxLength={10}
                                    placeholder="โทรศัพท์"
                                    style={{
                                        padding: '8px',
                                        fontSize: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #ccc',
                                        width: '100%',
                                        marginBottom: '10px'
                                    }}
                                />
                                {error && (
                                    <p style={{ color: 'red', marginTop: 0 }}>{error}</p>
                                )}
                                <p>อีเมล</p>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="อีเมล"
                                    style={{
                                        padding: '8px',
                                        fontSize: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #ccc',
                                        width: '100%'
                                    }}
                                />
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <Image
                                    onClick={() => { finishProcess() }}
                                    src="/promptpay-qr.svg"
                                    alt="promptpay"
                                    width={300}
                                    height={300}
                                    style={{
                                        width: "100%",
                                        borderRadius: "8px",
                                    }}
                                />
                                <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>
                                    เหลือเวลา {countdown} นาที
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ขวา: Order Summary */}
                    <div style={{
                        width: '100%',
                        maxWidth: '400px',

                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <div style={{
                            width: '100%',
                        }}>

                            <h1>Your Order</h1>
                            <div style={{ display: 'grid', rowGap: '20px', marginBottom: '20px' }}>
                                {sheets.map(render_order)}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <p style={{ fontWeight: 'bold' }}>ราคารวม</p>
                                <p>{totalPrice} บาท</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: '#106F61',
                                    borderRadius: '50%',
                                    marginRight: '8px'
                                }} />
                                <p style={{ margin: 0 }}>PromptPay</p>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={onPay}
                                style={{
                                    backgroundColor: onPay ? '#999' : LIGHT_BLUE_COLOR,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    padding: '12px 20px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    width: '100%',
                                    cursor: onPay ? 'not-allowed' : 'pointer',
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
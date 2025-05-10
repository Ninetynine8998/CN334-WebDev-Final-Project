"use client";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Container from "@/components/Container";
import { LIGHT_BLUE_COLOR } from "@/components/Constant";
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

export default function Checkout() {
    const route = useRouter();
    const [onPay, setOnPay] = useState(false);
    const [sheets, setSheets] = useState(mockData);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [countdown, setCountdown] = useState(120);
    const [error, setError] = useState('');


    useEffect(() => {
        const total = sheets.reduce((sum, item) => sum + item.price, 0);
        setTotalPrice(total);
    }, [sheets]);

    // นับถอยหลัง
    useEffect(() => {
        let timer;
        if (onPay && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }

        if (countdown == 0) {
            finishProcess();
        }

        return () => clearTimeout(timer);
    }, [onPay, countdown]);

    const finishProcess = () => {
        route.push("/dashboard");
    }

    const handleSubmit = () => {
        if (!/^\d{10}$/.test(phone)) {
            setError("กรุณากรอกเบอร์โทร 10 หลักให้ถูกต้อง");
            return;
        }
        setError('');
        setOnPay(true);
    };

    const render_order = (order) => (
        <div key={order.sheet_id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Image
                src={`/${order.image}`}
                alt="sheet"
                width={80}
                height={80}
                style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
            <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{order.name}</p>
                <p style={{ margin: 0 }}>{order.price} บาท</p>
            </div>
        </div>
    );

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
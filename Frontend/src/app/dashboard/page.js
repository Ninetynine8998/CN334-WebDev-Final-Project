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

export default function Dashboard() {
    const route = useRouter();
    const [onPay, setOnPay] = useState(false);
    const [sheets, setSheets] = useState(mockData);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [countdown, setCountdown] = useState(120);
    const [error, setError] = useState('');



    return (
        <div>
            <Container>
              
            </Container>
        </div>
    );
}
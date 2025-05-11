"use client";
// 'use server';
import { redirect, useRouter } from 'next/navigation'
// import { revalidatePath } from 'next/cache'

import Image from "next/image";
import Container from "@/components/Container";

import { YELLOW_COLOR, WHITE_COLOR, API_IP } from "@/components/Constant";
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function Home() {
    const router = useRouter();
    
    const [allSubject, setAllSubject] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(API_IP + '/api/_all_subject/');
                console.log('subject:', res.data);
                setAllSubject(res.data.subjects); // ต้องตรงกับ key ที่ Django ส่งออก
            } catch (err) {
                console.error('can not get subject:', err);
            }
        };
        fetchData();
    }, []);

    const render_subject = (subject) => {
        return (
            <div key={subject.subject_id}>
                <div
                    className='subject-card'
                    onClick={() => {
                        // redirect(`/sheet`);
                        router.push(`/sheet?subject_id=${subject.subject_id}&subject_name=${subject.name}`);
                    }}
                    style={{
                        backgroundColor: YELLOW_COLOR,
                        fontSize: "180%",
                        color: WHITE_COLOR,
                        borderRadius: "5%",
                    }}>
                    <div className="subject-list" style={{
                        padding: "20px",

                        justifyContent: "center",
                        alignItems: "center",
                        display: "grid",
                    }}>

                        <h1 style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}>{`วิชา`}</h1>
                        <p
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >{subject.name}</p>
                    </div>
                </div>

                <style jsx>{`
                    .subject-card {
                        -webkit-box-shadow: 3px 3px 10px 3px #dddddd;
                        -moz-box-shadow: 3px 3px 10px 3px #dddddd;
                        box-shadow: 3px 3px 10px 3px #dddddd;
                    }
                `}
                </style>
            </div>
        )
    }

    return (
        <>
            <Container>
                <div className="image-section" style={{
                    height: "10%",
                }}>
                    <Image
                        aria-hidden
                        src="/image1.svg"
                        alt="icon icon"
                        width={250}
                        height={400}
                        style={{
                            objectFit: "cover",
                            objectPosition: "100% 70%",
                            width: "100%",
                        }}
                    />
                </div>

                <div >
                    <h1 style={{
                        textAlign: "center",
                        fontSize: "50px",
                        margin: "20px",
                    }}>{'รายวิชา'}</h1>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "20px",
                            // marginTop: "2vm",
                            marginBottom: "10%",
                            paddingInline: "10%",

                        }}
                    >
                        {allSubject?.map((item) => render_subject(item))}
                    </div>

                </div>
            </Container>
        </>
    )
}
"use client";
// 'use server';
import { redirect } from 'next/navigation'
// import { revalidatePath } from 'next/cache'

import Image from "next/image";
import Container from "@/components/Container";

import { YELLOW_COLOR, WHITE_COLOR } from "@/components/Constant";

const mockData = [
    {
        id: 1,
        name: "ภาษาไทย",
    },
    {
        id: 2,
        name: "ชีวะวิทยา",
    },
    {
        id: 3,
        name: "ภาษาอังกฤษ",
    },
    {
        id: 3,
        name: "ภาษาอังกฤษ",
    },
    {
        id: 3,
        name: "ภาษาอังกฤษ",
    },
    {
        id: 3,
        name: "ภาษาอังกฤษ",
    },
    {
        id: 3,
        name: "ภาษาอังกฤษ",
    },
    {
        id: 3,
        name: "ภาษาอังกฤษ",
    },
]

export default function Home() {

    const render_subject = (subject) => {
        return (
            <div key={subject.id}>
                <div
                    // key={subject.id}
                    className='subject-card'
                    onClick={() => {
                        // revalidatePath(`/sheet`);
                        redirect(`/sheet`);
                    }}
                    style={{
                        // width: "100%",
                        // height: "100px",
                        backgroundColor: YELLOW_COLOR,
                        fontSize: "180%",
                        color: WHITE_COLOR,
                        borderRadius: "5%",
                    }}>
                    <div className="subject-list" style={{
                        // width: "100%",
                        // height: "100%",
                        padding: "20px",

                        justifyContent: "center",
                        alignItems: "center",
                        display: "grid",
                    }}>

                        <h1 style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}>{`วิชา`}</h1>
                        <p>{subject.name}</p>
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
                        {mockData.map((item) => render_subject(item))}
                    </div>

                </div>
            </Container>
        </>
    )
}
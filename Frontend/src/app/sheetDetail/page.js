"use client";
// 'use server';
import { redirect } from 'next/navigation'
// import { revalidatePath } from 'next/cache'

import Image from "next/image";
import Container from "@/components/Container";

import { YELLOW_COLOR, WHITE_COLOR } from "@/components/Constant";


export default function SheetDetail() {

    return (
        <>
            <Container>
                <div className="detail-section" style={{
                    // marginTop: '500px'
                    }}>
                    <div className="icon"
                    style={{
                        width:"50%",
                        backgroundColor:'red'
                    }}
                    >
                        <Image
                            aria-hidden
                            src="/sheet1.svg"
                            alt="icon"
                            width={50}
                            height={50}
                            style={{
                                width: "100%",
                                height: "100%"
                            }}
                        />
                    </div>
                </div>
            </Container>
        </>
    )
}
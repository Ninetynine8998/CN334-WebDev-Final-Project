"use client";

import { redirect } from 'next/navigation'

import Image from "next/image";
import Container from "@/components/Container";

import { YELLOW_COLOR, WHITE_COLOR } from "@/components/Constant";

export default function Sheet() {
    return (
        <div>
            <Container>
                <h1>Sheet</h1>
                <div className="image-section" style={{
                    height: "10%",
                }}>
                    <h1 style={{
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',

                    }}>
                        {'ภาษาไทย'}
                    </h1>
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
                        }}
                    />
                </div>


            </Container>
        </div>
    )
}
"use client";

import Image from "next/image";
import Link from 'next/link'
import { FaCartShopping } from "react-icons/fa6";
import { YELLOW_COLOR } from "./Constant";

export default function Header() {
    return (
        <nav className="header" style={myStyles.header}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
            }}>
                <div style={{ width: "20%", display: "flex", justifyContent: "center" }}>
                    <Image
                        aria-hidden
                        src="/appicon.svg"
                        alt="icon icon"
                        width={50}
                        height={50}
                    />
                </div>

                <div style={{ width: "60%", display: "flex", gap: "20px", justifyContent: "center", alignItems: "center" }}>
                    <Link href="/home">
                        <h2>Home</h2>
                    </Link>

                    <Link href="/dashboard">
                        <h2>Dashboard</h2>
                    </Link>
                </div>

                <div style={{ width: "20%", display: "flex", justifyContent: "center" }}>
                    <FaCartShopping size={32} style={{ cursor: "pointer" }} />
                </div>

            </div>

            <style jsx>{`
                .header {
                    -webkit-box-shadow: 0 5.5px 12.5px -3px #444444;
                    -moz-box-shadow: 0 5.5px 12.5px -3px #444444;
                    box-shadow: 0 5.5px 12.5px -3px #444444;
                }
            `}</style>

        </nav>
    )
}

const myStyles = {
    header: {
        backgroundColor: YELLOW_COLOR,
        width: "100%",
        color: "white",
        padding: "20px",
        top: 0,              // ✅ เพิ่มเพื่อปักไว้ด้านบน
        left: 0,             // ✅ เพิ่มเพื่อให้แนบขอบซ้าย

        position: "fixed",
        zIndex: 2,
    },
}



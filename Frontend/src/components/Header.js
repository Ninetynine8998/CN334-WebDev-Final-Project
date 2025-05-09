"use client";

import Image from "next/image";
import Link from 'next/link'
import { FaCartShopping } from "react-icons/fa6";

export default function Header() {
    return (
        <div className="header" style={myStyles.header}>
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
                    <FaCartShopping size={32} />
                </div>

            </div>

            <style jsx>{`
                .header {
                    -webkit-box-shadow: 0 5.5px 12.5px -3px #444444;
                    -moz-box-shadow: 0 5.5px 12.5px -3px #444444;
                    box-shadow: 0 5.5px 12.5px -3px #444444;
                }
            `}</style>

        </div>
    )
}

const myStyles = {
    header: {
        backgroundColor: "#F6B154",
        width: "100%",
        color: "white",
        padding: "20px",
        display: "absolute",
        position: "fixed",

    },
}



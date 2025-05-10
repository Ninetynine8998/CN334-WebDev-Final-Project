"use client";

import Image from "next/image";
import { FaFacebook } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { ImMail4 } from "react-icons/im";
import { RiInstagramFill } from "react-icons/ri";
import { BLUE_COLOR, DARK_BLUE_COLOR } from "./Constant";


export default function Footer({ children , style}) {
    return (
        <div className="footer"
        style={{...style}}
        >
            <div className="icon-section">
                <div className="icon">
                    <Image
                        aria-hidden
                        src="/appicon.svg"
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

            <div className="text">
                <h1>วิชา</h1>

                <div className="subject-grid">
                    <div className="subject-list">
                        <p>ภาษาไทย</p>
                        <p>ชีวะวิทยา</p>
                        <p>ภาษาอังกฤษ</p>
                        <p>คณิตศาสตร์</p>
                        <p>ฟิสิกส์</p>
                        <p>คอมพิวเตอร์</p>
                        <p>เคมี</p>
                        <p>ภาษาจีน</p>
                    </div>

                    <div>
                        <p>ที่อยู่ บริษัท 111/111 ชั้น1 อาคารอำนวยการ หมู่1 ต.คลองราชการ อ.คลองน้อยกว่าสอง จ.ปทุมธาณี</p>
                    </div>
                </div>

                <div className="iconContract">
                    <FaFacebook size={50} />
                    <AiFillTwitterCircle size={50} />
                    <ImMail4 size={50} />
                    <RiInstagramFill size={50} />
                </div>
            </div>

            <style jsx>{`
        .footer {
        display: flex;
        background-color: ${BLUE_COLOR};
        width: 100%;
        color: white;
        }

        .icon-section {
        width: 30%;
        display: grid;
        grid-template-areas: "icon" "text";
        }

        .icon {
        padding: 20%;
        }

        .text {
        padding: 2vw;
        width: 70%;
        }

        .subject-grid {
        margin: 20px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        font-size: 20px;
        }

        .subject-list {
        display: grid;
        row-gap: 20px;
        grid-template-columns: repeat(2, 1fr);
        }

        .iconContract {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        padding: 20px;
        }

        .iconContract :global(svg) {
        width: 5%;
        }

        @media (max-width: 768px) {
        .footer {
            flex-direction: column;
        }

        .icon-section,
        .text {
            width: 100%;
        }

        .iconContract {
            flex-wrap: wrap;
            gap: 10px;
        }

        .iconContract :global(svg) {
            width: 20% !important;
        }
        }
  `}</style>
        </div>

    )
}

const myStyles = {
    footer: {
        backgroundColor: "#086886",
        width: "100%",
        color: "white",

        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
    },
}
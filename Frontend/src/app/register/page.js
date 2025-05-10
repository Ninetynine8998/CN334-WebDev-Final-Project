"use client";

import { BLUE_COLOR, LIGHT_BLUE_COLOR, WHITE_COLOR } from "@/components/Constant";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


import { useEffect, useState } from "react";


export default function Register() {
    const route = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confrimPassword, setConfrimPassword] = useState('');

    const onRegister = () => {
        if (!email || !username || !password || !confrimPassword) {
            alert('asd')
            return
        }

        route.push("/login")
    }

    return (
        <div style={{
            display: "flex",
            height: "100vh",
            fontFamily: "sans-serif"
        }}>
            {/* ซ้าย: รูป */}
            <div style={styles.imageSection}>
                <Image
                    src="/login_img.svg" // ตั้งชื่อภาพตามไฟล์ของคุณใน /public
                    alt="register"
                    fill
                    style={{ objectFit: "cover" }}
                />
            </div>

            {/* ขวา: ฟอร์ม */}
            <div style={styles.formSection}>
                <div style={styles.formBox}>
                    {/* email */}
                    <h2 style={styles.label}>Email</h2>
                    <input
                        type="email"
                        style={styles.input}
                        placeholder=""
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* username */}
                    <h2 style={styles.label}>Username</h2>
                    <input
                        type="text"
                        style={styles.input}
                        placeholder=""
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {/* password */}
                    <h2 style={styles.label}>Password</h2>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* confirm password */}
                    <h3 style={styles.label}>Confrim Password</h3>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder=""
                        value={confrimPassword}
                        onChange={(e) => setConfrimPassword(e.target.value)}
                    />

                    <button className="register-button" style={styles.button}
                        onClick={() => onRegister()}
                    >Register</button>
                    <p style={styles.loginText}>
                        have account?{" "}
                        <a href="/login" >
                            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                Login
                            </span>
                        </a>
                    </p>
                </div>
            </div>

            <style jsx>{`
  .register-button {
    background-color: #00C2A8;
    color: white;
    font-weight: bold;
    padding: 10px 30px;
    border-radius: 6px;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    margin-top: 10px;
    min-width: 150px;
    align-self: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .register-button:hover {
    background-color: #008f87;
    transform: scale(1.05);
  }
`}</style>
        </div>
    );
}




// ✅ CSS-in-JS styles
const styles = {
    container: {
        display: "flex",
        height: "100vh",
        width: "100vw",
    },
    imageSection: {
        position: "relative",
        width: "50%",
        height: "100%",
    },
    formSection: {
        width: "50%",
        background: "linear-gradient(to bottom right, #f8b439, #0f5e8e)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    formBox: {
        width: "60%",
        maxWidth: "350px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    label: {
        margin: "0",
        color: WHITE_COLOR,
        fontWeight: 'normal',
    },
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        fontSize: "1rem",
    },
    button: {
        backgroundColor: LIGHT_BLUE_COLOR,
        color: WHITE_COLOR,
        fontWeight: "bold",
        padding: "10px",
        borderRadius: "6px",
        fontSize: "1rem",
        border: "none",
        cursor: "pointer",
        marginTop: "10px",

        alignSelf: "center",
        width: "40%",
        fontSize: "120%",

    },
    loginText: {
        fontSize: "0.8rem",
        color: "#fff",
        textAlign: "center",
        marginTop: "10px",
    },
};
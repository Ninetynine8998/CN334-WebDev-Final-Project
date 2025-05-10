"use client";

import { useRouter } from "next/navigation";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const route = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = () => {
        if (!email || !password) {
            alert('asd')
            return
        }

        route.push("/home")
    }

    return (
        <div style={styles.container}>
            {/* ซ้าย: รูป */}
            <div style={styles.imageSection}>
                <Image
                    src="/login_img.svg" // ตั้งชื่อภาพตามไฟล์ของคุณใน /public
                    alt="login"
                    fill
                    style={{ objectFit: "cover" }}
                />
            </div>

            {/* ขวา: ฟอร์ม login */}
            <div style={styles.formSection}>
                <div style={styles.formBox}>
                    <h2 style={styles.label}>Email</h2>
                    <input
                        type="email"
                        style={styles.input}
                        placeholder=""
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <h2 style={styles.label}>Password</h2>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}

                    />

                    <button
                        className="login-button"
                        style={styles.button}
                        onClick={() => onLogin()}
                    >Login</button>
                    <p style={styles.registerText}>
                        don’t have account?{" "}
                        <a href="/register" >
                            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                Register
                            </span>
                        </a>
                    </p>
                </div>
            </div>

            <style jsx>{`
  .login-button {
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

  .login-button:hover {
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
        color: "#fff",
        fontWeight: 'normal',
    },
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        fontSize: "1rem",
    },
    button: {
        backgroundColor: "#00C2A8",
        color: "#fff",
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
    registerText: {
        fontSize: "0.8rem",
        color: "#fff",
        textAlign: "center",
        marginTop: "10px",
    },
};

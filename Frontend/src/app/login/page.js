import styles from "../page.module.css";

export default function Login() {
    return (
        <div style={styles.pages}>
            <main className={styles.main}>
                <h1>Login page</h1>

                <div className={styles.grid}>
                    <a
                        href="/"
                        className={styles.card}
                    >
                        <h2>Login &rarr;</h2>
                        <p>Login to your account</p>
                    </a>
                </div>
            </main>
        </div>
    );
}
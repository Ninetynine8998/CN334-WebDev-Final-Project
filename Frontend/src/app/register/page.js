import styles from "../page.module.css";

export default function Register(){
    return (
        <div style={styles.pages}>
            <main className={styles.main}>
                <h1>Register page</h1>

                <div className={styles.grid}>
                    <a
                        href="/"
                        className={styles.card}
                    >
                        
                        <p>Create a new account</p>
                    </a>
                </div>
            </main>
        </div>
    );
}
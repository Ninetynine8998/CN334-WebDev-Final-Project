import Header from "./Header";
import Footer from "./Footer";

export default function Container({ children }) {
    return (
        <div>
            <div style={{ paddingTop: "80px" }}>
                <Header />
            </div>

            <div style={{ minHeight: "200px" }}>
                {children}
            </div>

            <Footer style={{ marginTop: '10%' }} />
        </div>
    )
}

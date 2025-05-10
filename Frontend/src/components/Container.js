import Header from "./Header";
import Footer from "./Footer";

export default function Container({ children }) {
    return (
        <div>
            <div style={{ paddingTop: "80px" }}>
            <Header />
            </div>
                
            {children}
            <Footer style={{ marginTop:'10%'}}/>
        </div>
    )
}

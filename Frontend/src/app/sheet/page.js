"use client";

import Image from "next/image";
import Container from "@/components/Container";

export default function Sheet() {
  return (
    <div>
      <Container>
        <div
          className="image-section"
          style={{
            position: "relative",
            width: "100%",
            height: "250px", // ปรับความสูงได้
            overflow: "hidden",
          }}
        >
          {/* ✅ พื้นหลังรูปภาพ */}
          <Image
            src="/image2.svg"
            alt="background"
            fill // ทำให้ภาพเต็มพื้นที่ของ div
            style={{
              objectFit: "cover",
              zIndex: 0,
            }}
          />

          {/* ✅ ตัวหนังสือซ้อนกลาง */}
          <h1
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontSize: "2.5rem",
              fontWeight: "bold",
              zIndex: 1,
              textShadow: "0 0 5px #000",
            }}
          >
            ภาษาไทย
          </h1>
        </div>
      </Container>
    </div>
  );
}

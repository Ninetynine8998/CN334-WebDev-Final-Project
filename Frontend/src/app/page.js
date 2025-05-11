"use client";

import { redirect } from 'next/navigation'
import { useRouter } from "next/navigation";

import Image from "next/image";
import Container from "@/components/Container";

import { YELLOW_COLOR, WHITE_COLOR } from "@/components/Constant";
import { useEffect } from 'react';

const mockData = [
  {
    id: 1,
    name: "ภาษาไทย",
  },
  {
    id: 2,
    name: "ชีวะวิทยา",
  },
  {
    id: 3,
    name: "ภาษาอังกฤษ",
  },
  {
    id: 4,
    name: "ภาษาอังกฤษ",
  },
  {
    id: 5,
    name: "ภาษาอังกฤษ",
  },
  {
    id: 6,
    name: "ภาษาอังกฤษ",
  },
  {
    id: 7,
    name: "ภาษาอังกฤษ",
  },
  {
    id: 8,
    name: "ภาษาอังกฤษ",
  },
]

export default function CheckAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // ไม่มี token ให้ redirect ไปหน้า login
      router.push("/login");
    }
    else{
      router.push("/home");
    }
  }, [])

  const loader = () => {
    return (
      <>
        <div className="blob"></div>

        <style jsx>{`

.blob {
   width: 176px;
   height: 176px;
   display: grid;
   background: #fff;
   filter: blur(8.8px) contrast(10);
   padding: 17.6px;
   mix-blend-mode: darken;
}

.blob:before,
.blob:after {
   content: "";
   grid-area: 1/1;
   width: 70.4px;
   height: 70.4px;
   background: #474bff;
   animation: blob-rhf26m 2.8s infinite;
}

.blob:after {
   animation-delay: -1.4s;
}

@keyframes blob-rhf26m {
   0% {
      transform: translate(0, 0);
   }

   25% {
      transform: translate(100%, 0);
   }

   50% {
      transform: translate(100%, 100%);
   }

   75% {
      transform: translate(0, 100%);
   }

   100% {
      transform: translate(0, 0);
   }
}
`}

        </style>
      </>
    )
  }

  return (
    <div style={{
      display: 'grid',
      justifyContent: 'center',
      

    }}>

      <div style={styles.container}>
        {/* ซ้าย: รูป */}
        <Image
          aria-hidden
          src="/appicon.svg"
          alt="icon"
          width={100}
          height={100}
          style={{
            width: "80%",
            height: "80%"
          }}
        />
        {/* {loader()} */}

      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "grid",
    justifyContent: 'center',

    height: "100vh",
    width: "100vw",
  },
};

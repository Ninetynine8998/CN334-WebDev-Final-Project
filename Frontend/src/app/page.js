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

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     // ไม่มี token ให้ redirect ไปหน้า login
  //     router.push("/login");
  //   }
  // }, [])

  const render_subject = (subject) => {
    return (
      <div key={subject.id}>
        <div
          // key={subject.id}
          className='subject-card'
          onClick={() => {
            // revalidatePath(`/sheet`);
            redirect(`/sheet`);
          }}
          style={{
            // width: "100%",
            // height: "100px",
            backgroundColor: YELLOW_COLOR,
            fontSize: "180%",
            color: WHITE_COLOR,
            borderRadius: "5%",
          }}>
          <div className="subject-list" style={{
            // width: "100%",
            // height: "100%",
            padding: "20px",

            justifyContent: "center",
            alignItems: "center",
            display: "grid",
          }}>

            <h1 style={{
              display: 'flex',
              justifyContent: 'center',
            }}>{`วิชา`}</h1>
            <p>{subject.name}</p>
          </div>
        </div>

        <style jsx>{`
                    .subject-card {
                        -webkit-box-shadow: 3px 3px 10px 3px #dddddd;
                        -moz-box-shadow: 3px 3px 10px 3px #dddddd;
                        box-shadow: 3px 3px 10px 3px #dddddd;
                    }
                `}
        </style>
      </div>
    )
  }

  return (
    <>
      <Container>
        <div className="image-section" style={{
          height: "10%",
        }}>
          <Image
            aria-hidden
            src="/image1.svg"
            alt="icon icon"
            width={250}
            height={400}
            style={{
              objectFit: "cover",
              objectPosition: "100% 70%",
              width: "100%",
            }}
          />
        </div>

        <div >
          <h1 style={{
            textAlign: "center",
            fontSize: "50px",
            margin: "20px",
          }}>{'รายวิชา'}</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              // marginTop: "2vm",
              marginBottom: "10%",
              paddingInline: "10%",

            }}
          >
            {mockData.map((item) => render_subject(item))}
          </div>

        </div>
      </Container>
    </>
  )
}

// import Image from "next/image";
// import styles from "./page.module.css";

// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol>
//           <li>
//             Get started by editing <code>src/app/page.js</code>.
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className={styles.ctas}>
//           <a
//             className={styles.primary}
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className={styles.logo}
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//             className={styles.secondary}
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className={styles.footer}>
//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }


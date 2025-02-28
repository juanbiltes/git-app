import { Geist, Geist_Mono } from "next/font/google";
import { PropsWithChildren } from "react";
import styles from "./PageContainer.module.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});


export default function PageContainer({ children }: PropsWithChildren) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable}`}>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}
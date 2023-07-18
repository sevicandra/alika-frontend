import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextAuthProvider } from "./_app";
import { Session } from "next-auth";
import React from 'react';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alika',
  description: 'Dengan Alika, kami hadirkan pengalaman terbaik dalam mengakses informasi keuangan di layar Anda.',
}



export default function RootLayout({
  children,

}:{
  children?: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-base-100 relative flex flex-col`}>
      <NextAuthProvider>{children}</NextAuthProvider>  
      </body>
    </html>
  )
}

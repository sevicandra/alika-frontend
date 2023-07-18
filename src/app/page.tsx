'use client';
import { useSession } from "next-auth/react";
import Loader from "@/Components/Atoms/Loader/Index";
import { signIn } from "next-auth/react";
import { signOut } from "next-auth/react"
import Auth from '@/Components/Templates/Auth/Index';

export default function Home() {
  const { data: session, status } = useSession();
  const ssokemenkeu = async () => {
    signIn("ssokemenkeu")
  };
  
  const signout = async () => {
    signOut()
  };
  return (
    <>
    {status ==="loading" &&
      <div 
        className='flex justify-center items-center h-screen'
      >
        <Loader 
          color ="#1b45a0"
          size="h-20 w-20"
        />
      </div>
    }

    {status === "unauthenticated" &&
      <div className='flex justify-center items-center h-screen text-center'>
        <div className='max-w-2xl'>
          <h1 className='text-6xl mb-2'>
            Hai!, Selamat Datang di Alika.
          </h1>
          <h2 className='text-md mb-2'>Dengan Alika, kami hadirkan pengalaman terbaik dalam mengakses informasi keuangan di layar Anda.</h2>
          <button
            onClick={ssokemenkeu}
            className='border border-primary rounded py-2 px-3 text-primary hover:text-base-100 hover:bg-primary'
          >
            Login Menggunakan Kemenkeu ID
          </button>
        </div>
      </div>
    }

    {status === "authenticated" &&
      <>
        <Auth>
          <>
          
          </>
        </Auth>
      </>
    }

    </>
  )
}

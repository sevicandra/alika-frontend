import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
        id:string,
        g2c_Npwp:string,
        g2c_Nik:string,
        g2c_Provinsi:string,
        name:string,
        phone_number:string,
        nip:string,
        jabatan:string,
        jenis_jabatan:string,
        kode_organisasi:string,
        organisasi:string,
        kode_satker:string,
        satker:string,
        image:string,
        preferred_username:string,
        email:string,
    },
    error?: string
    
    & DefaultSession['user'];
  }
}
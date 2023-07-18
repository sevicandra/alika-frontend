import NextAuth from "next-auth"
import axios from "axios";

const _openidClient = require("openid-client");

const handler = NextAuth({
    providers: [
        {
          id: "ssokemenkeu",
          name: "ssokemenkeu",
          version:"2.0",
          type: "oauth",
          authorization:{url:process.env.SSO_BASE_URI + process.env.SSO_AUTHORIZE_ENDPOINT, params:{
            redirect_uri: process.env.SSO_AUTHORIZE_REDIRECT_URI,
            scope: process.env.SSO_AUTHORIZE_SCOPE,
          }},
          token: {
            async request(context) {
              const response = await axios.post(process.env.SSO_BASE_URI + process.env.SSO_TOKEN_ENDPOINT,{
                    grant_type: "authorization_code",
                    client_id: process.env.SSO_AUTHORIZE_CLIENT_ID,
                    client_secret: process.env.SSO_TOKEN_CLIENT_SECRET,
                    code: context.params.code,
                    redirect_uri: process.env.SSO_AUTHORIZE_REDIRECT_URI,
              },{
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                }
              })
              const data = response.data
              const tokens =  new _openidClient.TokenSet(data)
              return { tokens }
            },
          },
          userinfo: {url:"https://demo-account.kemenkeu.go.id/connect/userinfo",
            async request(context) {

              const response = await axios.get("https://demo-account.kemenkeu.go.id/connect/userinfo", {
                headers: {
                  Authorization: `Bearer ${context.tokens.access_token}`
                }
              });
          
              const userinfoResponse = response.data;
              return userinfoResponse
            }
          },
          profile(profile) {
            return {
              id: profile.id,
              g2c_Npwp:profile.g2c_Npwp ,
              g2c_Nik:profile.g2c_Nik ,
              g2c_Provinsi:profile.g2c_Provinsi ,
              name:profile.name ,
              phone_number:profile.phone_number ,
              nip:profile.nip ,
              jabatan:profile.jabatan ,
              jenis_jabatan:profile.jenis_jabatan ,
              kode_organisasi:profile.kode_organisasi ,
              organisasi:profile.organisasi ,
              kode_satker:profile.kode_satker ,
              satker:profile.satker ,
              image:profile.gravatar ,
              preferred_username:profile.preferred_username ,
              email:profile.email
            }
          },
          clientId: process.env.SSO_AUTHORIZE_CLIENT_ID,
          clientSecret: process.env.SSO_TOKEN_CLIENT_SECRET,
        },
      ],

    callbacks: {
      async jwt({ token, user, account, profile }) {
        if (account) {
          token.accessToken = account.access_token
          token.expires_at = account.expires_at
          token.id = profile.id
          token.user = user
          return token
        }else if(Date.now() < token.expires_at * 1000){
          return token
        }else{
          return { ...token, error: "Token Expired" }
        }
      },
      async session({ session, token }) {
        session.error = token.error
        session.accessToken = token.accessToken
        session.user.id = token.id
        session.user = token.user
        session.expires= new Date(token.expires_at*1000)
        return session
      },
    },

    
    secret: process.env.AUTH_SECRET,

})

export { handler as GET, handler as POST }



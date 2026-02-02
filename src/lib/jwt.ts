import "server-only";
import { EncryptJWT, jwtDecrypt, JWTPayload, jwtVerify } from "jose";
const encrypt = async (payload: JWTPayload | undefined) => {
  const secret = process.env.APP_KEY || "";
  const key = new Uint8Array(Buffer.from(secret, "base64"));
  const jwt = await new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setExpirationTime("30d")
    .encrypt(key);

  return jwt;
};

const decrypt = async (token: string) => {
  const secret = process.env.APP_KEY || "";
  const key = new Uint8Array(Buffer.from(secret, "base64"));
  const { payload } = await jwtDecrypt(token, key);
  return payload;
};

const verify = async (token: string) => {
  const jwkResponse = await fetch(
    `${process.env.AUTH_BASE_URI_INTERNAL ?? process.env.AUTH_BASE_URI}/.well-known/jwks.json`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      cache: "force-cache",
      next: {
        revalidate: 60,
        tags: ["jwks"],
      },
    },
  );
  const jwk = await jwkResponse.json();
  const publicKey = await crypto.subtle.importKey(
    "jwk",
    jwk.keys[0],
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const { payload } = await jwtVerify(token, publicKey, {
    issuer: `${process.env.AUTH_BASE_URI}`,
  });
  return payload;
};

export { encrypt, decrypt, verify };

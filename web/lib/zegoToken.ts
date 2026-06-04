import crypto from "crypto"

// Zego's official server-side token (token04) generator, ported to TS.
// This runs ONLY on the server so the ServerSecret never reaches the browser.
// The client wraps the returned token with ZegoUIKitPrebuilt.generateKitTokenForProduction.

interface TokenInfo {
  app_id: number
  user_id: string
  nonce: number
  ctime: number
  expire: number
  payload: string
}

function makeNonce(): number {
  return Math.floor(Math.random() * (2147483647 - -2147483648 + 1)) + -2147483648
}

// 16-char ASCII IV, matching Zego's reference implementation.
function makeRandomIv(): string {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let result = ""
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function aesEncrypt(plainText: string, key: string, iv: string): Buffer {
  // key length (16/24/32) selects AES-128/192/256. A Zego ServerSecret is 32 chars → AES-256-CBC.
  const cipher = crypto.createCipheriv(`aes-${key.length * 8}-cbc`, Buffer.from(key), Buffer.from(iv))
  cipher.setAutoPadding(true)
  return Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()])
}

export function generateToken04(
  appId: number,
  userId: string,
  secret: string,
  effectiveTimeInSeconds: number,
  payload = "",
): string {
  if (!appId || typeof appId !== "number") throw new Error("appId is required")
  if (!userId || typeof userId !== "string") throw new Error("userId is required")
  if (![16, 24, 32].includes(secret.length)) throw new Error("secret must be 16, 24 or 32 chars")
  if (!(effectiveTimeInSeconds > 0)) throw new Error("effectiveTimeInSeconds must be positive")

  const createTime = Math.floor(Date.now() / 1000)
  const tokenInfo: TokenInfo = {
    app_id: appId,
    user_id: userId,
    nonce: makeNonce(),
    ctime: createTime,
    expire: createTime + effectiveTimeInSeconds,
    payload,
  }

  const plaintext = JSON.stringify(tokenInfo)
  const iv = makeRandomIv()
  const encryptBuf = aesEncrypt(plaintext, secret, iv)

  // Pack: expire(int64 BE) | ivLen(uint16 BE) | iv | cipherLen(uint16 BE) | cipher
  const expireBuf = Buffer.alloc(8)
  const ivLenBuf = Buffer.alloc(2)
  const cipherLenBuf = Buffer.alloc(2)
  expireBuf.writeBigInt64BE(BigInt(tokenInfo.expire))
  ivLenBuf.writeUInt16BE(iv.length)
  cipherLenBuf.writeUInt16BE(encryptBuf.length)

  const content = Buffer.concat([expireBuf, ivLenBuf, Buffer.from(iv), cipherLenBuf, encryptBuf])

  return "04" + content.toString("base64")
}

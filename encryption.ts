import crypto from "crypto";

const SECRET = process.env.ENCRYPT_SECRET!; // 32 bytes key

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
    
  const [ivHex, encryptedHex] = text.split(":");
  const iv = Buffer.from(ivHex!, "hex");
  const encryptedText = Buffer.from(encryptedHex!, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

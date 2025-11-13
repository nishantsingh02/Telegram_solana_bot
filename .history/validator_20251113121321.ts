import { PublicKey } from "@solana/web3.js";

export function isValidPublicKey(pubkey: string) {
    try {
        const key = new PublicKey(pubkey);
    } catch(error) {
        return false;
    }
}
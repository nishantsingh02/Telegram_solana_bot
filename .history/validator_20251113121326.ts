import { PublicKey } from "@solana/web3.js";

export function isValidPublicKey(pubkey: string) {
    try {
        const key = new PublicKey(pubkey);
        return 
    } catch(error) {
        return false;
    }
}
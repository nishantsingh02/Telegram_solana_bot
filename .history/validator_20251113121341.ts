import { PublicKey } from "@solana/web3.js";

export function isValidPublicKey(pubkey: string) {
    try {
        const key = new PublicKey(pubkey);
        return PublicKey.isOnCurve
    } catch(error) {
        return false;
    }
}
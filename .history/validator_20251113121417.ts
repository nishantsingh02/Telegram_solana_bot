import { PublicKey } from "@solana/web3.js";

export function isValidPublicKey(pubkey: string) {
    try {
        const key = new PublicKey(pubkey);
        return PublicKey.isOnCurve(key.toBase58());
    } catch(error) {
        return false;
    }
}

// this is a validate using Solana’s built-in validator:
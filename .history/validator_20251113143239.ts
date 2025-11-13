import { PublicKey } from "@solana/web3.js";


// validator for Private key
export function isValidPrivateKey(privkey: string) {
    try {
        
    }
}

// validator for publickey
export function isValidPublicKey(pubkey: string) {
    try {
        const key = new PublicKey(pubkey);
        return PublicKey.isOnCurve(key.toBase58());
    } catch(error) {
        return false;
    }
}

// return false if not a valid public key

// this is a validate using Solana’s built-in validator: to validate the publicKey send by user is correct or not
import { PublicKey } from "@solana/web3.js";


// validator for Private key
export function isValidPrivateKey(privkey: string) {
    try {
        let secretKey: Uint8Array;

        if(privkey.trim().startsWith("[")) {
            const arr = JSON.parse(privkey);
            if(!Array.isArray(arr)) return false; // if arr is not an array
            if(arr.length !== 64) return false;
            if(!arr.every((n: any) => Number.isInteger(n) && n>=0 && n<=255))
                return false;
            secretKey = new Uint8Array(arr);
        }
        // if the input privkey is in bs58 form
        else {
            const decoded = bs58.
        }
    } catch(error) {
        
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
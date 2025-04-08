import { Keypair } from "@solana/web3.js";

//Generate a new keypair
let kp = Keypair.generate();
console.log(`You've generated a new Solana wallet: ${kp.publicKey.toBase58()}`);
console.log(`[${kp.secretKey}]`);




//new Solana wallet: 7zEuGWAZDriykVwhpL6XfPHY3Di3Ju3Sn1TsnJcQqWFw
//[47,21,163,201,87,216,15,182,11,179,111,155,167,75,170,184,141,127,113,55,35,234,36,52,254,141,116,131,28,103,185,63,103,207,242,29,206,137,219,58,77,120,195,148,192,19,179,243,208,112,105,25,152,125,77,78,31,118,120,236,168,35,250,6]
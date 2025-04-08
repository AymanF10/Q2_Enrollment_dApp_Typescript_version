```markdown
# Turbin3 Solana Prerequisites - TypeScript Edition


A TypeScript implementation for Solana devnet operations and Turbin3 enrollment using PDAs and Anchor framework.

---

## 📖 Overview
This project enables users to:
1. Generate Solana keypairs
2. Airdrop devnet SOL tokens
3. Transfer tokens to Turbin3 wallets
4. Enroll in Turbin3 prerequisites program using PDAs
5. Implement IDL-based interactions

---

## 🚀 Features
- **Keypair Management**: Secure wallet generation/storage
- **Token Operations**: Airdrops & transfers with fee calculation
- **PDA Integration**: Program-controlled account creation
- **Anchor Framework**: IDL-based program interaction
- **Devnet Explorer Integration**: Transaction verification

---

## ⚙️ Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Yarn](https://yarnpkg.com/)
- Solana CLI (recommended)
- Turbin3 enrollment public key

---

## 🛠️ Installation
```bash
# Initialize project
mkdir turbin3-prereq && cd turbin3-prereq
yarn init -y

# Add dependencies
yarn add @solana/web3.js bs58 @coral-xyz/anchor
yarn add -D typescript ts-node @types/node

# Configure TypeScript
npx tsc --init --rootDir ./ --outDir ./dist --esModuleInterop \
--lib ES2019 --module commonjs --resolveJsonModule true --noImplicitAny true

# Create script files
touch keygen.ts airdrop.ts transfer.ts enroll.ts
```

---

## 🧑💻 Usage

### 1. Keypair Generation (`keygen.ts`)
```typescript
import { Keypair } from "@solana/web3.js";

const kp = Keypair.generate();
console.log(`Public Key: ${kp.publicKey.toBase58()}`);
console.log(`Private Key: [${kp.secretKey}]`);
```
**What's Happening:**
- Generates ED25519 keypair using Solana's cryptographic library
- Outputs Base58 public address and byte-array private key
- Private key must be saved to `dev-wallet.json`

Run with:
```bash
yarn keygen
```

---

### 2. Devnet Airdrop (`airdrop.ts`)
```typescript
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const txhash = await connection.requestAirdrop(
      keypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    console.log(`TX: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch(e) { console.error(e); }
})();
```
**What's Happening:**
- Connects to Solana devnet RPC
- Requests 2 SOL airdrop (2 billion lamports)
- Uses Web3.js for network interactions

Run with:
```bash
yarn airdrop
```

---

### 3. Token Transfer (`transfer.ts`)
```typescript
import { Transaction, SystemProgram, Connection, Keypair, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(wallet));
const to = new PublicKey("<TURBIN3_PUBKEY>");
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const transaction = new Transaction()
      .add(SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: LAMPORTS_PER_SOL/100 // 0.01 SOL
      }));
    
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = from.publicKey;

    const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
    console.log(`TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch(e) { console.error(e); }
})();
```
**What's Happening:**
- Constructs SOL transfer transaction
- Calculates recent blockhash for transaction validity
- Handles fee calculation automatically
- Uses SystemProgram for native token transfers

Run with:
```bash
yarn transfer
```

---

### 4. Enrollment Transaction (`enroll.ts`)
```typescript
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL } from "./programs/Turbin3_prereq";
import Turbin3Wallet from "./Turbin3-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(Turbin3Wallet));
const connection = new Connection("https://api.devnet.solana.com");
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed" });
const program = new Program(IDL, "<PROGRAM_ID>", provider);

(async () => {
  try {
    const github = Buffer.from("<GITHUB_USERNAME>", "utf8");
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("prereq"), keypair.publicKey.toBuffer()],
      program.programId
    );

    const txhash = await program.methods
      .complete(github)
      .accounts({ signer: keypair.publicKey, prereq: pda })
      .rpc();
    
    console.log(`TX: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch(e) { console.error(e); }
})();
```
**What's Happening:**
- Derives PDA using program ID and seeds
- Uses Anchor framework for IDL-based interactions
- Submits GitHub username as UTF-8 buffer
- Requires valid Turbin3 program ID (`WBAQSygkwMox2VuWKU133NxFrpDZUBdvSBeaBEue2Jq`)

Run with:
```bash
yarn enroll
```

---

## 📂 Project Structure
```
turbin3-prereq/
├── programs/
│   └── Turbin3_prereq.ts    # IDL type definitions
├── dev-wallet.json          # Devnet testing wallet
├── Turbin3-wallet.json      # Enrollment wallet (gitignored)
├── package.json
└── tsconfig.json
```

---

## 🔑 Key Concepts

### Program Derived Address (PDA)
- Deterministic address generated from seeds + program ID
- No corresponding private key
- Enables program-controlled accounts
```typescript
const [pda] = PublicKey.findProgramAddressSync(
  [Buffer.from("prereq"), publicKey.toBuffer()],
  programId
);
```

### Interface Definition Language (IDL)
- JSON schema defining program instructions
- Auto-generates client-side code
- Anchor framework integration
```json
{
  "version": "0.1.0",
  "name": "Turbin3_prereq",
  "instructions": [{
    "name": "complete",
    "accounts": [/*...*/],
    "args": [{"name": "github", "type": "bytes"}]
  }]
}
```

---

## 🤝 Contributing
1. Fork repository
2. Create feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open Pull Request

---

## 📜 License
MIT License - See [LICENSE.md](LICENSE.md) for details.

---


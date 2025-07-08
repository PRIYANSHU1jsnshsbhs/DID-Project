# Decentralized ID NFT Project

This project allows users to register a decentralized identity as an NFT, storing metadata (including a hashed DID and optional image) on IPFS, and interacting with a smart contract on Ethereum (Sepolia).

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`curl -L https://foundry.paradigm.xyz | bash`)

---

## 1. Clone the Repository

```sh
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

---

## 2. Environment Variables

### **Backend (`.env` in project root):**
Create a `.env` file in the root directory with:
```
SEPOLIA_RPC_URL=YOUR_SEPOLIA_RPC_URL
PRIVATE_KEY=YOUR_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

### **Frontend (`frontend/.env`):**
Create a `.env` file in the `frontend` folder with:
```
VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
VITE_PINATA_JWT=YOUR_PINATA_JWT
```

---

## 3. Install Dependencies

### **Backend (Foundry):**
No dependencies to install—Foundry manages everything.

### **Frontend:**
```sh
cd frontend
npm install react react-dom ethers axios wagmi viem @tanstack/react-query vite @vitejs/plugin-react
npm install --save-dev tailwindcss @tailwindcss/cli
```

---

## 4. Tailwind CSS Setup (CLI Method)

```sh
# In frontend/
mkdir -p src
echo '@import "tailwindcss";' > src/input.css
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
```
In your React entry (e.g. `App.jsx`), import the CSS:
```js
import './output.css'
```

---

## 5. Build & Run

### **Backend (Solidity/Foundry):**

- **Build contracts:**
  ```sh
  forge build
  ```
- **Run tests:**
  ```sh
  forge test
  ```
- **Format code:**
  ```sh
  forge fmt
  ```
- **Deploy contract:**
  ```sh
  forge script script/DeployDecentralizedIDNFT.s.sol:DeployDecentralizedIDNFT --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast
  ```

---

### **Frontend (React/Vite):**

- **Start the dev server:**
  ```sh
  npm run dev
  ```
- The app will be available at [http://localhost:5173](http://localhost:5173)

---

## 6. Usage

- Connect MetaMask in the UI.
- Fill in your details and upload an image (optional).
- Click "Register DID NFT".
- View your metadata on IPFS and transaction on Etherscan via the provided links.

---

## 7. GitHub Upload Instructions

1. Initialize git (if not already):
   ```sh
   git init
   ```
2. Add all files:
   ```sh
   git add .
   ```
3. Commit:
   ```sh
   git commit -m "Initial commit: Decentralized ID NFT project"
   ```
4. Create a new repo on GitHub and follow the instructions to add the remote:
   ```sh
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

---

## 8. Foundry Reference

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

### Documentation

https://book.getfoundry.sh/

### Usage

#### Build

```shell
forge build
```

#### Test

```shell
forge test
```

#### Format

```shell
forge fmt
```

#### Gas Snapshots

```shell
forge snapshot
```

#### Anvil

```shell
anvil
```

#### Deploy

```shell
forge script script/DeployDecentralizedIDNFT.s.sol:DeployDecentralizedIDNFT --rpc-url <your_rpc_url> --private-key <your_private_key>
```

#### Cast

```shell
cast <subcommand>
```

#### Help

```shell
forge --help
anvil --help
cast --help
```

---

**.env files are already in .gitignore and will not be pushed to GitHub.**

---

**Happy Coding!**

import { BrowserProvider, hashMessage, keccak256, recoverAddress } from 'ethers'

export async function getDidFromAccount(ethereum, address) {
  const provider = new BrowserProvider(ethereum)
  const signer = await provider.getSigner()
  const message = 'Sign this message to generate your DID'
  const signature = await signer.signMessage(message)
  const digest = hashMessage(message)
  const recoveredAddress = recoverAddress(digest, signature)
  const did = keccak256(recoveredAddress.toLowerCase())
  return did
}
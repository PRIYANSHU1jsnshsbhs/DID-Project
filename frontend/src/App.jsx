import React, { useState } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWriteContract,
} from 'wagmi'
import { uploadJSONToPinata } from './utils/uploadToPinata'
import { DECENTRALIZED_ID_NFT_ABI } from './abi/DecentralizedIDNFT'
import { getDidFromAccount } from './utils/getDidFromAccount'
import { uploadImageToPinata } from './utils/uploadImageToPinata'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS

function App() {
  const { address, isConnected } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { writeContractAsync, isPending } = useWriteContract()

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    residence: '',
    age: '',
    aadhar: '',
  })
  const [status, setStatus] = useState('')
  const [txHash, setTxHash] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [ipfsUri, setIpfsUri] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0])
  }

  const handleConnect = async () => {
    try {
      setStatus('Connecting to MetaMask...')
      // Use the injected connector (works for MetaMask)
      const injectedConnector = connectors.find(c => c.id === 'injected')
      if (!injectedConnector) {
        setStatus('Injected wallet not found')
        return
      }
      await connectAsync({ connector: injectedConnector })
      setStatus('Connected successfully')
    } catch (err) {
      console.error('Connection failed:', err)
      setStatus('Error connecting to MetaMask: ' + (err?.shortMessage || err?.message || err?.name))
    }
  }

  const handleRegister = async () => {
    try {
      setStatus('Generating DID...')
      const did = await getDidFromAccount(window.ethereum, address)

      let imageUri = ''
      if (imageFile) {
        setStatus('Uploading image...')
        imageUri = await uploadImageToPinata(imageFile)
      }

      setStatus('Uploading metadata...')
      const metadata = { ...formData, did, image: imageUri }
      const ipfsUri = await uploadJSONToPinata(metadata)
      setIpfsUri(ipfsUri) // <-- Save the IPFS URI in state

      setStatus('Sending transaction...')
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: DECENTRALIZED_ID_NFT_ABI,
        functionName: 'register',
        args: [ipfsUri, did],
      })
      setTxHash(hash)
      setStatus('Transaction sent!')
    } catch (err) {
      console.error(err)
      setStatus('Error: ' + (err.shortMessage || err.message))
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Decentralized ID NFT Registration</h1>

      {!isConnected && (
        <button onClick={handleConnect}>Connect MetaMask</button>
      )}

      {isConnected && (
        <>
          <p>Connected as: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>

          <h2>Fill Details</h2>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} /><br /><br />
          <input type="date" name="dob" placeholder="DOB" onChange={handleChange} /><br /><br />
          <input type="text" name="residence" placeholder="Residential Address" onChange={handleChange} /><br /><br />
          <input type="number" name="age" placeholder="Age" onChange={handleChange} /><br /><br />
          <input type="text" name="aadhar" placeholder="Aadhar Card No" onChange={handleChange} /><br /><br />
          <input type="file" accept="image/*" onChange={handleImageChange} /><br /><br />

          <button onClick={handleRegister} disabled={isPending}>
            {isPending ? 'Registering...' : 'Register DID NFT'}
          </button>
        </>
      )}

      <p>Status: {status}</p>
      {ipfsUri && (
        <div>
          <p>
            Metadata IPFS URI: <a href={`https://ipfs.io/ipfs/${ipfsUri.replace('ipfs://', '')}`} target="_blank" rel="noopener noreferrer">{ipfsUri}</a>
          </p>
        </div>
      )}
      {txHash && (
        <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
          View on Etherscan
        </a>
      )}
    </div>
  )
}

export default App

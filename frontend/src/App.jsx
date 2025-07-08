import React, { useState } from 'react'
import './output.css';
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
    <div className="min-h-screen bg-blockchain-og bg-cover bg-center flex items-center justify-center">
      <div className="absolute inset-0 bg-og-overlay"></div>
      <div className="relative z-10 bg-white bg-opacity-90 rounded-2xl shadow-xl max-w-md w-full p-8 space-y-6">
        <h1 className="text-3xl font-bold text-primary text-center">NayiPehchaan</h1>

        {!isConnected ? (
          <button
            onClick={handleConnect}
            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-indigo-700"
          >
            Connect MetaMask
          </button>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Connected: {address.slice(0, 6)}…{address.slice(-4)}</span>
              <button onClick={() => disconnect()}
                className="text-sm text-accent hover:underline"
              >
                Disconnect
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text" name="name" placeholder="Name"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="date" name="dob"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                type="text" name="residence" placeholder="Residential Address"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                type="number" name="age" placeholder="Age"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                type="text" name="aadhar" placeholder="Aadhar Card No"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                type="file" accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600"
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={isPending}
              className="w-full p-4 text-black rounded-lg bg-green-500 disabled:opacity-50"
            >
              {isPending ? 'Registering…' : 'Register DID NFT'}
            </button>
          </>
        )}

        {status && <p className="text-center text-sm text-gray-800">{status}</p>}

        {ipfsUri && (
          <div className="text-sm text-center text-blue-700 break-all">
            <a
              href={`https://ipfs.io/ipfs/${ipfsUri.replace('ipfs://', '')}`}
              target="_blank" rel="noopener"
            >
              View Metadata on IPFS
            </a>
          </div>
        )}

        {txHash && (
          <div className="text-sm text-center">
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank" rel="noopener"
              className="text-blue-700 hover:underline"
            >
              View Transaction on Etherscan
            </a>
          </div>
        )}
      </div>
    </div >
  )
}

export default App
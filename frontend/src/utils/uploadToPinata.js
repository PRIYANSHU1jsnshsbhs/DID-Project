import axios from 'axios'

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT

export async function uploadJSONToPinata(jsonData) {
  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    jsonData,
    {
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
        'Content-Type': 'application/json'
      }
    }
  )
  const cid = res.data.IpfsHash
  return `ipfs://${cid}`
}

import axios from 'axios'

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT

export async function uploadImageToPinata(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    formData,
    {
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      }
    }
  )
  const cid = res.data.IpfsHash
  return `ipfs://${cid}`
}
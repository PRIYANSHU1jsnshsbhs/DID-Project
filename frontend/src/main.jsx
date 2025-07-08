import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { WagmiProvider, http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ✅ Only import createPublicClient (not WebSocket)
import { createPublicClient } from 'viem'

const queryClient = new QueryClient()

const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  publicClient: createPublicClient({
    chain: sepolia,
    transport: http()
  })
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <App />
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
)

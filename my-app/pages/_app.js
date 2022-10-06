import '../styles/globals.css'

import {
  WagmiConfig,
  createClient,
  chain,
  configureChains
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'

const { chains, provider } = configureChains(
  [chain.goerli],
  [alchemyProvider({ apiKey: process.env.GOERLI_RPC_KEY })]
)

const { connectors } = getDefaultWallets({
  appName: "CryptoDevs Collection",
  chains
});

const wagmiClient = createClient({
  // autoConnect: true,
  connectors,
  provider
})

export default function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

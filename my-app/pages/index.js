import React from "react"
import Image from 'next/image'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi"

import { CRYPTODEVS_GOERLI_ADDRESS } from "../constants"
import CryptoDevs from '../constants/CryptoDevs.json'

import styles from "../styles/Home.module.css"
import { useWhitelist } from "../hooks/useWhitelist"
import { useCryptoDevs } from "../hooks/useCryptoDevs"

function ShowInfos() {
    const { isCryptoDevsReadSuccess, numberOfNft, maxNft, presaleStarted, presaleEnded } = useCryptoDevs()
    let msg = numberOfNft < maxNft
        ?
        `${numberOfNft} NFT has been minted on a total of ${maxNft}`
        :
        "All the NFT has been minted"
    return (
        <div>
            {isCryptoDevsReadSuccess && presaleStarted && !presaleEnded && <div className={styles.description}>Presale is live !</div>}
            <div className={styles.labelNftMinted}>{msg}</div>
        </div>
    )
}

function Mint({ functionMint }) {
    const { nftPrice } = useCryptoDevs()
    const { config } = usePrepareContractWrite({
        addressOrName: CRYPTODEVS_GOERLI_ADDRESS,
        contractInterface: CryptoDevs.abi,
        functionName: functionMint,
        overrides: {
            value: nftPrice,
        },
    })
    const { data, write: mint } = useContractWrite(config)
    const { isLoading, status } = useWaitForTransaction({
        hash: data?.hash,
    })

    return (
        <div>
            <button className={styles.button} onClick={() => mint?.()} disabled={!mint || isLoading}>{isLoading ? "Minting..." : "Mint"}</button>
            <div> Status : {status}</div>
            {data?.hash &&
                <div>
                    Check tx on <a target="_blank" rel="noopener noreferrer" href={`https://goerli.etherscan.io//tx/${data?.hash}`}>Etherscan</a>
                </div>
            }
        </div>
    )
}

function ConnectAndMint() {
    const { address } = useAccount()
    const { isWhitelisted } = useWhitelist(address)
    const { isCryptoDevsReadSuccess, numberOfNft, maxNft, presaleStarted, presaleEnded } = useCryptoDevs(isWhitelisted)

    const canPresaleMint = presaleStarted && !presaleEnded && (numberOfNft < maxNft) && isWhitelisted
    const canMint = presaleEnded && (numberOfNft < maxNft)

    return (
        <div>
            {
                presaleStarted &&
                !presaleEnded &&
                (numberOfNft <= maxNft) &&
                !isWhitelisted &&
                <div className={styles.description}>Only Whitelisted addresses can Mint !</div>
            }
            <div className={styles.buttonContainer}>

                {isCryptoDevsReadSuccess && !presaleStarted && <div className={styles.description}>Presale hasn&apos;t started !</div>}
                {presaleStarted && (numberOfNft >= maxNft) && <div className={styles.description}>All NFT are Minted !</div>}
                {canPresaleMint && <Mint functionMint={"presaleMint"} />}
                {canMint && <Mint functionMint={"mint"} />}
            </div>
        </div>
    )
}

export default function Home() {
    const [hasMounted, setHasMounted] = React.useState(false);

    const { isConnected } = useAccount()

    React.useEffect(() => {
        setHasMounted(true)
    }, [])

    return (
        <div className={styles.appContainer}>
            <div className={styles.contentContainer}>
                <h1 className={styles.title}>Welcome to CryptoDevs !</h1>
                <div className={styles.description}>It&apos;s an NFT collection for devs</div>
                <a target="_blank" rel="noopener noreferrer" href="https://testnets.opensea.io/collection/cryptodevs-7xacselaea">check the collection on Opensea</a>
                {hasMounted && <ShowInfos />}
                <ConnectButton />
                {hasMounted && isConnected && <ConnectAndMint />}
            </div>
            <div className={styles.nftContainer}>
                <Image src="/0.svg" width="423" height="532" alt="CryptoDevs Img" />
            </div>
        </div >
    )
}

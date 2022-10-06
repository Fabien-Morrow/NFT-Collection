import { CRYPTODEVS_GOERLI_ADDRESS } from "../constants"
import CryptoDevs from '../constants/CryptoDevs.json'
import { useContractReads, useContractEvent } from "wagmi";
import { useMemo } from "react";

export function useCryptoDevs(buildMint = false, presale = false) {
    const configCryptoDevs = useMemo(() => {
        return {
            addressOrName: CRYPTODEVS_GOERLI_ADDRESS,
            contractInterface: CryptoDevs.abi,
        }
    }, [])

    const { data, isSuccess: isCryptoDevsReadSuccess, refetch } = useContractReads({
        contracts: [
            {
                ...configCryptoDevs,
                functionName: "numberOfNft",
            },
            {
                ...configCryptoDevs,
                functionName: "maxNft",
            },
            {
                ...configCryptoDevs,
                functionName: "presaleStarted",
            },
            {
                ...configCryptoDevs,
                functionName: "presaleEnded",
            },
            {
                ...configCryptoDevs,
                functionName: "nftPrice",
            },
        ]
    })

    useContractEvent({
        ...configCryptoDevs,
        eventName: 'Transfer',
        listener: (event) => (refetch())
    })

    useContractEvent({
        ...configCryptoDevs,
        eventName: 'PresaleStateChanged',
        listener: (event) => (refetch())
    })

    const numberOfNft = data?.[0]
    const maxNft = data?.[1]
    const presaleStarted = data?.[2]
    const presaleEnded = data?.[3]
    const nftPrice = data?.[4]

    return (useMemo(() => ({ isCryptoDevsReadSuccess, numberOfNft, maxNft, presaleStarted, presaleEnded, nftPrice, configCryptoDevs }), [isCryptoDevsReadSuccess, numberOfNft, maxNft, presaleStarted, presaleEnded, nftPrice, configCryptoDevs]))
}

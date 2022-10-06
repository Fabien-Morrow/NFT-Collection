import { WHITELIST_GOERLI_ADDRESS } from "../constants"
import Whitelist from '../constants/Whitelist.json'
import { useContractRead } from "wagmi";
import { useMemo } from "react";

export function useWhitelist(address) {
    const { data: isWhitelisted } = useContractRead({
        addressOrName: WHITELIST_GOERLI_ADDRESS,
        contractInterface: Whitelist.abi,
        functionName: "whitelistedAddresses",
        args: [address]
    })
    return (useMemo(() => ({ isWhitelisted }), [isWhitelisted]))
}

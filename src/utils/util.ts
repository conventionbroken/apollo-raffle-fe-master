import { web3 } from "@project-serum/anchor";
import { RPC_URL } from "../config";
import { programs } from "@metaplex/js";
import { PublicKey } from "@solana/web3.js";
export function formatOrdinal(num: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = num % 100;
    return `${num}${suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]}`;
}

export function formatName(name: string) {
    return name.length > 8 ? name.slice(0, 7) + "..." : name;
}


export const solConnection = new web3.Connection(RPC_URL,
    { confirmTransactionInitialTimeout: 60000 });


export const getNftMetaData = async (nftMintPk: PublicKey) => {
    let {
        metadata: { Metadata },
    } = programs;
    let metadataAccount = await Metadata.getPDA(nftMintPk);
    const metadata = await Metadata.load(solConnection, metadataAccount);
    return metadata.data.data.uri;
};

export interface AddressCount {
    address: string;
    count: number;
}

export function getAddressCounts(addresses: string[]): AddressCount[] {
    const countObj: { [address: string]: number } = {};

    addresses.forEach((address) => {
        if (countObj.hasOwnProperty(address)) {
            countObj[address] += 1;
        } else {
            countObj[address] = 1;
        }
    });

    const result: AddressCount[] = Object.entries(countObj).map(([address, count]) => ({
        address,
        count,
    }));

    return result.sort((a, b) => b.count - a.count);
}
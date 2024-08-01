import * as anchor from "@project-serum/anchor";
import {
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
} from '@solana/web3.js';

import { IDL as RaffleIDL } from "./raffle";
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { solConnection } from "../utils/util";
import { RafflePool } from "../utils/type";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import {
    GLOBAL_AUTHORITY_SEED,
    PROGRAM_ID,
    APE_TOKEN_MINT,
    RAFFLE_SIZE,
    DECIMALS,
    APE_DECIMALS,
    ADMIN_WALLET
} from "../config"
import { successAlert } from "../components/ToastGroup";
import whiteListOne from "./whitelist/levelOne.json"
import whiteListTwo from "./whitelist/levelTwo.json"

/**
 * @dev CreateRaffle function
 * @param userAddress The raffle creator's address
 * @param nft_mint The nft_mint address
 * @param ticketPriceSol The ticket price by SOL 
 * @param ticketPriceApe The ticket price by SOLAPE token
 * @param endTimestamp The raffle end timestamp
 * @param max The max entrants of this raffle
 */

export const createRaffle = async (
    wallet: WalletContextState,
    nft_mint: PublicKey,
    ticketPriceSol: number,
    ticketPriceApe: number,
    endTimestamp: number,
    max: number,
    setLoading: Function,
) => {
    console.log("endTimestamp:", endTimestamp)
    if (wallet.publicKey === null) return;
    const walletAddress = wallet.publicKey;
    setLoading(true);
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(RaffleIDL as anchor.Idl, PROGRAM_ID, provider);
    try {

        const tx = await createRaffleTx(
            program,
            walletAddress,
            nft_mint,
            ticketPriceSol,
            ticketPriceApe,
            endTimestamp,
            1,
            max
        );
        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "finalized",
        });
        console.log("txHash =", txId);
        successAlert("Success!")
        setLoading(false);
    } catch (error) {
        setLoading(false);

    }
}

/**
 * @dev BuyTicket function
 * @param userAddress The use's address
 * @param nft_mint The nft_mint address
 * @param amount The amount of ticket to buy
 */

export const buyTicket = async (
    wallet: WalletContextState,
    raffleKey: PublicKey,
    amount: number,
    setLoading: Function
) => {
    console.log(amount)
    if (wallet.publicKey === null) return;
    const walletAddress = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(RaffleIDL as anchor.Idl, PROGRAM_ID, provider);
    /// Wallet compare with JSON

    const whiteListOneSet = new Set(whiteListOne);
    const whiteListTwoSet = new Set(whiteListTwo);

    let level = 2;
    if (whiteListOneSet.has(wallet.publicKey.toBase58())) {
        level = 0;
    } else if (whiteListTwoSet.has(wallet.publicKey.toBase58())) {
        level = 1;
    }

    console.log("whitelist level:", level)

    try {
        setLoading(true);
        const tx = await buyTicketTx(
            program,
            walletAddress,
            raffleKey,
            amount,
            level
        );
        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "finalized",
        });
        successAlert("Success!")
        console.log("txHash =", txId);
        setLoading(false);
    } catch (error) {
        console.log(error)
        setLoading(false);
    }
}

/**
 * @dev RevealWinner function
 * @param nft_mint The nft_mint address
 */
export const revealWinner = async (
    wallet: WalletContextState,
    raffleKey: PublicKey,
    setLoading: Function
) => {
    if (wallet.publicKey === null) return;
    const walletAddress = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(RaffleIDL as anchor.Idl, PROGRAM_ID, provider);
    try {
        setLoading(true);
        const tx = await revealWinnerTx(
            program,
            walletAddress,
            raffleKey,
        );
        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "finalized",
        });

        console.log("txHash =", txId);
        successAlert("Thanks! Success!");
        setLoading(true);
    } catch (error) {
        console.log(error);
        setLoading(true);
    }
}

/**
 * @dev ClaimReward function
 * @param nft_mint The nft_mint address
 */
export const claimReward = async (
    wallet: WalletContextState,
    nft_mint: PublicKey,
    raffleKey: PublicKey,
    setLoading: Function,
) => {
    if (wallet.publicKey === null) return;
    const walletAddress = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(RaffleIDL as anchor.Idl, PROGRAM_ID, provider);
    try {
        setLoading(true)
        const tx = await claimRewardTx(
            program,
            walletAddress,
            nft_mint,
            raffleKey
        );
        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "finalized",
        });


        successAlert("Success!")
        console.log("txHash =", txId);
        setLoading(false)
    } catch (error) {
        console.log(error);
        setLoading(false)
    }
}

/**
 * @dev WithdrawNFT function
 * @param nft_mint The nft_mint address
 */
export const withdrawNft = async (
    wallet: WalletContextState,
    nft_mint: PublicKey,
    raffleKey: PublicKey,
    setLoading: Function
) => {
    if (wallet.publicKey === null) return;
    const walletAddress = wallet.publicKey;
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(RaffleIDL as anchor.Idl, PROGRAM_ID, provider);
    try {
        setLoading(true);
        const tx = await withdrawNftTx(
            program,
            walletAddress,
            nft_mint,
            raffleKey
        );
        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "finalized",
        });
        console.log("txHash =", txId);
        successAlert("Success!")
        setLoading(false);
    } catch (error) {
        console.log("Withdraw Error:", error)
        setLoading(false);
    }
}

export const createRaffleTx = async (
    program: anchor.Program,
    userAddress: PublicKey,
    nft_mint: PublicKey,
    ticketPriceSol: number,
    ticketPriceApe: number,
    endTimestamp: number,
    whitelisted: number,
    max: number
) => {

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    let ownerNftAccount = await getAssociatedTokenAccount(userAddress, nft_mint);

    let ix0 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        globalAuthority,
        [nft_mint]
    );
    console.log("Dest NFT Account = ", ix0.destinationAccounts[0].toBase58());


    let ix1 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        userAddress,
        [APE_TOKEN_MINT]
    );

    let raffle;
    let i;

    for (i = 10; i > 0; i--) {
        raffle = await PublicKey.createWithSeed(
            userAddress,
            nft_mint.toBase58().slice(0, i),
            program.programId,
        );
        let state = await getStateByKey(raffle);
        if (state === null) {
            console.log(i);
            break;
        }
    }
    let tx = new Transaction();
    if (raffle) {
        let ix = SystemProgram.createAccountWithSeed({
            fromPubkey: userAddress,
            basePubkey: userAddress,
            seed: nft_mint.toBase58().slice(0, i),
            newAccountPubkey: raffle,
            lamports: await solConnection.getMinimumBalanceForRentExemption(RAFFLE_SIZE),
            space: RAFFLE_SIZE,
            programId: program.programId,
        });


        tx.add(ix);
        if (ix0.instructions.length > 0) tx.add(...ix0.instructions)
        if (ix1.instructions.length > 0) tx.add(...ix1.instructions)
        tx.add(program.instruction.createRaffle(
            new anchor.BN(ticketPriceApe * APE_DECIMALS),
            new anchor.BN(ticketPriceSol * DECIMALS),
            new anchor.BN(endTimestamp),
            new anchor.BN(whitelisted),
            new anchor.BN(max),
            {
                accounts: {
                    admin: userAddress,
                    globalAuthority,
                    raffle,
                    ownerTempNftAccount: ownerNftAccount,
                    destNftTokenAccount: ix0.destinationAccounts[0],
                    nftMintAddress: nft_mint,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
                instructions: [],
                signers: [],
            }));
    }


    return tx;
}

export const buyTicketTx = async (
    program: anchor.Program,
    userAddress: PublicKey,
    raffleKey: PublicKey,
    amount: number,
    level: number
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    let tx = new Transaction();
    if (raffleKey) {

        let raffleState = await getStateByKey(raffleKey);
        if (raffleState) {
            const creator = raffleState.creator;

            let ix1 = await getATokenAccountsNeedCreate(
                solConnection,
                userAddress,
                userAddress,
                [APE_TOKEN_MINT]
            );
            let ix2 = await getATokenAccountsNeedCreate(
                solConnection,
                userAddress,
                creator,
                [APE_TOKEN_MINT]
            );
            let ix3 = await getATokenAccountsNeedCreate(
                solConnection,
                userAddress,
                ADMIN_WALLET,
                [APE_TOKEN_MINT]
            );


            if (ix1.instructions.length > 0) tx.add(...ix1.instructions);
            if (ix2.instructions.length > 0) tx.add(...ix2.instructions);
            if (ix3.instructions.length > 0) tx.add(...ix3.instructions);

            console.log(ix1.destinationAccounts[0].toBase58());
            console.log(ix2.destinationAccounts[0].toBase58());
            tx.add(program.instruction.buyTickets(
                new anchor.BN(amount), new anchor.BN(level),
                {
                    accounts: {
                        buyer: userAddress,
                        raffle: raffleKey,
                        globalAuthority,
                        creator,
                        creatorTokenAccount: ix2.destinationAccounts[0],
                        userTokenAccount: ix1.destinationAccounts[0],
                        admin: ADMIN_WALLET,
                        adminTokenAccount: ix3.destinationAccounts[0],
                        tokenProgram: TOKEN_PROGRAM_ID,
                        systemProgram: SystemProgram.programId,
                    },
                    instructions: [],
                    signers: [],
                }));
        }

    }
    return tx;

}

export const revealWinnerTx = async (
    program: anchor.Program,
    userAddress: PublicKey,
    raffleKey: PublicKey,
) => {
    let tx = new Transaction();
    tx.add(program.instruction.revealWinner(
        {
            accounts: {
                buyer: userAddress,
                raffle: raffleKey
            },
            instructions: [],
            signers: []
        }
    ));

    return tx;
}

export const claimRewardTx = async (
    program: anchor.Program,
    userAddress: PublicKey,
    nft_mint: PublicKey,
    raffleKey: PublicKey,
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    let tx = new Transaction();
    const srcNftTokenAccount = await getAssociatedTokenAccount(globalAuthority, nft_mint);

    let ix0 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        userAddress,
        [nft_mint]
    );
    console.log("Claimer's NFT Account: ", ix0.destinationAccounts[0]);

    if (ix0.instructions.length > 0) tx.add(...ix0.instructions);
    if (raffleKey) {
        tx.add(program.instruction.claimReward(
            bump,
            {
                accounts: {
                    claimer: userAddress,
                    globalAuthority,
                    raffle: raffleKey,
                    claimerNftTokenAccount: ix0.destinationAccounts[0],
                    srcNftTokenAccount,
                    nftMintAddress: nft_mint,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
                instructions: [],
                signers: [],
            }));
    }

    return tx;

}

export const withdrawNftTx = async (
    program: anchor.Program,
    userAddress: PublicKey,
    nft_mint: PublicKey,
    raffleKey: PublicKey
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    let tx = new Transaction();
    const srcNftTokenAccount = await getAssociatedTokenAccount(globalAuthority, nft_mint);

    let ix0 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        userAddress,
        [nft_mint]
    );

    if (raffleKey) {
        if (ix0.instructions.length === 0) {
            tx.add(program.instruction.withdrawNft(
                bump,
                {
                    accounts: {
                        claimer: userAddress,
                        globalAuthority,
                        raffle: raffleKey,
                        claimerNftTokenAccount: ix0.destinationAccounts[0],
                        srcNftTokenAccount,
                        nftMintAddress: nft_mint,
                        tokenProgram: TOKEN_PROGRAM_ID,
                    },
                    signers: [],
                }));
        } else {
            if (ix0.instructions.length > 0) tx.add(...ix0.instructions);
            tx.add(program.instruction.withdrawNft(
                bump,
                {
                    accounts: {
                        claimer: userAddress,
                        globalAuthority,
                        raffle: raffleKey,
                        claimerNftTokenAccount: ix0.destinationAccounts[0],
                        srcNftTokenAccount,
                        nftMintAddress: nft_mint,
                        tokenProgram: TOKEN_PROGRAM_ID,
                    },
                    instructions: [],
                    signers: [],
                }));
        }
    }

    return tx;

}

// export const getAllData = async () => {
//     let cloneWindow: any = window;
//     let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
//     const program = new anchor.Program(RaffleIDL as anchor.Idl, PROGRAM_ID, provider);
//     let poolAccounts = await solConnection.getProgramAccounts(
//         program.programId,
//         {
//             filters: [
//                 {
//                     dataSize: RAFFLE_SIZE
//                 },
//             ]
//         }
//     );

//     let result = [];
//     for (let i = 0; i < poolAccounts.length; i++) {
//         const data = poolAccounts[i].account.data;

//         const creator = new PublicKey(data.slice(8, 40));
//         const nftMint = new PublicKey(data.slice(40, 72));

//         let buf = data.slice(72, 80).reverse();
//         const count = new anchor.BN(buf).toNumber();

//         buf = data.slice(80, 88).reverse();
//         const noRepeat = new anchor.BN(buf).toNumber();

//         buf = data.slice(88, 96).reverse();
//         const maxEntrants = new anchor.BN(buf).toNumber();

//         buf = data.slice(96, 104).reverse();
//         const startTimestamp = new anchor.BN(buf).toNumber();

//         buf = data.slice(104, 112).reverse();
//         const endTimestamp = new anchor.BN(buf).toNumber();

//         buf = data.slice(112, 120).reverse();
//         const ticketPriceApe = new anchor.BN(buf).toNumber();

//         buf = data.slice(120, 128).reverse();
//         const ticketPriceSol = new anchor.BN(buf).toNumber();

//         buf = data.slice(128, 136).reverse();
//         const whitelisted = new anchor.BN(buf).toNumber();

//         const winner = new PublicKey(data.slice(136, 168)).toBase58();

//         let entrants = [];

//         for (let j = 0; j < count; j++) {
//             const entrant = new PublicKey(data.slice(168 + j * 32, 200 + j * 32));
//             entrants.push(entrant.toBase58());
//         }

//         result.push({
//             raffleKey: poolAccounts[i].pubkey.toBase58(),
//             creator: creator.toBase58(),
//             nftMint: nftMint.toBase58(),
//             count: count,
//             noRepeat: noRepeat,
//             maxEntrants: maxEntrants,
//             startTimestamp: startTimestamp,
//             endTimestamp: endTimestamp,
//             ticketPriceApe: ticketPriceApe,
//             ticketPriceSol: ticketPriceSol,
//             whitelisted: whitelisted,
//             winner: winner,
//             entrants: entrants
//         });

//     }

//     return result;
// }

export const getAllData = async () => {
    let cloneWindow: any = window;
    // Ensure solConnection is initialized
    if (!solConnection) {
        console.error('solConnection is undefined');
        return;
    }
    // Ensure window['solana'] is initialized
    if (!cloneWindow['solana']) {
        console.error('window[\'solana\'] is undefined');
        return;
    }
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions());
    const program = new anchor.Program(RaffleIDL as anchor.Idl, PROGRAM_ID, provider);
    let poolAccounts = await solConnection.getProgramAccounts(
        program.programId,
        {
            filters: [
                {
                    dataSize: RAFFLE_SIZE
                },
            ]
        }
    );

    let result = [];
    for (let i = 0; i < poolAccounts.length; i++) {
        const data = poolAccounts[i].account.data;
        // Ensure further usage checks for undefined objects/properties
    }
};

export const getRaffleKey = async (
    nft_mint: PublicKey
): Promise<PublicKey | null> => {
    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(RaffleIDL as anchor.Idl, PROGRAM_ID, provider);
    let poolAccounts = await solConnection.getProgramAccounts(
        program.programId,
        {
            filters: [
                {
                    dataSize: RAFFLE_SIZE
                },
                {
                    memcmp: {
                        "offset": 40,
                        "bytes": nft_mint.toBase58()
                    }
                }
            ]
        }
    );
    if (poolAccounts.length !== 0) {
        let maxId = 0;
        let used = 0;
        for (let i = 0; i < poolAccounts.length; i++) {
            const data = poolAccounts[i].account.data;
            const buf = data.slice(128, 136).reverse();
            if ((new anchor.BN(buf)).toNumber() === 1) {
                maxId = i;
                used = 1;
            }

        }
        let raffleKey: PublicKey = PublicKey.default;

        if (used === 1) raffleKey = poolAccounts[maxId].pubkey;

        console.log(raffleKey.toBase58())
        return raffleKey;
    } else {
        return null;
    }
}

export const getStateByKey = async (
    raffleKey: PublicKey
): Promise<RafflePool | null> => {

    let cloneWindow: any = window;
    let provider = new anchor.AnchorProvider(solConnection, cloneWindow['solana'], anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program(RaffleIDL as anchor.Idl, PROGRAM_ID, provider);
    try {
        let rentalState = await program.account.rafflePool.fetch(raffleKey);
        return rentalState as unknown as RafflePool;
    } catch {
        return null;
    }
}
const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
    let associatedTokenAccountPubkey = (await PublicKey.findProgramAddress(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
    return associatedTokenAccountPubkey;
}

export const getATokenAccountsNeedCreate = async (
    connection: anchor.web3.Connection,
    walletAddress: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    nfts: anchor.web3.PublicKey[],
) => {
    let instructions = [], destinationAccounts = [];
    for (const mint of nfts) {
        const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
        let response = await connection.getAccountInfo(destinationPubkey);
        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(
                destinationPubkey,
                walletAddress,
                owner,
                mint,
            );
            instructions.push(createATAIx);
        }
        destinationAccounts.push(destinationPubkey);
        // if (walletAddress != owner) {
        //     const userAccount = await getAssociatedTokenAccount(walletAddress, mint);
        //     response = await connection.getAccountInfo(userAccount);
        //     if (!response) {
        //         const createATAIx = createAssociatedTokenAccountInstruction(
        //             userAccount,
        //             walletAddress,
        //             owner,
        //             mint,
        //         );
        //         instructions.push(createATAIx);
        //     }
        // }
    }
    return {
        instructions,
        destinationAccounts,
    };
}

export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: anchor.web3.PublicKey,
    payer: anchor.web3.PublicKey,
    walletAddress: anchor.web3.PublicKey,
    splTokenMintAddress: anchor.web3.PublicKey
) => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new anchor.web3.TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
}

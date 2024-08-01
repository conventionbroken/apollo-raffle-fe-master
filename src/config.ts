import { PublicKey } from "@metaplex-foundation/js";

export const RPC_URL = "https://api.devnet.solana.com";

export const GLOBAL_AUTHORITY_SEED = "global-authority";
export const EMPTY_USER = "11111111111111111111111111111111";

export const PROGRAM_ID = "HYpCYwetRSXdjVuvbZi9g4mTz2Ng2XSrdcPx1fpwHnto";
export const APE_TOKEN_MINT = new PublicKey("AsACVnuMa5jpmfp3BjArmb2qWg5A6HBkuXePwT37RrLY");
export const ADMIN_WALLET = new PublicKey("fzAmK49gHQzVY5rDVVG5eNiKseTHZuM1CdzKV3d8rEr");
export const RAFFLE_SIZE = 32936;
export const DECIMALS = 1000000000;
export const APE_DECIMALS = 1000000000;
export const DAY = 3600 * 24 * 1000
export const TOKENS = [
    {
        tokenName: "Solana",
        tokenSymbol: "SOL",
        tokenAddress: "Gj8q7FboqyEGkJy7oYDFWjrozgsGegjkHnbLtZr9LvUW",
        decimal: 9
    },
    {
        tokenName: "SolAPE",
        tokenSymbol: "SOLAPE",
        tokenAddress: "GHvFFSZ9BctWsEc5nujR1MTmmJWY7tgQz2AXE6WVFtGN",
        decimal: 9
    },
]

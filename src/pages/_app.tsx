import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import Wallet from "../components/wallet/Wallet";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export default function App({ Component, pageProps }: any) {
  return (
    <Wallet>
      <WalletModalProvider>
        <Component {...pageProps} />
        <ToastContainer
          style={{ fontSize: 15 }}
          pauseOnFocusLoss={false}
          enableMultiContainer={false}
        />
      </WalletModalProvider>
    </Wallet>
  );
}

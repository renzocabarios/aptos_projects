"use client";
import { WalletSelector } from "@/components/wallet-selector";
import { useWallet, WalletName } from "@aptos-labs/wallet-adapter-react";
import Image from "next/image";

export default function Home() {
  const { connect, disconnect, account, connected } = useWallet();

  const handleConnect = async () => {
    try {
      // Change below to the desired wallet name instead of "Petra"
      await connect("Petra" as WalletName<"Petra">);
      console.log("Connected to wallet:", account);
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      console.log("Disconnected from wallet");
    } catch (error) {
      console.error("Failed to disconnect from wallet:", error);
    }
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* {connected ? (
        <div>
          <p>Connected to: {account?.address}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )} */}
      <WalletSelector />
    </div>
  );
}

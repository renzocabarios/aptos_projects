import { useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./abi.json";
declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [randomDino, setrandomDino] = useState(
    `https://raw.githubusercontent.com/tinydinosnft/tinydinosassets/main/images/dinos/1600x1600/original/1.png`
  );
  const [accountAddress, setAccountAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setcontract] = useState<any>(null);
  const [provider, setprovider] = useState<any>(null);

  const connectWallet = async () => {
    const { ethereum } = window;
    if (!ethereum) sethaveMetamask(false);
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    setcontract(contract);
    setAccountAddress(accounts[0]);
    setIsConnected(true);
    setprovider(provider);
  };

  const generateNumber = () => {
    setrandomDino(
      `https://raw.githubusercontent.com/tinydinosnft/tinydinosassets/main/images/dinos/1600x1600/original/${Math.floor(
        Math.random() * 2000 + 1
      )}.png`
    );
  };

  const mint = async () => {
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);

    const contract = new ethers.Contract(
      "0xa4457D6cF9C612e19A4CC7eB29B950a37ec378b1",
      abi,
      provider
    );

    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const temp = await contractWithSigner.createToken(randomDino);
    alert(temp.hash);
  };

  return (
    <>
      <img src={`${randomDino}`} />
      {accountAddress && isConnected ? (
        <p>{accountAddress}</p>
      ) : (
        <p>No Wallet Connected</p>
      )}
      <button
        className="btn"
        onClick={generateNumber}
        disabled={!accountAddress && !isConnected}
      >
        Generate Art
      </button>
      <button
        className="btn"
        onClick={mint}
        disabled={!accountAddress && !isConnected}
      >
        Mint
      </button>
      {accountAddress && isConnected ? (
        <h3>Wallet Connected</h3>
      ) : (
        <button className="btn" onClick={connectWallet}>
          Connect
        </button>
      )}
    </>
  );
}

export default App;

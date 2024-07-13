import React, { useState } from 'react';
import { execHaloCmdWeb } from '@arx-research/libhalo/api/web.js';
import { ethers } from 'ethers';
import tokenAbi from '../contracts/Token.json'; // Adjust the path as needed
import contractAddress from '../contracts/contract-address.json'; // Adjust the path as needed

function NFCWriter() {
  const [status, setStatus] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [signature, setSignature] = useState(null);

  const readNFC = async () => {
    let command = {
      name: "sign",
      keyNo: 1, // Assuming key slot 1
      message: "0123456789abcdef" // Example message to sign
    };

    try {
      setStatus('Scanning NFC wristband... Please tap your wristband.');
      console.log("Attempting to execute NFC read command: ", command);
      const result = await execHaloCmdWeb(command);
      console.log("NFC read result: ", result);

      if (result.signature) {
        setSignature(result.signature);
        setStatus(`Read signature from wristband.`);
      } else {
        setStatus('No signature found on wristband.');
      }
    } catch (e) {
      console.error("NFC reading failed: ", e);
      setStatus(`Failed to read the wristband. Error: ${e.message}`);
    }
  };

  const claimToken = async () => {
    if (!signature) {
      setStatus('No signature found on wristband.');
      return;
    }

    try {
      // Connect to Ethereum provider and get signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // Get contract instance
      const tokenContract = new ethers.Contract(contractAddress.Token, tokenAbi.abi, signer);

      // Call the claim function with the signature
      const tx = await tokenContract.claimTokenWithSignature(signature.raw); // Adjust this based on your contract's method
      setStatus(`Transaction sent: ${tx.hash}`);

      // Wait for the transaction to be mined
      await tx.wait();
      setStatus(`Successfully claimed token with the signature.`);
    } catch (e) {
      console.error("Token claiming failed: ", e);
      setStatus('Failed to claim the token.');
    }
  };

  return (
    <div className="container p-4">
      <h2>Claim Token from Wristband</h2>
      <button onClick={readNFC} className="btn btn-secondary mb-2">Read Wristband</button>
      <button onClick={claimToken} className="btn btn-primary mb-2">Claim Token</button>
      {status && <p className="mt-2">{status}</p>}
      {signature && (
        <div className="mt-2">
          <p>Signature:</p>
          <pre>{JSON.stringify(signature, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default NFCWriter;

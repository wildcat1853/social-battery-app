import React, { useState } from 'react';
import { execHaloCmdWeb } from '@arx-research/libhalo/api/web.js';

function NFCWriter() {
  const [status, setStatus] = useState('');
  const [url, setUrl] = useState('');

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const writeNFC = async () => {
    let command = {
      name: "cfg_ndef",
      url: url
    };

    try {
      // --- request NFC command execution ---
      const result = await execHaloCmdWeb(command);
      // the command has succeeded, display the result to the user
      setStatus(`Successfully reprogrammed the wristband to ${url}`);
    } catch (e) {
      // the command has failed, display error to the user
      console.error("NFC writing failed: ", e);
      setStatus('Failed to reprogram the wristband.');
    }
  };

  return (
    <div className="container p-4">
      <h2>Reprogram Wristband</h2>
      <input
        type="text"
        value={url}
        onChange={handleUrlChange}
        placeholder="Enter new URL"
        className="form-control mb-2"
      />
      <button onClick={writeNFC} className="btn btn-primary">Reprogram Wristband</button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}

export default NFCWriter;

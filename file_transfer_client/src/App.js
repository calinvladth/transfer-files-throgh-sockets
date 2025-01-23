import { useEffect, useState } from "react";
import {calculatePercentage} from './utils/calculatePercentage'

function App() {
  const [ws, setWs] = useState(null);
  const [chunks, setChunks] = useState([])
  const [fileName, setFileName] = useState('')

  const [percentage, setPercentage] = useState(0)
  const [uploadPercentage, setUploadPercentage] = useState(0)

  useEffect(() => {
    const websocket = new WebSocket('ws://172.236.212.109:8080');

    websocket.onopen = () => {
      console.log('WebSocket is connected');
    };

    websocket.onmessage = (evt) => {
      const message = (evt.data);
      const jsonMessage = JSON.parse(message)
      console.log(jsonMessage)

      if (jsonMessage.fileName) {
        setFileName(jsonMessage.fileName)
      }

      console.log(jsonMessage)
      setPercentage(calculatePercentage(jsonMessage.chunkIndex, jsonMessage.totalChunks))

      handleReceiveChunk(jsonMessage.buffer)
    };

    websocket.onclose = () => {
      console.log('WebSocket is closed');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const handleReceiveChunk = (chunk) => {
    const data = chunk.data;
    if (!data || !Array.isArray(data)) {
      console.error('Invalid chunk format:', chunk);
      return;
    }

    // Convert to Uint8Array
    const uint8Array = new Uint8Array(data);

    setChunks((prevChunks) => [...prevChunks, uint8Array]);
  };

  const handleDownload = () => {
    const combinedBuffer = Uint8Array.from(chunks.flat());
    console.log(combinedBuffer.slice(0, 20)); 

    if (chunks.length === 0) return;

    // Combine chunks into a single Blob
    const blob = new Blob(chunks, { type: 'application/octet-stream' });

    // Create a download link
    const url = URL.createObjectURL(blob);

    // Create an anchor element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Change filename and extension as needed
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  function handleFileChange(e) {
    const file = e.target.files[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = async () => {
      const arrayBuffer = reader.result;
      const chunkSize = 64 * 1024; // 64 KB per chunk
      const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);
      console.log({chunkSize, totalChunks})

      // Send file metadata first
      ws.send(
        JSON.stringify({
          type: 'metadata',
          fileName: file.name,
          fileSize: file.size,
          totalChunks,
        })
      );

      for (let i = 0; i < totalChunks; i++) {
        setUploadPercentage(calculatePercentage(i, totalChunks))
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);

        const blob = file.slice(start, end);
        const base64Chunk = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        }); 

        ws.send(
          JSON.stringify({
            type: 'chunk',
            chunkIndex: i,
            data: base64Chunk.split(',')[1], // Remove the data URI prefix
            totalChunks,
            fileName: file.name
          })
        );
      }
    };

    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="App">
      

      <form action="">
        <label>File upload</label>
        <input type="file" onChange={handleFileChange} />
      </form>

      <p>Uploading {uploadPercentage.toFixed(0)}%</p>

      {
        fileName && <p>Download {fileName}: {percentage.toFixed(0)}%</p>
      }
      
      {
        percentage === 100 && <button onClick={handleDownload} disabled={chunks.length === 0} className="border border-black">
        Download {fileName}
      </button>
      }
    </div>
  );
}

export default App;

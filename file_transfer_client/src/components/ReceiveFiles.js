import { useEffect, useState } from "react";
import { calculatePercentage } from "../utils/calculatePercentage";

function ReceiveFiles({ ws }) {
  const [chunks, setChunks] = useState([]);
  const [from, setFrom] = useState("");
  const [fileName, setFileName] = useState("");
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (evt) => {
        const message = evt.data;
        const jsonMessage = JSON.parse(message);
        console.log("JSON: ", jsonMessage);

        if (jsonMessage.fileName) {
          setFileName(jsonMessage.fileName);
        }

        if (jsonMessage.from) {
          setFrom(jsonMessage.from);
        }

        setPercentage(
          calculatePercentage(
            jsonMessage.chunkIndex,
            jsonMessage.totalChunks
          ).toFixed(0)
        );

        handleReceiveChunk(jsonMessage.buffer);
      };
    }
  }, [ws]);

  const handleReceiveChunk = (chunk) => {
    const data = chunk.data;
    if (!data || !Array.isArray(data)) {
      return;
    }

    // Convert to Uint8Array
    const uint8Array = new Uint8Array(data);

    setChunks((prevChunks) => [...prevChunks, uint8Array]);
  };

  const handleDownload = () => {
    if (chunks.length === 0) {
      return;
    }

    console.log("PPP ", percentage);
    if (percentage !== "100") {
      return;
    }

    const combinedBuffer = Uint8Array.from(chunks.flat());
    combinedBuffer.slice(0, 20);

    // Combine chunks into a single Blob
    const blob = new Blob(chunks, { type: "application/octet-stream" });

    // Create a download link
    const url = URL.createObjectURL(blob);

    // Create an anchor element and trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // Change filename and extension as needed
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!fileName) {
    return;
  }

  return (
    <div className="w-full border border-black p-7">
      <p>Received files</p>
      <ul>
        <li
          className={`list-disc list-inside ${
            percentage === "100" && "cursor-pointer"
          }`}
          onClick={handleDownload}
        >
          {from}
          {": "}
          {fileName}:{" "}
          <span
            className={percentage === "100" ? "text-green-500" : "text-black"}
          >
            {percentage}%
          </span>
        </li>
      </ul>
    </div>
  );
}

export default ReceiveFiles;

import { useEffect, useState } from "react";
import { calculatePercentage } from "../utils/calculatePercentage";

function ReceiveFiles({ ws }) {
  const [chunks, setChunks] = useState([]);
  const [map, setMap] = useState(new Map());

  useEffect(() => {
    const newMap = new Map(map);
    if (ws) {
      ws.onmessage = (evt) => {
        const message = evt.data;
        const jsonMessage = JSON.parse(message);

        if (jsonMessage.type !== "clientChunk") {
          return;
        }

        if (!jsonMessage.fileName) {
          return;
        }

        if (!jsonMessage.from) {
          return;
        }

        const chunk = jsonMessage.buffer.data;

        if (!chunk || !Array.isArray(chunk)) {
          return;
        }

        const uint8Array = new Uint8Array(chunk);

        newMap.set(jsonMessage.fileName, {
          percentage: calculatePercentage(
            jsonMessage.chunkIndex,
            jsonMessage.totalChunks
          ).toFixed(0),
          from: jsonMessage.from,
          chunks: newMap.get(jsonMessage.fileName)?.chunks
            ? [...newMap.get(jsonMessage.fileName).chunks, uint8Array]
            : [uint8Array],
        });

        setMap(new Map(newMap));
      };
    }
  }, [ws, map]);

  const handleDownload = (fileName) => {
    const file = map.get(fileName);

    if (file.chunks.length === 0) {
      return;
    }

    // TODO: Find other way for this shit

    // Combine chunks into a single Blob
    const blob = new Blob(file.chunks, { type: "application/octet-stream" });

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

  // If map empty return

  return (
    <div className="w-full border border-black p-7">
      <p>Received files</p>
      <ul>
        {Array.from(map.entries()).map(([key, value]) => (
          <li
            onClick={() => handleDownload(key)}
            key={key}
            className={`list-disc list-inside ${
              value.percentage === "100" && "cursor-pointer"
            }`}
          >
            {key}{" "}
            <span
              className={`${value.percentage === "100" && "text-green-500"}`}
            >
              {value.percentage}%
            </span>{" "}
            {value.from}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReceiveFiles;

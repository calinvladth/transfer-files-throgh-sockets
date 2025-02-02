import { useState } from "react";
import { calculatePercentage } from "../utils/calculatePercentage";
import { formatFileSize } from "../utils/formatFileSize";

function SendFiles({ ws, collection }) {
  const [map, setMap] = useState(new Map());

  function handleFileChange(e) {
    const files = e.target.files;
    const newMap = new Map(map);

    Array.from(files).forEach((file) => {
      if (!file) {
        return;
      }

      newMap.set(file, 0);

      const reader = new FileReader();

      reader.onload = async () => {
        const arrayBuffer = reader.result;
        // TODO: Check for a good chunk size
        const chunkSize = 64 * 1024; // 64 KB per chunk
        const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);

        ws.send(
          JSON.stringify({
            type: "metadata",
            fileName: file.name,
            fileSize: file.size,
            totalChunks,
            collection,
          })
        );

        for (let i = 0; i < totalChunks; i++) {
          newMap.set(file, calculatePercentage(i + 1, totalChunks).toFixed(0));
          setMap(new Map(newMap));

          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, file.size);

          const blob = file.slice(start, end);
          const base64Chunk = await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });

          ws.send(
            JSON.stringify({
              type: "chunk",
              chunkIndex: i,
              data: base64Chunk.split(",")[1],
              totalChunks,
              fileName: file.name,
              collection,
            })
          );
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }

  return (
    <div className="border border-black p-7">
      <form action="">
        <label className="mb-3" for="small_size">
          Send file to collection
        </label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-xs cursor-pointer focus:outline-none py-3"
        ></input>
      </form>

      <>
        <p>Uploading</p>
        <ul>
          {Array.from(map.entries()).map(([key, value]) => (
            <li className="list-disc list-inside">
              {key.name} {formatFileSize(key.size)}{" "}
              <span
                className={value === "100" ? "text-green-500" : "text-black"}
              >
                {value}%
              </span>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
}

export default SendFiles;

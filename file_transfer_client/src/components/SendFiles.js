import { useState } from "react";
import { calculatePercentage } from "../utils/calculatePercentage";
import { formatFileSize } from "../utils/formatFileSize";

function SendFiles({ ws, collection }) {
  const [fileData, setFileData] = useState();
  const [uploadPercentage, setUploadPercentage] = useState(0);

  function handleFileChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setFileData(file);

    const reader = new FileReader();

    reader.onload = async () => {
      const arrayBuffer = reader.result;
      // TODO: Check for a good chunk size
      const chunkSize = 64 * 1024; // 64 KB per chunk
      const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);

      // Send file metadata first
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
        setUploadPercentage(calculatePercentage(i + 1, totalChunks).toFixed(0));
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
            data: base64Chunk.split(",")[1], // Remove the data URI prefix
            totalChunks,
            fileName: file.name,
            collection,
          })
        );

        if (uploadPercentage === 100) {
          setFileData();
        }
      }
    };

    reader.readAsArrayBuffer(file);
  }
  return (
    <div className="border border-black p-7">
      <form action="">
        <label className="mb-3" for="small_size">
          Send file to users collection
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-xs cursor-pointer focus:outline-none py-3"
        ></input>
      </form>

      {fileData && (
        <>
          <p>Uploading</p>
          {/* TODO: Manage multiple files */}
          <ul>
            <li className="list-disc list-inside">
              {fileData.name} {formatFileSize(fileData.size)}{" "}
              <span
                className={
                  uploadPercentage == 100 ? "text-green-500" : "text-black"
                }
              >
                {uploadPercentage}%
              </span>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

export default SendFiles;

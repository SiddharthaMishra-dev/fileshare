import { Peer } from "peerjs";
import { signal } from "@preact/signals-react";
import fileDownload from "js-file-download";
import Layout from "./Layout/Layout";
import { useEffect } from "react";
import { FaRegClipboard } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import toast from "react-hot-toast";

function App() {
  const peer = new Peer();
  const Id = signal("");
  const connectionId = signal("");
  const file = signal<File | null>(null);
  const fileName = signal("");
  peer.on("open", (id: string) => {
    Id.value = id;
  });

  useEffect(() => {
    peer.on("connection", (conn) => {
      console.log("someone is connected");

      conn.on("data", (data: any) => {
        console.log("receiving");
        let dt = data.file;
        if (data.file) {
          fileDownload(dt, data.filename, data.filetype);
        }
      });
    });

    return () => {
      peer.disconnect();
    };
  }, [peer]);

  const onFilechange = (e: any) => {
    file.value = e.target.files[0];
    fileName.value = file.value?.name || "";
    console.log(file?.value?.name);
  };

  const handleFileSend = () => {
    const conn = peer.connect(connectionId.value);
    const blob = new Blob([file.value!], { type: file.value?.type });
    conn.on("open", () => {
      conn.send({
        file: blob,
        filename: file.value?.name,
        filetype: file.value?.type,
      });
    });
  };

  const handleConnection = () => {
    handleFileSend();
  };

  return (
    <Layout>
      <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-neutral-800 rounded-lg">
        <div className="text-4xl font-semibold text-green-400 ">fileShare</div>
        <div className="flex flex-col gap-y-2 w-full max-w-[400px]">
          <p className="font-semibold text-md">Your connection Id</p>
          <div className="relative h-[50px] px-3 py-4 bg-neutral-700 rounded-md ">
            <p>{Id}</p>
            <FaRegClipboard
              onClick={() => {
                navigator.clipboard.writeText(Id.value);
                toast.success("copied!!");
              }}
              size={25}
              className="absolute top-3 right-3 hover:text-green-400 transition"
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-2 w-full max-w-[400px]">
          <p className="font-semibold text-md">Input connection Id</p>
          <input
            className="px-2 py-4 rounded-md"
            onChange={(e) => {
              connectionId.value = e.target.value;
            }}
            placeholder="Other device connection Id"
          />
        </div>

        <div className=" py-4 flex flex-col gap-y-4 justify-center items-center w-full max-w-[400px]">
          <label
            htmlFor="file-input"
            className="w-full flex flex-col justify-center items-center bg-neutral-700 p-6 rounded-md hover:opacity-60 transition"
          >
            <IoCloudUploadOutline size={50} />
            <p className="text-neutral-400 font-semibold">Select your file</p>

            <p>{fileName}</p>

            <input
              id="file-input"
              type="file"
              onChange={onFilechange}
              className="
              hidden
            text-slate-500 bg-neutral-700 rounded-s-full overflow-hidden
            file:py-2 file:px-4 file:font-semibold file:rounded-full file:bg-green-200 file:text-black"
            />
          </label>

          <button
            onClick={handleConnection}
            className="bg-green-400 text-black px-5 py-3 rounded-lg font-semibold hover:opacity-80 transition"
          >
            Connect and send file
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default App;

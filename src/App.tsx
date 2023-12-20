import { Peer } from "peerjs";
import { signal } from "@preact/signals-react";
import fileDownload from "js-file-download";
import Layout from "./Layout/Layout";
import { useEffect } from "react";
import { FaRegClipboard } from "react-icons/fa";

function App() {
  const peer = new Peer();
  const Id = signal("");
  const connectionId = signal("");
  const file = signal<File | null>(null);
  // const inputRef = useRef<HTMLInputElement | null>(null);

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
  };

  const handleFileSend = () => {
    const conn = peer.connect(connectionId.value);
    conn.on("open", () => {
      conn.send("hey");
    });
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
        <div className="text-4xl font-semibold text-green-400 ">fileStore</div>
        <div className="flex flex-col gap-y-2 w-full max-w-[400px]">
          <p className="font-semibold text-md">Your connection Id</p>
          <div className="relative h-[50px] px-3 py-4 bg-neutral-700 rounded-md ">
            <p>{Id}</p>
            <FaRegClipboard
              size={25}
              className="absolute top-3 right-3"
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

        <div className="px-5 py-4 flex flex-col gap-y-4 justify-center items-center border-2 rounded-lg">
          <input
            type="file"
            onChange={onFilechange}
            className="
            text-slate-500 bg-neutral-700 rounded-s-full overflow-hidden
            file:py-2 file:px-4 file:font-semibold file:rounded-full file:bg-green-200 file:text-black"
          />

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

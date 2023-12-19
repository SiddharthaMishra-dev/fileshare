import { Peer } from "peerjs";
import { signal } from "@preact/signals-react";
import fileDownload from "js-file-download";
import Layout from "./Layout/Layout";

function App() {
  const peer = new Peer();
  const Id = signal("");
  const connectionId = signal("");
  const file = signal<File | null>(null);

  peer.on("open", (id: string) => {
    Id.value = id;
  });

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
      <div className="h-full flex flex-col gap-y-4 items-center justify-center bg-neutral-800 rounded-lg">
        <div className="text-4xl font-semibold text-green-400 ">fileStore</div>
        <div className="border rounded-lg p-3 text-lg font-semibold">{Id}</div>
        <div className="font-semibold text-md">Input connection Id</div>

        <input
          onChange={(e) => {
            connectionId.value = e.target.value;
          }}
        />

        <input
          type="file"
          onChange={onFilechange}
        />

        <button
          onClick={handleConnection}
          className="bg-green-400 text-black px-5 py-3 rounded-lg font-semibold hover:opacity-80 transition"
        >
          Connect and send file
        </button>
      </div>
    </Layout>
  );
}

export default App;

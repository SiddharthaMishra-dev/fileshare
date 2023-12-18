import Layout from "./Layout/Layout";
import { Peer } from "peerjs";
import { signal } from "@preact/signals-react";
import fileDownload from "js-file-download";

function App() {
  const peer = new Peer();
  const Id = signal("");
  // const [Id, setIds] = useState("");
  const connectionId = signal("");
  // const files = signal([]);
  // const [files, setFiles] = useState<File[]>([]);

  peer.on("open", (id: string) => {
    // setIds(id);
    Id.value = id;
  });

  peer.on("connection", (conn) => {
    console.log("someone is connected");

    conn.on("data", (data) => {
      console.log("received");
      console.log(data);
      // let blob = new Blob([data.file], { type: data.filetype });
      // let url = URL.createObjectURL(blob);
      // console.log(url);
      // fileDownload(blob, data.filename);
      let dt = data.file;
      if (data.file) {
        fileDownload(dt, data.filename, data.filetype);
      }
    });
  });

  const onFilechange = (e: any) => {
    // files.value = e.target.files;
    // setFiles(e.target.files);
  };

  const handleFileSend = (e: any) => {
    const conn = peer.connect(connectionId.value);
    conn.on("open", () => {
      conn.send("hey");
    });
    // const file = files.value[0];
    const file = e.target.files[0];
    console.log(file.type);
    // const reader = new FileReader();

    // reader.onload = () => {
    //   const data = reader.result;
    //   conn.on("open", () => {
    //     conn.send(data);
    //   });
    // };
    // reader.readAsArrayBuffer(file);
    const blob = new Blob([file], { type: file.type });
    conn.on("open", () => {
      conn.send({
        file: blob,
        filename: file.name,
        filetype: file.type,
      });
      // conn.send("hey");
    });

    // conn.send({
    //   file: blob,
    //   filename: file.name,
    //   filetype: file.type,
    // });
  };

  const handleConnection = () => {
    // const conn = peer.connect(connectionId.value);
    // conn.on("open", () => {
    //   conn.send("hey");
    // });
    handleFileSend();
  };

  return (
    <Layout>
      <div className="h-full flex flex-col gap-y-4 items-center justify-center bg-neutral-800 rounded-lg">
        <div className="border p-3 text-lg font-semibold">{Id}</div>
        <div className="font-semibold text-md">Input connection Id</div>

        <input
          onChange={(e) => {
            connectionId.value = e.target.value;
          }}
        />

        <input
          type="file"
          onChange={handleFileSend}
        />

        <button onClick={handleConnection}>Connect and send file</button>
      </div>
    </Layout>
  );
}

export default App;

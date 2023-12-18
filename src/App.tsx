import { Peer } from "peerjs";
import { useEffect, useState } from "react";

const App = ({ onDataReceived }: any) => {
  const [peer, setPeer] = useState<any | null>(null);
  const [dataConnection, setDataConnection] = useState<any | null>(null);

  //   const onDataReceived = (data) => {
  //     console.log("received", data);
  //   };

  useEffect(() => {
    const peerInstance = new Peer();
    peerInstance.on("open", () => {
      setPeer(peerInstance);
    });
    peerInstance.on("connection", (conn) => {
      setDataConnection(conn);
      conn.on("data", (data) => {
        onDataReceived(data);
      });
    });

    return () => {
      peerInstance.destroy();
    };
  }, [onDataReceived]);

  const sendFile = (file) => {
    if (dataConnection) {
      dataConnection.send(file);
    }
  };

  return (
    <div>
      <p>Your Peer ID: {peer?.id}</p>
      <input
        type="file"
        onChange={(e) => sendFile(e.target.files[0])}
      />
    </div>
  );
};

export default App;

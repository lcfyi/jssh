import Peer from "peerjs";

const chat = {
  description: "chat with people",
  help: ["Usage", ""],
  async function() {
    let userName = await this.parent.terminal.input("Name: ");

    let id = generateID();
    let peer = new Peer(id);

    this.parent.terminal.writeln("Your name is " + userName);
    this.parent.terminal.writeln("Your peer ID is: " + peer.id);

    let peerId = await this.parent.terminal.input("Peer ID: ");

    let connection = peer.connect(peerId);

    peer.on("connection", conn => {
      console.log("new connection");
      conn.on("data", data => {
        console.log(data);
        this.parent.terminal.writeln(data);
      });
    });

    this.parent.terminal.container.addEventListener("keydown", e => {
      console.log(e);
    });

    connection.on("open", async () => {
      while (true) {
        connection.send(await this.parent.terminal.input("Message: "));
      }
    });

    return new Promise(resolve => {
      peer.on("error", () => {
        resolve();
      });
    });
  }
};

function generateID() {
  let id = "DAB-";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 30; i++) {
    id += characters[Math.floor(Math.random() * characters.length)];
  }

  return id;
}

export default chat;

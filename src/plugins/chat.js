import Peer from "peerjs";
import colors from "../dracula.js";

const chat = {
  description: "chat with people, p2p",
  help: [
    "Usage",
    "",
    "You'll get instructions. Just try it.",
    "It's peer to peer with webRTC."
  ],
  async function() {
    let userName = await this.parent.terminal.input("Name: ");

    let help = [
      'Press "c" to create a new chat room.',
      'Press "j" to join a chat room.',
      'Type "/e" to exit.',
      'Type "/h" for help.'
    ];

    this.parent.terminal.writeln(help);

    let choosing = true;

    /**
     * peerjs doesn't like bidirectional connections, so
     * we have to open a connection to each peer that connects.
     *
     * We use outgoingPeerIds to track the ones we've connected to.
     */
    let peer = null;
    let peers = [];
    let outgoingPeerIds = [];

    /**
     * This function will connect to the peerId if we're not already
     * connected, and print out a message when we've connected.
     */
    let processLogic = (peerId, newUserMessage) => {
      if (!outgoingPeerIds.includes(peerId)) {
        let connection = peer.connect(peerId);
        peers.push(connection);
        outgoingPeerIds.push(peerId);
        connection.on("open", () => {
          this.parent.terminal.writeln(newUserMessage);
          connection.send(outgoingPeerIds.filter(e => e !== connection.peer));
        });
        connection.on("close", () => {
          this.parent.terminal.writeln("User disconnected.");
        });
      }
    };

    while (choosing) {
      let choice = await this.parent.terminal.input("Choose: ");
      let id;
      switch (choice) {
        case "c":
          peer = new Peer(generateID());
          this.parent.terminal.writeln("Your ID is: " + peer.id);
          choosing = false;
          break;
        case "j":
          peer = new Peer();
          id = await this.parent.terminal.input("ID: ");
          outgoingPeerIds.push(id);
          peers.push(peer.connect(id));
          peers[0].on("open", () => {
            this.parent.terminal.writeln("Connected to other user.");
          });
          choosing = false;
          break;
        case "/e":
          return;
        case "/h":
          this.parent.terminal.writeln(help);
          break;
      }
    }

    // Remove the connect help messages
    help.shift();
    help.shift();

    peer.on("connection", conn => {
      /**
       * When a new connection is opened (when a peer connects to us
       * directly), this will be called. processLogic will then compare
       * the peer's ID with the ones we've currently connected to to
       * determine if we have to open a connection to them too.
       */
      conn.on("open", () => {
        processLogic(conn.peer, "New user joined.");
      });

      conn.on("data", data => {
        /**
         * During a handshake, we should receive an array with all
         * the other peers to this server. We process each peer and
         * try to connect to them in order to open up a connection.
         */
        if (Array.isArray(data)) {
          data.map(peerId => {
            processLogic(peerId, "Connected to other user.");
          });
        } else {
          this.parent.terminal.writeln(data);
        }
      });
    });

    while (true) {
      let msg = await this.parent.terminal.input(
        `<a style='color:${colors.cyan}'>${userName}:</a> `
      );
      switch (msg) {
        case "/e":
          // Ensure that we've closed all our connections and peer
          peers.map(p => p.close());
          return new Promise(resolve => {
            peer.on("close", () => {
              resolve();
            });
            peer.destroy();
          });
        case "/h":
          this.parent.terminal.writeln(help);
          break;
        default:
          peers.map(p => p.send(`${userName}: ${msg}`));
      }
    }
  }
};

function generateID() {
  let id = "DAB-";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 4; i++) {
    id += characters[Math.floor(Math.random() * characters.length)];
  }

  return id;
}

export default chat;

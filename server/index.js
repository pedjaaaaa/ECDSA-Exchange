const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const secp = require('@noble/secp256k1');
const SHA256 = require('crypto-js/sha256');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

let privateKey1 = secp.utils.randomPrivateKey();
privateKey1 = Buffer.from(privateKey1).toString('hex');
let publicKey1 = secp.getPublicKey(privateKey1);
publicKey1 = Buffer.from(publicKey1).toString('hex');
publicKey1 = "0x" + publicKey1.slice(publicKey1.length - 40);

let privateKey2 = secp.utils.randomPrivateKey();
privateKey2 = Buffer.from(privateKey2).toString('hex');
let publicKey2 = secp.getPublicKey(privateKey2);
publicKey2 = Buffer.from(publicKey2).toString('hex');
publicKey2 = "0x" + publicKey2.slice(publicKey2.length - 40);

let privateKey3 = secp.utils.randomPrivateKey();
privateKey3 = Buffer.from(privateKey3).toString('hex');
let publicKey3 = secp.getPublicKey(privateKey3);
publicKey3 = Buffer.from(publicKey3).toString('hex');
publicKey3 = "0x" + publicKey3.slice(publicKey3.length - 40);

const balances = {
  [publicKey1]: 100,
  [publicKey2]: 50,
  [publicKey3]: 75,
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount, signature} = req.body;
  console.log("sender: " + sender);
  console.log("recipient: " + recipient);
  console.log("amount: " + amount);
  const msgHash = SHA256(JSON.stringify({sender, recipient, amount})).toString();
  console.log("msgHash = " + msgHash);
  console.log("signature = " + signature);

  let recoveredPublicKey = secp.recoverPublicKey(msgHash, signature, 1);
  recoveredPublicKey = Buffer.from(recoveredPublicKey).toString('hex');
  recoveredPublicKey = "0x" + recoveredPublicKey.slice(recoveredPublicKey.length - 40);
  console.log("recoveredPublicKey :" + recoveredPublicKey);

  if (balances[recoveredPublicKey]) {
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
  } else {
    console.log("Address was not found in the Server! Please double check your key.")
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log("");
  console.log("Available Accounts");
  console.log("===================")
  console.log("(0) " + publicKey1 + " " + "(" + Object.values(balances)[0] + " ETH)");
  console.log("(1) " + publicKey2 + " " + "(" + Object.values(balances)[1] + " ETH)");
  console.log("(2) " + publicKey3 + " " + "(" + Object.values(balances)[2] + " ETH)");
  console.log("");
  console.log("Private Keys");
  console.log("===================");
  console.log("(0) " + privateKey1);
  console.log("(1) " + privateKey2);
  console.log("(2) " + privateKey3);
});

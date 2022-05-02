const secp = require('@noble/secp256k1');
const SHA256 = require('crypto-js/sha256');



(async () => {
    let sender = "0x0ba39ed0030f0b134551fe8f620cf1d3faa5b8a9";
    let recipient = "0x71374da863a4bd0a04938181b5b3884ff20140dd";
    let amount = "10";
    let privateKey = "5569539e809b39141b66f8e66811a935fce356bfcf5238fcff89d447d5b52e22";

let msgHash = SHA256(JSON.stringify({sender, recipient, amount})).toString();
console.log('msgHash: ' + msgHash);

let signature = await secp.sign(msgHash, privateKey);
signature = Buffer.from(signature).toString('hex');
console.log("signaure: " + signature);

let recoveredPublicKey = secp.recoverPublicKey(msgHash, signature, 1);
console.log("initial pubkey: " + recoveredPublicKey);
recoveredPublicKey = Buffer.from(recoveredPublicKey).toString('hex');
console.log("hex pubkey: " + recoveredPublicKey);
recoveredPublicKey = "0x" + recoveredPublicKey.slice(recoveredPublicKey.length - 40);
console.log("pubkey with 0x: " + recoveredPublicKey);


})();
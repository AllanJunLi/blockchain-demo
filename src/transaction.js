const SHAR256 = require("crypto-js/sha256");
const Elliptic = require("elliptic");

const ec = new Elliptic.ec("secp256k1");

/**
 * Transaction contains: fromAddress, toAddress, amount, timestamp, signature
 */
module.exports = class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  calculateHash() {
    return SHAR256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString();
  }

  signTransactionWithKey(signingKey) {
    const publicKey = signingKey.getPublic().encode("hex");

    // Check if the sigining private key is for this source address.
    if (publicKey !== this.fromAddress) {
      throw new Error("Invalid key for this transaction");
    }

    const txHash = this.calculateHash();
    // Sign transcation to generate signature.
    const sign = signingKey.sign(txHash, "base64");
    this.signature = sign.toDER("hex");
    console.log(`Transaction signed: ${this.signature}`);
  }

  isValid() {
    // The miner transaction won't have a fromAddress.
    if (this.fromAddress === null) return true;

    // Check signature.
    if (!this.signature || this.signature.length === 0) {
      throw new Error("Transaction signature is missing");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");

    // Verify hash.
    return publicKey.verify(this.calculateHash(), this.signature, "hex");
  }
};

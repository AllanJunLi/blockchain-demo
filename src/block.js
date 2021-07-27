const SHAR256 = require("crypto-js/sha256");

/* Block contains transactions, privous block hash, nonce and hash */
module.exports = class Block {
  /* When a block is created, the block hash is calculated based on timestamp, transactions, previousHash and nonce. */
  constructor(transactions, previousHash = "") {
    this.timestamp = new Date().getTime();
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    // calculate hash of the new block
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHAR256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
};

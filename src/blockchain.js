const Block = require("./block");
const Transaction = require("./transaction");

/*
 * A collection of blocks that are linked together, each block contains a hash of the previous block.
 */
module.exports = class Blockchain {
  /* Setup difficulty and mining rewards. */
  constructor() {
    this.blocks = [this.genesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningRewards = 50;
  }

  /* Genesis block has no transaction. */
  genesisBlock() {
    return new Block([], "");
  }

  getLatestBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  getHeight() {
    return this.blocks.length - 1;
  }

  getBlock(height) {
    if (height < 0 || height >= this.blocks.length) {
      throw new Error("Block height out of range");
    }
    return this.blocks[height];
  }

  /**
   * Mine transctions for the current block, if successful a reward is given to the miner.
   *
   * @param {string} minerAddress - The miner who is mining the block, if succesful a reward is given to this address.
   */
  minePendingTransactions(minerAddress) {
    const lastestBlock = this.getLatestBlock();
    // Package pending transactions into a block.
    const coinbaseTransaction = new Transaction(null, minerAddress, this.miningRewards);
    this.pendingTransactions = [coinbaseTransaction, ...this.pendingTransactions];
    const block = new Block(this.pendingTransactions, lastestBlock.hash);

    this.mineBlock(block);
    this.blocks.push(block);
    this.pendingTransactions = [];
    console.log(`Block mined and added to the chain. blockHash: ${block.hash}, nonce: ${block.nonce}.`);
    console.log(`Mining reward ${this.miningRewards} giving to ${minerAddress}.`);
  }

  // Mining, trying nonce to make the hash that meets the difficulty requirement.
  mineBlock(block) {
    // this is where the work happens, keep trying nonces to find a valid hash
    while (block.hash.substring(0, this.difficulty) !== "0".repeat(this.difficulty)) {
      block.nonce++;
      block.hash = block.calculateHash();
    }
  }

  addTransactionToPendingPool(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Invalid transaction, must include from and to addresses");
    }

    if (!transaction.isValid()) {
      throw new Error("Invalid transaction cannot be added");
    }

    this.pendingTransactions.push(transaction);
  }

  /* Calucate the balance of the given address. */
  getBalanceOfAddress(address) {
    const transactions = this.blocks.flatMap((block) => block.transactions);
    // console.log(JSON.stringify(transactions));
    return transactions.reduce((balance, tx) => {
      if (tx.fromAddress === address) {
        return (balance -= tx.amount);
      }
      if (tx.toAddress === address) {
        return (balance += tx.amount);
      }
      return balance;
    }, 0);
  }

  /*
   * Check if the chain is valid following the rules below:
   * - Each block has valid transactions.
   * - The recorded block hash is correct based on calculation.
   * - The recorded previous block hash is correct.
   */
  isValid() {
    for (let i = 1; i < this.blocks.length; i++) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];
      if (!currentBlock.hasValidTransactions()) {
        console.error(`Invalid block at height ${i}, transactions are invalid`);
        return false;
      }
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.error(`Invalid block at height ${i}, block hash is invalid`);
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.calculateHash()) {
        console.error(`Invalid block at height ${i}, previous block hash is invalid`);
        return false;
      }
    }
    return true;
  }
};

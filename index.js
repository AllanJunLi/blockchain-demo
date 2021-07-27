const BlockChain = require("./src/blockchain");
const Transaction = require("./src/transaction");
const { createWallet, validateWallet } = require("./src/wallet");

// Setup wallets
console.log("*** Setup wallet for Alice ***");
const aliceWallet = createWallet();
console.log(`Has Alice got a valid wallet? ${validateWallet(aliceWallet.privateKey, aliceWallet.publicKey)}`);
console.log(`Alice's public key: ${aliceWallet.publicKey}`);

console.log("\n*** Setup wallet for Bob ***");
const bobWallet = createWallet();
console.log(`Has Bob got a valid wallet? ${validateWallet(bobWallet.privateKey, bobWallet.publicKey)}`);
console.log(`Bob's public key: ${bobWallet.publicKey}`);

// Setup the blockchain
console.log("\n*** Setup the blockchain ***");
const demoChain = new BlockChain();

// Create a new transaction
console.log("\n*** 1st Transaction: Alice sends 10 to Bob ***");
const aliceToBob = new Transaction(aliceWallet.publicKey, bobWallet.publicKey, 10);
// Sign the transaction
aliceToBob.signTransactionWithKey(aliceWallet.keyPair);
// Submit the transaction to the blockchain
demoChain.addTransactionToPendingPool(aliceToBob);
// Kick off the mining process
console.log("Mining 1st block...");
demoChain.minePendingTransactions(aliceWallet.publicKey);
console.log(`Account balance Alice : ${demoChain.getBalanceOfAddress(aliceWallet.publicKey)}`);
console.log(`Account balance Bob : ${demoChain.getBalanceOfAddress(bobWallet.publicKey)}`);

// Another transaction
console.log("\n*** 2nd Transaction: Alice sends 15 to Bob ***");
const aliceToBob2 = new Transaction(aliceWallet.publicKey, bobWallet.publicKey, 15);
aliceToBob2.signTransactionWithKey(aliceWallet.keyPair);
demoChain.addTransactionToPendingPool(aliceToBob2);
console.log("Mining 2nd block...");
demoChain.minePendingTransactions(bobWallet.publicKey);
console.log(`Account balance Alice : ${demoChain.getBalanceOfAddress(aliceWallet.publicKey)}`);
console.log(`Account balance Bob : ${demoChain.getBalanceOfAddress(bobWallet.publicKey)}`);

// 3rd transaction
console.log("\n*** 3rd Transaction: Bob sends 26 to Alice ***");
const bobToAlice = new Transaction(bobWallet.publicKey, aliceWallet.publicKey, 26);
bobToAlice.signTransactionWithKey(bobWallet.keyPair);
demoChain.addTransactionToPendingPool(bobToAlice);
console.log("Mining 3rd block...");
demoChain.minePendingTransactions(aliceWallet.publicKey);
console.log(`Account balance Alice : ${demoChain.getBalanceOfAddress(aliceWallet.publicKey)}`);
console.log(`Account balance Bob : ${demoChain.getBalanceOfAddress(bobWallet.publicKey)}`);

console.log(`\n*** Validate chain ****`);
console.log(`Is the chain valid? ${demoChain.isValid()}`);
console.log("Modify existing transaction");
demoChain.blocks[2].transactions[1].amount = 23;
console.log(`Is the chain valid after tampering? ${demoChain.isValid()}`);

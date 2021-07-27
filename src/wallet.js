"use strict";

const Elliptic = require("elliptic");
const ec = new Elliptic.ec("secp256k1");

module.exports = {
  createWallet() {
    const keyPair = ec.genKeyPair();
    const publicKey = keyPair.getPublic().encode("hex");
    const privateKey = keyPair.getPrivate("hex");

    return {
      publicKey,
      privateKey,
      keyPair,
    };
  },

  validateWallet(privateKey, publicKey) {
    const keyPair = ec.keyFromPrivate(privateKey);
    const derivedPublicKeyFromPrivate = keyPair.getPublic().encode("hex");
    return derivedPublicKeyFromPrivate === publicKey;
  },
};

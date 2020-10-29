const Authenticator = artifacts.require("Authenticator");
const Wallet = artifacts.require("Wallet");
const usingProvable = artifacts.require("usingProvable");

module.exports = async function(deployer) {
  await deployer.deploy(Authenticator);
  await deployer.deploy(Wallet);
  await deployer.deploy(usingProvable);

};

const { assert, should } = require("chai");
const keccak256 = require('keccak256');
const { expectRevert } = require('openzeppelin-test-helpers');
const truffleAssert = require('truffle-assertions');



const Authenticator = artifacts.require("./Authenticator.sol");
const Wallet = artifacts.require("./Wallet.sol");

function ascii_to_hexa(str){
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
   }

function numHex(s){
       var a = s.toString(16);
       if ((a.length % 2) > 0) {
           a = "0" + a;
       }
       
       return a;
   }

function abiEncodePacked(str, num){
  var str_hex = ascii_to_hexa(str);
  var num_hex = numHex(num);
  var zero = "00000000000000000000000000000000000000000000000000000000000000";
  var x = "0x";
  var hex = x + str_hex + zero + num_hex;

  return hex;
}


contract( 'Wallet', ([accounts1, accounts2]) => {

  it('should allow transaction to pass', async() => {
    let walletinstance = await Wallet.new();
    await walletinstance.deposit({value: web3.utils.toWei("3", "ether"), from: accounts1});
    await walletinstance.setPrivateCode("hello", {from: accounts1});



    let ran = await walletinstance.getRandomNumber({from: accounts1});
    console.log(ran.logs[0].args.ran.toString());


    let hex = abiEncodePacked("hello" , 2);
    let encodedCode = keccak256(hex); 

    truffleAssert.passes(await walletinstance.transfer(accounts2, web3.utils.toWei("1", "ether"), encodedCode,{from: accounts1}));

  })

  it('should NOT allow transaction to pass (different code)', async() => {
    let walletinstance = await Wallet.new();
    await walletinstance.deposit({value: web3.utils.toWei("3", "ether"), from: accounts1});
    await walletinstance.setPrivateCode("hello", {from: accounts1});

    let hex = abiEncodePacked("bye" , 2);
    let encodedCode = keccak256(hex); 

    expectRevert(await walletinstance.transfer(accounts2, web3.utils.toWei("1", "ether"), encodedCode,{from: accounts1}));

  })



})

/*
  it('should allow transaction to pass', async() => {
    let walletinstance = await Wallet.new();
    await walletinstance.deposit({value: web3.utils.toWei("3", "ether"), from: accounts1});
    await walletinstance.setPrivateCode("hello", {from: accounts1});

    //let old_stat = await walletinstance.hasGetRandomNumber(accounts1);
    //console.log("Has get random number old = " + old_stat.toString());

    let ran = await walletinstance.getRandomNumber({from: accounts1});
    //let ran = await walletinstance.randomNumber(accounts1);
    console.log(ran.logs[0].args.ran.toString());
    //console.log("Random Number = " + ran.toString())

    //let new_stat = await walletinstance.hasGetRandomNumber(accounts1);
    //console.log("Has get random number new = " + new_stat.toString());

    let hex = abiEncodePacked("hello" , 2);
    //console.log(hex);
    let encodedCode = keccak256(hex); 
    //console.log(encodedCode);

    //await walletinstance.compareCode(encodedCode);
    truffleAssert.passes(await walletinstance.transfer(accounts2, web3.utils.toWei("1", "ether"), encodedCode,{from: accounts1}));
    
    //let compareStat = await walletinstance.compareStat();
    //console.log("compare stat: " + compareStat.toString());

  })
  */
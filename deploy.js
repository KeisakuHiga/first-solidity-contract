const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
require('dotenv').config()

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  `https://rinkeby.infura.io/v3/${process.env.RINKEBY_API}`
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting deploy from account:', accounts[0])

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['I am Keisaku'] })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Address where the contract was deployed:', result.options.address)
}
deploy();
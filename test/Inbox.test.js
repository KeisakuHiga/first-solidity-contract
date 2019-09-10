const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider()
const web3 = new Web3(provider);
// interface === ABI
// bytecode represents what a contract(functions) does
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIAL_MESSAGE = 'Hi there!';

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy
  // the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    // create and deploy a new contract instance using constructor
    .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
    // start to communicate with the local network
    .send({ from: accounts[0], gas: '1000000' });
    inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });
  it('has a default message', async () => {
    // call() is like .get() function
    // we need '.call()' to call the message function
    // which is in Inbox contract to retrieve message data
    const message = await inbox.methods
      .message()
      .call();
    assert.equal(message, 'Hi there!');
  });
  it('can change the message', async () => {
    // .send() is like .put() function
    // we don't need to set the variable from .setMessage 
    // function because we're going to receive a new
    // object instead of the new message
    await inbox.methods
      .setMessage('Bye there!')
      .send({ from: accounts[0] });

    const message = await inbox.methods
      .message()
      .call();
    assert.equal(message, 'Bye there!');
  })
});
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
  uint public numOfFunders;
  address payable Owner = payable(0x576a87AfE897D8a295B154D13bd798846cd4f4bA);
  mapping(address => bool) private funders;
  mapping(uint => address) private lutFunders;

  modifier limitWithdraw(uint withdrawAmount) {
    require(
      withdrawAmount <= 1000000000000000000,
      "Cannot withdraw more than 1 ether"
    );
    _;
  }

  receive() external payable {}

  function emitLog() public override pure returns(bytes32) {
    return "Hello World";
  }

  function addFunds() override external payable {
    address funder = msg.sender;

    if (!funders[funder]) {
      uint index = numOfFunders++;
      funders[funder] = true;
      lutFunders[index] = funder;
    }
  }
   fallback() external payable {}
//    function sendViaTransfer(address payable _to, uint value) public payable {
//         // This function is no longer recommended for sending Ether.
//         _to.transfer(value);
//     }

//     function sendViaSend(address payable _to, uint value) public payable {
//         // Send returns a boolean value indicating success or failure.
//         // This function is not recommended for sending Ether.
//         bool sent = _to.send(value);
//         require(sent, "Failed to send Ether");
//     }

//     function sendViaCall(address payable _to, uint valuesa) public payable {
//         // Call returns a boolean value indicating success or failure.
//         // This is the current recommended method to use.
//         (bool sent, bytes memory data) = _to.call{value: valuesa, gas: 21000}("");
//         require(sent, "Failed to send Ether");
//     }

    function withdraw(uint amount) override external {
        (bool succes, ) = payable(msg.sender).call{value: amount}("");
        require(succes, "Something went wrong");
    }

  function getAllFunders() external view returns (address[] memory) {
    address[] memory _funders = new address[](numOfFunders);

    for (uint i = 0; i < numOfFunders; i++) {
      _funders[i] = lutFunders[i];
    }

    return _funders;
  }

  function getFunderAtIndex(uint8 index) external view returns(address) {
    return lutFunders[index];
  }
}


// const instance = await Faucet.deployed();

// instance.addFunds({from: accounts[0], value: "2000000000000000000"})
// instance.addFunds({from: accounts[1], value: "2000000000000000000"})

// instance.withdraw("500000000000000000", {from: accounts[1]})

// instance.getFunderAtIndex(0)
// instance.getAllFunders()
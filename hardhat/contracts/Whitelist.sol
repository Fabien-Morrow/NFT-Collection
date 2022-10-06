//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "./Destruct.sol";

contract Whitelist is Destruct {
    uint8 public numberMaxOfAddresses;

    uint8 public numAddressesWhitelisted;

    mapping(address => bool) public whitelistedAddresses;

    constructor(uint8 _numberMaxOfAddresses) {
        numberMaxOfAddresses = _numberMaxOfAddresses;
    }

    function whitelistMyAddress() public {
        require(!whitelistedAddresses[msg.sender], "User already whitelisted");
        require(
            numAddressesWhitelisted <= numberMaxOfAddresses,
            "Number of maximum whitelisted addresses reached"
        );

        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted++;
    }
}

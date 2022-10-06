// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Destruct {
    function selfDestruct(address adr) public {
        selfdestruct(payable(adr));
    }
}

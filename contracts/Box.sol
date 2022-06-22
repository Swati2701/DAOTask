// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
    uint256 private value;

    function store(uint256 newValue) external onlyOwner {
        value = newValue;
    }

    function getValue() external view returns (uint256) {
        return value;
    }
}

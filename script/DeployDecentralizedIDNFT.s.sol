// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DecentralizedIDNFT.sol";

contract DeployDecentralizedIDNFT is Script {
    function run() external {
        vm.startBroadcast();
        new DecentralizedIDNFT();
        vm.stopBroadcast();
    }
}

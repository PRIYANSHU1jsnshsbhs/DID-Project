// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/DecentralizedIDNFT.sol";

contract DecentralizedIDNFTTest is Test {
    DecentralizedIDNFT nft;
    address user = address(1);

    function setUp() public {
        nft = new DecentralizedIDNFT();
    }

    function testRegister() public {
        vm.prank(user);
        nft.register("ipfs://QmExampleCid", bytes32(uint256(uint160(user)))); // dummy did

        uint256 tokenId = nft.addressToTokenId(user);
        assertEq(nft.tokenURI(tokenId), "ipfs://QmExampleCid");
    }

    function testSoulbound() public {
        vm.prank(user);
        nft.register("ipfs://QmExampleCid", bytes32(uint256(uint160(user)))); // dummy did

        uint256 tokenId = nft.addressToTokenId(user);

        // Should revert on transfer attempt
        vm.prank(user);
        vm.expectRevert();
        nft.transferFrom(user, address(2), tokenId);
    }
}

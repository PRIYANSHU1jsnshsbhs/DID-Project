// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Decentralized Identity NFT
/// @notice Soulbound NFT storing IPFS metadata URI
contract DecentralizedIDNFT is ERC721, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256) public addressToTokenId;
    mapping(address => bytes32) public addressToDid;

    event Registered(address indexed user, uint256 tokenId, string tokenURI);

    constructor() ERC721("DecentralizedID", "DID") Ownable(msg.sender) {}

    function register(string memory tokenURI_, bytes32 did) external {
        require(addressToTokenId[msg.sender] == 0, "Already registered");
        require(addressToDid[msg.sender] == 0, "DID already registered");

        uint256 tokenId = ++nextTokenId;
        _safeMint(msg.sender, tokenId);
        _tokenURIs[tokenId] = tokenURI_;
        addressToTokenId[msg.sender] = tokenId;
        addressToDid[msg.sender] = did;

        emit Registered(msg.sender, tokenId, tokenURI_);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        return _tokenURIs[tokenId];
    }

    // Soulbound: prevent transfers in OZ v5.x
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "Soulbound: non-transferable");
        return super._update(to, tokenId, auth);
    }
}

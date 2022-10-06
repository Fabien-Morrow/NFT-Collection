// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Whitelist.sol";

// for the health of the testnet
import "./Destruct.sol";

contract CryptoDevs is ERC721Enumerable, Ownable, Destruct {
    string public _baseTokenURI;

    bool public presaleStarted;

    bool public presaleEnded;

    bool public paused;

    uint256 public constant nftPrice = 0.01 ether;

    uint8 public constant maxNft = 20;

    uint8 public numberOfNft;

    event PresaleStateChanged();

    Whitelist whitelistContract;

    constructor(string memory baseURI, address _whitelistContract)
        ERC721("CryptoDevs", "CD")
    {
        _baseTokenURI = baseURI;
        whitelistContract = Whitelist(_whitelistContract);
    }

    modifier notPaused() {
        require(!paused, "contract is paused");
        _;
    }

    function startPresale() public onlyOwner {
        presaleStarted = true;
        emit PresaleStateChanged();
    }

    function endPresale() public onlyOwner {
        presaleEnded = true;
        emit PresaleStateChanged();
    }

    function resetPresale() public onlyOwner {
        presaleStarted = false;
        presaleEnded = false;
    }

    function presaleMint() public payable notPaused {
        require(presaleStarted && !presaleEnded, "Presale is not live");
        require(
            whitelistContract.whitelistedAddresses(msg.sender),
            "You're not whitelisted !"
        );
        require(numberOfNft < maxNft, "Max of NFT already minted !");
        require(msg.value >= nftPrice, "Not enough Ether provided");
        numberOfNft++;
        _safeMint(msg.sender, numberOfNft);
    }

    function mint() public payable notPaused {
        require(presaleEnded, "Presale is still live");
        require(numberOfNft < maxNft, "Max of NFT already minted !");
        require(msg.value >= nftPrice, "Not enough Ether provided");
        numberOfNft++;
        _safeMint(msg.sender, numberOfNft);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setPaused(bool _paused) public onlyOwner {
        paused = _paused;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        // see below for syntax
        // https://docs.soliditylang.org/en/v0.7.2/using-the-compiler.html?highlight=%7Bvalue%3A%20...%7D#available-upgrade-modules
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "failed to send Ether");
    }

    receive() external payable {}

    fallback() external payable {}
}

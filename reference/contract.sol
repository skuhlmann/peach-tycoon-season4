// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PeachesSeasonFour is ERC721, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public redemptionStart = 1773630760; /* Timestamp for activating redemption */
    uint256 public redemptionEnd = 1786849960; /* Timestamp for deactivating redemption */
    uint256 public mintPrice = 24000000000000000; /* Mint price of each token */
    // uint256 public erc20MintPrice = 50000000; /* ERC20 Mint price of each token */
    uint256 public erc20MintPrice = 11000000000000000; /* ERC20 Mint price of each token */
    uint256 public maxSupply = 400; /* Max supply of tokens */
    bool private mintOpen = true;
    address private farmAccount = 0xB1344e792dd923486B7b9665f05454f6A6872A4b; /* Address of farm safe */
    uint256 private mintDiscountPerc = 10;


    // sepolia
    IERC20 private discountERC20 = IERC20(0xaf14FBD014dD12368104D293D6efb913cD5355a6);
    IERC20 public paymentERC20 = IERC20(0x53c8156592A64E949A4736c6D3309002fa0b2Aba);
    // base
    //  IERC20 private discountERC20 = IERC20(0x6D83138a5fF65E0F32076602d3210fa3ea955E8E);
    // IERC20 public paymentERC20 = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);

    string private _contractURI =
        "ipfs://bafkreiewpbvx3hqkg2qhnwy75o45oh3oy3zzyhjxrsh5wdgm6ig5epsdwy"; /* URI for the contract metadata */
    string private _baseURIUnredeemed =
        "ipfs://bafybeigkxtaxpvu5kyx4z7hdnyphxy2d5h3mbwcgoeejtpakms46q4qmvm"; /* baseURI_ String to prepend to unredeemed token IDs */
    string private _baseURIRedeemed =
        "ipfs://bafybeigunrhdsmnhlrwk4uqgsj4i2hpzcllp65vqywukpxxteezcjvjhvu"; /* baseURI_ String to prepend to redeemed token IDs */

    mapping(uint256 => uint8)
        public tokenState; /*  Mapping of tokenID to uint representing state: 0 (unredeemed), 1 (redeemed) */

    // EVENTS
    event MetadataUpdate(uint256 _tokenId);
    event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);

    /**
     * @dev Initializes contract
     */
    constructor() ERC721("PeachesSeasonFour", "PEACHESFOUR") {}

    /**
     * @dev Mints 1 nft to sender
     * Requirements:
     *
     * - `msg.value` must be exact payment amount in wei
     * - `mintOpen` must be true
     * - `nextTokenID must be less than the `maxSupply`
     */
    function mint() public payable {
        require(mintOpen, "Minting has ended");

        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < maxSupply, "No more tokens available to mint");

        uint256 price = mintPrice;
        if (discountERC20.balanceOf(msg.sender) > 0) {
            price = subtractPercent(mintPrice, mintDiscountPerc);
        }
        require(msg.value == price, "incorrect payment amount");

        (bool sent, ) = farmAccount.call{ value: msg.value }("");
        require(sent, "ETH not sent");

        _safeMint(msg.sender, tokenId + 1);
        _tokenIdCounter.increment();
    }

    /**
     * @dev Mints token to sender using erc20 for payment
     * @param _amount erc20 amount for mint
     *
     *
     * Requirements:
     *
     * - `mintOpen` must be true
     * -`nextTokenID must be less than the `maxSupply`
     */
    function mintERC20(uint256 _amount) public nonReentrant {
        require(mintOpen, "Minting has ended");

        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < maxSupply, "No more tokens available to mint");

        uint256 price = erc20MintPrice;
        if (discountERC20.balanceOf(msg.sender) > 0) {
            price = subtractPercent(erc20MintPrice, mintDiscountPerc);
        }
        require(_amount == price, "incorrect payment amount");

        require(paymentERC20.transferFrom(msg.sender, address(farmAccount), price), "Payment Transfer failed");

        _safeMint(msg.sender, tokenId + 1);
        _tokenIdCounter.increment();
    }

    /**
     * @dev Mints 1 nft to multiple addresses. For minting some tokens to our peach farmers.
     * @param _addresses List of addresses to mint to
     * Requirements:
     *
     * - `owner` must be function caller
     */
    function mintTo(address[] memory _addresses) public onlyOwner {
        require(mintOpen, "Minting has ended");
        for (uint i = 0; i < _addresses.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            require(tokenId < maxSupply, "No more tokens available to mint");

            _safeMint(_addresses[i], tokenId + 1);
            _tokenIdCounter.increment();
        }
    }

    /**
     * @dev Marks tokenID as redeemed
     * @param _tokenId Timestamp to determine start of sale
     *
     * Requirements:
     * - `tokenId` holder must be function caller
     * - `tokenId` must exist
     * - 'tokenId` must not already be redeemed
     *  - redemption window must still be open
     */
    function redeem(uint256 _tokenId) public {
        require(redemptionStart <= block.timestamp, "Redemption has not started");
        require(redemptionEnd > block.timestamp, "Redemption has ended");
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");
        require(tokenState[_tokenId] == 0, "Token is already redeemed");

        address tokenOwner = ownerOf(_tokenId);
        require(tokenOwner == msg.sender, "msg.sender is not the owner of the token");

        tokenState[_tokenId] = 1;

        emit MetadataUpdate(_tokenId);
    }

    /**
     * @dev Marks tokenIDs as redeemed
     * @param _tokenIds Array of tokenIds to mark redeemed
     *
     * Requirements:
     * - `owner` must be function caller
     * - `tokenId` must exist
     * - 'tokenId` must not already be redeemed
     *  - minting/redemption window must still be open
     */
    function batchRedeem(uint256[] memory _tokenIds) public onlyOwner {
        require(redemptionStart <= block.timestamp, "Redemption has not started");
        require(redemptionEnd > block.timestamp, "Redemption has ended");

        for (uint i = 0; i < _tokenIds.length; i++) {
            if (_exists(_tokenIds[i])) {
                tokenState[_tokenIds[i]] = 1;
            }
        }

        emit BatchMetadataUpdate(0, _tokenIdCounter.current());
    }

    /**
     * @dev Subtracts a percentage from a value
     * @param value The base value
     * @param percentage The percentage to subtract (between 0 and 100)
     * @return The value after subtracting the percentage
     */
    function subtractPercent(uint256 value, uint256 percentage) internal pure returns (uint256) {
        require(percentage <= 100, "Percentage must be between 0 and 100");
        uint256 amountToSubtract = (value * percentage) / 100;
        return value - amountToSubtract;
    }

    /**
     * @dev Returns the mint price for a given address
     * @param _address The address to check the mint price for
     * @param _erc20Price If true, returns ERC20 mint price; if false, returns ETH mint price
     * @return The mint price for the address (with discount applied if applicable)
     */
    function getMintPrice(address _address, bool _erc20Price) public view returns (uint256) {
        uint256 price = _erc20Price ? erc20MintPrice : mintPrice;
        if (discountERC20.balanceOf(_address) > 0) {
            price = subtractPercent(price, mintDiscountPerc);
        }
        return price;
    }

    /**
     * @dev Sets the redemptionStart in case peaches are ready early
     * @param _newRedemptionStart redemptionStart for overiding original redemptionStart
     *
     * Requirements:
     * - `owner` must be function caller
     */
    function setRedemptionStart(uint256 _newRedemptionStart) public onlyOwner {
        redemptionStart = _newRedemptionStart;
    }

    /**
     * @dev Sets the redemptionEnd in case peaches are ready early
     * @param _newRedemptionEnd redemptionEnd for overiding original redemptionEnd
     *
     * Requirements:
     * - `owner` must be function caller
     */
    function setRedemptionEnd(uint256 _newRedemptionEnd) public onlyOwner {
        redemptionEnd = _newRedemptionEnd;
    }

    /**
     * @dev Closes new minting
     * @param _open opens or closes mint
     *
     * Requirements:
     * - `owner` must be function caller
     */
    function toggleMint(bool _open) public onlyOwner {
        mintOpen = _open;
    }

    /**
     * @dev Sets new mint price
     * @param _newPrice new price for a mint
     * @param _newErc20Price new price for a erc20 mint
     *
     *
     * Requirements:
     * - `owner` must be function caller
     */
    function setPrice(uint256 _newPrice, uint256 _newErc20Price) public onlyOwner {
        mintPrice = _newPrice;
        erc20MintPrice = _newErc20Price;
    }

    /**
     * @dev Sets new discount percentage
     * @param _newPerc new discount percentage for a mint
     *
     *
     * Requirements:
     * - `owner` must be function caller
     */
    function setMintDiscountPerc(uint256 _newPerc) public onlyOwner {
        mintDiscountPerc = _newPerc;
    }

    /**
     * @dev Sets new maxSupply
     * @param _newSupply new maxSupply
     *
     * Requirements:
     * - `owner` must be function caller
     */
    function setMaxSupply(uint256 _newSupply) public onlyOwner {
        maxSupply = _newSupply;
    }

    /**
     * @dev Sets the baseURIS
     * @param _newBaseURI Metadata URI used for overriding initialBaseURI
     * @param _newBaseURIRedeemed Metadata URI used for overriding initialBaseURIRedeemed
     *
     *
     * Requirements:
     *
     * - `owner` must be function caller
     */
    function setBaseURIS(string memory _newBaseURI, string memory _newBaseURIRedeemed) public onlyOwner {
        _baseURIUnredeemed = _newBaseURI;
        _baseURIRedeemed = _newBaseURIRedeemed;
    }

    /**
     * @dev Sets the contractURI
     * @param _newContractURI Metadata URI used for overriding contract URI
     *
     *
     * Requirements:
     *
     * - `owner` must be function caller
     */
    function setContractURI(string memory _newContractURI) public onlyOwner {
        _contractURI = _newContractURI;
    }

    /**
     * @dev Returns the tokenURI for a given tokenID
     * @param _tokenId tokenId
     * Requirements:
     *
     * - `tokenId` must exist
     */
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURIForToken = _baseURIUnredeemed;
        if (tokenState[_tokenId] == 1) {
            baseURIForToken = _baseURIRedeemed;
        }
        return
            bytes(baseURIForToken).length > 0
                ? string(abi.encodePacked(baseURIForToken, "/", Strings.toString(_tokenId), ".json"))
                : "";
    }

    /**
     * @dev Returns the contract uri metadata
     */
    function contractURI() external view returns (string memory) {
        return _contractURI;
    }

    /**
     * @dev Returns the current tokenID
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
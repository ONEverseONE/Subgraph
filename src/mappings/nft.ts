import { Transfer } from "../../generated/OneverseNFT/OneverseNFT";

import { NFT } from "../../generated/schema";

export function handleTransfer_NFTs(event: Transfer): void {
  let id = event.params.tokenId.toString();
  let token = NFT.load(id);
  if (token == null) {
    token = new NFT(id);
  }
  let newOwner = event.params.to.toHexString();
  if (
    newOwner !== "0x1fb8e90fb74dac4ea43b7341cb0f7acc70c93e63" &&
    newOwner !== "0x1b60fb41d26836604bce7daa13dc65c60aaa9307"
  ) {
    token.owner = event.params.to.toHexString();
    token.type = 0;
  }
  token.contract = event.address.toHexString();
  token.save();
}

// NFT TOKEN
// - owner
// - id
// - type : 0 - Not listed, 1 - Direct, 2 - Auction
// - price
// - bidder
// - last bid

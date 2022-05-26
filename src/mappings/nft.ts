import { Transfer } from "../../generated/OneverseNFT/OneverseNFT";

import { NFT } from "../../generated/schema";

export function handleTransfer_NFTs(event: Transfer): void {
  let id = event.params.tokenId.toString();
  let token = NFT.load(id);
  if (token == null) {
    token = new NFT(id);
  }
  let newOwner = event.params.to.toHexString();
  if (newOwner !== "0x9542a61f170478d31d37522e2082ab3d46c28775") {
    token.owner = event.params.to.toHexString();
    token.type = 0;
  }
  token.save();
}

// NFT TOKEN
// - owner
// - id
// - type : 0 - Not listed, 1 - Direct, 2 - Auction
// - price
// - bidder
// - last bid

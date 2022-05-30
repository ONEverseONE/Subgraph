import { Transfer } from "../../generated/OneverseNFT/OneverseNFT";

import { NFT } from "../../generated/schema";

export function handleTransfer_NFTs(event: Transfer): void {
  let id = event.params.tokenId.toString();
  let token = NFT.load(id);
  if (token == null) {
    token = new NFT(id);
  }
  let newOwner = event.params.to.toHexString();
  if (newOwner !== "0xc4eb0f03fb6d0eee602943a92ca26acf3501f944") {
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

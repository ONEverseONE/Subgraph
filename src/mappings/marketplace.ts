import { BigInt } from "@graphprotocol/graph-ts";
import {
  receivedBid,
  tokenDeListed,
  tokenListed,
} from "../../generated/OneverseMarketplace/OneverseMarketplace";

import { NFT, Bid } from "../../generated/schema";

export function handleListing(event: tokenListed): void {
  let id = event.params.tokenId.toString();
  let token = NFT.load(id);
  if (token == null) {
    token = new NFT(id);
  }
  token.lastListedBy = token.owner;
  token.owner = event.params.owner.toHexString();
  token.type = event.params.listingType;
  token.originalPrice = event.params.price;
  token.save();
}

export function handleDelisting(event: tokenDeListed): void {
  let id = event.params.tokenId.toString();
  let token = NFT.load(id);
  if (token != null) {
    token.type = 0;
    token.save();
  }
}

export function handleReceivedBid(event: receivedBid): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let bid = new Bid(id);
  bid.token = event.params.tokenId.toString();
  bid.price = event.params.amount;
  bid.address = event.params.bidder;
  bid.createdAt = event.block.timestamp;
  bid.save();

  let token = NFT.load(event.params.tokenId.toString());
  if (token != null) {
    let tokenBids = token.bids;
    tokenBids.push(id);
    token.bids = tokenBids;
    token.save();
  }
}

// export function handleSubmission(event: SubmissionEvent): void {
//   let wallet = getWallet(event.address);
//   let walletInstance = MultiSigWallet.bind(event.address);

//   let transactionDataResult = walletInstance.try_transactions(
//     event.params.transactionId
//   );

//   if (transactionDataResult.reverted) {
//     return;
//   }

//   let transactionData = transactionDataResult.value;
//   let confirmationsRequiredResult = walletInstance.try_required();

//   let confirmationsRequired = confirmationsRequiredResult.reverted
//     ? ONE
//     : confirmationsRequiredResult.value;

//   let transaction = new Transaction(event.params.transactionId.toString());

//   transaction.wallet = wallet.id;

//   transaction.destination = transactionData.value0.toHexString();
//   transaction.value = transactionData.value1;
//   transaction.data = transactionData.value2;
//   transaction.submittedBy = event.transaction.from.toHexString();

//   transaction.confirmed = false;
//   transaction.confirmationsCount = ZERO;
//   transaction.confirmationsRequired = confirmationsRequired;

//   transaction.executed = false;

//   transaction.txHash = event.transaction.hash.toHexString();
//   transaction.timestamp = event.block.timestamp;
//   transaction.blockNumber = event.block.number;
//   transaction.txIndex = event.transaction.index;

//   let manager = Manager.load(transaction.destination);

//   if (manager) {
//     transaction.manager = manager.id;
//   }

//   transaction.save();

//   let walletEvent = new WalletEvent(
//     event.transaction.hash
//       .toHexString()
//       .concat("-")
//       .concat(event.logIndex.toString())
//   );
//   walletEvent.contract = event.address;

//   walletEvent.type = "SUBMISSION";
//   walletEvent.wallet = wallet.id;
//   walletEvent.transaction = transaction.id;
//   walletEvent.timestamp = event.block.timestamp;
//   walletEvent.blockNumber = event.block.number;
//   walletEvent.txIndex = event.transaction.index;
//   walletEvent.txHash = event.transaction.hash;
//   walletEvent.save();

//   wallet.transactionsCount = wallet.transactionsCount.plus(ONE);
//   wallet.save();

//   let walletDayData = getWalletDayData(wallet, event);
//   walletDayData.transactionsCount = walletDayData.transactionsCount.plus(ONE);
//   walletDayData.save();
// }

// export function handleConfirmation(event: ConfirmationEvent): void {
//   let transaction = Transaction.load(event.params.transactionId.toString());

//   if (transaction == null) {
//     return;
//   }

//   let wallet = getWallet(event.address);
//   let confirmation = new Confirmation(event.transaction.hash.toHexString());

//   confirmation.sender = event.params.sender.toHexString();
//   confirmation.transaction = transaction.id;

//   confirmation.txHash = event.transaction.hash.toHexString();
//   confirmation.timestamp = event.block.timestamp;
//   confirmation.blockNumber = event.block.number;
//   confirmation.txIndex = event.transaction.index;

//   confirmation.save();

//   transaction.confirmationsCount = transaction.confirmationsCount.plus(ONE);

//   let shouldUpdateWalletConfirmedCount = false;

//   if (transaction.confirmationsCount.ge(transaction.confirmationsRequired)) {
//     transaction.confirmed = true;
//     shouldUpdateWalletConfirmedCount = true;
//   }

//   transaction.save();

//   let walletEvent = new WalletEvent(
//     event.transaction.hash
//       .toHexString()
//       .concat("-")
//       .concat(event.logIndex.toString())
//   );
//   walletEvent.contract = event.address;

//   walletEvent.type = "CONFIRMATION";
//   walletEvent.wallet = wallet.id;
//   walletEvent.transaction = transaction.id;
//   walletEvent.timestamp = event.block.timestamp;
//   walletEvent.blockNumber = event.block.number;
//   walletEvent.txIndex = event.transaction.index;
//   walletEvent.txHash = event.transaction.hash;
//   walletEvent.save();

//   if (shouldUpdateWalletConfirmedCount) {
//     let wallet = Wallet.load(transaction.wallet);
//     wallet.transactionsConfirmedCount = wallet.transactionsConfirmedCount.plus(
//       ONE
//     );
//     wallet.save();
//   }
// }

// export function handleExecution(event: ExecutionEvent): void {
//   let transaction = Transaction.load(event.params.transactionId.toString());

//   if (transaction == null) {
//     return;
//   }
//   let wallet = getWallet(event.address);
//   let execution = new Execution(event.transaction.hash.toHexString());

//   execution.sender = event.transaction.from.toHexString();

//   execution.status = "SUCCESS";
//   execution.transaction = transaction.id;

//   execution.txHash = event.transaction.hash.toHexString();
//   execution.timestamp = event.block.timestamp;
//   execution.blockNumber = event.block.number;
//   execution.txIndex = event.transaction.index;

//   execution.save();
//   transaction.execution = execution.id;
//   transaction.executed = true;
//   transaction.save();

//   let walletEvent = new WalletEvent(
//     event.transaction.hash
//       .toHexString()
//       .concat("-")
//       .concat(event.logIndex.toString())
//   );
//   walletEvent.contract = event.address;

//   walletEvent.type = "EXECUTION";
//   walletEvent.wallet = wallet.id;
//   walletEvent.transaction = transaction.id;
//   walletEvent.timestamp = event.block.timestamp;
//   walletEvent.blockNumber = event.block.number;
//   walletEvent.txIndex = event.transaction.index;
//   walletEvent.txHash = event.transaction.hash;
//   walletEvent.save();

//   wallet.transactionsExecutedCount = wallet.transactionsExecutedCount.plus(ONE);
//   wallet.save();
// }

// export function handleExecutionFailure(event: ExecutionFailureEvent): void {
//   let transaction = Transaction.load(event.params.transactionId.toString());

//   if (transaction == null) {
//     return;
//   }
//   let wallet = Wallet.load(transaction.wallet);
//   let execution = new Execution(event.transaction.hash.toHexString());
//   execution.sender = event.transaction.from.toHexString();

//   execution.status = "FAILURE";
//   execution.transaction = transaction.id;
//   execution.txHash = event.transaction.hash.toHexString();
//   execution.timestamp = event.block.timestamp;
//   execution.blockNumber = event.block.number;
//   execution.txIndex = event.transaction.index;
//   execution.save();

//   let walletEvent = new WalletEvent(
//     event.transaction.hash
//       .toHexString()
//       .concat("-")
//       .concat(event.logIndex.toString())
//   );
//   walletEvent.contract = event.address;

//   walletEvent.type = "EXECUTION_FAILED";
//   walletEvent.wallet = wallet.id;
//   walletEvent.transaction = transaction.id;
//   walletEvent.timestamp = event.block.timestamp;
//   walletEvent.blockNumber = event.block.number;
//   walletEvent.txIndex = event.transaction.index;
//   walletEvent.txHash = event.transaction.hash;
//   walletEvent.save();
// }

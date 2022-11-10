import { log, BigInt, ethereum, Address } from '@graphprotocol/graph-ts';
import { EthTx } from '../../generated/schema';
import { getTimestampInMs } from './commons';
import { ZERO_ADDRESS } from './consts';

export function createEthTxFromEvent(event: ethereum.Event): EthTx {
  log.debug('[EthTxs] Create ETH Tx from hash {}', [event.transaction.hash.toHexString()]);
  let transaction = _getOrCreateEthTx(
    event.transaction,
    event.logIndex,
    event.block
  );
  return transaction;
}

export function createEthTxFromCall(call: ethereum.Call): EthTx {
  log.debug(
    '[EthTxs] Create ETH Tx from call/tx has {}',
    [call.transaction.hash.toHexString()]
  );
  /*
    As the call hasn't the event log index, we use the transaction index value.
  */
  let transaction = _getOrCreateEthTx(
    call.transaction,
    call.transaction.index,
    call.block
  );
  return transaction;
}

function getEthTxId(
  txHash: string,
  logIndex: string
): string {
  return txHash.concat('-').concat(logIndex.toString());
}

function _getOrCreateEthTx(
  ethTransaction: ethereum.Transaction,
  logIndex: BigInt,
  block: ethereum.Block
): EthTx {
  log.info(
    '[EthTxs] Get or create ETH Tx for hash {}. Log Index: {} Tx Index: {}',
    [
      ethTransaction.hash.toHexString(),
      logIndex.toString(),
      ethTransaction.index.toString(),
    ]
  );
  let id = getEthTxId(
    ethTransaction.hash.toHexString(),
    logIndex.toString()
  );
  let entity = EthTx.load(id);
  if (entity === null) {
    // Special handling for contract creates since ethTransaction.to will be null.
    let toAddress = ZERO_ADDRESS;
    if (ethTransaction.to) {
      toAddress = ethTransaction.to as Address;
    }
    entity = new EthTx(id);
    entity.logIndex = logIndex;
    entity.from = ethTransaction.from;
    entity.gasPrice = ethTransaction.gasPrice;
    entity.gasLimit = ethTransaction.gasLimit;
    entity.hash = ethTransaction.hash;
    entity.index = ethTransaction.index;
    entity.to = toAddress;
    entity.value = ethTransaction.value;
    entity.timestamp = getTimestampInMs(block);
    entity.blockGasLimit = block.gasLimit;
    entity.blockNumber = block.number;
    entity.save();
  }
  return entity;
}

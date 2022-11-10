import { BigInt, ethereum } from "@graphprotocol/graph-ts";

export function getTimeInMs(time: BigInt): BigInt {
  return time.times(BigInt.fromI32(1000));
}

export function getTimestampInMs(block: ethereum.Block): BigInt {
  return block.timestamp.times(BigInt.fromI32(1000));
}

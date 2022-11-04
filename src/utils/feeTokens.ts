import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { FeeToken, GaugeReward } from '../../generated/schema';
import * as fees from './fees';
import * as tokens from './tokens';

export function createFeeToken(
  gaugeReward: GaugeReward,
  amount: BigInt,
  tx: ethereum.Transaction
): FeeToken {
  let id = tx.hash.toHexString().concat('-').concat(tx.index.toString());;
  let entity = FeeToken.load(id);
  if (entity == null) {
    entity = new FeeToken(id);
    entity.from = gaugeReward.id;
    entity.token = gaugeReward.reward;
    entity.amount = amount;
    entity.save();
  }
  let token = tokens.getOrCreateToken(Address.fromString(gaugeReward.reward));
  fees.getOrCreateFee(entity, token, amount);
  return entity as FeeToken;
}

import { Address, BigInt } from '@graphprotocol/graph-ts';
import { EthTx, RewardTokenClaim } from '../../generated/schema';
import * as accounts from "../utils/accounts";
import * as gaugeRewards from "../utils/gaugeRewards";

export function getOrCreateRewardTokenClaim(
  gaugeAddress: Address,
  userAddress: Address,
  rewardAddress: Address,
  amount: BigInt,
  period: BigInt,
  ethTx: EthTx
): RewardTokenClaim | null{
  let gaugeReward = gaugeRewards.getGaugeReward(gaugeAddress, rewardAddress, period);
  let account = accounts.getOrCreateAccount(userAddress, false, ethTx);
  let id = ethTx.hash.toHexString().concat('-').concat(ethTx.logIndex.toString());;
  let entity = RewardTokenClaim.load(id);
  if (entity == null) {
    entity = new RewardTokenClaim(id);
    entity.amount = amount;
    entity.gaugeReward = gaugeReward.id;
    entity.account = account.id;
    entity.amount = amount;
    entity.save();
  }
  return entity;
}

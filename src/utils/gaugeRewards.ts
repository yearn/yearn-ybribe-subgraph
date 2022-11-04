import { Address, BigInt, ethereum, log } from '@graphprotocol/graph-ts';
import { GaugeReward } from '../../generated/schema';
import * as accounts from "../utils/accounts";
import * as tokens from "../utils/tokens";
import * as gauges from "../utils/gauges";
import * as feeTokens from "../utils/feeTokens";

export function createId(
  gaugeAddress: Address,
  rewardAddress: Address
): string {
  return gaugeAddress
  .toHexString()
  .concat('-')
  .concat(rewardAddress.toHexString());//.concat('-').concat(period.toString())
}

export function getOrCreateGaugeReward(
  briberAddress: Address,
  gaugeAddress: Address,
  rewardAddress: Address,
  amount: BigInt,
  fee: BigInt,
  period: BigInt,
  tx: ethereum.Transaction,
): GaugeReward {
  let reward = tokens.getOrCreateToken(rewardAddress);
  let briber = accounts.getOrCreateAccount(briberAddress, false);
  let gauge = gauges.getOrCreateGauge(gaugeAddress);
  let id = createId(gaugeAddress, rewardAddress);
  let entity = GaugeReward.load(id);
  log.warning("Creating Gauge Reward gauge {} reward {} period {}", [
    gaugeAddress.toHexString(),
    rewardAddress.toHexString(),
    period.toString()
  ]);
  if (entity == null) {
    entity = new GaugeReward(id);
    entity.briber = briber.id;
    entity.gauge = gauge.id;
    entity.reward = reward.id;
    entity.amount = amount;
    entity.period = period;
    entity.save();
  }
  feeTokens.createFeeToken(entity, fee, tx);
  return entity;
}

export function getGaugeReward(
  gaugeAddress: Address,
  rewardAddress: Address,
  period: BigInt,
): GaugeReward {
  let id = createId(gaugeAddress, rewardAddress);
  let entity = GaugeReward.load(id);
  if (entity == null) {
    log.warning("Gauge reward not found gauge {} reward {} period {}", [
      gaugeAddress.toHexString(),
      rewardAddress.toHexString(),
      period.toString()
    ]);
  }
  return entity!;
}
import {
  Blacklisted as BlacklistedEvent,
  ChangeOwner as ChangeOwnerEvent,
  NewTokenReward as NewTokenRewardEvent,
  RemovedFromBlacklist as RemovedFromBlacklistEvent,
  RewardAdded as RewardAddedEvent,
  RewardClaimed as RewardClaimedEvent,
  ClearRewardRecipient as ClearRewardRecipientEvent,
  FeeUpdated as FeeUpdatedEvent,
  PeriodUpdated as PeriodUpdatedEvent,
  SetRewardRecipient as SetRewardRecipientEvent,
  Claim_rewardCall,
  Claim_reward_forCall,
} from "../../generated/yBribe/yBribe";
import {
  yBribe as yBribeContract
} from "../../generated/yBribe/yBribe";
import * as accounts from "../utils/accounts";
import { FEE_PERCENT, OWNER } from "../utils/consts";
import * as bribe from "../utils/yBribe";
import * as gaugeRewards from "../utils/gaugeRewards";
import * as rewardTokenClaims from "../utils/rewardTokenClaims";
import * as rewardRecipients from "../utils/rewardRecipients";
import * as gaugePeriods from "../utils/gaugePeriods";
import * as ethTxs from "../utils/ethTxs";
import { log } from "@graphprotocol/graph-ts";

export function handleBlacklisted(event: BlacklistedEvent): void {
  let ethTx = ethTxs.createEthTxFromEvent(event);
  accounts.getOrCreateAccount(event.params.user, true, ethTx);
}

export function handleChangeOwner(event: ChangeOwnerEvent): void {
  bribe.createOrUpdateAddress(OWNER, OWNER, event.params.owner);
}

export function handleRemovedFromBlacklist(event: RemovedFromBlacklistEvent): void {
  let ethTx = ethTxs.createEthTxFromEvent(event);
  accounts.updateBlacklist(event.params.user, false, ethTx);
}

export function handleNewTokenReward(event: NewTokenRewardEvent): void {
  // TODO
}

export function handleRewardAdded(event: RewardAddedEvent): void {
  let ethTx = ethTxs.createEthTxFromEvent(event);
  let yBribeInstance = yBribeContract.bind(event.address);
  let currentPeriod = yBribeInstance.current_period();

  gaugeRewards.getOrCreateGaugeReward(
    event.params.briber,
    event.params.gauge,
    event.params.reward_token,
    event.params.amount,
    event.params.fee,
    currentPeriod,
    ethTx,
    event
  );
}

export function handleRewardClaimed(event: RewardClaimedEvent): void {
  /*
  let yBribeInstance = yBribeContract.bind(event.address);
  let currentPeriod = yBribeInstance.current_period();
  rewardTokenClaims.getOrCreateRewardTokenClaim(
    event.params.gauge,
    event.params.user,
    event.params.reward_token,
    event.params.amount,
    currentPeriod,
    event.transaction,
  );
  */
}

export function handleClaim_reward(call: Claim_rewardCall): void {
  let gauge = call.inputs.gauge;
  let rewardToken = call.inputs.reward_token;
  let amount = call.outputs.value0;
  let user = call.transaction.from;
  log.info("Handler claim_rewards yBribe: {} User: {} RewardToken: {} TxHash: {}", [
    call.to.toHexString(),
    user.toHexString(),
    rewardToken.toHexString(),
    call.transaction.hash.toHexString()
  ]);

  if (!gaugeRewards.hasGaugeReward(gauge, rewardToken)) {
    log.warning("[handleClaim_reward] Gauge reward does not exist in TxHash: {}", [call.transaction.hash.toHexString()]);
    return;
  }
  let ethTx = ethTxs.createEthTxFromCall(call);
  let yBribeInstance = yBribeContract.bind(call.to);
  let currentPeriod = yBribeInstance.current_period();
  
  rewardTokenClaims.getOrCreateRewardTokenClaim(
    gauge,
    user,
    rewardToken,
    amount,
    currentPeriod,
    ethTx,
  );
}

export function handleClaim_rewardFor(call: Claim_reward_forCall): void {
  let gauge = call.inputs.gauge;
  let rewardToken = call.inputs.reward_token;
  let amount = call.outputs.value0;
  let user = call.inputs.user;
  let yBribeInstance = yBribeContract.bind(call.to);
  let currentPeriod = yBribeInstance.current_period();
  log.info("[handleClaim_rewardFor] Gauge {} Token {} User {} Tx {}", [
    gauge.toHexString(),
    rewardToken.toHexString(),
    user.toHexString(),
    call.transaction.hash.toHexString()
  ]);

  if (!gaugeRewards.hasGaugeReward(gauge, rewardToken)) {
    log.warning("[handleClaim_rewardFor] Gauge reward does not exist in TxHash: {}", [call.transaction.hash.toHexString()]);
    return;
  }

  let ethTx = ethTxs.createEthTxFromCall(call);
  rewardTokenClaims.getOrCreateRewardTokenClaim(
    gauge,
    user,
    rewardToken,
    amount,
    currentPeriod,
    ethTx,
  );
}

export function handleClearRewardRecipient(event: ClearRewardRecipientEvent): void {
  let ethTx = ethTxs.createEthTxFromEvent(event);
  rewardRecipients.createRewardRecipient(
    event.params.user,
    event.params.recipient,
    ethTx
  );
}

export function handleSetRewardRecipient(event: SetRewardRecipientEvent): void {
  let ethTx = ethTxs.createEthTxFromEvent(event);
  rewardRecipients.createRewardRecipient(
    event.params.user,
    event.params.recipient,
    ethTx
  );
}

export function handleFeeUpdated(event: FeeUpdatedEvent): void {
  bribe.createOrUpdateBigInt(FEE_PERCENT, FEE_PERCENT, event.params.fee);
}

export function handlePeriodUpdated(event: PeriodUpdatedEvent): void {
  bribe.updateBribe(event.address);
  gaugePeriods.getOrCreateGaugePeriod(
    event.params.gauge,
    event.params.period,
    event.params.bias,
    event.params.blacklisted_bias
  );
}

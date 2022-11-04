import {
  Blacklisted as BlacklistedEvent,
  ChangeOwner as ChangeOwnerEvent,
  NewTokenReward as NewTokenRewardEvent,
  RemovedFromBlacklist as RemovedFromBlacklistEvent,
  RewardAdded as RewardAddedEvent,
  RewardClaimed as RewardClaimedEvent,
  Claim_rewardCall,
  Claim_reward_forCall
} from "../../generated/yBribe/yBribe";
import {
  yBribe as yBribeContract
} from "../../generated/yBribe/yBribe";
import * as accounts from "../utils/accounts";
import { OWNER } from "../utils/consts";
import * as bribe from "../utils/yBribe";
import * as gaugeRewards from "../utils/gaugeRewards";
import * as rewardTokenClaims from "../utils/rewardTokenClaims";
import { log } from "@graphprotocol/graph-ts";

export function handleBlacklisted(event: BlacklistedEvent): void {
  accounts.getOrCreateAccount(event.params.user, true);
}

export function handleChangeOwner(event: ChangeOwnerEvent): void {
  bribe.createOrUpdateAddress(OWNER, OWNER, event.params.owner);
}

export function handleRemovedFromBlacklist(event: RemovedFromBlacklistEvent): void {
  accounts.updateBlacklist(event.params.user, false);
}

export function handleNewTokenReward(event: NewTokenRewardEvent): void {
  // TODO
}

export function handleRewardAdded(event: RewardAddedEvent): void {
  let yBribeInstance = yBribeContract.bind(event.address);
  let currentPeriod = yBribeInstance.current_period();

  gaugeRewards.getOrCreateGaugeReward(
    event.params.briber,
    event.params.gauge,
    event.params.reward_token,
    event.params.amount,
    event.params.fee,
    currentPeriod,
    event.transaction
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
  /*
  let gauge = call.inputs.gauge;
  let rewardToken = call.inputs.reward_token;
  let amount = call.outputs.value0;
  let user = call.transaction.from;
  let yBribeInstance = yBribeContract.bind(call.to);
  let currentPeriod = yBribeInstance.current_period();
  rewardTokenClaims.getOrCreateRewardTokenClaim(
    gauge,
    user,
    rewardToken,
    amount,
    currentPeriod,
    call.transaction,
  );
  */
}

export function handleClaim_rewardFor(call: Claim_reward_forCall): void {
  let gauge = call.inputs.gauge;
  let rewardToken = call.inputs.reward_token;
  let amount = call.outputs.value0;
  let user = call.inputs.user;
  let yBribeInstance = yBribeContract.bind(call.to);
  let currentPeriod = yBribeInstance.current_period();
  log.info("handleClaim_rewardFor Gauge {} Token {} User {} Tx {}", [
    gauge.toHexString(),
    rewardToken.toHexString(),
    user.toHexString(),
    call.transaction.hash.toHexString()
  ]);
  rewardTokenClaims.getOrCreateRewardTokenClaim(
    gauge,
    user,
    rewardToken,
    amount,
    currentPeriod,
    call.transaction,
  );
}

/*
export function handleClearRewardRecipient(event: ClearRewardRecipient): void {}
export function handleFeeUpdated(event: FeeUpdated): void {}
export function handlePeriodUpdated(event: PeriodUpdated): void {}


export function handleSetRewardRecipient(event: SetRewardRecipient): void {}
*/
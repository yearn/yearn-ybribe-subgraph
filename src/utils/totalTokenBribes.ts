import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { TotalTokenBribe } from '../../generated/schema';
import * as tokens from '../utils/tokens';
import { BIGINT_ZERO } from './consts';

function _getId(bribeAddress: Address): string {
  return bribeAddress.toHexString();
}

function _getTotalTokenBribe(bribeAddress: Address): TotalTokenBribe | null {
  let id = _getId(bribeAddress);
  let entity = TotalTokenBribe.load(id);
  if (entity === null ) {
    log.warning("[TotalTokenBribe] Entity not found for token id {}", [id]);
  }
  return entity;
}

export function createOrUpdateTotalTokenBribes(bribeAddress: Address, amount: BigInt): TotalTokenBribe {
  let id = _getId(bribeAddress);
  let bribe = tokens.getOrCreateToken(bribeAddress);
  let entity = _getTotalTokenBribe(bribeAddress);
  if (entity == null) {
    entity = new TotalTokenBribe(id);
    entity.bribe = bribe.id;
    entity.amount = amount;
    entity.claimed = BIGINT_ZERO;
  } else {
    entity.amount = entity.amount.plus(amount);
  }
  entity.save();
  return entity as TotalTokenBribe;
}

export function updateClaimedAmount(bribeAddress: Address, claimedAmount: BigInt): void {
  let entity = _getTotalTokenBribe(bribeAddress);
  if (entity === null) {
    return;
  }
  entity.claimed = entity.claimed.plus(claimedAmount);
  entity.save();
}

import { Address } from '@graphprotocol/graph-ts';
import { EthTx, RewardRecipient } from '../../generated/schema';
import * as accounts from './accounts';
import { FALSE } from './consts';

export function createRewardRecipient(
  accountAddress: Address,
  recipientAddress: Address,
  ethTx: EthTx
): RewardRecipient {
  let id = accountAddress.toHexString();
  let account = accounts.getOrCreateAccount(accountAddress, FALSE, ethTx);
  let recipient = accounts.getOrCreateAccount(recipientAddress, FALSE, ethTx);
  let entity = RewardRecipient.load(id);
  if (entity == null) {
    entity = new RewardRecipient(id);
    entity.account = account.id;
    entity.recipient = recipient.id;
  } else {
    entity.recipient = recipient.id;
  }
  entity.save();
  return entity as RewardRecipient;
}

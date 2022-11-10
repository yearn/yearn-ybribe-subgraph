import { Address } from '@graphprotocol/graph-ts';
import { Account, EthTx } from '../../generated/schema';

export function getOrCreateAccount(
  accountAddress: Address,
  isBlacklisted: boolean,
  ethTx: EthTx
): Account {
  let id = accountAddress.toHexString();
  let account = Account.load(id);
  if (account == null) {
    account = new Account(id);
    account.createdAt = ethTx.id;
  }
  account.isBlacklisted = isBlacklisted;
  account.save();
  return account;
}

export function updateBlacklist(
  accountAddress: Address,
  isBlacklisted: boolean,
  ethTx: EthTx
): Account {
  return getOrCreateAccount(accountAddress, isBlacklisted, ethTx);
}

import { Address, BigInt } from '@graphprotocol/graph-ts';


export let OWNER = "Owner";
export let FEE_PERCENT = "FeePercent";
export let FEE_RECIPIENT = "FeeRecipient";
export let CURRENT_PERIOD = "CurrentPeriod";
export let BIGINT_ZERO = BigInt.fromI32(0);
export let ZERO_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
);
export let FALSE = false;
export let TRUE = true;

import { BigInt } from '@graphprotocol/graph-ts';
import { Fee, FeeToken, Token } from '../../generated/schema';

export function getOrCreateFee(
  feeToken: FeeToken,
  token: Token,
  amount: BigInt,
): Fee {
  let entity = Fee.load(token.id);
  if (entity == null) {
    entity = new Fee(token.id);
    entity.token = token.id;
    entity.total = amount;
    entity.fees = [];
  } else {
    entity.total = entity.total.plus(amount);
  }
  let fees = entity.fees;
  fees.push(feeToken.id);
  entity.fees = fees;
  entity.save();
  return entity as Fee;
}

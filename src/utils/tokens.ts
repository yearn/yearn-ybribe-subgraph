import { Address } from '@graphprotocol/graph-ts';
import { Token } from '../../generated/schema';
import { ERC20 } from '../../generated/yBribe/ERC20';
import { BIGINT_ZERO } from '../utils/consts';

export function getOrCreateToken(address: Address): Token {
  let id = address.toHexString();
  let token = Token.load(id);
  if (token == null) {
    token = new Token(id);
    let tokenContract = ERC20.bind(address);
    let decimals = tokenContract.try_decimals();
    let name = tokenContract.try_name();
    let symbol = tokenContract.try_symbol();
    token.decimals = decimals.reverted ? BIGINT_ZERO.toI32() : decimals.value;
    token.name = name.reverted ? 'NoName' : name.value;
    token.symbol = symbol.reverted ? 'NoSymbol' : symbol.value;
    token.save();
  }
  return token as Token;
}

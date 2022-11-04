import { Address } from '@graphprotocol/graph-ts';
import { Gauge } from '../../generated/schema';

export function getOrCreateGauge(address: Address): Gauge {
  let id = address.toHexString();
  let entity = Gauge.load(id);
  if (entity == null) {
    entity = new Gauge(id);
    entity.address = address;
    entity.save();
  }
  return entity;
}

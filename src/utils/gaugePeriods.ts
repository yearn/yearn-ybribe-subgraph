import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { Gauge, GaugePeriod } from '../../generated/schema';
import * as gauges from './gauges';

function createGaugePeriod(
  gauge: Gauge,
  period: BigInt,
  bias: BigInt,
  blacklistedBias: BigInt,
): GaugePeriod {
  let id = gauge.id.concat("-".concat(period.toString()));
  let entity = new GaugePeriod(id);
  entity.gauge = gauge.id;
  entity.period = period;
  entity.bias = bias;
  entity.blacklistedBias = blacklistedBias;
  entity.save();
  return entity;
}

export function getOrCreateGaugePeriod(
  gaugeAddress: Address,
  period: BigInt,
  bias: BigInt,
  blacklistedBias: BigInt,
): GaugePeriod {
  let id = gaugeAddress.toHexString().concat("-".concat(period.toString()));
  let gauge = gauges.getOrCreateGauge(gaugeAddress);
  let entity = GaugePeriod.load(id);
  if (entity == null) {
    entity = createGaugePeriod(gauge, period, bias, blacklistedBias);
  } else {
    log.warning("Gauge period found for Gauge: {} Period: {}", [gaugeAddress.toHexString(), period.toString()]);
  }
  return entity;
}

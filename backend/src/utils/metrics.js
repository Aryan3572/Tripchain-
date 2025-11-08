// src/utils/metrics.js

export function estimateTripMetrics(mode, distanceKm) {
  const costRates = {
    car: 5,
    bus: 2,
    train: 1.5,
    walk: 0,
    bike: 0,
    cab: 12,
    scooter: 1.5,
  };

  const co2Rates = {
    car: 0.192,
    bus: 0.089,
    train: 0.041,
    walk: 0,
    bike: 0,
    cab: 0.192,
    scooter: 0.05,
  };

  const cost = Number((costRates[mode] * distanceKm).toFixed(2));
  const co2 = Number((co2Rates[mode] * distanceKm).toFixed(3));

  return { cost, co2 };
}

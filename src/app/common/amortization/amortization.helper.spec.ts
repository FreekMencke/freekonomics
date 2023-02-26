import Decimal from 'decimal.js';
import {
  calculateMonthlyInterest,
  calculateMonthlyPayment,
  calculatePrincipalPayment,
  calculateYearlyInterest,
  paymentStatusAt,
} from './amortization.helper';

describe('amortization', () => {
  it('#calculateMonthlyInterest should return the correct monthly interest', () => {
    expect(calculateMonthlyInterest(0.021)).toEqual(new Decimal(0.001733));
    expect(calculateMonthlyInterest(0.02285)).toEqual(new Decimal(0.001885));
    expect(calculateMonthlyInterest(0.0286)).toEqual(new Decimal(0.002353));
  });

  it('#calculateYearlyInterest should return the correct monthly interest', () => {
    expect(calculateYearlyInterest(0.001733)).toEqual(new Decimal(0.021));
    expect(calculateYearlyInterest(0.001885)).toEqual(new Decimal(0.0229));
    expect(calculateYearlyInterest(0.002353)).toEqual(new Decimal(0.0286));
  });

  it('#calculateMonthlyPayment should return the correct monthly payment amount', () => {
    expect(calculateMonthlyPayment(230_000, calculateMonthlyInterest(0.021), 348)).toEqual(new Decimal(880.68));
    expect(calculateMonthlyPayment(362_000, calculateMonthlyInterest(0.02285), 300)).toEqual(new Decimal(1580.95));
    expect(calculateMonthlyPayment(240_000, calculateMonthlyInterest(0.0286), 300)).toEqual(new Decimal(1116.21));
  });

  it('#calculatePrincipalPayment should return the correct principal payment and interest', () => {
    // payment 1, 230.000 at 2.1% for 348 months
    const principalPayment1 = calculatePrincipalPayment(
      1,
      230000,
      calculateMonthlyPayment(230_000, calculateMonthlyInterest(0.021), 348),
      calculateMonthlyInterest(0.021),
    );
    expect(principalPayment1.principalBalance).toEqual(new Decimal(229_517.91));
    expect(principalPayment1.principalPayment).toEqual(new Decimal(482.09));
    expect(principalPayment1.interest).toEqual(new Decimal(398.59));

    // payment 1, 362.000 at 2.285% for 300 months
    const principalPayment2 = calculatePrincipalPayment(
      1,
      362_000,
      calculateMonthlyPayment(362_000, calculateMonthlyInterest(0.02285), 300),
      calculateMonthlyInterest(0.02285),
    );
    expect(principalPayment2.principalBalance).toEqual(new Decimal(361_101.42));
    expect(principalPayment2.principalPayment).toEqual(new Decimal(898.58));
    expect(principalPayment2.interest).toEqual(new Decimal(682.37));

    // payment 299, 362.000 at 2.285% for 300 months
    const principalPayment3 = calculatePrincipalPayment(
      299,
      362_000,
      calculateMonthlyPayment(362_000, calculateMonthlyInterest(0.02285), 300),
      calculateMonthlyInterest(0.02285),
    );
    expect(principalPayment3.principalBalance).toEqual(new Decimal(1576.08));
    expect(principalPayment3.principalPayment).toEqual(new Decimal(1575.01));
    expect(principalPayment3.interest).toEqual(new Decimal(5.94));

    // payment 1, 240.000 at 2.86% for 300 months
    const principalPayment4 = calculatePrincipalPayment(
      1,
      240_000,
      calculateMonthlyPayment(240_000, calculateMonthlyInterest(0.0286), 300),
      calculateMonthlyInterest(0.0286),
    );
    expect(principalPayment4.principalBalance).toEqual(new Decimal(239_448.51));
    expect(principalPayment4.principalPayment).toEqual(new Decimal(551.49));
    expect(principalPayment4.interest).toEqual(new Decimal(564.72));

    // payment 299, 240.000 at 2.86% for 300 months
    const principalPayment5 = calculatePrincipalPayment(
      299,
      240_000,
      calculateMonthlyPayment(240_000, calculateMonthlyInterest(0.0286), 300),
      calculateMonthlyInterest(0.0286),
    );
    expect(principalPayment5.principalBalance).toEqual(new Decimal(1113.48));
    expect(principalPayment5.principalPayment).toEqual(new Decimal(1110.98));
    expect(principalPayment5.interest).toEqual(new Decimal(5.23));
  });

  it('#calculatePrincipalPayment should return the correct principal payment and interest', () => {
    // payment 299, 362.000 at 2.285% for 300 months
    const principalPayment1 = paymentStatusAt(
      299,
      300,
      362_000,
      calculateMonthlyPayment(362_000, calculateMonthlyInterest(0.02285), 300),
      calculateMonthlyInterest(0.02285),
    );
    expect(principalPayment1.principalBalance).toEqual(new Decimal(1576.08));
    expect(principalPayment1.principalPaid).toEqual(Decimal.sub(362_000, 1576.08));
    expect(principalPayment1.interestTotal).toEqual(Decimal.sub(112_285, 4.87));

    // payment 299, 240.000 at 2.86% for 300 months
    const principalPayment2 = paymentStatusAt(
      299,
      300,
      240_000,
      calculateMonthlyPayment(240_000, calculateMonthlyInterest(0.0286), 300),
      calculateMonthlyInterest(0.0286),
    );
    expect(principalPayment2.principalBalance).toEqual(new Decimal(1113.48));
    expect(principalPayment2.principalPaid).toEqual(Decimal.sub(240000, 1113.48));
    expect(principalPayment2.interestTotal).toEqual(Decimal.sub(94862.89, 2.62));
  });
});

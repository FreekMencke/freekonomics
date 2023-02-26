import { Decimal } from 'decimal.js';

export function calculateMonthlyInterest(yearlyInterest: number | Decimal, decimalPrecision: number = 6): Decimal {
  return Decimal.add(yearlyInterest, 1).pow(Decimal.div(1, 12)).sub(1).toDecimalPlaces(decimalPrecision);
}

export function calculateYearlyInterest(monthlyInterest: number | Decimal, decimalPrecision: number = 4): Decimal {
  return Decimal.add(monthlyInterest, 1).pow(12).sub(1).toDecimalPlaces(decimalPrecision);
}

export function calculateMonthlyPayment(
  principal: number | Decimal,
  monthlyInterest: number | Decimal,
  periodInMonths: number | Decimal,
  decimals = 2,
): Decimal {
  return Decimal.mul(principal, monthlyInterest)
    .mul(Decimal.add(monthlyInterest, 1).pow(periodInMonths))
    .div(Decimal.add(monthlyInterest, 1).pow(periodInMonths).sub(1))
    .toDecimalPlaces(decimals);
}

export function calculatePrincipalPayment(
  paymentNumber: number | Decimal,
  principal: number | Decimal,
  monthlyPayment: number | Decimal,
  monthlyInterest: number | Decimal,
  callback?: (principalPayment: Decimal, interest: Decimal) => any,
): { principalBalance: Decimal; principalPayment: Decimal; interest: Decimal } {
  const interest = Decimal.mul(principal, monthlyInterest).toDecimalPlaces(2);
  const principalBalance = Decimal.sub(principal, Decimal.sub(monthlyPayment, interest));

  callback?.(Decimal.sub(monthlyPayment, interest), interest);

  if (paymentNumber > 1) {
    return calculatePrincipalPayment(
      Decimal.sub(paymentNumber, 1),
      principalBalance,
      monthlyPayment,
      monthlyInterest,
      callback,
    );
  }
  return {
    principalBalance,
    principalPayment: Decimal.sub(monthlyPayment, interest),
    interest,
  };
}

export function paymentStatusAt(
  paymentNumber: number | Decimal,
  totalPayments: number | Decimal,
  principal: number | Decimal,
  monthlyPayment: number | Decimal,
  monthlyInterest: number | Decimal,
): { principalBalance: Decimal; principalPaid: Decimal; interestTotal: Decimal } {
  let interestTotal = new Decimal(0);
  let principalPaid = new Decimal(0);

  const cappedPaymentNumber = Decimal.min(paymentNumber, totalPayments); // add this line to cap paymentNumber

  calculatePrincipalPayment(
    cappedPaymentNumber,
    principal,
    monthlyPayment,
    monthlyInterest,
    (principalPayment, interest) => {
      interestTotal = interestTotal.add(interest);
      principalPaid = principalPaid.add(principalPayment);
    },
  );

  return {
    principalBalance: Decimal.max(0, Decimal.sub(principal, principalPaid)),
    principalPaid: Decimal.min(principal, principalPaid),
    interestTotal,
  };
}

import differenceInMonths from 'date-fns/differenceInMonths';
import startOfDay from 'date-fns/startOfDay';
import Decimal from 'decimal.js';
import { calculateMonthlyPayment, paymentStatusAt } from './amortization.helper';

export enum AmortizationStorageKey {
  AMORTIZATION = 'amortization',
}

export class Mortgage {
  id: string;

  description: string;
  firstPaymentDate: Date;

  principal: number;
  durationInMonths: number;
  yearlyInterest: number;
  monthlyInterest: number;

  get paymentStatus() {
    return paymentStatusAt(
      differenceInMonths(startOfDay(new Date()), startOfDay(this.firstPaymentDate)),
      this.durationInMonths,
      this.principal,
      calculateMonthlyPayment(this.principal, Decimal.div(this.monthlyInterest, 100), this.durationInMonths),
      Decimal.div(this.monthlyInterest, 100),
    );
  }
}

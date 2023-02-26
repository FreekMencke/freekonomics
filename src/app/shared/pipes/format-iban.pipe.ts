import { Pipe, PipeTransform } from '@angular/core';
import { friendlyFormatIBAN, isValidIBAN } from 'ibantools';

@Pipe({ name: 'formatIban' })
export class FormatIbanPipe implements PipeTransform {
  transform(iban: string | null): string | null {
    if (!iban || !isValidIBAN(iban)) return iban;

    return friendlyFormatIBAN(iban);
  }
}

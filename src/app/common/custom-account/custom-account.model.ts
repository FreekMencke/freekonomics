import { Institution } from '../nordigen/nordigen.model';

export const CustomInstitutions: Institution[] = [
  {
    id: 'DELEN',
    bic: '',
    transaction_total_days: '-1',
    name: 'Delen Private Bank',
    countries: ['BE'],
    logo: 'delen-private-bank.png',
  },
];

export const OtherInstitution: Institution = {
  id: 'OTHER',
  bic: '',
  transaction_total_days: '-1',
  name: 'Other',
  countries: [],
  logo: 'other.png',
};

export class CustomAccount {
  id: string;
  iban: string;
  country: string;
  institution_id: string;
  balance: number;
}

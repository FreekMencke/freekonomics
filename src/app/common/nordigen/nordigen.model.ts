export type NordigenSecret = {
  id: string;
  key: string;
};

export type NordigenTokenRefreshResponse = {
  access: string;
  access_expires: number;
};

export type NordigenTokenResponse = NordigenTokenRefreshResponse & {
  refresh: string;
  refresh_expires: number;
};

export enum RequisitionStatus {
  Created = 'CR',
  ['Giving consent'] = 'GC',
  ['Undergoing authentication'] = 'UA',
  ['Rejected'] = 'RJ',
  ['Selected accounts'] = 'SA',
  ['Granting access'] = 'GA',
  Linked = 'LN',
  Suspended = 'SU',
  Expired = 'EX',

  CR = 'Created',
  GC = 'Giving consent',
  UA = 'Undergoing authentication',
  RJ = 'Rejected',
  SA = 'Selected accounts',
  GA = 'Granting access',
  LN = 'Linked',
  SU = 'Suspended',
  EX = 'Expired',
}

export type Requisition = {
  id: string;
  created: Date;
  redirect: string;
  status: RequisitionStatus;
  institution_id: string;
  agreement: string;
  reference: string;
  accounts: string[];
  link: string;
  account_selection: boolean;
  redirect_immediate: boolean;
};

export type Institution = {
  bic: string;
  countries: string[];
  id: string;
  logo: string;
  name: string;
  transaction_total_days: string;
};

export enum AccountStatus {
  DISCOVERED = 'DISCOVERED',
  ERROR = 'ERROR',
  EXPIRED = 'EXPIRED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  SUSPENDED = 'SUSPENDED',
}

export type NordigenAccount = {
  id: string;
  created: Date;
  last_accessed: Date;
  iban: string;
  institution_id: string;
  status: AccountStatus;
};

export type Amount = {
  amount: string;
  currency: string;
};

export type Balance = {
  balanceAmount: Amount;
};

export type TransactionAccount = {
  currency: string;
  iban: string;
};

export type Transaction = {
  additionalInformation?: string;
  bankTransactionCode?: string;
  bookingDate: string;
  creditorAccount?: TransactionAccount;
  creditorName?: string;
  debtorAccount?: TransactionAccount;
  debtorName?: string;
  proprietaryBankTransactionCode?: string;
  remittanceInformationUnstructured: string;
  transactionAmount: Amount;
  transactionId: string;
  valueDate?: string;
};

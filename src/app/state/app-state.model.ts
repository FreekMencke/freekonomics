import { Mortgage } from '../common/amortization/amortization.model';
import { CustomAccount } from '../common/custom-account/custom-account.model';
import { Balance, Institution, NordigenAccount, Requisition } from '../common/nordigen/nordigen.model';

export class AppStateModel {
  countries: Set<string>;
  institutions: Institution[];

  customAccounts: CustomAccount[];

  nordigenAccounts: NordigenAccount[];
  nordigenBalances: Map<string, Balance>;
  nordigenBalancesLoading: boolean;

  requisitions: Requisition[];
  requisitionsLoading: boolean;

  mortgages: Mortgage[];
}

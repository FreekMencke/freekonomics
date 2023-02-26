import { Mortgage } from './amortization.model';

export namespace Amortization {
  export class CreateOrUpdateMortgage {
    static readonly type: string = '[Amortization] Create/Update Mortgage';
    constructor(public mortgage: Mortgage, public id?: string) {}
  }

  export class DeleteMortgage {
    static readonly type: string = '[Amortization] Delete Mortgage';
    constructor(public id: string) {}
  }

  export class UpdateMortgageOrder {
    static readonly type: string = '[Amortization] Update Mortgage Order';
    constructor(public previousIndex: number, public currentIndex: number) {}
  }
}

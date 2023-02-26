export namespace Nordigen {
  export class GetInstitutions {
    static readonly type: string = '[Nordigen] Get Institutions';
  }

  export class GetRequisitions {
    static readonly type: string = '[Nordigen] Get Requisitions';
  }

  export class DeleteRequisition {
    static readonly type: string = '[Nordigen] Delete Requisition';
    constructor(public id: string) {}
  }

  export class GetAccounts {
    static readonly type: string = '[Nordigen] Get Accounts';
  }

  export class GetAccountBalance {
    static readonly type: string = '[Nordigen] Get Account Balance';
    constructor(public id: string) {}
  }

  export class GetAllAccountBalances {
    static readonly type: string = '[Nordigen] Get All Account Balances';
  }

  export class UpdateAccountOrder {
    static readonly type: string = '[Nordigen] Update Account Order';
    constructor(public previousIndex: number, public currentIndex: number) {}
  }
}

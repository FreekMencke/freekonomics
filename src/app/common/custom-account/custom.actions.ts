import { CustomAccount } from './custom-account.model';

export namespace Custom {
  export class CreateOrUpdateAccount {
    static readonly type: string = '[Custom] Create/Update Account';
    constructor(public customAccount: CustomAccount, public id?: string) {}
  }

  export class DeleteAccount {
    static readonly type: string = '[Custom] Delete Account';
    constructor(public id: string) {}
  }

  export class UpdateAccountOrder {
    static readonly type: string = '[Custom] Update Account Order';
    constructor(public previousIndex: number, public currentIndex: number) {}
  }
}

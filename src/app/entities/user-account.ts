export class UserAccount {

    constructor(
      public access_type:string,
      public auth_method:string,
      public authorized_ips:string,
      public credit:string,
      public purgatory:string,
      public quota:string,
      public since:string
    ){}
}


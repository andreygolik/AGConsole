export class User {
  constructor(
    public login: string,
    public password: string,
    public firstName?: string,
    public lastName?: string
  ) {}
}

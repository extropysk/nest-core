export enum Action {
  NONE = 0,
  READ = 1 << 0,
  CREATE = 1 << 1,
  UPDATE = 1 << 2,
  DELETE = 1 << 3,
  WRITE = CREATE | UPDATE | DELETE,
  READ_WRITE = READ | WRITE,
}

export interface Permission {
  action: Action
  subject: string
}

export interface Payload {
  sub: string
  email: string
  roles?: string[]
  permissions?: Permission[]
}

export class PayloadDto implements Payload {
  sub: string
  email: string
  roles?: string[]
}

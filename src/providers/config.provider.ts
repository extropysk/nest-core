export const CONFIG = 'config'

export interface Config {
  jwt: {
    secret: string
    expiresIn?: string
  }
}

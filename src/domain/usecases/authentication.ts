export interface AuthenticationModle {
  email: string
  password: string
}

export interface Authentication {
  auth: (authentication: AuthenticationModle) => Promise<string>
}

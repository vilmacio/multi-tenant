export interface AuthCredentials {
    email: string
    password: string
}

export interface Authentication {
    auth(credentials: AuthCredentials):Promise<string>
}

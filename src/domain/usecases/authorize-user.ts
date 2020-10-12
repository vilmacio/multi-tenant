import { User } from '../models/user'

export interface Authorization {
    authorize(accessToken: string, role?:string):Promise<User>
}

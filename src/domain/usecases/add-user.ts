import { User } from '../models/user'

export type AddUserModel = {
    name: string
    email: string
    password: string
}

export interface AddUser {
    add(userData: AddUserModel): Promise<User>
}

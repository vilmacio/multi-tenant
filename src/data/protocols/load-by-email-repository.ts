import { User } from '../../domain/models/user'

export interface LoadByEmailRepository {
    loadByEmail(email: string):Promise<User>
}

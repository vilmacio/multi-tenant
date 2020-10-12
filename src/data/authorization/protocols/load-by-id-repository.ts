import { User } from '../../../domain/models/user'

export interface LoadByIdRepository {
    loadById(id: string):Promise<User>
}

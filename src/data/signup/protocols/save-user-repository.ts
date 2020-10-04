import { User } from '../../../domain/models/user'
import { AddUserModel } from '../../../domain/usecases/add-user'

export interface SaveUserRepository {
    save(addUserModel: AddUserModel):Promise<User>
}

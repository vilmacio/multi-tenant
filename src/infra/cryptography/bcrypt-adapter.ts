import { Hasher } from '../../data/signup/protocols/hasher'
import bcrypt from 'bcrypt'

export class BCryptAdapter implements Hasher {
    private salt: number
    constructor (salt:number) {
      this.salt = salt
    }

    async hash (value: string) {
      const hashedValue = await bcrypt.hash(value, this.salt)
      return hashedValue
    }
}

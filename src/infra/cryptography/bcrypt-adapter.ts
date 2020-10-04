import { Hasher } from '../../data/signup/protocols/hasher'
import bcrypt from 'bcrypt'
import { HashComparer } from '../../data/login/protocols/hash-comparer'

export class BCryptAdapter implements Hasher, HashComparer {
    private salt: number
    constructor (salt:number) {
      this.salt = salt
    }

    async hash (value:string) {
      const hashedValue = await bcrypt.hash(value, this.salt)
      return hashedValue
    }

    async compare (hash:string, valueToCompare:string):Promise<boolean> {
      const result = await bcrypt.compare(hash, valueToCompare)
      return result
    }
}

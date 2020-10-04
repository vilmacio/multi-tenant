export interface HashComparer {
    compare(hash:string, valueToCompare:string):Promise<boolean>
}

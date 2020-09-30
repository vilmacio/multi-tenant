export class InvalidParamError extends Error {
  constructor (param: string) {
    super(`Invalid Param: ${param}`)
    this.name = 'InvalidParamError'
  }
}

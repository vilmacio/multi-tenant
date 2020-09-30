export class MissingParamError extends Error {
  constructor (param: string) {
    super(`Missing Param: ${param}`)
    this.name = 'MissingParamError'
  }
}

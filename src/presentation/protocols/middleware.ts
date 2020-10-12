import { httpRequest, httpResponse } from './http'

export interface Middleware {
    handle(httpRequest: httpRequest):Promise<httpResponse>
}

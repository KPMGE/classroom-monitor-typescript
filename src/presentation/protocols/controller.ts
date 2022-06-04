import { HttpResponse } from "./http"

export interface Controller {
  handle(): Promise<HttpResponse>
}

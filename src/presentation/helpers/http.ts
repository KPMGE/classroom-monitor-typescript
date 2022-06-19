import { HttpResponse } from "../protocols"

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: error
})

export const badRequest = (message: string): HttpResponse => ({
  statusCode: 400,
  body: message
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

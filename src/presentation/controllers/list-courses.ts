import { ListCoursesUseCase } from "../../domain/protocols"
import { ok, serverError } from "../helpers"
import { Controller, HttpResponse } from "../protocols"

export class ListCoursesController implements Controller {
  constructor(private readonly listCoursesUseCase: ListCoursesUseCase) { }

  async handle(): Promise<HttpResponse> {
    try {
      const courses = await this.listCoursesUseCase.list()
      return ok(courses)
    } catch (error) {
      return serverError(error)
    }
  }
}

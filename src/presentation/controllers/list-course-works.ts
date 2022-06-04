import { ListCourseWorksUseCase } from "../../domain/protocols/list-course-works"
import { ok, serverError } from "../helpers"
import { Controller, HttpResponse } from "../protocols"

export class ListCourseWorksController implements Controller {
  constructor(private readonly listCourseWorksService: ListCourseWorksUseCase) { }

  async handle(): Promise<HttpResponse> {
    try {
      const courseWorks = await this.listCourseWorksService.list()
      return ok(courseWorks)
    } catch (err) {
      return serverError(err)
    }
  }
}

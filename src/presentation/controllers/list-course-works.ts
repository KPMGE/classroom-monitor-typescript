import { ListCourseWorksUseCase } from "../../domain/protocols/list-course-works"
import { badRequest, ok, serverError } from "../helpers"
import { Controller, HttpRequest, HttpResponse } from "../protocols"

export class ListCourseWorksController implements Controller {
  constructor(private readonly listCourseWorksService: ListCourseWorksUseCase) { }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const courseId = request.params.courseId
      if (!courseId) return badRequest('courseId is missing!')
      const courseWorks = await this.listCourseWorksService.list(courseId)
      return ok(courseWorks)
    } catch (err) {
      return serverError(err)
    }
  }
}

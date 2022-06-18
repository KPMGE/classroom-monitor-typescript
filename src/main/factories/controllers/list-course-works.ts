import { ListCourseWorksController } from "../../../presentation/controllers"
import { makeListCourseWorksService } from "../services"

export const makeListCourseWorksController = (): ListCourseWorksController => {
  return new ListCourseWorksController(makeListCourseWorksService())
}

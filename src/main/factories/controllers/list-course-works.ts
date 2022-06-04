import { ListCourseWorksController } from "../../../presentation/controllers"
import { makeClassroomListCourseWorksRepository } from "../services"

export const makeListCourseWorksController = (): ListCourseWorksController => {
  return new ListCourseWorksController(makeClassroomListCourseWorksRepository())
}

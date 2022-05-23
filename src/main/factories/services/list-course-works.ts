import { ListCourseWorksRepository } from "../../../application/protocols"
import { ClassroomRepository } from "../../../infrastructure/repositories"

export const makeClassroomListCourseWorksRepository = (): ListCourseWorksRepository => {
  const listRepo = new ClassroomRepository()
  return listRepo
}

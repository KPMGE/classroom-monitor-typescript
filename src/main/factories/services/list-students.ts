import { ListStudentsRepository } from "../../../application/protocols"
import { ClassroomRepository } from "../../../infrastructure/repositories"

export const makeClassroomListStudentsRepository = (): ListStudentsRepository => {
  const listRepo = new ClassroomRepository()
  return listRepo
}

import { ListStudentsController } from "../../../presentation/controllers/list-students"
import { Controller } from "../../../presentation/protocols"
import { makeClassroomListStudentsRepository } from "../services"

export const makeListStudentsController = (): Controller => {
  return new ListStudentsController(makeClassroomListStudentsRepository())
}

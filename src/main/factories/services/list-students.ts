import { ListStudentsService } from "../../../application/services"
import { ListStudentsUseCase } from "../../../domain/protocols"
import { ClassroomRepository } from "../../../infrastructure/repositories"

export const makeListStudentsService = (): ListStudentsUseCase => {
  const repo = new ClassroomRepository()
  const service = new ListStudentsService(repo)
  return service
}

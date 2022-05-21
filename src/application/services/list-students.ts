import { ListStudentsUseCase } from "../../domain/protocols"
import { StudentDTO } from "../DTO"
import { ListStudentsRepository } from "../protocols"

export class ListStudentsService implements ListStudentsUseCase {
  constructor(private readonly listStudentsRepo: ListStudentsRepository) { }

  async list(): Promise<StudentDTO[]> {
    return await this.listStudentsRepo.list()
  }
}

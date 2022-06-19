import { Student } from "../../domain/entities"
import { ListStudentsUseCase } from "../../domain/protocols"
import { ListStudentsRepository } from "../protocols"

export class ListStudentsService implements ListStudentsUseCase {
  constructor(private readonly listStudentsRepository: ListStudentsRepository) { }

  async list(courseId: string): Promise<Student[]> {
    const students = await this.listStudentsRepository.listStudents(courseId)
    return students
  }
}

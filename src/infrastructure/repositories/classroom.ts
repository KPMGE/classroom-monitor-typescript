import { ListStudentsRepository } from "../../application/protocols"
import { Student } from "../../domain/entities"

export class ClassroomRepository implements ListStudentsRepository {
  async list(): Promise<Student[]> {
    return []
  }
}

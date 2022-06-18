import { Student } from "../../domain/entities"

export interface ListStudentsRepository {
  listStudents(): Promise<Student[]>
}

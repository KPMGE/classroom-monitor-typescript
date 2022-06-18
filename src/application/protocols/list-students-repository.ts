import { Student } from "../../domain/entities"

export interface ListStudentsRepository {
  list(): Promise<Student[]>
}

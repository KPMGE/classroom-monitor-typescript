import { Student } from "../entities"

export interface ListStudentsUseCase {
  list(): Promise<Student[]>
}

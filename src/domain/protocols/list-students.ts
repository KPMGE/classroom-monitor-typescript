import { Student } from "../entities"

export interface ListStudentsUseCase {
  list(courseId: string): Promise<Student[]>
}

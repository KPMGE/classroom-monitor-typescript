import { Student } from "../../domain/entities"

export interface ListStudentsRepository {
  listStudents(courseId: string): Promise<Student[]>
}

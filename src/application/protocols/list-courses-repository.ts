import { Course } from "../../domain/entities"

export interface ListCoursesRepository {
  list(): Promise<Course[]>
}


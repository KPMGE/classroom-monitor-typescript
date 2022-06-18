import { Course } from "../../domain/entities"

export interface ListCoursesRepository {
  listCourses(): Promise<Course[]>
}


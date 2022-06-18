import { Course } from "../entities"

export interface ListCoursesUseCase {
  list(): Promise<Course[]>
}

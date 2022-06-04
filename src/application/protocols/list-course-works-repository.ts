import { CourseWork } from "../../domain/entities"

export interface ListCourseWorksRepository {
  list(): Promise<CourseWork[]>
}

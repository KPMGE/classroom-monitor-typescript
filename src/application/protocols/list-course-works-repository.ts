import { CourseWork } from "../../domain/entities"

export interface ListCourseWorksRepository {
  listCourseWorks(): Promise<CourseWork[]>
}

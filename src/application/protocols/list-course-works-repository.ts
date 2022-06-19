import { CourseWork } from "../../domain/entities"

export interface ListCourseWorksRepository {
  listCourseWorks(courseId: string): Promise<CourseWork[]>
}

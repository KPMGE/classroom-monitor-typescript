import { CourseWork } from '../entities'

export interface ListCourseWorksUseCase {
  list(courseId: string): Promise<CourseWork[]>
}

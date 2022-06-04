import { CourseWork } from '../entities'

export interface ListCourseWorksUseCase {
  list(): Promise<CourseWork[]>
}

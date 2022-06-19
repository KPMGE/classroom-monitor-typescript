import { CourseWork } from "../../domain/entities"
import { ListCourseWorksUseCase } from "../../domain/protocols/list-course-works"
import { ListCourseWorksRepository } from "../protocols"

export class ListCourseWorksService implements ListCourseWorksUseCase {
  constructor(private readonly listCourseWorksRepo: ListCourseWorksRepository) { }

  async list(courseId: string): Promise<CourseWork[]> {
    return await this.listCourseWorksRepo.listCourseWorks(courseId)
  }
}

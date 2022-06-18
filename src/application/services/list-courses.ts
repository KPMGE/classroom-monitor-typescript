import { Course } from "../../domain/entities"
import { ListCoursesUseCase } from "../../domain/protocols"
import { ListCoursesRepository } from "../protocols"

export class ListCoursesService implements ListCoursesUseCase {
  constructor(private readonly listCoursesRepository: ListCoursesRepository) { }

  async list(): Promise<Course[]> {
    const courses = await this.listCoursesRepository.list()
    return courses
  }
}

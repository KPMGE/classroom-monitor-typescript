export interface ListCoursesUseCase {
  list(): Promise<Course[]>
}

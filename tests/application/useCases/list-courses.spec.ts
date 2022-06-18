import { Course } from "../../../src/domain/entities"

interface ListCoursesUseCase {
  list(): Promise<Course[]>
}

interface ListCoursesRepository {
  list(): Promise<Course[]>
}

const makeFakeCourse = (): Course => ({
  id: 'fake_course_id',
  title: 'fake_course_title'
})

class ListCoursesRepositoryMock implements ListCoursesRepository {
  callsCount = 0
  courses = [makeFakeCourse(), makeFakeCourse()]

  async list(): Promise<Course[]> {
    this.callsCount++
    return this.courses
  }
}

class ListCoursesService implements ListCoursesUseCase {
  constructor(private readonly listCoursesRepository: ListCoursesRepository) { }

  async list(): Promise<Course[]> {
    const courses = await this.listCoursesRepository.list()
    return courses
  }
}

type SutTypes = {
  repo: ListCoursesRepositoryMock
  sut: ListCoursesService
}

const makeSut = (): SutTypes => {
  const repo = new ListCoursesRepositoryMock()
  const sut = new ListCoursesService(repo)

  return {
    repo, sut
  }
}

describe('list-courses', () => {
  it('should call repository only once', () => {
    const { sut, repo } = makeSut()

    sut.list()

    expect(repo.callsCount).toBe(1)
  })

  it('should throw if repository throws', async () => {
    const { sut, repo } = makeSut()
    repo.list = () => { throw new Error('repo error') }

    const promise = sut.list()

    expect(promise).rejects.toThrowError(new Error('repo error'))
  })

  it('should return right data', async () => {
    const { sut, repo } = makeSut()

    const courses = await sut.list()

    expect(courses).toEqual(repo.courses)
  })
})

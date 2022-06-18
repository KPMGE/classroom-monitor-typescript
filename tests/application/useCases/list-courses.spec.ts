import { ListCoursesService } from "../../../src/application/services/list-courses"
import { ListCoursesUseCase } from "../../../src/domain/protocols"
import { ListCoursesRepositorySpy } from "../mocks/list-courses"

type SutTypes = {
  repo: ListCoursesRepositorySpy
  sut: ListCoursesUseCase
}

const makeSut = (): SutTypes => {
  const repo = new ListCoursesRepositorySpy()
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
    repo.listCourses = () => { throw new Error('repo error') }

    const promise = sut.list()

    expect(promise).rejects.toThrowError(new Error('repo error'))
  })

  it('should return right data', async () => {
    const { sut, repo } = makeSut()

    const courses = await sut.list()

    expect(courses).toEqual(repo.courses)
  })
})

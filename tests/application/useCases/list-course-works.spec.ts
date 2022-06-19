import { ListCourseWorksService } from "../../../src/application/services"
import { ListCourseWorksRepositorySpy } from "../mocks/list-course-works"

type SutTypes = {
  sut: ListCourseWorksService,
  repo: ListCourseWorksRepositorySpy
}

const makeSut = (): SutTypes => {
  const repo = new ListCourseWorksRepositorySpy()
  const sut = new ListCourseWorksService(repo)
  return {
    repo,
    sut
  }
}

describe('list-course-works-service', () => {
  it('should call repository only once', () => {
    const { sut, repo } = makeSut()

    sut.list('any_course_id')

    expect(repo.callsCount).toBe(1)
  })

  it('should call repository with right course id', () => {
    const { sut, repo } = makeSut()

    sut.list('any_course_id')

    expect(repo.courseId).toEqual('any_course_id')
  })

  it('should throw if repository throws', async () => {
    const { sut, repo } = makeSut()
    repo.listCourseWorks = () => { throw new Error('repo error') }

    const promise = sut.list('any_course_id')

    await expect(promise).rejects.toThrow()
  })
})

type Course = {
  id: string
  title: string
}

interface ListCoursesUseCase {
  list(): Promise<Course>
}

interface ListCoursesRepository {
  list(): Promise<Course>
}

class ListCoursesRepositoryMock implements ListCoursesRepository {
  callsCount = 0
  async list(): Promise<Course> {
    this.callsCount++
    return null
  }
}

class ListCoursesService implements ListCoursesUseCase {
  constructor(private readonly listCoursesRepository: ListCoursesRepository) { }

  async list(): Promise<Course> {
    this.listCoursesRepository.list()
    return null
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
})

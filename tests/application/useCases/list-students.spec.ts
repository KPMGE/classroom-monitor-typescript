type CourseWork = {
  title: string
  description: string
};

type Submission = {
  late: boolean
  courseWork: CourseWork
};

type Student = {
  id: string
  name: string
  email: string
  submissions: Submission[]
};

interface ListStudentsRepository {
  list(): Promise<Student[]>
}

interface ListStudentsUseCase {
  list(): Promise<Student[]>
}

class ListStudentsRepositoryMock implements ListStudentsRepository {
  callsCount = 0
  async list(): Promise<Student[]> {
    this.callsCount++
    return null
  }
}

class ListStudentsService implements ListStudentsUseCase {
  constructor(private readonly listStudentsRepo: ListStudentsRepository) { }

  async list(): Promise<Student[]> {
    this.listStudentsRepo.list()
    return null
  }
}

type SutTypes = {
  repo: ListStudentsRepositoryMock
  sut: ListStudentsService
}

const makeSut = (): SutTypes => {
  const repo = new ListStudentsRepositoryMock()
  const sut = new ListStudentsService(repo)
  return {
    repo,
    sut
  }
}

describe('list students', () => {
  it('should call repository only once', () => {
    const { repo, sut } = makeSut()

    sut.list()

    expect(repo.callsCount).toBe(1)
  })

  it('should throw if repository throws', () => {
    const { repo, sut } = makeSut()
    repo.list = () => { throw new Error() }

    const promise = sut.list()

    expect(promise).rejects.toThrow()
  })
})

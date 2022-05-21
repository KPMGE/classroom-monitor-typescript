import { CourseWork } from "../../../src/domain/entities/course-work"
import { Student } from "../../../src/domain/entities/student"
import { Submission } from "../../../src/domain/entities/submission"

const makeCourseWork = (): CourseWork => ({
  title: "any title",
  description: "any description"
})

const makeSubmission = (): Submission => ({
  late: false,
  courseWork: makeCourseWork()
})

const makeStudent = (): Student => ({
  id: 'any id',
  name: 'any name',
  email: 'any email',
  submissions: [makeSubmission()]
})

interface ListStudentsRepository {
  list(): Promise<Student[]>
}

interface ListStudentsUseCase {
  list(): Promise<Student[]>
}

class ListStudentsRepositorySpy implements ListStudentsRepository {
  callsCount = 0
  students = [makeStudent()]

  async list(): Promise<Student[]> {
    this.callsCount++
    return this.students
  }
}

class ListStudentsService implements ListStudentsUseCase {
  constructor(private readonly listStudentsRepo: ListStudentsRepository) { }

  async list(): Promise<Student[]> {
    return await this.listStudentsRepo.list()
  }
}

type SutTypes = {
  repo: ListStudentsRepositorySpy
  sut: ListStudentsService
}

const makeSut = (): SutTypes => {
  const repo = new ListStudentsRepositorySpy()
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

  it('should throw if repository throws', async () => {
    const { repo, sut } = makeSut()
    repo.list = () => { throw new Error() }

    const promise = sut.list()

    await expect(promise).rejects.toThrow()
  })

  it('should return a valid list of students', async () => {
    const { sut } = makeSut()

    const students = await sut.list()

    expect(students.length).toBe(1)
    expect(students[0]).toEqual(makeStudent())
  })
})

import { Submission } from "../../../src/domain/entities/submission"
import { makeStudent } from "./student"

export const makeSubmission = (): Submission => ({
  late: false,
  id: 'any_submission_id',
  student: makeStudent(),
  studentId: 'any_student_id'
})


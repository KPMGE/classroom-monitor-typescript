import { Student } from "./student"

export type Submission = {
  id: string
  studentId: string
  late: boolean
  student: Student
}

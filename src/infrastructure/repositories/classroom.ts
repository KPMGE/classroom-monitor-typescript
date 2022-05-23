import { classroom_v1 } from "googleapis"
import { ListCourseWorksRepository } from "../../application/protocols"
import { CourseWork, Student, Submission } from "../../domain/entities"
import { classroomHelper } from './classroom-helper'

const getAllCourseWorks = async (classroom: classroom_v1.Classroom, courseId: string): Promise<CourseWork[]> => {
  const response = await classroom.courses.courseWork.list({
    courseId,
    courseWorkStates: ["PUBLISHED"],
    orderBy: "dueDate asc",
    fields: 'courseWork.id,courseWork.title'
  })

  let courseWorks = response.data.courseWork.map<CourseWork>(courseWork => ({
    id: courseWork.id,
    title: courseWork.title,
    submissions: []
  }))


  for (const courseWork of courseWorks) {
    const submissions = await getAllSubmissions(classroom, courseId, courseWork.id)
    courseWork.submissions = submissions
  }

  return courseWorks
}

const getAllSubmissions = async (classroom: classroom_v1.Classroom, courseId: string, courseWorkId: string): Promise<Submission[]> => {
  const response = await classroom.courses.courseWork.studentSubmissions.list({
    courseId,
    courseWorkId,
  })

  const submissions = response.data.studentSubmissions.map<Submission>(submmission => ({
    id: submmission.id,
    late: submmission.late ? true : false,
    studentId: submmission.userId,
    student: null
  }))

  for (const submission of submissions) {
    const student = await getStudent(classroom, courseId, submission.studentId)
    submission.student = student
  }

  return submissions
}

const getStudent = async (classroom: classroom_v1.Classroom, courseId: string, userId: string): Promise<Student> => {
  const response = await classroom.courses.students.get({
    courseId,
    userId,
    fields: 'profile.id,profile.name.fullName,profile.emailAddress'
  })

  const student: Student = {
    id: response.data.userId,
    email: response.data.profile.emailAddress,
    name: response.data.profile.name.fullName
  }

  return student
}

export class ClassroomRepository implements ListCourseWorksRepository {
  async list(): Promise<CourseWork[]> {
    const courseWorks = await getAllCourseWorks(classroomHelper.instance, classroomHelper.courseId)
    return courseWorks
  }
}

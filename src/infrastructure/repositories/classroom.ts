import { classroom_v1 } from "googleapis"
import { ListCoursesRepository, ListCourseWorksRepository, ListStudentsRepository } from "../../application/protocols"
import { Course, CourseWork, Student, Submission } from "../../domain/entities"
import { classroomHelper } from './classroom-helper'

const getAllCourseWorks = async (classroom: classroom_v1.Classroom, courseId: string): Promise<CourseWork[]> => {
  const response = await classroom.courses.courseWork.list({
    courseId,
    courseWorkStates: ["PUBLISHED"],
    orderBy: "dueDate asc",
    fields: 'courseWork.id,courseWork.title'
  })

  let courseWorks = response.data.courseWork.map<CourseWork>(courseWork => {
    return {
      id: courseWork.id,
      title: courseWork.title,
      submissions: []
    }
  })


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
    email: response.data.profile.emailAddress,
    name: response.data.profile.name.fullName
  }

  return student
}

const listCourses = async (classroom: classroom_v1.Classroom): Promise<Course[]> => {
  const response = await classroom.courses.list()

  const courses = response.data.courses.map<Course>(course => ({
    id: course.id,
    title: course.name
  }))

  return courses
}

const listStudents = async (classroom: classroom_v1.Classroom, courseId: string): Promise<Student[]> => {
  const response = await classroom.courses.students.list({ courseId })

  const students = response.data.students.map<Student>(student => ({
    name: student.profile.name.fullName,
    email: student.profile.emailAddress
  }))

  return students
}

export class ClassroomRepository implements ListCourseWorksRepository, ListCoursesRepository, ListStudentsRepository {
  async listCourseWorks(): Promise<CourseWork[]> {
    const courseWorks = await getAllCourseWorks(classroomHelper.instance, classroomHelper.courseId)
    return courseWorks
  }

  async listCourses(): Promise<Course[]> {
    return await listCourses(classroomHelper.instance)
  }

  async listStudents(): Promise<Student[]> {
    return await listStudents(classroomHelper.instance, classroomHelper.courseId)
  }
}

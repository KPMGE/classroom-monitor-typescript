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
    states: ['TURNED_IN']
  })

  const allStudents = await listStudents(classroom, courseId, [], '')

  let submissions: Submission[] = []

  for (const submission of response.data.studentSubmissions) {
    for (const student of allStudents) {
      if (submission.userId === student.id) {
        submissions.push({
          student,
          id: submission.id,
          late: submission.late ? true : false
        })
      }
    }
  }

  return submissions
}

const listCourses = async (classroom: classroom_v1.Classroom): Promise<Course[]> => {
  const response = await classroom.courses.list({ teacherId: 'me' })

  const courses = response.data.courses.map<Course>(course => ({
    id: course.id,
    title: course.name
  }))

  return courses
}

const listStudents = async (classroom: classroom_v1.Classroom, courseId: string, students: Student[], nextPageToken: string): Promise<Student[]> => {
  const response = await classroom.courses.students.list({
    courseId,
    pageToken: nextPageToken
  })

  const newStudents = response.data.students.map<Student>(student => ({
    id: student.profile.id,
    name: student.profile.name.fullName,
    email: student.profile.emailAddress
  }))

  // adds up the old students with the brand new fetched ones
  students = [...students, ...newStudents]

  if (response.data.nextPageToken) {
    return listStudents(classroom, courseId, students, response.data.nextPageToken)
  }

  return students
}

export class ClassroomRepository implements ListCourseWorksRepository, ListCoursesRepository, ListStudentsRepository {
  async listCourseWorks(courseId: string): Promise<CourseWork[]> {
    try {
      const courseWorks = await getAllCourseWorks(classroomHelper.instance, courseId)
      console.log("course works")
      return courseWorks
    } catch (error) {
    }
  }

  async listCourses(): Promise<Course[]> {
    return await listCourses(classroomHelper.instance)
  }

  async listStudents(courseId: string): Promise<Student[]> {
    return await listStudents(classroomHelper.instance, courseId, [], "")
  }
}

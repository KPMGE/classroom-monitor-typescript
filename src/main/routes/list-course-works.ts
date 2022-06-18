import { Router } from "express"
import { adaptRoute } from "../adapters"
import { makeListCourseWorksController } from "../factories/controllers"

export default (router: Router) => {
  router.get('/course-works', adaptRoute(makeListCourseWorksController()))
}

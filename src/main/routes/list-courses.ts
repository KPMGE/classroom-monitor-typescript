import { Router } from "express"
import { adaptRoute } from "../adapters"
import { makeListCoursesController } from "../factories/controllers"

export default (router: Router) => {
  router.get('/courses', adaptRoute(makeListCoursesController()))
}

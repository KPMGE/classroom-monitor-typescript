import { Router } from "express"
import { adaptRoute } from "../adapters"
import { makeListStudentsController } from "../factories/controllers/list-students"

export default (router: Router) => {
  router.get('/students/:courseId', adaptRoute(makeListStudentsController()))
}

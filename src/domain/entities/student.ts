import { Submission } from "./submission"

export type Student = {
  id: string
  name: string
  email: string
  submissions: Submission[]
}

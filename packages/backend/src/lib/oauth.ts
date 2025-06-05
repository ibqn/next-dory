import { env } from "../env"
import { GitHub } from "arctic"

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
  "http://localhost:3333/auth/sign-in/github/callback"
)

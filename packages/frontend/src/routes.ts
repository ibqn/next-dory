export const Route = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/dashboard",
} as const

export type Route = (typeof Route)[keyof typeof Route]

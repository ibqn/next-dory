export const Route = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/dashboard",
  home: "/",
  events: "/events",
  bookmarked: "/dashboard/bookmarks",
  account: "/dashboard/account",
} as const

export type Route = (typeof Route)[keyof typeof Route]

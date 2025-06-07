export const Route = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/dashboard",
  home: "/",
  events: "/events",
  bookmarked: "/bookmarks",
  account: "/account",
} as const

export type Route = (typeof Route)[keyof typeof Route]

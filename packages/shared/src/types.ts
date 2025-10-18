
export const Provider = {
  github: "github",
  google: "google",
} as const

export type Provider = (typeof Provider)[keyof typeof Provider]

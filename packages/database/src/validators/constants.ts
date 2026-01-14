export const event = {
  name: {
    minLength: 1,
    maxLength: 100,
  },
  slug: {
    minLength: 1,
    maxLength: 100,
  },
  description: {
    minLength: 1,
    maxLength: 255,
  },
} as const

export const question = {
  minLength: 1,
  maxLength: 2500,
} as const

export const poll = {
  body: {
    minLength: 1,
    maxLength: 500,
  },
  options: {
    minLength: 1,
    maxLength: 100,
    minCount: 2,
    maxCount: 6,
  },
} as const

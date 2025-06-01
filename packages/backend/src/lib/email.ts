import { env } from "../env"

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${env.FRONTEND_URL}/auth/email-verification?token=${token}`

  console.log({
    from: "onboarding@admin.dev",
    to: `${email}`,
    subject: "Confirm your email",
    html: `<p>Please click this <a href="${confirmationLink}">link</a> to confirm email.</p>`,
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const passwordResetLink = `${env.FRONTEND_URL}/auth/new-password?token=${token}`

  console.log({
    from: "onboarding@admin.dev",
    to: `${email}`,
    subject: "Reset your password",
    html: `<p>Please click this <a href="${passwordResetLink}">link</a> to set a new password.</p>`,
  })
}

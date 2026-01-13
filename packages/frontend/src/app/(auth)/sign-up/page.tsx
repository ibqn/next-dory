import { GithubIcon } from "@/components/github-icon"
import { GoogleIcon } from "@/components/google-icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { env } from "@/env"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>Sign up with your Github or Google account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field className="gap-4">
              <Button asChild variant="outline" className="w-full">
                <a href={`${env.API_URL}/auth/sign-in/github`}>
                  <GithubIcon />
                  Sign up with GitHub
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <a href={`${env.API_URL}/auth/sign-in/google`}>
                  <GoogleIcon />
                  Sign up with Google
                </a>
              </Button>
            </Field>

            <Field>
              <FieldDescription className="text-center">
                Have an account already? <Link href="/sign-in">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

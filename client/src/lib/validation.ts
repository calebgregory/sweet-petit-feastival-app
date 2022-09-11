const email_re = /^\S+@\S+\.\S+$/i

export function is_email_valid(email: string): boolean {
  return email_re.test(email)
}

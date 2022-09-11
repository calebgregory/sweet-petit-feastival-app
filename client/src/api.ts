/* eslint-disable no-console */
import { ValidationError } from "./lib/errors"
import { is_email_valid } from "./lib/validation"

import config from "./config.json"

export const registerForEmails = async (email: string) => {
  const e = email.trim().toLowerCase()

  if (e && !is_email_valid(email)) {
    throw new ValidationError("invalid email")
  }

  try {
    const resp = await (
      await fetch(`${config.url}/register`, {
        method: "post",
        body: JSON.stringify({ email: e })
      })
    ).json()
    console.log("got resp", resp)
  } catch (error) {
    console.error("error making that request", error)
  }
}

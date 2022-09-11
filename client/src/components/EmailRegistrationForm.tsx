/* eslint-disable no-console */
import React, { FormEvent, useState } from "react"

import { classnames } from "../lib/classnames"
import { ValidationError } from "../lib/errors"

type Props = {
  submit: (email: string) => Promise<unknown>;
}

export function EmailRegistrationForm({ submit }: Props) {
  const [email, set_email] = useState("")
  const [submitted, set_submitted] = useState(false)
  const [error, set_error] = useState("")

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await submit(email)
    } catch (error) {
      if (error instanceof ValidationError) {
        set_error(error.message)
        return
      } else {
        console.warn("submit failed due to error", error)
      }
    }
    set_email("")
    set_submitted(true)
  }

  return (
    <>
      <p>
        Please enter your email in this form so that we can send you updates as
        we think of them. We promise not to spam you, and of course you&#39;ll
        be <code>bcc:</code>&#39;d :)
      </p>
      <form onSubmit={handleSubmit}>
        <input
          className={classnames(error && "error")}
          disabled={submitted}
          placeholder={submitted ? "thank you!" : "please gimme your email"}
          type="text"
          value={email}
          onChange={(event) => {
            if (error) {
              set_error("")
            }
            set_email(event.target.value)
          }}
        />
        <button disabled={submitted}>
          {submitted ? "🎉" : "here you go!"}
        </button>
      </form>
      {error && <span id="error">{error}</span>}
    </>
  )
}

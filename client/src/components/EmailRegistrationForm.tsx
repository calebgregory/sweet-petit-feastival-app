/* eslint-disable no-console */
import React, { FormEvent } from "react"

import { Signal } from "@preact/signals-core"

import { classnames } from "../lib/classnames"
import { ValidationError } from "../lib/errors"
import { useSignal, useComputed } from "../lib/signals"

type Props = {
  user_email: Signal<string>;
  submit: (email: string) => Promise<unknown>;
}

export function EmailRegistrationForm({ user_email, submit }: Props) {
  const email = useSignal("")
  const error = useSignal("")

  const submitted = useComputed(() => Boolean(user_email.value))

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await submit(email.value)
    } catch (_error) {
      if (_error instanceof ValidationError) {
        error.value = _error.message
        return
      } else {
        console.warn("submit failed due to error", _error)
      }
    }
    email.value = ""
  }

  return (
    <>
      <p>
        Please enter your email in this form so that we can send you updates as
        we think of them. We promise not to spam you, and of course you&#39;ll
        be <code>bcc:</code>&#39;d :)
      </p>
      <form id="email_registration" onSubmit={handleSubmit}>
        <input
          className={classnames(error && "error")}
          disabled={submitted.value}
          placeholder={
            submitted.value ? "thank you!" : "please gimme your email"
          }
          type="text"
          value={email.value}
          onChange={(event) => {
            if (error) {
              error.value = ""
            }
            email.value = event.target.value
          }}
        />
        <button className="primary" disabled={submitted.value}>
          {submitted.value ? "🎉" : "here you go!"}
        </button>
      </form>
      {error && <span id="error">{error.value}</span>}
    </>
  )
}

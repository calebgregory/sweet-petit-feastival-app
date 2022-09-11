import React, { FormEvent } from "react"

import { Signal, useComputed, useSignal } from "@preact/signals-react"

import { Participant, RegisterForPotluckInput } from "../app/types"
import { classnames } from "../lib/classnames"
import { ValidationError } from "../lib/errors"

type Props = {
  user_email: Signal<string>;
  participants: Signal<Participant[]>;
  submit: (input: RegisterForPotluckInput) => Promise<unknown>;
}

export function ParticipantsTable({ user_email, participants, submit }: Props) {
  const form_enabled = useSignal(false)
  const email = useSignal(user_email.value)
  const email_error = useSignal("")
  const name = useSignal("")
  const food_to_bring = useSignal("")
  const food_to_bring_error = useSignal("")

  const participants_with_name = useComputed(() =>
    participants.value.filter((p) => Boolean(p.name))
  )
  const is_valid = useComputed(
    () => email.value && name.value && food_to_bring.value
  )
  const is_food_to_bring_valid = useComputed(
    () => food_to_bring.value.length < 2000
  )

  const clear_form = () => {
    name.value = ""
    food_to_bring.value = ""
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await submit({
        email: email.value,
        name: name.value,
        food_to_bring: food_to_bring.value
      })
    } catch (_error) {
      if (_error instanceof ValidationError) {
        email_error.value = _error.message
        return
      } else {
        console.warn("submit failed due to error", _error)
      }
    }
    form_enabled.value = false
    clear_form()
  }

  return (
    <>
      <h4>Let us know what you&#39;re bringing!</h4>
      <p>
        Use the form below to let us / others know what you&#39;re gonna bring
        to the Feastival. Afterwards, we&#39;re going to compile everyone&#39;s
        recipes into a little <i>Sweet Petit v1 Cookbook Zine</i>, so please
        also bring (or email) your recipe to us so we can include it in that!
        Note that you can bring multiple things -- just lump them all in the
        same entry.
      </p>
      <div className="participants_table_container">
        <table className="participants_table">
          <tbody>
            {participants_with_name.value.map((p, i) => (
              <tr key={p.id + i}>
                <td className="participant_name">{p.name}</td>
                <td>{p.food_to_bring}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {form_enabled.value && (
          <form id="food_to_bring" onSubmit={handleSubmit}>
            <div>
              <input
                className={classnames(email_error.value && "error")}
                placeholder="your email (this is how i&#39;ll identify you so please get this right 😛)"
                type="text"
                value={email.value}
                onChange={(e) => {
                  if (email_error.value) {
                    email_error.value = ""
                  }
                  email.value = e.target.value
                }}
              />
              {email_error && <span id="error">{email_error.value}</span>}
            </div>
            <div>
              <input
                placeholder="your name"
                type="text"
                value={name.value}
                onChange={(e) => {
                  name.value = e.target.value
                }}
              />
            </div>
            <div>
              <input
                className={classnames(food_to_bring_error.value && "error")}
                disabled={!is_food_to_bring_valid.value}
                placeholder="what you're bringing"
                type="text"
                value={food_to_bring.value}
                onChange={(e) => {
                  food_to_bring.value = e.target.value
                }}
              />
            </div>
          </form>
        )}
        {!form_enabled.value ? (
          <button
            className="primary"
            onClick={() => {
              form_enabled.value = true
            }}
          >
            add your dish
          </button>
        ) : (
          <div className="button_group">
            <button
              onClick={() => {
                form_enabled.value = false
                clear_form()
              }}
            >
              nevermind
            </button>
            <button
              className="primary"
              disabled={!is_valid.value}
              onClick={handleSubmit}
            >
              ok!
            </button>
          </div>
        )}
        <p className="extra_info">
          ℹ - (Because of how I built this, if you want to update what
          you&#39;re bringing, you&#39;ll have to do that on the same device you
          originally used to add your dish. This code is open-source; you can go
          read it{" "}
          <a
            href="https://github.com/calebgregory/sweet-petit-feastival-app"
            rel="noreferrer"
            target="_blank"
          >
            here
          </a>
          )
        </p>
      </div>
    </>
  )
}

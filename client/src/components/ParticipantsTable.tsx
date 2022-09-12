import React, { FormEvent } from "react"

import { Signal } from "@preact/signals-core"

import { Participant, RegisterForPotluckInput } from "../app/types"
import { classnames } from "../lib/classnames"
import { ValidationError } from "../lib/errors"
import { useComputed, useSignal } from "../lib/signals"

type Props = {
  user_email: Signal<string>;
  user_id: Signal<string>;
  participants: Signal<Participant[]>;
  submit: (input: RegisterForPotluckInput) => Promise<unknown>;
}

export function EditableParticipantEntry({
  participant: p,
  food_to_bring,
  edit_form_enabled,
  handle_submit,
  handle_edit_click
}: {
  participant: Participant;
  food_to_bring: Signal<string>;
  edit_form_enabled: Signal<boolean>;
  handle_submit: (e: FormEvent) => Promise<unknown>;
  handle_edit_click: (p: Participant) => unknown;
}) {
  return (
    <tr>
      <td className="participant_name">{p.name}</td>
      <td>
        {edit_form_enabled.value ? (
          <input
            type="text"
            value={food_to_bring.value}
            onChange={(e) => {
              food_to_bring.value = e.target.value
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handle_submit(e)
              }
            }}
          />
        ) : (
          <span onClick={handle_edit_click.bind(null, p)}>
            {p.food_to_bring}
          </span>
        )}
      </td>
      <td>
        {edit_form_enabled.value ? (
          <span className="icon" onClick={handle_submit}>
            {"✅"}
          </span>
        ) : (
          <span className="icon" onClick={handle_edit_click.bind(null, p)}>
            {"✏️"}
          </span>
        )}
      </td>
    </tr>
  )
}

export function ParticipantsTable({
  user_email,
  user_id,
  participants,
  submit
}: Props) {
  const create_form_enabled = useSignal(false)
  const edit_form_enabled = useSignal(false)
  const email = useSignal(user_email.value)
  const email_error = useSignal("")
  const name = useSignal("")
  const food_to_bring = useSignal("")
  const food_to_bring_error = useSignal("")

  const participants_with_name = useComputed(() =>
    participants.value.filter((p) => Boolean(p.name))
  )
  const is_valid = useComputed(() =>
    Boolean(email.value && name.value && food_to_bring.value)
  )
  const is_food_to_bring_valid = useComputed(
    () => food_to_bring.value.length < 2000
  )
  const has_participant_already_submitted = useComputed(() =>
    participants_with_name.value.some((p) => p.id === user_id.value)
  )

  const clear_form = () => {
    name.value = ""
    food_to_bring.value = ""
  }

  const handle_submit = async (event: FormEvent) => {
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
    create_form_enabled.value = false
    edit_form_enabled.value = false
    clear_form()
  }

  const handle_edit_click = (p: Participant) => {
    email.value = user_email.value
    name.value = p.name
    food_to_bring.value = food_to_bring.value || p.food_to_bring // preserve edits

    edit_form_enabled.value = true
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
            {participants_with_name.value.map((p, i) => {
              if (p.id === user_id.value) {
                return (
                  <EditableParticipantEntry
                    key={p.id + i}
                    edit_form_enabled={edit_form_enabled}
                    food_to_bring={food_to_bring}
                    handle_edit_click={handle_edit_click}
                    handle_submit={handle_submit}
                    participant={p}
                  />
                )
              }

              return (
                <tr key={p.id + i}>
                  <td className="participant_name">{p.name}</td>
                  <td>{p.food_to_bring}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {create_form_enabled.value && (
          <form id="food_to_bring" onSubmit={handle_submit}>
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
            <div className="button_container">
              <button
                className="primary"
                disabled={!is_valid.value}
                onClick={handle_submit}
              >
                ok!
              </button>
            </div>
          </form>
        )}
        {!has_participant_already_submitted.value &&
          !create_form_enabled.value && (
            <div className="button_container">
              <button
                className="primary"
                onClick={() => {
                  create_form_enabled.value = true
                }}
              >
                add your dish
              </button>
            </div>
          )}
        <p className="extra_info">
          ℹ - (Because of how I built this, if you want to update what
          you&#39;re bringing, you&#39;ll have to do that on the same device you
          originally used to add your dish. Although... I guess you can
          overwrite an existing entry using the same email. This
          invitation&#39;s code is open-source; you can go read it{" "}
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

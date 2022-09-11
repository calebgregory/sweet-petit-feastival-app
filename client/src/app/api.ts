/* eslint-disable no-console */
import config from "../config.json"
import { ValidationError } from "../lib/errors"
import { is_email_valid } from "../lib/validation"

import {
  ListParticipantsResult,
  RegisterForPotluckInput,
  RegisterForPotluckResult
} from "./types"

type Endpoint = "/register" | "/participants"
const endpoint_onto_method: Record<Endpoint, "get" | "post"> = {
  "/participants": "get",
  "/register": "post"
}

function fmt_and_throw_if_email_invalid(email: string): string {
  const e = email.trim().toLowerCase()
  if (e && !is_email_valid(email)) {
    throw new ValidationError("invalid email")
  }
  return e
}

function _fetch<Input extends Record<string, any>, Result>(
  endpoint: Endpoint,
  input?: Input,
  __fetch = fetch
): Promise<Result> {
  return __fetch(
    `${config.url}/${endpoint}`,
    {
      get: { method: "get" },
      post: { method: "post", body: JSON.stringify(input) }
    }[endpoint_onto_method[endpoint]]
  ).then((resp) => resp.json())
}

export async function register(
  input: RegisterForPotluckInput
): Promise<RegisterForPotluckResult> {
  input.email = fmt_and_throw_if_email_invalid(input.email)
  return await _fetch("/register", input)
}

export async function list_participants(): Promise<ListParticipantsResult> {
  return await _fetch("/participants")
}

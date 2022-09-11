import { Signal, signal } from "@preact/signals-react"

import { CoreIsNotInitedError } from "../lib/errors"

import * as api from "./api"
import { Participant } from "./types"

/** global state */
export type StateTree = {
  participants: Signal<Participant[]>;
  user_email: Signal<string>;
}
type StateTreeValues = { [K in keyof StateTree]: StateTree[K]["value"] }
type InitialState = Partial<StateTreeValues>

export const make_defaults = (): StateTreeValues => ({
  participants: [],
  user_email: ""
})

export const make_state_tree = (
  initial_state: InitialState = {}
): StateTree => {
  const values = { ...make_defaults(), ...initial_state }

  const participants = signal(values.participants)
  const user_email = signal(values.user_email)

  return {
    participants,
    user_email
  }
}

/** application core */
export type Core = {
  state_tree: StateTree;
  api: {
    list_participants: typeof api.list_participants;
    register_for_emails: typeof api.register_for_emails;
    register_to_bring_food: typeof api.register_to_bring_food;
  };
}

const _core: { current: Core | null } = { current: null }
export const inited = signal(false)

export function globalize(core: Core) {
  _core.current = core
  inited.value = true
  return _core.current
}

export function core(): Core {
  if (!_core.current) {
    throw new CoreIsNotInitedError(
      "core has not been initialized with a state-tree"
    )
  }

  return _core.current
}

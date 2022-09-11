import { Signal, signal } from "@preact/signals-react"

import { CoreIsNotInitedError } from "../lib/errors"

import * as api from "./api"
import { Participant } from "./types"

/** global state */
export type StateTree = {
  participants: Signal<Participant[]>;
  user_email: Signal<string>;
  user_id: Signal<string>;
}
type StateTreeValues = { [K in keyof StateTree]: StateTree[K]["value"] }
type InitialState = Partial<StateTreeValues>

export const make_defaults = (): StateTreeValues => ({
  participants: [],
  user_email: "",
  user_id: ""
})

export const make_state_tree = (
  initial_state: InitialState = {}
): StateTree => {
  const values = { ...make_defaults(), ...initial_state }

  const participants = signal(values.participants)
  const user_email = signal(values.user_email)
  const user_id = signal(values.user_id)

  return {
    participants,
    user_email,
    user_id
  }
}

/** application core */
export type Core = {
  state_tree: StateTree;
  api: {
    list_participants: typeof api.list_participants;
    register: typeof api.register;
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

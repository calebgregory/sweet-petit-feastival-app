/* eslint-disable no-console */
import clone_deep from "lodash.clonedeep"

import { determine_user_id_from_participants } from "../coordinate/determine_user_id_from_participants"

import * as api from "./api"
import * as core from "./core"
import { load_from_storage, init_persistence } from "./storage"

function _preact_signals_bug_hacky_fix(state_tree: core.StateTree) {
  for (const [key, value] of Object.entries(state_tree)) {
    // @ts-expect-error string keys
    state_tree[key].value = clone_deep(value.value)
  }
}

export async function init() {
  const init_state = load_from_storage()
  console.debug("initial state from storage", init_state)
  const state_tree = core.make_state_tree(init_state)

  core.globalize({ state_tree, api })

  init_persistence(state_tree)

  const { potluck_participants } = await api.list_participants()
  state_tree.participants.value = potluck_participants

  if (state_tree.user_email.value) {
    const user_id = await determine_user_id_from_participants(
      state_tree.user_email.value,
      potluck_participants
    )
    console.debug("user_id", user_id)
    state_tree.user_id.value = user_id
  }

  _preact_signals_bug_hacky_fix(state_tree)
}

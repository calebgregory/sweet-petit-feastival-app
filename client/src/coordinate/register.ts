import * as core from "../app/core"
import { RegisterForPotluckInput } from "../app/types"

import { determine_user_id_from_participants } from "./determine_user_id_from_participants"

type Dependencies = {
  api: Pick<core.Core["api"], "register">;
  state_tree: Pick<
    core.Core["state_tree"],
    "participants" | "user_email" | "user_id"
  >;
}

export async function register(
  { api, state_tree }: Dependencies,
  input: RegisterForPotluckInput
) {
  const { potluck_participants } = await api.register(input)

  state_tree.user_email.value = input.email
  state_tree.participants.value = potluck_participants

  if (!state_tree.user_id.value) {
    state_tree.user_id.value = await determine_user_id_from_participants(
      input.email,
      potluck_participants
    )
  }
}

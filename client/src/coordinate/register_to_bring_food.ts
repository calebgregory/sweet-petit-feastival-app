import * as core from "../app/core"
import { RegisterForPotluckInput } from "../app/types"

type Dependencies = {
  api: Pick<core.Core["api"], "register_to_bring_food">;
  state_tree: Pick<core.Core["state_tree"], "participants" | "user_email">;
}

export async function register_to_bring_food(
  { api, state_tree }: Dependencies,
  input: RegisterForPotluckInput
) {
  const { potluck_participants } = await api.register_to_bring_food(input)

  state_tree.user_email.value = input.email
  state_tree.participants.value = potluck_participants
}

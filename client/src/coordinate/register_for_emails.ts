import * as core from "../app/core"

type Dependencies = {
  api: Pick<core.Core["api"], "register_for_emails">;
  state_tree: Pick<core.Core["state_tree"], "user_email" | "participants">;
}

export async function register_for_emails(
  { api, state_tree }: Dependencies,
  email: string
) {
  const { potluck_participants } = await api.register_for_emails(email)

  state_tree.user_email.value = email
  state_tree.participants.value = potluck_participants
}

/* eslint-disable */
import * as api from "./api";
import * as core from "./core";
import { load_from_storage, init_persistence } from "./storage";

export async function init() {
  const init_state = load_from_storage();
  console.debug("initial state from storage", init_state);
  const state_tree = core.make_state_tree(init_state);

  core.globalize({ state_tree, api });

  init_persistence(state_tree);

  const { potluck_participants } = await api.list_participants();
  state_tree.participants.value = potluck_participants;
}

import { effect } from "@preact/signals-react"

import { StateTree, make_defaults } from "./core"

const persist_key_onto_parser = {
  user_email: String
} as const

/** sort of namespaces */
const key = (k: keyof typeof persist_key_onto_parser) =>
  `lol.sweetpetitfeastival.${k}`

type Loaded = {
  [K in keyof typeof persist_key_onto_parser]: ReturnType<
    typeof persist_key_onto_parser[K]
  >;
}
export function load_from_storage(): Loaded {
  const loaded = make_defaults()

  for (const [k, parse] of Object.entries(persist_key_onto_parser)) {
    const _k = k as keyof typeof persist_key_onto_parser
    const stored = localStorage.getItem(key(_k))
    if (stored) {
      const value = parse(stored)
      loaded[_k] = value
    }
  }

  for (const k of Object.keys(loaded)) {
    const _k = k as keyof ReturnType<typeof make_defaults>
    if (!(_k in persist_key_onto_parser)) {
      delete loaded[_k]
    }
  }

  return loaded as Loaded
}

export function init_persistence(state_tree: StateTree) {
  for (const k of Object.keys(persist_key_onto_parser)) {
    const _k = k as keyof typeof persist_key_onto_parser
    effect(() => {
      localStorage.setItem(key(_k), String(state_tree[_k].value))
    })
  }
}

/** https://github.com/preactjs/signals/issues/86 */
import React from "react"

import { Signal, computed, signal, effect } from "@preact/signals-core"

// Signal hook, can use existing signals or create one based on the initial input
export function useSignal<T>(input: T) {
  const instance = React.useMemo(
    () => (input instanceof Signal ? input : signal(input)),
    []
  )
  const [state, setState] = React.useState(instance.value)
  React.useEffect(
    () =>
      effect(() => {
        const newState = instance.value
        if (state !== newState) {
          setState(newState)
        }
      }),
    []
  )
  return instance
}

// Signal hook, can use existing signals or create one based on the initial input
export function useComputed<T>(input: () => T) {
  const instance = React.useMemo(() => computed(input), [])
  const [state, setState] = React.useState(instance.value)
  React.useEffect(
    () =>
      effect(() => {
        const newState = instance.value
        if (state !== newState) {
          setState(newState)
        }
      }),
    []
  )
  return instance
}

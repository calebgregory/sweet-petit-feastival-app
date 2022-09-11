import React, { createContext, useContext } from "react"

import { core, Core } from "./core"

const CoreContext = createContext<null | Core>(null)

export function useCore() {
  const _core = useContext(CoreContext)

  if (!_core) {
    throw new Error(
      "core cannot be null, please wrap your app in the the CoreProvider"
    )
  }

  return _core
}

export function CoreProvider({ children }: { children: React.ReactNode }) {
  return <CoreContext.Provider value={core()}>{children}</CoreContext.Provider>
}

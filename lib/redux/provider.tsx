"use client"

import { Provider } from "react-redux"
import { store } from "./store"
import { ToastProvider } from "@radix-ui/react-toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}


import { createContext, useContext } from 'react'

export type PrivacyContextValue = { privacy: boolean; toggle: () => void }

export const PrivacyContext = createContext<PrivacyContextValue>({ privacy: false, toggle: () => {} })

export function usePrivacy(): PrivacyContextValue {
  return useContext(PrivacyContext)
}

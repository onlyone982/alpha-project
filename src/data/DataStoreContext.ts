import { createContext, useContext } from 'react'
import type { DataStore } from './store'

export const DataStoreContext = createContext<DataStore | null>(null)

/** 현재 로그인 사용자의 저장소. 로그인 전이면 null */
export function useStore(): DataStore | null {
  return useContext(DataStoreContext)
}

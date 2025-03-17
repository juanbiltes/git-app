import { useQueryParam } from './useQueryParam'

export type ProfileTab = 'followers' | 'repositories' | 'following' | undefined

export function useProfileTab() {
  const [tab, setTab] = useQueryParam('tab')
  
  const setProfileTab = (newTab: ProfileTab) => {
    setTab(newTab || '')
  }

  return [tab as ProfileTab, setProfileTab] as const
} 
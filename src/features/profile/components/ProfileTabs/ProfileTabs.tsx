import { GithubUser } from '~/types/Users'
import styles from './ProfileTabs.module.css'
import clsx from 'clsx'
import { ProfileTab, useProfileTab } from '~/common/hooks/useProfileTab'
import { TabContent } from '../TabContent'


function TabsButtons() {
    const [activeTab, setActiveTab] = useProfileTab()
  
    const handleTabChange = (tab: ProfileTab) => {
      setActiveTab(tab === activeTab ? undefined : tab)
    }
  
    const isActive = (tab: string) => activeTab === tab

    
    return (
        <div className={styles.tabs} role="tablist">
        <button 
          onClick={() => handleTabChange('followers')}
          className={clsx(styles.tab, isActive('followers') && styles.active)}
          role="tab"
          aria-selected={isActive('followers')}
        >
          Followers
        </button>
        <button 
          onClick={() => handleTabChange('repositories')}
          className={clsx(styles.tab, isActive('repositories') && styles.active)}
          role="tab"
          aria-selected={isActive('repositories')}
        >
          Repositories
        </button>
        <button 
          onClick={() => handleTabChange('following')}
          className={clsx(styles.tab, isActive('following') && styles.active)}
          role="tab"
          aria-selected={isActive('following')}
        >
          Following
        </button>
      </div>
    )
}
interface ProfileTabsProps {
  user: GithubUser
}

export function ProfileTabs({ user }: ProfileTabsProps) {
  return (
    <>
        <TabsButtons />
        <TabContent user={user} />
    </>
  )
} 
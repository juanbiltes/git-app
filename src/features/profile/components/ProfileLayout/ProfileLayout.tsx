import { GithubUser } from '~/types/Users'
import { ProfileInfo, ProfileTabs, ProfileCard } from '..'
import { UserAvatar } from '~/common/components/UserAvatar'
import PageContainer from '~/common/components/PageContainer'

interface ProfileLayoutProps {
  user: GithubUser
  children?: React.ReactNode
}

export function ProfileLayout({ user, children }: ProfileLayoutProps) {
  return (
    <PageContainer>
      <ProfileCard>
        <UserAvatar username={user.login} src={user.avatar_url} withFavorite />
        <ProfileInfo user={user} />
        <ProfileTabs user={user} />
      </ProfileCard>
      {children}
    </PageContainer>
  )
} 
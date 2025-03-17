import { ApiError } from '~/types/errors';
import { GithubUser } from '~/types/Users';
import { ApiErrorMessage } from '~/components/shared/ApiErrorMessage';
import { ProfileInfo, ProfileTabs, ProfileCard } from './components'
import { UserAvatar } from '~/common/components/UserAvatar'
import PageContainer from '~/common/components/PageContainer'

interface ProfileFeatureProps {
  readonly user?: GithubUser;
  readonly error?: ApiError;
}

export function ProfileFeature({ user, error }: ProfileFeatureProps): JSX.Element|null {
  if (error) {
    return <ApiErrorMessage error={error} />;
  }

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <ProfileCard>
        <UserAvatar username={user.login} src={user.avatar_url} withFavorite />
        <ProfileInfo user={user} />
        <ProfileTabs user={user} />
      </ProfileCard>
    </PageContainer>
  );
} 
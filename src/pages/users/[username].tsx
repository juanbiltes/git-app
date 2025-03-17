import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ProfileFeature } from '~/features/profile/ProfileFeature';
import { getUser } from '~/services/githubClient';
import { GithubUser } from '~/types/Users';
import { API_ERROR_TYPES, ApiError, WithApiErrorProps } from '~/types/errors';

interface ProfilePageProps extends WithApiErrorProps {
  readonly user?: GithubUser;
}

export default function ProfilePage({ user, error }: ProfilePageProps): JSX.Element {
  return <ProfileFeature user={user} error={error} />;
}

export const getServerSideProps = (
  async (context: GetServerSidePropsContext) => {
    const username = context.params?.username as string;

    try {
      const user = await getUser(username);
      return { props: { user } };
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'type' in error) {
        const apiError = error as ApiError;
        if (apiError.type === API_ERROR_TYPES.RATE_LIMIT) {
          return { props: { error: apiError } };
        }
      }
      return { notFound: true };
    }
  }
) satisfies GetServerSideProps<ProfilePageProps>
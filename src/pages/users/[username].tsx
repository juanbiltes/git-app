import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import PageContainer from '~/common/components/PageContainer';
import Profile from '~/features/profile/ProfileFeature';
import { getUser } from '~/services/githubClient';
import { GithubUser } from '~/types/Users';

interface PageProps {
    user: GithubUser
}

const ProfilePage = ({ user }: PageProps) => {
    return (
        <PageContainer>
            <Profile user={user} />
        </PageContainer>
    );
};

interface Props {
    user: GithubUser | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
    const username = context.params?.username as string;

    let user = null;
    if (username) {
        user = await getUser(username); 
    }

    return {
        props: {
            user,
        },
    };
};

export default ProfilePage;
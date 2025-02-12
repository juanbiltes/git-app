import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Profile from '~/features/profile/ProfileFeature';
import githubClient from '~/services/github/GithubClient';
import { GithubUser } from '~/types/Users';

interface PageProps {
    user: GithubUser
}

const ProfilePage = ({ user }: PageProps) => {
    return (
        <div>
            <Profile user={user} />
        </div>
    );
};

interface Props {
    user: GithubUser | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
    const username = context.params?.username as string;

    let user = null;
    if (username) {
        user = await githubClient.users.getUser(username); 
    }

    return {
        props: {
            user,
        },
    };
};

export default ProfilePage;
const endpoints: { [key: string]: any } = {
    users: '/users',
    user: (loginId: string) => `/users/${loginId}`,
    searchUsers: '/search/users',
  };

export default endpoints;
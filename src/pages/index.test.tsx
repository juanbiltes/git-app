import { render } from '@testing-library/react';
import HomePage from './index';
import Users from '~/features/users/UsersFeature';

jest.mock('~/features/users/UsersFeature', () => ({
  __esModule: true,
  default: jest.fn(() => null)
}));

describe('HomePage', () => {
  it('should render Users component', () => {
    render(<HomePage />);
    
    expect(Users).toHaveBeenCalled();
  });
}); 
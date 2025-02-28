import { render } from '@testing-library/react';
import HomePage from './index';
import Users from '~/features/Search/SearchFeature';

jest.mock('~/features/Search/SearchFeature', () => ({
  __esModule: true,
  default: jest.fn(() => null)
}));

describe('HomePage', () => {
  it('should render Users component', () => {
    render(<HomePage />);
    
    expect(Users).toHaveBeenCalled();
  });
}); 
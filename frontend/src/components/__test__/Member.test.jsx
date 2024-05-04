import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../store/AuthContext';
import Member from '../Member';
import axios from 'axios';
import { waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';

vi.mock('react-router-dom', async () => {
    const actualModule = await vi.importActual('react-router-dom');
    return {
      ...actualModule,
      useNavigate: vi.fn(() => vi.fn()), 
        };
     });

describe('Member Component', () => {
    let mockNavigate;
  // Mock axios
  const mock = new MockAdapter(axios);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  beforeEach(() => {
    // Mock auth context and axios
    mock.onPatch(`${apiBaseUrl}/api/groups/remove-member/1`).reply(200, {
      message: 'Member removed successfully'
    });
    mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);   


  });

  afterEach(() => {
    mock.reset();
  });

  it('should render member profile information', () => {
    const { container } = render(
      <MemoryRouter>
        <AuthProvider>
          <Member
            username="John Doe"
            avatar="path/to/avatar.jpg"
            memberId="123"
            ownerId="456"
            isCurrentUserHost={true}
            groupId="1"
            onMemberHandler={() => {}}
          />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(container.querySelector('img').src).toContain('path/to/avatar.jpg');
  });

  it('should navigate to user profile on view button click', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Member
            username="John Doe"
            avatar="path/to/avatar.jpg"
            memberId="123"
            ownerId="456"
            isCurrentUserHost={true}
            groupId="1"
            onMemberHandler={() => {}}
          />
        </AuthProvider>
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('View'));
    expect(mockNavigate).toHaveBeenCalledWith(`/user/profile/123`);
  });

  it('should display delete button for hosts and allow deletion', async () => {
    const mockHandler = vi.fn();
    const { getByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <Member
            username="John Doe"
            avatar="path/to/avatar.jpg"
            memberId="123"
            ownerId="456"
            isCurrentUserHost={true}
            groupId="1"
            onMemberHandler={mockHandler}
          />
        </AuthProvider>
      </MemoryRouter>
    );
    const deleteButton = getByText('Delete');
    expect(deleteButton).toBeInTheDocument();
    global.confirm = vi.fn(() => true); // Mock confirmation dialog to return 'true'
    fireEvent.click(deleteButton);
  
    // Wait for promises to resolve
    await waitFor(() => {
      expect(mockHandler).toHaveBeenCalledWith("123", "remove");
      expect(mock.history.patch.length).toBe(1);
      expect(mock.history.patch[0].url).toBe(`${apiBaseUrl}/api/groups/remove-member/1`);
    });
  });
});

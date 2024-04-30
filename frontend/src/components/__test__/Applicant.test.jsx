import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Applicant from '../Applicant';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mocking axios
const mockAxios = new MockAdapter(axios);
const API_BASE_URL = process.env.VITE_API_BASE_URL

describe('Applicant Component', () => {
  // Mock data
  const props = {
    username: 'TestUser',
    message: 'This is a test message',
    avatar: 'test-avatar.jpg',
    isHost: true,
    applicationId: '123',
    onApplicationHandled: vi.fn(),
  };

  // Setup mock API responses and mock alert
  beforeEach(() => {
    mockAxios.onPatch(`${API_BASE_URL}/api/application/applications-with-details/${props.applicationId}`).reply(200, {
      message: "Application status updated successfully"
    });
    window.alert = vi.fn(); // Mock the alert function
  });

  afterEach(() => {
    mockAxios.reset();
    vi.restoreAllMocks(); // Restore all mocks to their original value
  });

  it('renders correctly', () => {
    const { getByText, getByAltText } = render(
      <MemoryRouter>
        <Applicant {...props} />
      </MemoryRouter>
    );
    expect(getByText(props.username)).toBeInTheDocument();
    expect(getByAltText('avatar')).toBeInTheDocument();
  });

  it('handles accept action correctly', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Applicant {...props} />
      </MemoryRouter>
    );
    const acceptButton = getByText('Allow');
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(props.onApplicationHandled).toHaveBeenCalledWith(props.applicationId, 'accepted');
      expect(window.alert).toHaveBeenCalledWith('Application accepted successfully!');
    });
  });

  it('handles reject action correctly', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Applicant {...props} />
      </MemoryRouter>
    );
    const rejectButton = getByText('Reject');
    fireEvent.click(rejectButton);

    await waitFor(() => {
      expect(props.onApplicationHandled).toHaveBeenCalledWith(props.applicationId, 'rejected');
      expect(window.alert).toHaveBeenCalledWith('Application rejected successfully!');
    });
  });

  it('displays an error message on API failure', async () => {
    mockAxios.onPatch(`${API_BASE_URL}/api/application/applications-with-details/${props.applicationId}`).networkError();
    const { getByText } = render(
      <MemoryRouter>
        <Applicant {...props} />
      </MemoryRouter>
    );
    const acceptButton = getByText('Allow');
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Failed to accept application:/));
    });
  });
});

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { AuthProvider } from '../../store/AuthContext';
import Applicant from '../Applicant';

// Create axios mock
const mockAxios = new MockAdapter(axios);

// Common setup for all tests
beforeEach(() => {
  mockAxios.reset();
  mockAxios.onGet(`${import.meta.env.VITE_API_BASE_URL}/auth/check-session`).reply(200, {
    isLoggedIn: true,
    user: { id: 1, name: 'John Doe' }
  });
});

function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Applicant Component', () => {
  it('renders correctly with minimum props', async () => {
    renderWithProviders(<Applicant username="John Doe" avatar="url-to-avatar" applicationId="1" userId="2" isHost={true} onApplicationHandled={vi.fn()} onMemberHandler={vi.fn()} />);
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).toBeTruthy();  // Checking if text is in the document
  
      // Get the image element and check the 'src' attribute manually
      const image = screen.getByRole('img');
      expect(image).toBeTruthy();  // Ensure the image element is found
      expect(image.getAttribute('src')).toBe('url-to-avatar');  // Manually check the 'src' attribute
    });
  });
  

  it('handles accept application correctly', async () => {
    const applicationId = "1";
    const handleApplicationHandled = vi.fn();
    const handleMemberHandler = vi.fn();
    
    mockAxios.onPatch(`${import.meta.env.VITE_API_BASE_URL}/api/application/applications-with-details/${applicationId}`).reply(200, {
      message: "Accepted"
    });

    renderWithProviders(
      <Applicant
        username="John Doe"
        avatar="url-to-avatar"
        applicationId={applicationId}
        userId="2"
        isHost={true}
        onApplicationHandled={handleApplicationHandled}
        onMemberHandler={handleMemberHandler}
      />
    );

    fireEvent.click(screen.getByText('Allow'));
    await waitFor(() => {
      expect(handleApplicationHandled).toHaveBeenCalledWith(applicationId);
      expect(handleMemberHandler).toHaveBeenCalledWith(applicationId, 'add');
    });
  });

  it('handles reject application correctly', async () => {
    const applicationId = "1";
    const handleApplicationHandled = vi.fn();
    
    mockAxios.onPatch(`${import.meta.env.VITE_API_BASE_URL}/api/application/applications-with-details/${applicationId}`).reply(200, {
      message: "Rejected"
    });

    renderWithProviders(
      <Applicant
        username="John Doe"
        avatar="url-to-avatar"
        applicationId={applicationId}
        userId="2"
        isHost={true}
        onApplicationHandled={handleApplicationHandled}
      />
    );

    fireEvent.click(screen.getByText('Reject'));
    await waitFor(() => {
      expect(handleApplicationHandled).toHaveBeenCalledWith(applicationId);
    });
  });
});

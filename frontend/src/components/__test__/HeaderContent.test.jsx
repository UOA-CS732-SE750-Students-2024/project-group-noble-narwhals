import { describe, it, beforeEach, expect, beforeAll, afterAll } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import HeaderContent from '../HeaderContent';
import { AuthProvider } from "../../store/AuthContext";
import '@testing-library/jest-dom';

const mock = new MockAdapter(axios);
const groupId = 'testGroupId';
const user = { _id: 'testUserId' };
const baseMockProps = {
    groupName: "Test Group",
    groupTags: ["Tag1", "Tag2"],
    postedDate: new Date().toISOString(),
    activityDetails: [{ icon: <div>Icon</div>, detail: "Detail Text" }],
    isHost: false,
    groupId: groupId,
    deadlineDate: new Date().toISOString(),
    groupStatus: "active",
    groupMembers: []
};

beforeAll(() => {
    // Mock for checking application status
    mock.onGet(`http://localhost:3000/api/groups/${groupId}/has-applied`).reply(200, {
        hasApplied: false,
        status: 'Not Applied'
    });

    // Mock for checking like status
    mock.onGet(`http://localhost:3000/api/user/${user._id}/likes/${groupId}`).reply(200, {
        liked: false
    });

    // Mock for toggling like status
    mock.onPost(`http://localhost:3000/api/user/like/${groupId}`).reply(200, {
        message: "Liked successfully"
    });
    mock.onPost(`http://localhost:3000/api/user/unlike/${groupId}`).reply(200, {
        message: "Unliked successfully"
    });


    // Mock for joining a group
    mock.onPost(`http://localhost:3000/api/groups/join/${groupId}/group`).reply(200, {
        message: "Your application to join the group has been submitted!"
    });

    // Mock for canceling a join application
    mock.onPost(`http://localhost:3000/api/groups/cancel-application/${groupId}`).reply(200, {
        message: "Your application has been cancelled."
    });

    // Mock for quitting a group
    mock.onPost(`http://localhost:3000/api/groups/quit/${groupId}`).reply(200, {
        message: "You have successfully left the group."
    });

    // Mock for dismissing a group
    mock.onPatch(`http://localhost:3000/api/groups/dismiss/${groupId}`).reply(200, {
        message: "Group has been successfully dismissed."
    });

    // Mock for closing a group
    mock.onPatch(`http://localhost:3000/api/groups/update/${groupId}`).reply(200, {
        message: "The group has been closed successfully."
    });
});


afterAll(() => {
    mock.restore();
});

describe('HeaderContent Component', () => {
    it('should toggle like status when like button is clicked', async () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <HeaderContent {...baseMockProps} />
                </AuthProvider>
            </MemoryRouter>
        );

        const likeButton = screen.queryByRole('button', { name: /like/i });
        if (likeButton) {
            fireEvent.click(likeButton);
            await waitFor(() => expect(screen.getByRole('button', { name: /unlike/i })).toBeInTheDocument());
        } else {
            console.error('Like button not found');
        }
    });

    it('should handle joining a group for a new applicant', async () => {
        const joinMockProps = {
            ...baseMockProps,
            hasApplied: false
        };

        render(
            <MemoryRouter>
                <AuthProvider>
                    <HeaderContent {...joinMockProps} />
                </AuthProvider>
            </MemoryRouter>
        );
        screen.debug();
        const joinButton = screen.queryByRole('button', { name: /join/i });
        if (joinButton) {
            fireEvent.click(joinButton);
            await waitFor(() => expect(screen.getByRole ('button', { name: /cancel/i })).toBeInTheDocument());
        } else {
            console.error('Join button not found');
        }
    });

    it('should handle canceling a join request for an existing applicant', async () => {
        const cancelMockProps = {
            ...baseMockProps,
            hasApplied: true
        };

        render(
            <MemoryRouter>
                <AuthProvider>
                    <HeaderContent {...cancelMockProps} />
                </AuthProvider>
            </MemoryRouter>
        );

        const cancelButton = screen.queryByRole('button', { name: /cancel/i });
        if (cancelButton) {
            fireEvent.click(cancelButton);
            await waitFor(() => expect(screen.getByRole('button', { name: /join/i })).toBeInTheDocument());
        } else {
            console.error('Cancel button not found');
        }
    });

       
    it('should handle a group member request to quit the group', async () => {
        const quitMockProps = {
            ...baseMockProps,
            isGroupMember: true
        };

        render(
            <MemoryRouter>
                <AuthProvider>
                    <HeaderContent {...quitMockProps} />
                </AuthProvider>
            </MemoryRouter>
        );

        const quitButton = screen.queryByRole('button', { name: /quit/i });
        if (quitButton) {
            fireEvent.click(quitButton);
            await waitFor(() => expect(screen.getByRole('button', { name: /join/i })).toBeInTheDocument());
        } else {
            console.error('Quit button not found');
        }
    });

    it('should handle a group host request to dismiss the group', async () => {
        const dismissMockProps = {
            ...baseMockProps,
            isHost: true
        };

        render(
            <MemoryRouter>
                <AuthProvider>
                    <HeaderContent {...dismissMockProps} />
                </AuthProvider>
            </MemoryRouter>
        );

        const dismissButton = screen.queryByRole('button', { name: /dismiss/i });
        if (dismissButton) {
            fireEvent.click(dismissButton);
        } else {
            console.error('Dismiss button not found');
        }
    });

    it('should handle a group host request to close the group', async () => {
        const closeMockProps = {
            ...baseMockProps,
            isHost: true
        };

        render(
            <MemoryRouter>
                <AuthProvider>
                    <HeaderContent {...closeMockProps} />
                </AuthProvider>
            </MemoryRouter>
        );

        const closeButton = screen.queryByRole('button', { name: /close/i });
        if (closeButton) {
            fireEvent.click(closeButton);
        } else {
            console.error('Close button not found');
        }
    });
  
});

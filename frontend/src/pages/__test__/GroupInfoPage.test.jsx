import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../store/AuthContext';
import GroupInfoPage from '../group/GroupInfoPage';

// 设置 Mock Adapter
const axiosMock = new MockAdapter(axios);
const groupId = '1'; // 假设这是你想测试的群组ID

describe('GroupInfoPage Tests', () => {
  beforeEach(() => {
    // 设置 axios mock 响应
    axiosMock.onGet(`http://localhost:3000/api/groups/${groupId}/detail`).reply(200, {
      groupName: 'Study Group',
      createDate: '2022-01-01T00:00:00.000Z',
      deadlineDate: '2022-02-01T00:00:00.000Z',
      groupTags: [{ name: 'Education' }],
      groupMembers: [
        { _id: '123', name: 'John Doe', avatar: 'url_to_avatar' }
      ],
      groupDescription: 'Description of the study group',
      groupApplicants: [
        { 
          _id: '13', 
          applicantId: { 
            name: 'Jane Doe', 
            avatar: 'url_to_avatar2' 
          }, 
        }
      ],
      application: [
        { 
          _id: '1', 
          applicantId: { 
            name: 'Jane Doe', 
            avatar: 'url_to_avatar2' 
          }, 
          message: 'I want to join this group',
        }
      ],
      ownerId: { _id: '123', name: 'John Doe', avatar: 'url_to_avatar' }
    });
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it('renders group details and interacts with page elements', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={[`/groups/${groupId}`]}>
          <Routes>
            <Route path="/groups/:groupId" element={<GroupInfoPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    const groupName = await screen.findByText('Study Group');
    expect(groupName).toBeInTheDocument();
    
    const groupDescription = await screen.findByText('Description of the study group');
    expect(groupDescription).toBeInTheDocument();
  
    const educationTag = await screen.findByText('Education');
    expect(educationTag).toBeInTheDocument();
  
    const johnDoe = await screen.findByText('John Doe');
    expect(johnDoe).toBeInTheDocument(); 
  
    const avatars = await screen.findAllByAltText('avatar');
    expect(avatars.length).toBeGreaterThanOrEqual(1);
  
    const janeDoe = await screen.findByText('Jane Doe');
    expect(janeDoe).toBeInTheDocument(); 
  
    const message = await screen.findByText('I want to join this group');
    expect(message).toBeInTheDocument();
  
  });
});

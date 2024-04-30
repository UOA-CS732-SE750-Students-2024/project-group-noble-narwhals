import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import UserPageSideBar from "../UserPageSideBar";
import { AuthProvider } from "../../store/AuthContext";

let axiosMock;

beforeEach(() => {
  axiosMock = new MockAdapter(axios);
});

afterEach(() => {
  axiosMock.reset();
  vi.restoreAllMocks(); // vitest的vi对象用于处理mocks和spies
});

describe("UserPageSideBar Component", () => {
  it("renders user details correctly", async () => {
    axiosMock.onGet(`${import.meta.env.VITE_API_BASE_URL}/api/user/userData/1`).reply(200, {
      name: 'Test User',
      avatar: '/path-to-avatar.jpg',
      _id: '1'
    });

    render(
      <AuthProvider value={{ isLoggedIn: true, user: { _id: '1' } }}>
        <MemoryRouter initialEntries={['/user/profile/1']}>
          <UserPageSideBar />
        </MemoryRouter>
      </AuthProvider>
    );

    await screen.findByText('Test User'); 
    expect(screen.getByAltText("Test User's Avatar")).toHaveAttribute('src', '/path-to-avatar.jpg');
  });

  it("displays appropriate navigation options for own profile", () => {
    render(
      <AuthProvider value={{ isLoggedIn: true, user: { _id: '1' } }}>
        <MemoryRouter initialEntries={['/user/profile/1']}>
          <UserPageSideBar />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Account settings')).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    axiosMock.onGet(`${import.meta.env.VITE_API_BASE_URL}/api/user/userData/2`).networkError();

    render(
      <AuthProvider value={{ isLoggedIn: false }}>
        <MemoryRouter initialEntries={['/user/profile/2']}>
          <UserPageSideBar />
        </MemoryRouter>
      </AuthProvider>
    );

 
  });
});

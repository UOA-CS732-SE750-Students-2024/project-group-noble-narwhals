// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.observations = [];
  }

  observe(target, options) {
    this.observations.push({ target, options });
    this.callback(
      [{ target, contentRect: target.getBoundingClientRect() }],
      this
    );
  }

  unobserve(target) {
    this.observations = this.observations.filter(
      (obs) => obs.target !== target
    );
  }

  disconnect() {
    this.observations = [];
  }
};

import "@testing-library/jest-dom";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { MemoryRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import HomePage from "../HomePage";
import { AuthProvider } from "../../store/AuthContext";
import userEvent from "@testing-library/user-event";

let axiosMock;

beforeEach(() => {
  axiosMock = new MockAdapter(axios);
  axiosMock.onGet(`${process.env.VITE_API_BASE_URL}/api/group`).reply(200, [
    // Mock data for group API response
    {
      _id: "1",
      groupName: "Study Group",
      groupType: "group",
      groupStatus: "available",
      deadlineDate: "2023-05-01T23:59:59.999Z",
      groupMembers: ["user1", "user2"],
      groupDescription: "A study group for math and science topics",
      groupTags: ["Math", "Science"],
      maxNumber: 10,
      likeNumber: 2,
    },
    {
      _id: "2",
      groupName: "Workshop",
      groupType: "activity",
      groupStatus: "available",
      deadlineDate: "2023-05-02T23:59:59.999Z",
      groupMembers: ["user3", "user4"],
      groupDescription: "Workshop for DIY enthusiasts",
      groupTags: ["Workshop", "DIY"],
      maxNumber: 20,
      likeNumber: 3,
    },
  ]);

  axiosMock
    .onGet(`${process.env.VITE_API_BASE_URL}/api/tag`)
    .reply(200, ["Math", "Science", "Art"]);
});

afterEach(() => {
  axiosMock.reset();
});

// Mock data that your component expects
const mockAuth = {
  isLoggedIn: true,
  user: { name: "Test User", id: "1" },
  updateAuth: vi.fn(),
};
const MockProvider = ({ children }) => (
  <AuthProvider value={mockAuth}>
    <MemoryRouter>{children}</MemoryRouter>
  </AuthProvider>
);
describe("HomePage", () => {
  it("renders the home page correctly", async () => {
    render(<HomePage />, { wrapper: MockProvider });
    expect(screen.getByText("Need Group/ Activities?")).toBeInTheDocument();
    expect(
      screen.getByText("Type in the group name, course name, find your group!")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();

    const studyGroups = await screen.findAllByText("Study Group");
    expect(studyGroups.length).toBeGreaterThan(0);

    studyGroups.forEach((group) => {
      expect(group).toBeInTheDocument();
    });
  });

  it("handles search input and redirects on form submission", async () => {
    const history = createMemoryHistory();
    const { getByPlaceholderText } = render(
      <AuthProvider value={mockAuth}>
        <Router navigator={history} location={history.location}>
          <HomePage />
        </Router>
      </AuthProvider>
    );

    const searchInput = getByPlaceholderText("Search");
    await userEvent.type(searchInput, "Math");
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });

    // Assume redirect happens to '/search' path
    await waitFor(() => {
      expect(history.location.pathname).toBe("/search");
    });
  });

  it("displays group and activity galleries after data fetch", async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </AuthProvider>
    );

    // Wait for the data to be fetched and the component to update
    const studyGroups = await screen.findAllByText(
      "Study Group",
      {},
      { timeout: 5000 }
    );
    expect(studyGroups.length).toBeGreaterThan(0);
    studyGroups.forEach((sg) => {
      expect(sg).toBeInTheDocument();
    });

    const workshops = await screen.findAllByText(
      "Workshop",
      {},
      { timeout: 5000 }
    );
    expect(workshops.length).toBeGreaterThan(0);
    workshops.forEach((ws) => {
      expect(ws).toBeInTheDocument();
    });
  });
});

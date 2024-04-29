import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import CreatGroupPage from "../group/CreateGroupPage";
import { AuthProvider } from "../../store/AuthContext";

let axiosMock;

//before all test, create a new instance of MockAdapter
beforeAll(() => {
  axiosMock = new MockAdapter(axios);
});

//after each test, reset the mock
afterEach(() => {
  axiosMock.reset();
});

describe("Create group Page test", () => {
  it("Render Create group page correctly ", () => {
    const { getByText, queryByAltText } = render(
      <AuthProvider>
        <MemoryRouter>
          <CreatGroupPage />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(getByText("Create A New Group/Activity")).toBeInTheDocument();
    expect(getByText("Title")).toBeInTheDocument();
    expect(getByText("Due Date")).toBeInTheDocument();
    expect(getByText("Tags")).toBeInTheDocument();
  });

  it(" Create group function wrong by not fill all fields", () => {
    const { getByText, queryByAltText, get } = render(
      <AuthProvider>
        <MemoryRouter>
          <CreatGroupPage />
        </MemoryRouter>
      </AuthProvider>
    );

    const titleInput = screen.getByPlaceholderText("Enter a title");
    const typeButton = getByText("Group");
    const createButton = getByText("Create");

    fireEvent.change(titleInput, { target: { value: "732" } });
    fireEvent.click(typeButton);
    fireEvent.click(createButton);

    //create will fail because of missing fields
    expect(getByText("Please fill out all fields")).toBeInTheDocument();
  });

  it(" Create group function works correctly ", async () => {
    const context = {
      isLoggedIn: true,
      user: { _id: "123", avatar: "test", name: "Bob" },
    };

    //mock check-session api
    axiosMock
      .onGet(`${import.meta.env.VITE_API_BASE_URL}/auth/check-session`)
      .reply(201, context);

    const data = {
      _id: "1",
      title: "test",
      description: "test",
      tags: ["test"],
      dueDate: "2022-12-12",
      type: "group",
      members: 6,
    };

    axiosMock
      .onPost(`${import.meta.env.VITE_API_BASE_URL}/api/groups/creategroup`)
      .reply(201, data);

    const { getByText, getByPlaceholderText, getByTestId } = render(
      <AuthProvider>
        <MemoryRouter>
          <CreatGroupPage />
        </MemoryRouter>
      </AuthProvider>
    );

    const titleInput = screen.getByPlaceholderText("Enter a title");
    const typeButton = getByText("Group");
    const memberInput = getByPlaceholderText("0");
    const tagInput = getByPlaceholderText("Enter a tag");
    const addButton = getByText("Add");
    const descriptionInput = getByPlaceholderText(
      "Write a description of the group/activity"
    );
    const dueDateInput = getByTestId("dueDate");

    await userEvent.type(titleInput, "test");
    userEvent.click(typeButton);
    await userEvent.type(memberInput, "6");
    await userEvent.type(tagInput, "test");
    userEvent.click(addButton);
    await userEvent.type(descriptionInput, "test");
    await userEvent.type(dueDateInput, "2024-05-12");

    const createButton = getByText("Create");
    fireEvent.click(createButton);

    expect(await axiosMock.history.post.length).toBe(1);
  });
});

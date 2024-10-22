/**
 * Notes:
 * 1. if component contains Link, NavLink, Routes, Outlet, useLocation, useNavigate, useRouteMatch, you need to wrap it with MemoryRouter.
 * 2. if component contains useAuth, you need to wrap it with AuthProvider.
 * 3. if need to test axios, you need to mock axios with MockAdapter.
 */

import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../Navbar";
import { AuthProvider } from "../../store/AuthContext";

let axiosMock;

//before all test, create a new instance of MockAdapter
beforeAll(() => {
  axiosMock = new MockAdapter(axios);
});

//after each test, reset the mock
afterEach(() => {
  fireEvent.scroll(window, { target: { scrollY: 0 } });
  axiosMock.reset();
});

/**
 * Test for Navbar component
 */
describe("Navbar component", () => {
  it("Render <Navbar> ", () => {
    const { getByRole } = render(
      <AuthProvider >
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthProvider>
    );
    

    const nav = getByRole("navigation");
    expect(getByRole("navigation").children.length).toBe(1);
  });

  it("Search input display and function is ok", () => {
    const { getByPlaceholderText, queryByPlaceholderText } = render(
      <AuthProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(queryByPlaceholderText("Search")).toBeNull();

    fireEvent.scroll(window, { target: { scrollY: 330 } });
    expect(queryByPlaceholderText("Search")).toBeInTheDocument();

    // search bar should be displayed and can input
    const inputSearch = getByPlaceholderText("Search");
    expect(inputSearch).toBeInTheDocument();
    fireEvent.change(inputSearch, { target: { value: "test query" } });
    expect(inputSearch.value).toBe("test query");
  });

  it("Render correctly when user is not logged in", () => {
    render(
      <AuthProvider >
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthProvider>
    );

    //login & signup button should be displayed
    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();

    //logo should be displayed
    expect(screen.getAllByAltText("logo").length).toBeGreaterThan(1);
  });

  it("Render correctly when user is logged in", async () => {
    const context = {
      isLoggedIn: true,
      user: { _id: "123", avatar: "test", name: "Bob" },
    };

    //mock check-session api
    axiosMock
      .onGet(`${import.meta.env.VITE_API_BASE_URL}/auth/check-session`)
      .reply(201, context);

    const { findByText, findByAltText } = render(
      <AuthProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(await findByText("Create Group")).toBeInTheDocument();
    expect(await findByText("Notifications")).toBeInTheDocument();
    expect(await findByText(context.user.name)).toBeInTheDocument();
    expect(await findByAltText("Avator")).toBeInTheDocument();

    const avatar = await findByAltText("Avator");
    const parent = avatar.parentElement;

    //click avatar, dropdown should be displayed     
    fireEvent.click(parent);
    expect(await findByText("My profile")).toBeInTheDocument();
    expect(await findByText("Log out")).toBeInTheDocument();
  });
});

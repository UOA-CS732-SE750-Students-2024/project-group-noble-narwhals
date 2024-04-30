import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";
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

describe("App Router", () => {
  it("Render login page correctly ", () => {
    const { getByText } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(getByText("Log in with Google")).toBeInTheDocument();
    expect(getByText("Hey! Mate")).toBeInTheDocument();
  });

  it("Render Singup page correctly ", () => {
    const { getByText } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/signup"]}>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(getByText("Sign up with Google")).toBeInTheDocument();
    expect(getByText("Welcome! Mate")).toBeInTheDocument();
  });

  it("Render 404 page correctly ", () => {
    const { getByText } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/*"]}>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(getByText("404")).toBeInTheDocument();
  });

  it("Render Home page correctly ", () => {
    const { getByText, getByAltText } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(getByText("Need Group/ Activities?")).toBeInTheDocument();
    expect(getByText("Recommendation")).toBeInTheDocument();
    expect(getByText("Groups")).toBeInTheDocument();
    expect(getByText("Activities")).toBeInTheDocument();
    expect(getByAltText("Footer")).toBeInTheDocument();
  });

  it("Render Search page correctly ", () => {
    const { getByText, getByAltText } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/search"]}>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(getByText("group")).toBeInTheDocument();
    expect(getByText("activity")).toBeInTheDocument();
    expect(getByAltText("Footer")).toBeInTheDocument();

  });

  it("Render create group page correctly ", () => {
    const { getByText } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/creategroup"]}>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(getByText("Create A New Group/Activity")).toBeInTheDocument();
    expect(getByText("Title")).toBeInTheDocument();
    expect(getByText("Due Date")).toBeInTheDocument();
    expect(getByText("Tags")).toBeInTheDocument();
  });

 



});


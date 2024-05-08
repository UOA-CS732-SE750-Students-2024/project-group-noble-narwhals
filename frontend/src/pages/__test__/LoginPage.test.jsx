import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../LoginPage";

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

describe("Login Page test", () => {
  it("Render login page correctly ", () => {
    const { getByText, queryByAltText, queryAllByText} = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(getByText("Sign up with Google")).toBeInTheDocument();
    expect(queryAllByText("Sign up")).toBeTruthy();
    expect(queryAllByText("Log in")).toBeTruthy();
    expect(queryByAltText("Footer")).toBeNull();
  });
});
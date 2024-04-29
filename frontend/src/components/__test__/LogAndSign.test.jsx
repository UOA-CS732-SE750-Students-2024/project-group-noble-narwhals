import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import LogAndSign from "../LogAndSign";

let axiosMock;

//before all test, create a new instance of MockAdapter
beforeAll(() => {
  axiosMock = new MockAdapter(axios);
});

//after each test, reset the mock
afterEach(() => {
  axiosMock.reset();
});

describe("LogAndSign component", () => {
  it("Render Log in correctly ", () => {
    const { getByText, queryByText, getByAltText } = render(
      <LogAndSign loginType={true} />
    );

    expect(getByText("Hey! Mate")).toBeInTheDocument();
    expect(queryByText("Welcome! Mate")).toBeNull();
    expect(getByText("Log in with Google")).toBeInTheDocument();
    expect(getByAltText("logo")).toBeInTheDocument();
  });

  it("Render Sign up correctly ", () => {
    const { getByText, queryByText, getByAltText } = render(
      <LogAndSign loginType={false} />
    );

    expect(getByText("Welcome! Mate")).toBeInTheDocument();
    expect(queryByText("Hey! Mate")).toBeNull();
    expect(getByText("Sign up with Google")).toBeInTheDocument();
    expect(getByAltText("logo")).toBeInTheDocument();
  });

  it("log in function correctly ", async () => {
    const context = {
      isLoggedIn: true,
      user: { _id: "123", avatar: "test", name: "Bob" },
    };

    //mock check-session api
    axiosMock
      .onPost(`${import.meta.env.VITE_API_BASE_URL}/auth/login`)
      .reply(201, context);

    const { getByText, queryByText, getByAltText } = render(
      <LogAndSign loginType={true} />
    );

    expect(getByText("Log in with Google")).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("E-mail");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByText("Log in");

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    expect(await axiosMock.history.post.length).toBe(1);
    expect(await axiosMock.history.post[0].data).toBe(JSON.stringify({email:"user@example.com", password:"password"})) ;
  });
});

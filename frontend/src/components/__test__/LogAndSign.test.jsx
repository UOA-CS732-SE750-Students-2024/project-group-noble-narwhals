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
});

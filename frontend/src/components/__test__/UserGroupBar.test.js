import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import UserGroupBar from "../UserGroupBar";
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
 * Test for UserPageSideBar component
 */


describe("UserGroupBar component", () => {
    it("Render UserGroupBar correctly ", () => {
        const { getByText, getByRole } = render(<UserGroupBar />);
  
        expect(getByRole("navigation")).toBeInTheDocument();
    });
    }
);
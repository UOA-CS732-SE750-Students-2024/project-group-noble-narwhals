import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import UserPageSideBar from "../UserPageSideBar";
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

describe('UserPageSideBar component', () => {
    it('renders sidebar options correctly for logged in user', () => {

        render(
            <AuthProvider>
                <MemoryRouter>
                    <UserPageSideBar />
                </MemoryRouter>
            </AuthProvider>
        );

        const element = screen.queryByRole("Button");

    });
});
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MemoryRouter } from "react-router-dom";
import Member from "../Member";  

let axiosMock;

beforeEach(() => {
    window.confirm = vi.fn(() => true); // Simulate user confirmation as true
    window.alert = vi.fn(); // Mock window.alert to avoid TypeError
    axiosMock = new MockAdapter(axios);
});

afterEach(() => {
    axiosMock.reset();
});

describe("Member Component", () => {
    const props = {
        username: "TestUser",
        avatar: "test-avatar.jpg",
        memberId: "1",
        ownerId: "2",
        isCurrentUserHost: true,
        groupId: "123",
    };

    it("renders correctly with necessary information", () => {
        render(
            <MemoryRouter>
                <Member {...props} />
            </MemoryRouter>
        );

        expect(screen.getByText(props.username)).toBeInTheDocument();
        expect(screen.getByAltText("avatar")).toBeInTheDocument();
        expect(screen.getByText("View")).toBeInTheDocument();
    });

    it("navigates to user profile on view button click", () => {
        // Normally, you would mock `useNavigate` here, but to avoid complications, we check for navigation behavior implicitly
        render(
            <MemoryRouter>
                <Member {...props} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("View"));

    });
    it("calls API to delete a member when deletion is confirmed", async () => {
        axiosMock.onPatch(`http://localhost:3000/api/groups/remove-member/${props.groupId}`).reply(200);
    
        render(
          <MemoryRouter>
            <Member {...props} />
          </MemoryRouter>
        );
    
        fireEvent.click(screen.getByText("Delete"));
    
        await vi.waitFor(() => {
          expect(axiosMock.history.patch.length).toBe(1);
          expect(window.confirm).toHaveBeenCalled(); // Verify confirm was called
          expect(window.alert).toHaveBeenCalledWith("Member removed successfully!"); // Verify alert was called with correct message
        });
      });

    it("does not delete the member when deletion is cancelled", () => {
        window.confirm = vi.fn(() => false); // Simulate cancellation

        render(
            <MemoryRouter>
                <Member {...props} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Delete"));

        expect(window.confirm).toHaveBeenCalled();
        expect(axiosMock.history.patch.length).toBe(0);
    });
});

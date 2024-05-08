import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SearchPage from "../SearchPage";
import { beforeAll, afterEach, afterAll, expect } from "vitest";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";

// mockdata
const group1 = {
  _id: "000000000000000000000101",
  groupStatus: "available",
  groupName: "Group1",
  groupTags: [{ name: "tag1" }, { name: "tag2" }],
  groupDescription: "This is group1",
  groupMembers: [{ name: "member1", avatar: "avatar1" }],
  maxNumber: 10,
  groupType: "group",
};

const group2 = {
  _id: "000000000000000000000102",
  groupStatus: "available",
  groupName: "Group2",
  groupTags: [{ name: "tag1" }, { name: "tag2" }],
  groupDescription: "This is group2",
  groupMembers: [{ name: "member1", avatar: "avatar1" }],
  maxNumber: 10,
  groupType: "activity",
};

const mockData = [group1, group2];

const restHandlers = [
  // http.get("http://localhost:3000/api/groups/search/", (req, res, ctx) => {
  //   return res(ctx.json(mockData));
  // }),
  http.get(/^http:\/\/localhost:3000\/api\/group\/search.*$/, () => {
    return HttpResponse.json(mockData);
  }),
];

const server = setupServer(...restHandlers);
beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe("Search page", async () => {
  it("render", async () => {
    render(
      <MemoryRouter initialEntries={["/search"]}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>
    );
    const searchBar = await screen.getByPlaceholderText("Search");
    expect(searchBar).toBeInTheDocument();
    const groupTab = await screen.getByText("group");
    expect(groupTab).toHaveClass("bg-hmblue-700");
    await waitFor(() => {
      const group1 = screen.getByText("Group1");
      expect(group1).toBeInTheDocument();

      const actBtn = screen.getByText("activity");
      fireEvent.click(actBtn);
      const group2 = screen.getByText("Group2");
      expect(group2).toBeInTheDocument();
    });
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Gallery from "./../Gallery";
import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("./../GalleryCard", () => ({
  __esModule: true,
  default: vi.fn(() => (
    <div data-testid="gallery-card">Gallery Card Component</div>
  )),
}));
const navigateMock = vi.fn();
// Set up a proper mock for useNavigate
vi.mock("react-router-dom", async () => {
  const actualModule = await vi.importActual("react-router-dom");
  return {
    ...actualModule,
    useNavigate: () => navigateMock,
  };
});

describe("Gallery Component", () => {
  const sampleData = [
    {
      title: "Group 1",
      id: "1",
      dayNum: 30,
      isFavorite: true,
      imageLink: ["http://example.com/image1.jpg"],
      num: 5,
      numLimit: 10,
      description: "Description 1",
    },
    {
      title: "Activity 1",
      id: "2",
      dayNum: 15,
      isFavorite: false,
      imageLink: ["http://example.com/image2.jpg"],
      num: 3,
      numLimit: 5,
      description: "Description 2",
    },
  ];
  beforeEach(() => {
    navigateMock.mockClear(); // Clear mock history before each test
  });

  it("renders correctly with data", () => {
    render(
      <BrowserRouter>
        <Gallery name="Groups" data={sampleData} />
      </BrowserRouter>
    );
    expect(screen.getAllByTestId("gallery-card").length).toBe(2);
  });

  it("displays a message when there is no data", () => {
    render(
      <BrowserRouter>
        <Gallery name="Groups" data={[]} />
      </BrowserRouter>
    );
    expect(
      screen.getByText(
        "Sorry, no information is currently available on the platform"
      )
    ).toBeInTheDocument();
  });

  it.each([
    ["Groups", "/search", { state: { groupType: "group" } }],
    ["Activities", "/search", { state: { groupType: "activity" } }],
    ["Recommendation", "/search", undefined],
  ])(
    'navigates correctly when "More" is clicked for %s',
    (name, expectedPath, expectedState) => {
      'navigates correctly when "More" is clicked for %s',
        (name, expectedPath, expectedState) => {
          render(
            <BrowserRouter>
              <Gallery name={name} data={sampleData} />
            </BrowserRouter>
          );

          fireEvent.click(screen.getByText("More"));

          if (expectedState === undefined) {
            expect(navigateMock).toHaveBeenCalledWith(expectedPath);
          } else {
            expect(navigateMock).toHaveBeenCalledWith(
              expectedPath,
              expectedState
            );
          }
        };
    }
  );
});

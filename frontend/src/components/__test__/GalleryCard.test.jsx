import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import GalleryCard from "./../GalleryCard"; // Adjust the import path as necessary
import { describe, it, expect } from "vitest";
import React from "react";

describe("GalleryCard Component", () => {
  it("renders correctly with all props provided", () => {
    const mockProps = {
      title: "Test Gallery",
      id: "1",
      dayNum: 5,
      isFavorite: false,
      imageLink: ["url-to-image"],
      num: 5,
      numLimit: 10,
      description: "A brief description of the gallery.",
    };

    render(
      <Router>
        <GalleryCard {...mockProps} />
      </Router>
    );

    expect(screen.getByText(/Test Gallery/i)).toBeInTheDocument();
    expect(screen.getByText(/5 days left/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A brief description of the gallery./i)
    ).toBeInTheDocument();
  });

  it("toggles like status when the like button is clicked", async () => {
    const mockProps = {
      title: "Interactive Gallery",
      id: "2",
      dayNum: 10,
      isFavorite: true, // Initially liked
      imageLink: ["url-to-image"],
      num: 3,
      numLimit: 10,
      description: "Gallery with interactive test.",
      isLoggedIn: true,
    };

    render(
      <Router>
        <GalleryCard {...mockProps} />
      </Router>
    );

    const likeButton = screen.getByRole("button", { name: /like/i });
    await userEvent.click(likeButton);
    // Assuming the state update isn't instant and there's no API mock here, this is just an example
    // In actual test, mock axios and test the state before and after API call
    expect(likeButton).toHaveAttribute("aria-pressed", "false");
  });
});

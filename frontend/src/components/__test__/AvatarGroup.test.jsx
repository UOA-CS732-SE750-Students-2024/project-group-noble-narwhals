import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AvatarGroup from "../AvatarGroup"; // Adjust the path as necessary

describe("AvatarGroup Component", () => {
  const imageSources = [
    "http://example.com/image1.jpg",
    "http://example.com/image2.jpg",
    "http://example.com/image3.jpg",
  ];
  const imageSourcesOnlyOne = ["http://example.com/image1.jpg"];

  it("renders the correct number of images", () => {
    render(<AvatarGroup imageSources={imageSources} num={3} numLimit={5} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
  });

  it("displays the correct count and limit", () => {
    render(<AvatarGroup imageSources={imageSources} num={3} numLimit={5} />);
    const countText = screen.getByText((content, node) => {
      const hasText = (node) => node.textContent === "3/5";
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node.children).every(
        (child) => !hasText(child)
      );
      return nodeHasText && childrenDontHaveText;
    });
    expect(countText).toBeInTheDocument();
  });
  it("limits the number of images displayed to num if specified", () => {
    render(<AvatarGroup imageSources={imageSources} num={2} numLimit={5} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
  });
  it("shows the correct number of images when there is only the host", () => {
    render(
      <AvatarGroup imageSources={imageSourcesOnlyOne} num={1} numLimit={5} />
    );
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(1);
  });

  it("shows correct alternate text for images", () => {
    render(<AvatarGroup imageSources={imageSources} num={2} numLimit={5} />);
    const firstImage = screen.getByAltText("Avatar 1");
    const secondImage = screen.getByAltText("Avatar 2");
    expect(firstImage).toBeInTheDocument();
    expect(secondImage).toBeInTheDocument();
  });
});

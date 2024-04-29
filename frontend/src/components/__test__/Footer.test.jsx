import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer component", () => {
  it("Render Footer correctly ", () => {
    const { getByAltText, getByRole } = render(<Footer />);

    expect(getByAltText("Footer")).toBeInTheDocument();
    expect(getByRole("img")).toBeInTheDocument();
  });
});

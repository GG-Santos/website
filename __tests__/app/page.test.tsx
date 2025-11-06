import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Page from "@/app/page";

describe("Home Page", () => {
  test("renders without crashing", () => {
    render(<Page />);
    // Add your specific assertions here based on your page content
    expect(document.body).toBeInTheDocument();
  });
});

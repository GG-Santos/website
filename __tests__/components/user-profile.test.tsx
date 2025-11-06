import { UserProfile } from "@components/user-profile";
import { render, screen, waitFor } from "@test/test-utils";
import { delay, HttpResponse, http } from "msw";
import { describe, expect, test } from "vitest";
import { server } from "../../src/mocks/node";

describe("UserProfile", () => {
  test("renders loading state initially", () => {
    render(<UserProfile />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("renders user data after successful fetch", async () => {
    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("User ID: 1")).toBeInTheDocument();
  });

  test("renders error state when API fails", async () => {
    // Override the handler for this specific test
    server.use(
      http.get("/api/user", async () => {
        await delay(100);
        return HttpResponse.json(
          { error: "Failed to fetch user" },
          { status: 500 }
        );
      })
    );

    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    expect(screen.getByText("Failed to fetch user")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  test("renders edit and view profile buttons", async () => {
    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /view profile/i })
    ).toBeInTheDocument();
  });
});

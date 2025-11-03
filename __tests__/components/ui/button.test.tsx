import { Button } from "@shadcn/button"; // adjust path if needed
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

// Top-level regex constants for biome performance rule
const CLICK_ME_RE = /click me/i;
const DELETE_RE = /delete/i;
const I_RE = /^i$/i;
const GO_RE = /go/i;
const DISABLED_RE = /disabled/i;

describe("Button (shadcn-style)", () => {
  test("renders children and calls onClick when clicked", async () => {
    const handle = vi.fn();
    render(<Button onClick={handle}>Click me</Button>);

    const btn = screen.getByRole("button", { name: CLICK_ME_RE });
    expect(btn).toBeInTheDocument();

    await userEvent.click(btn);
    expect(handle).toHaveBeenCalledTimes(1);
  });

  test("applies variant classes (destructive) and size classes (icon)", () => {
    render(<Button variant="destructive">Delete</Button>);
    const destructiveBtn = screen.getByRole("button", { name: DELETE_RE });
    expect(destructiveBtn.className).toContain("bg-destructive");

    render(<Button size="icon">I</Button>);
    const iconBtn = screen.getByRole("button", { name: I_RE });
    expect(iconBtn.className).toContain("size-9");
  });

  test("asChild renders the provided element (e.g. <a>)", () => {
    render(
      <Button asChild>
        <a href="/foo">Go</a>
      </Button>
    );

    const link = screen.getByRole("link", { name: GO_RE });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/foo");
  });

  test("disabled prevents clicks and adds disabled attribute", async () => {
    const handle = vi.fn();
    render(
      <Button disabled onClick={handle}>
        Disabled
      </Button>
    );
    const btn = screen.getByRole("button", { name: DISABLED_RE });
    expect(btn).toBeDisabled();

    await userEvent.click(btn);
    expect(handle).not.toHaveBeenCalled();
  });
});

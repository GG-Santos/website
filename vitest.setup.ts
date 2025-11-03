// vitest.setup.ts
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

// --- MSW (node) ---
import { server } from "@/mocks/node";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

vi.mock("next/navigation", async () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// src/mocks/handlers.ts
import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("https://api.example.com/user", () =>
    HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    })
  ),
];

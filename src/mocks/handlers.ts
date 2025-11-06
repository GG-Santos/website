import { delay, HttpResponse, http } from "msw";

// Example handlers - customize these for your API endpoints
export const handlers = [
  // Example GET request
  http.get("/api/user", async () => {
    await delay(100);
    return HttpResponse.json({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    });
  }),

  // Example POST request
  http.post("/api/user", async ({ request }) => {
    const data = await request.json();
    await delay(100);
    return HttpResponse.json(
      {
        id: "2",
        ...data,
      },
      { status: 201 }
    );
  }),

  // Example error response
  http.get("/api/error", async () => {
    await delay(100);
    return HttpResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }),
];

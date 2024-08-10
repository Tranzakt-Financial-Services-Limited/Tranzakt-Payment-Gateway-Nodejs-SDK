import { ApiError } from "../src";
import { requestProcessor } from "../src/request-processor";

describe("Test request processor", () => {
  const mockUrl = "/test-endpoint";

  it("should process a successful request", async () => {
    const mockResponse = { success: true };

    // Mock the fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    ) as jest.Mock;

    const response = await requestProcessor({
      url: mockUrl,
      method: "POST",
      data: { key: "value" },
    });

    expect(response).toEqual(mockResponse);
  });

  it("should handle a 400 Bad Request error", async () => {
    const mockError: ApiError = {
      status: 400,
      message:
        "The data you provided is not properly formatted. Please check for errors and try again.",
      type: "BadRequest",
      errors: [
        "The data you provided is not properly formatted. Please check for errors and try again.",
      ],
    };

    // Mock the fetch API to return a 400 error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      } as Response)
    ) as jest.Mock;

    await expect(
      requestProcessor({
        url: mockUrl,
        method: "POST",
        data: { key: "value" },
      })
    ).rejects.toEqual(mockError);
  });

  it("should handle a network error", async () => {
    const mockError: ApiError = {
      status: 500,
      message: "An unexpected error occurred.",
      type: "NetworkError",
      errors: ["An unexpected error occurred."],
    };

    // Mock the fetch API to throw an error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("An unexpected error occurred."))
    ) as jest.Mock;

    await expect(
      requestProcessor({
        url: mockUrl,
        method: "POST",
        data: { key: "value" },
      })
    ).rejects.toEqual(mockError);
  });
});

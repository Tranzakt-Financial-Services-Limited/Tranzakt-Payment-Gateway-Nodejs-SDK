import { ApiError } from "../src";
import { requestProcessor } from "../src/utils/request-processor";

describe("Test request processor", () => {
  const mockUrl = "/test-endpoint";

  it("should process a successful request", async () => {
    const mockData = { someField: "someValue" };
    const mockResponse = {
      success: true,
      data: mockData,
      status: 200,
      message: "Success",
    };

    // Mock the fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
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
    const errorMessage =
      "The data you provided is not properly formatted. Please check for errors and try again.";
    const mockError: ApiError = {
      status: 400,
      message: errorMessage,
      type: "BadRequest",
      errors: [errorMessage],
    };

    const expectedResponse = {
      success: false,
      data: null,
      status: 400,
      message: errorMessage,
    };

    // Mock the fetch API to return a 400 error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockError),
      } as Response)
    ) as jest.Mock;

    const response = await requestProcessor({
      url: mockUrl,
      method: "POST",
      data: { key: "value" },
    });

    expect(response).toEqual(expectedResponse);
  });

  it("should handle a network error", async () => {
    const errorMessage = "An unexpected error occurred.";
    const expectedResponse = {
      success: false,
      data: null,
      status: 500,
      message: errorMessage,
    };

    // Mock the fetch API to throw an error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error(errorMessage))
    ) as jest.Mock;

    const response = await requestProcessor({
      url: mockUrl,
      method: "POST",
      data: { key: "value" },
    });

    expect(response).toEqual(expectedResponse);
  });
});

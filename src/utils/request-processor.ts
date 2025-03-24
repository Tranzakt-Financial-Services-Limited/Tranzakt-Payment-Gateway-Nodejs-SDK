import { BASE_URL } from "../config";
import { ApiError, ApiResponse, StandardApiResponse } from "../types";

type IRequestParam<T = any> = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: T;
  headers?: Record<string, string>;
};

export async function requestProcessor<T>({
  url,
  method,
  data,
  headers,
}: IRequestParam): Promise<ApiResponse<T>> {
  const config: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  };
  try {
    const response = await fetch(`${BASE_URL}${url}`, config);

    if (!response.ok) {
      const errorResponse = (await response.json().catch(() => ({
        status: response.status,
        message: response.statusText,
        type: "UnknownError",
        errors: [response.statusText],
      }))) as ApiError;

      return {
        success: false,
        data: null as unknown as T,
        status: errorResponse.status,
        message: errorResponse.message || "An error occurred",
      };
    }

    const responseData = (await response.json()) as StandardApiResponse<T>;
    return {
      success: true,
      data: responseData.data,
      status: responseData.status,
      message: responseData.message,
    };
  } catch (error: any) {
    // Handle network errors or unexpected issues
    return {
      success: false,
      data: null as unknown as T,
      status: 500,
      message: error?.message ?? "NetworkError",
    };
  }
}

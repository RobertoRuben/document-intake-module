import axios, { AxiosError } from "axios";

/**
 * Base error for operations in the application
 */
export class AppOperationError extends Error {
  code: number;
  details: string;

  constructor(message: string, code: number = 500, details: string = "") {
    super(message);
    this.name = "AppOperationError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Utility class for global API error handling
 */
export class ApiErrorHandler {
  /**
   * Processes API errors and extracts details
   * @param error Captured error
   * @param errorClassName Optional: custom name for the error class
   * @throws AppOperationError with the processed error information
   */
  static handleApiError(error: unknown, errorClassName?: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      interface ErrorResponse {
        detail?: {
          details?: string;
          message?: string;
          code?: number;
        };
      }
      const responseData = axiosError.response?.data as ErrorResponse;

      if (responseData?.detail) {
        const errorDetail = responseData.detail;
        const details =
          errorDetail.details || errorDetail.message || "Operation error";
        const code = errorDetail.code || axiosError.response?.status || 500;

        const appError = new AppOperationError(
          errorDetail.message || "Operation error",
          code,
          details
        );
        
        if (errorClassName) {
          appError.name = errorClassName;
        }
        
        throw appError;
      }

      const communicationError = new AppOperationError(
        "Error in server communication",
        axiosError.response?.status || 500
      );
      
      if (errorClassName) {
        communicationError.name = errorClassName;
      }
      
      throw communicationError;
    }

    const unexpectedError = new AppOperationError("Unexpected operation error");
    
    if (errorClassName) {
      unexpectedError.name = errorClassName;
    }
    
    throw unexpectedError;
  }
}
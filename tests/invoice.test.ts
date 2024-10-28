import {
  ApiError,
  CreateInvoiceProps,
  Invoice,
  InvoiceStatus,
  InvoiceType,
  PaymentMethod,
  ServiceFeeBilling,
  SettlementFrequency,
  Tranzakt,
} from "../src";
import { BASE_URL, INVOICE_URL } from "../src/config";

describe("InvoiceService", () => {
  const mockSecretKey = "test-secret-key";

  const tranzakt = new Tranzakt(mockSecretKey);

  const mockInvoiceResponse: Invoice = {
    id: "inv-001",
    title: "Test Invoice",
    collectionName: "Test Collection",
    payerName: "John Doe",
    payerEmail: "john@example.com",
    payerPhoneNumber: "1234567890",
    billerName: "Test Biller",
    billerAddress: "123 Test St",
    billerEmail: "biller@example.com",
    amount: 1000,
    serviceCharge: 50,
    vat: 50,
    totalAmount: 1100,
    invoiceStatus: InvoiceStatus.Unpaid,
    serviceFeePayer: ServiceFeeBilling.Payer,
    settlementFrequency: SettlementFrequency.Instant,
    type: InvoiceType.Test,
    paymentUrl: "https://example.com/pay/inv-001",
    dateCreated: "2024-01-01T00:00:00Z",
    dateModified: "2024-01-01T00:00:00Z",
    billerMetaData: {
      reference: "REF001",
    },
    paymentDate: "",
    paymentMethod: PaymentMethod.BankTransfer,
    invoiceBeneficiaries: [
      {
        amount: "1000",
        linkedAccountId: "acc-001",
        accountName: "Test Account",
        accountNumber: "1234567890",
        bankName: "Test Bank",
        businessName: "Test Business",
      },
    ],
    callBackUrl: "https://example.com/callback",
  };

  const mockInvoiceData: CreateInvoiceProps = {
    collectionId: "col-001",
    title: "Test Invoice",
    payerName: "John Doe",
    payerEmail: "john@example.com",
    payerPhoneNumber: "1234567890",
    billerMetaData: {
      reference: "REF001",
    },
    amount: 1000,
    callBackUrl: "https://example.com/callback",
    invoiceBeneficiaries: [
      {
        linkedAccountId: "acc-001",
        amount: 1000,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getInvoiceDetails", () => {
    it("should fetch invoice details successfully", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockInvoiceResponse),
        } as Response)
      ) as jest.Mock;

      const response = await tranzakt.getInvoiceDetails("inv-001");

      expect(response).toEqual(mockInvoiceResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}${INVOICE_URL}/inv-001`,
        expect.objectContaining({
          headers: {
            "x-api-key": mockSecretKey,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
        })
      );
    });

    it("should handle invoice not found error", async () => {
      const mockError: ApiError = {
        status: 404,
        message: "Invoice not found",
        type: "NotFound",
        errors: ["Invoice not found"],
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve(mockError),
        } as Response)
      ) as jest.Mock;

      await expect(tranzakt.getInvoiceDetails("invalid-id")).rejects.toEqual(
        mockError
      );
    });
  });

  describe("createInvoice", () => {
    it("should create an invoice successfully", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockInvoiceResponse),
        } as Response)
      ) as jest.Mock;

      const response = await tranzakt.createInvoice(mockInvoiceData);

      expect(response).toEqual(mockInvoiceResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}${INVOICE_URL}`,
        expect.objectContaining({
          method: "POST",
          headers: {
            "x-api-key": mockSecretKey,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockInvoiceData),
        })
      );
    });

    it("should handle validation error during creation", async () => {
      const mockError: ApiError = {
        status: 400,
        message: "Validation failed",
        type: "ValidationError",
        errors: [
          "Email must be valid",
          "Phone number must be valid",
          "Amount must be greater than 0",
        ],
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve(mockError),
        } as Response)
      ) as jest.Mock;

      const invalidData: CreateInvoiceProps = {
        ...mockInvoiceData,
        payerEmail: "invalid-email",
        payerPhoneNumber: "invalid-phone",
        amount: 0,
      };

      await expect(tranzakt.createInvoice(invalidData)).rejects.toEqual(
        mockError
      );
    });

    it("should create an invoice without optional fields", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockInvoiceResponse),
        } as Response)
      ) as jest.Mock;

      const minimalInvoiceData: CreateInvoiceProps = {
        collectionId: "col-001",
        title: "Test Invoice",
        payerName: "John Doe",
        payerEmail: "john@example.com",
        payerPhoneNumber: "1234567890",
      };

      await tranzakt.createInvoice(minimalInvoiceData);

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}${INVOICE_URL}`,
        expect.objectContaining({
          body: JSON.stringify(minimalInvoiceData),
        })
      );
    });
  });

  describe("invalidateAnInvoice", () => {
    it("should handle already invalidated invoice error", async () => {
      const mockError: ApiError = {
        status: 400,
        message: "Invoice already invalidated",
        type: "BadRequest",
        errors: ["Invoice already invalidated"],
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve(mockError),
        } as Response)
      ) as jest.Mock;

      await expect(tranzakt.invalidateAnInvoice("inv-001")).rejects.toEqual(
        mockError
      );
    });

    it("should handle permission denied error", async () => {
      const mockError: ApiError = {
        status: 403,
        message: "Permission denied",
        type: "Forbidden",
        errors: ["You don't have permission to invalidate this invoice"],
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 403,
          json: () => Promise.resolve(mockError),
        } as Response)
      ) as jest.Mock;

      await expect(tranzakt.invalidateAnInvoice("inv-001")).rejects.toEqual(
        mockError
      );
    });

    it("should handle invalidating a paid invoice", async () => {
      const mockError: ApiError = {
        status: 400,
        message: "Cannot invalidate a paid invoice",
        type: "BadRequest",
        errors: ["Cannot invalidate an invoice that has already been paid"],
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve(mockError),
        } as Response)
      ) as jest.Mock;

      await expect(tranzakt.invalidateAnInvoice("inv-001")).rejects.toEqual(
        mockError
      );
    });

    it("should handle non-existent invoice invalidation attempt", async () => {
      const mockError: ApiError = {
        status: 404,
        message: "Invoice not found",
        type: "NotFound",
        errors: ["The specified invoice does not exist"],
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve(mockError),
        } as Response)
      ) as jest.Mock;

      await expect(
        tranzakt.invalidateAnInvoice("non-existent-id")
      ).rejects.toEqual(mockError);
    });
  });

  describe("error handling across all methods", () => {
    it("should handle network errors", async () => {
      const errorMessage = "Failed to fetch";
      const mockError: ApiError = {
        status: 500,
        message: errorMessage, // Changed to match the actual error message
        type: "NetworkError",
        errors: [errorMessage],
      };

      global.fetch = jest.fn(() =>
        Promise.reject(new Error(errorMessage))
      ) as jest.Mock;

      await expect(tranzakt.getInvoiceDetails("inv-001")).rejects.toEqual(
        mockError
      );
    });

    it("should handle malformed JSON responses", async () => {
      const errorMessage = "Invalid JSON";
      const mockError: ApiError = {
        status: 500,
        message: errorMessage, // Changed to match the actual error message
        type: "NetworkError",
        errors: [errorMessage],
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.reject(new Error(errorMessage)),
        } as Response)
      ) as jest.Mock;

      await expect(tranzakt.getInvoiceDetails("inv-001")).rejects.toEqual(
        mockError
      );
    });

    it("should handle server errors", async () => {
      const mockError: ApiError = {
        status: 500,
        message: "Internal Server Error",
        type: "ServerError",
        errors: ["An unexpected error occurred"],
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve(mockError),
        } as Response)
      ) as jest.Mock;

      await expect(tranzakt.getInvoiceDetails("inv-001")).rejects.toEqual(
        mockError
      );
    });
  });
});

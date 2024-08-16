import {
  ApiError,
  CreateInvoiceProps,
  Invoice,
  InvoiceType,
  PaymentMethod,
  SettlementFrequency,
  Tranzakt,
} from "../src";

describe("Tranzakt", () => {
  const mockSecretKey = "test-secret-key";
  const tranzakt = new Tranzakt(mockSecretKey);

  const mockInvoiceData: CreateInvoiceProps = {
    collectionId: "12345",
    title: "Test Invoice",
    payerName: "John Doe",
    payerEmail: "john.doe@example.com",
    payerPhoneNumber: "1234567890",
    amount: 10000,
    invoiceBeneficiaries: [
      {
        linkedAccountId: "32334-as8ff-7888-980",
        amount: 10000,
      },
    ],
  };

  const mockResponse: Invoice = {
    id: "inv-001",
    title: "Test Invoice",
    collectionName: "Test Collection",
    payerName: "John Doe",
    payerEmail: "john.doe@example.com",
    payerPhoneNumber: "1234567890",
    billerName: "Test Biller",
    billerAddress: "123 Biller St.",
    billerEmail: "biller@example.com",
    amount: 1000,
    vat: 50,
    totalAmount: 1050,
    invoiceStatus: "Pending",
    serviceFeePayer: "Biller",
    settlementFrequency: SettlementFrequency.Instant,
    type: InvoiceType.Test,
    paymentUrl: "https://payment.example.com/inv-001",
    dateCreated: "2024-01-01T00:00:00Z",
    dateModified: "2024-01-01T00:00:00Z",
    paymentDate: "",
    paymentMethod: PaymentMethod.BankTransfer,
    invoiceBeneficiaries: [],
  };

  it("should create a static invoice successfully", async () => {
    // Mock the fetch API to return a successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    ) as jest.Mock;

    const response = await tranzakt.createInvoice(mockInvoiceData);

    expect(response).toEqual(mockResponse);
  });

  it("should handle a 400 Bad Request error when creating a static invoice", async () => {
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

    await expect(tranzakt.createInvoice(mockInvoiceData)).rejects.toEqual(
      mockError
    );
  });

  it("should handle a network error when creating a static invoice", async () => {
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

    await expect(tranzakt.createInvoice(mockInvoiceData)).rejects.toEqual(
      mockError
    );
  });
});

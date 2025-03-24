# Tranzakt Payment Platform (TPP) Node SDK

A Node.js library for seamless integration with TPP APIs. This SDK simplifies your integration by providing an intuitive interface for making API calls.

## Installation

```bash
npm install --save tranzakt-node-sdk
# or
yarn add tranzakt-node-sdk
```

## Quick Start

```typescript
import { Tranzakt } from "tranzakt-node-sdk";

const tranzakt = new Tranzakt("your-secret-key");
```

## Response Structure

All SDK methods return responses with a consistent structure:

```typescript
interface ApiResponse<T> {
  success: boolean; // Indicates if the request was successful
  data: T; // Contains the actual response data
  status: number; // HTTP status code
  message: string; // Human-readable message
}
```

This consistent structure simplifies how you work with responses from the API.

## Core Features

### 1. Collection Management

#### Get Collection Details

Retrieves comprehensive information about a specific collection, including its configuration, payment channels, settlement settings, and beneficiary accounts.

```typescript
// Fetch details for a specific collection
const response = await tranzakt.getCollection(
  "37a71e2e-ed54-4e46-a3a9-47a211c352ea"
);

if (response.success) {
  const collection = response.data;
  console.log(`Collection name: ${collection.collectionName}`);
}
```

Response example:

```typescript
{
  success: true,
  data: {
    id: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
    collectionName: "Product Sales",
    description: "Collection for product sales",
    invoiceExpirationPeriod: "TwentyFourHours",
    paymentChannels: ["Card", "BankTransfer"],
    settlementFrequency: "Instant",
    serviceFeeBilling: "Payer",
    amount: 5000,
    dateCreated: "2024-01-01T00:00:00Z",
    status: "Active",
    collectionCategory: {
      id: "cat-001",
      name: "E-commerce"
    },
    collectionAccounts: [
      {
        percentage: 100,
        linkedAccount: {
          id: "acc-001",
          accountName: "Business Account",
          accountNumber: "1234567890",
          bank: {
            id: "bank-001",
            name: "Example Bank",
            code: "001",
            logo: "https://example.com/logo.png"
          },
          merchant: {
            merchantId: "merch-001",
            businessName: "Example Business"
          }
        }
      }
    ]
  },
  status: 200,
  message: "Success"
}
```

#### List Collection Invoices

Fetches a paginated list of invoices associated with a collection. Supports filtering by status, date range, and search terms, making it easy to track and manage payments.

```typescript
// Get paginated list of invoices for a collection
const response = await tranzakt.getCollectionInvoices(
  "37a71e2e-ed54-4e46-a3a9-47a211c352ea", // Collection ID (required)
  {
    // All parameters below are optional
    invoiceStatus: "Paid",
    search: "John",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    invoiceType: "Live",
    linkedAccountId: "account-uuid",
    isDownloading: false,
    page: 1,
    pageSize: 20,
  }
);

if (response.success) {
  // Access the paginated data
  const { items, totalCount } = response.data;
  console.log(`Found ${totalCount} invoices`);
}
```

Optional Parameters:

- `invoiceStatus`: Filter by status ("Unpaid" | "Paid" | "Invalidated")
- `search`: Search by payer name or email
- `startDate`: Filter from date (YYYY-MM-DD)
- `endDate`: Filter to date (YYYY-MM-DD)
- `invoiceType`: Filter by type ("Test" | "Live")
- `linkedAccountId`: Filter by beneficiary account
- `isDownloading`: Set to true to get all records for download
- `page`: Page number (default: 1)
- `pageSize`: Records per page (default: 20)

Response example:

```typescript
{
  success: true,
  data: {
    items: [
      {
        id: "inv-001",
        title: "Monthly Subscription",
        amount: 5000,
        status: "Paid",
        payerName: "John Doe",
        payerEmail: "john@example.com",
        dateCreated: "2024-01-15T10:30:00Z",
        datePaid: "2024-01-15T10:35:00Z"
      },
      // More invoice items...
    ],
    page: 1,
    pageSize: 20,
    totalCount: 45,
    hasNextPage: true,
    hasPreviousPage: false
  },
  status: 200,
  message: "Success"
}
```

### 2. Invoice Operations

#### Create Invoice

Creates a new payment invoice for a collection. Supports both fixed and variable amounts, multiple beneficiaries, and custom metadata for integration with your systems.

```typescript
// Create a new invoice
const response = await tranzakt.createInvoice({
  // Required parameters
  collectionId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
  payerEmail: "john.doe@example.com",
  payerName: "John Doe",
  payerPhoneNumber: "07078955432",
  title: "Checkout Invoice",

  // Optional parameters (some may be required based on collection settings)
  amount: 40000, // Required if collection has no fixed amount
  invoiceBeneficiaries: [
    // Required if collection has no fixed beneficiaries
    {
      linkedAccountId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
      amount: 20000,
    },
  ],
  callBackUrl: "https://your-callback-url.com/webhook",
  billerMetaData: {
    "order-id": "12345",
  },
});

if (response.success) {
  const invoice = response.data;
  console.log(`Payment URL: ${invoice.paymentUrl}`);
}
```

Response example:

```typescript
{
  success: true,
  data: {
    id: "inv-001",
    title: "Checkout Invoice",
    collectionName: "Product Sales",
    payerName: "John Doe",
    payerEmail: "john.doe@example.com",
    payerPhoneNumber: "07078955432",
    billerName: "Example Business",
    billerAddress: "123 Business St",
    billerEmail: "sales@example.com",
    amount: 40000,
    serviceCharge: 400,
    vat: 0,
    totalAmount: 40400,
    invoiceStatus: "Unpaid",
    serviceFeePayer: "Payer",
    settlementFrequency: "Instant",
    type: "Live",
    paymentUrl: "https://pay.tranzakt.finance/inv-001",
    dateCreated: "2024-03-24T12:00:00Z",
    dateModified: "2024-03-24T12:00:00Z",
    paymentDate: "",
    paymentMethod: "Card",
    invoiceBeneficiaries: [
      {
        amount: "20000",
        linkedAccountId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
        accountName: "Business Account",
        accountNumber: "1234567890",
        bankName: "Example Bank",
        businessName: "Example Business"
      }
    ],
    billerMetaData: {
      "order-id": "12345"
    },
    callBackUrl: "https://your-callback-url.com/webhook"
  },
  status: 201,
  message: "Invoice created successfully"
}
```

#### Get Invoice Details

Retrieves detailed information about a specific invoice, including payment status, beneficiary details, and transaction metadata.

```typescript
// Fetch details for a specific invoice
const response = await tranzakt.getInvoice(
  "22205053-02c7-4607-9cb5-5fa58cecae6d" // Invoice ID (required)
);

if (response.success) {
  const invoice = response.data;
  console.log(`Invoice status: ${invoice.invoiceStatus}`);
}
```

#### Invalidate Invoice

Cancels an unpaid invoice, preventing it from being paid. Useful for managing expired or cancelled orders.

```typescript
// Invalidate an unpaid invoice
const response = await tranzakt.invalidateInvoice(
  "22205053-02c7-4607-9cb5-5fa58cecae6d" // Invoice ID (required)
);

if (response.success) {
  console.log("Invoice successfully invalidated");
}
```

Response example:

```typescript
{
  success: true,
  data: null,
  status: 200,
  message: "Invoice invalidated successfully"
}
```

## Error Handling

Since all responses follow the same structure, error handling is straightforward:

```typescript
const response = await tranzakt.createInvoice({
  /* invoice data */
});

if (!response.success) {
  console.error(`Error (${response.status}): ${response.message}`);
}
```

You can handle specific error cases based on the status code:

```typescript
const response = await tranzakt.createInvoice({
  /* invoice data */
});

if (!response.success) {
  console.error(`Error (${response.status}): ${response.message}`);

  // Handle specific error cases
  if (response.status === 400) {
    // Handle validation errors
    console.log("Please check your input data");
  } else if (response.status === 403) {
    // Handle permission issues
    console.log("You don't have permission to perform this action");
  }
}
```

Error response example:

```typescript
{
  success: false,
  data: null,
  status: 400,
  message: "Validation error: Missing required fields"
}
```

Common Error Status Codes:

- 400: Invalid request (missing required fields, incorrect amounts)
- 401: Unauthorized (invalid API key)
- 403: Permission denied (disabled collection, wrong API key type)
- 404: Resource not found (invalid invoice or collection ID)
- 412: Business validation failed (unverified beneficiary, missing collection owner)
- 500: Server error (unexpected issues)

## Important Notes

When creating invoices:

1. Don't specify amount if collection has fixed amount
2. Must specify amount if collection has no fixed amount
3. Don't specify beneficiaries if collection has fixed beneficiaries
4. Must specify beneficiaries if collection has no fixed beneficiaries
5. Collection owner must be included in beneficiaries
6. All beneficiary accounts must be verified (KYB completed)

## Support

- Email: hi@tranzakt.app
- Docs: https://docs.tranzakt.com

## License

MIT License - © TRANZAKT FINANCIAL SERVICES LIMITED

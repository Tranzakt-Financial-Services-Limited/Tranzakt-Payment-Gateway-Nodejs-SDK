# Tranzakt Payment Platform (TPP) Node SDK

A Node.js library for seamless integration with TPP APIs.

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

All SDK methods return a consistent response:

```typescript
interface ApiResponse<T> {
  success: boolean; // Request success indicator
  data: T; // Response data
  status: number; // HTTP status code
  message: string; // Human-readable message
}
```

## Core Features

### 1. Collection Management

#### Get Collection Details

```typescript
const response = await tranzakt.getCollection("collection-id");
```

**Response:**

```typescript
{
  success: true,
  data: {
    id: "collection-id",
    collectionName: "Product Sales",
    description: "Collection for product sales",
    invoiceExpirationPeriod: "TwentyFour_Hours",
    paymentChannels: ["Card", "BankTransfer"],
    settlementFrequency: "Instant",
    serviceFeeBilling: "Payer",
    amount?: 5000, // Optional - only if fixed amount
    dateCreated: "2024-01-01T00:00:00Z",
    status: "Active",
    collectionCategory: {
      id: "cat-001",
      name: "E-commerce"
    },
    collectionAccounts?: [ // Optional - beneficiary accounts
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
    ],
    collectionClient?: { // Optional - client information
      clientId: "client-001",
      clientName: "Client Name",
      status: "Approved" // "Pending" | "Approved" | "Rejected"
    }
  },
  status: 200,
  message: "Success"
}
```

#### List Collection Invoices

```typescript
const response = await tranzakt.getCollectionInvoices("collection-id", {
  invoiceStatus: "Unpaid" | "Paid" | "Invalidated",
  search: "payer name or email",
  startDate: "2024-01-01", // YYYY-MM-DD
  endDate: "2024-12-31", // YYYY-MM-DD
  InvoiceType: "Test" | "Live",
  linkedAccountId: "account-id",
  IsDownloading: false, // true for all records
  page: 1,
  pageSize: 20,
});
```

All parameters are optional.

**Response:**

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
      }
      // More items...
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

```typescript
const response = await tranzakt.createInvoice({
  // Required fields
  collectionId: "collection-id",
  payerEmail: "john.doe@example.com",
  payerName: "John Doe",
  payerPhoneNumber: "07078955432",
  title: "Invoice Title",

  // Optional/Conditional fields
  amount: 40000, // Required if collection has no fixed amount
  invoiceBeneficiaries: [
    // Required if collection has no fixed beneficiaries
    {
      linkedAccountId: "account-id",
      amount: 20000,
    },
  ],
  callBackUrl: "https://your-webhook.com/callback",
  billerMetaData: {
    "order-id": "12345",
  },
});
```

**Response:**

```typescript
{
  success: true,
  data: {
    id: "inv-001",
    title: "Invoice Title",
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
    status: "Unpaid", // InvoiceStatus enum
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
        linkedAccountId: "account-id",
        accountName: "Business Account",
        accountNumber: "1234567890",
        bankName: "Example Bank",
        businessName: "Example Business"
      }
    ],
    billerMetaData: {
      "order-id": "12345"
    },
    callBackUrl: "https://your-webhook.com/callback"
  },
  status: 201,
  message: "Invoice created successfully"
}
```

**Important Rules:**

- Don't specify `amount` if collection has fixed amount
- Must specify `amount` if collection has no fixed amount
- Don't specify `invoiceBeneficiaries` if collection has fixed beneficiaries
- Must specify `invoiceBeneficiaries` if collection has no fixed beneficiaries
- Collection owner must be included in beneficiaries
- All beneficiary accounts must be verified (KYB completed)

#### Get Invoice Details

```typescript
const response = await tranzakt.getInvoice("invoice-id");
```

**Response:**

```typescript
{
  success: true,
  data: {
    // Same structure as Create Invoice response
    id: "inv-001",
    title: "Invoice Title",
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
    status: "Paid", // Can be "Unpaid" | "Paid" | "Invalidated"
    serviceFeePayer: "Payer",
    settlementFrequency: "Instant",
    type: "Live",
    paymentUrl: "https://pay.tranzakt.finance/inv-001",
    dateCreated: "2024-03-24T12:00:00Z",
    dateModified: "2024-03-24T12:00:00Z",
    paymentDate: "2024-03-24T12:05:00Z",
    paymentMethod: "Card",
    invoiceBeneficiaries: [...],
    billerMetaData: {...},
    callBackUrl: "https://your-webhook.com/callback"
  },
  status: 200,
  message: "Success"
}
```

#### Invalidate Invoice

```typescript
const response = await tranzakt.invalidateInvoice("invoice-id");
```

Cancels an unpaid invoice, preventing payment.

**Response:**

```typescript
{
  success: true,
  data: null,
  status: 200,
  message: "Invoice invalidated successfully"
}
```

## Error Handling

All errors follow the same response structure:

```typescript
const response = await tranzakt.createInvoice({
  /* invoice data */
});

if (!response.success) {
  console.error(`Error (${response.status}): ${response.message}`);

  // Handle specific error cases
  switch (response.status) {
    case 400:
      // Validation errors - check input data
      break;
    case 401:
      // Invalid API key
      break;
    case 403:
      // Permission denied
      break;
    case 404:
      // Resource not found
      break;
    case 412:
      // Business validation failed
      break;
    case 500:
      // Server error
      break;
  }
}
```

**Error Response Structure:**

```typescript
{
  success: false,
  data: null,
  status: 400, // HTTP status code
  message: "Validation error: Missing required fields"
}
```

**Common Error Status Codes:**

- `400`: Invalid request (missing required fields, incorrect amounts)
- `401`: Unauthorized (invalid API key)
- `403`: Permission denied (disabled collection, wrong API key type)
- `404`: Resource not found (invalid invoice or collection ID)
- `412`: Business validation failed (unverified beneficiary, missing collection owner)
- `500`: Server error (unexpected issues)

## API Reference

### Common Types

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  status: number;
  message: string;
}

interface PaginatedData<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface Bank {
  id: string;
  name: string;
  code: string;
  logo: string;
}
```

### Invoice Types

```typescript
interface CreateInvoiceProps {
  collectionId: string;
  title: string;
  payerName: string;
  payerEmail: string;
  payerPhoneNumber: string;
  billerMetaData?: Record<string, string>;
  amount?: number;
  callBackUrl?: string;
  invoiceBeneficiaries?: {
    linkedAccountId: string;
    amount: number;
  }[];
}

interface Invoice {
  id: string;
  title: string;
  collectionName: string;
  payerName: string;
  payerEmail: string;
  payerPhoneNumber: string;
  billerName: string;
  billerAddress: string;
  billerEmail: string;
  amount: number;
  serviceCharge?: number;
  vat: number;
  totalAmount: number;
  status: InvoiceStatus;
  serviceFeePayer: ServiceFeeBilling;
  settlementFrequency: SettlementFrequency;
  type: InvoiceType;
  paymentUrl: string;
  dateCreated: string;
  dateModified: string;
  billerMetaData?: Record<string, string>;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  invoiceBeneficiaries: InvoiceBeneficiary[];
  callBackUrl?: string;
}

interface InvoiceBeneficiary {
  amount: string;
  linkedAccountId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  businessName: string;
}

interface CollectionInvoiceItem {
  id: string;
  title: string;
  amount: number;
  status: string;
  payerName: string;
  payerEmail: string;
  dateCreated: string;
  datePaid?: string;
}

interface GetCollectionInvoicesParams {
  invoiceStatus?: InvoiceStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  InvoiceType?: InvoiceType;
  linkedAccountId?: string;
  IsDownloading?: boolean;
  page?: number;
  pageSize?: number;
}
```

### Collection Types

```typescript
interface Collection {
  id: string;
  collectionName: string;
  description: string;
  invoiceExpirationPeriod: InvoiceExpirationPeriod;
  paymentChannels: PaymentChannelType[];
  settlementFrequency: SettlementFrequency;
  serviceFeeBilling: ServiceFeeBilling;
  amount?: number;
  dateCreated: string;
  status: CollectionStatus;
  collectionCategory: {
    id: string;
    name: string;
  };
  collectionAccounts?: {
    percentage: number;
    linkedAccount: LinkedAccount;
  }[];
  collectionClient?: CollectionClient;
}

interface LinkedAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bank: Bank;
  merchant: {
    merchantId: string;
    businessName: string;
  };
}

interface CollectionClient {
  clientId: string;
  clientName: string;
  status: ClientRequestStatus;
}
```

### Response Types

```typescript
type CreateInvoiceResponse = ApiResponse<Invoice>;
type GetInvoiceResponse = ApiResponse<Invoice>;
type GetCollectionInvoicesResponse = ApiResponse<
  PaginatedData<CollectionInvoiceItem>
>;
type InvalidateInvoiceResponse = ApiResponse<null>;
type GetCollectionResponse = ApiResponse<Collection>;
```

### Enums

```typescript
enum InvoiceStatus {
  Unpaid = "Unpaid",
  Paid = "Paid",
  Invalidated = "Invalidated",
}

enum InvoiceType {
  Test = "Test",
  Live = "Live",
}

enum PaymentMethod {
  Card = "Card",
  BankTransfer = "BankTransfer",
  USSD = "USSD",
}

enum PaymentChannelType {
  Card = "Card",
  BankTransfer = "BankTransfer",
  USSD = "USSD",
  BankBranch = "BankBranch",
}

enum ServiceFeeBilling {
  Payer = "Payer",
}

enum SettlementFrequency {
  Instant = "Instant",
  Daily = "Daily",
}

enum SettlementType {
  Empty = "Empty",
  Single = "Single",
  Multiple = "Multiple",
}

enum CollectionStatus {
  Active = "Active",
  Pending = "Pending",
  Disabled = "Disabled",
  Suspended = "Suspended",
  Blocked = "Blocked",
}

enum ClientRequestStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

enum InvoiceExpirationPeriod {
  One_Hour = 1,
  TwentyFour_Hours = 24,
  FortyEight_Hours = 48,
}
```

## Support

- Email: support@tranzakt.finance
- Docs: https://docs.tranzakt.com

## License

MIT License - © TRANZAKT FINANCIAL SERVICES LIMITED

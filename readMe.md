![TRANZAKT FINANCIAL SERVICES LIMITED logo](https://tranzakt.s3.eu-west-1.amazonaws.com/app-images/logo-small.png "TRANZAKT FINANCIAL SERVICES LIMITED")

# Tranzakt Payment Platform (TPP) SDK

This Node.js library provides a seamless integration with TPP APIs for your applications. It abstracts the complexities of direct API integration, offering an intuitive interface for making API calls.

## Installation

```bash
npm install --save tranzakt-node-sdk
```

or using yarn:

```bash
yarn add tranzakt-node-sdk
```

## Getting Started

Initialize the SDK with your secret key:

```typescript
import { Tranzakt } from "tranzakt-node-sdk";

const tranzakt = new Tranzakt("your-secret-key");
```

Or using CommonJS:

```javascript
const { Tranzakt } = require("tranzakt-node-sdk");
const tranzakt = new Tranzakt("your-secret-key");
```

## Types

### Base Types

```typescript
interface ApiResponse<T> {
  data: T;
  status: string; // "success" | "error"
  message: string;
}

interface ApiError {
  status: number;
  message: string;
  type: string;
  errors: string[];
}

interface PaginatedData<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

### Enums

```typescript
enum CollectionStatus {
  Active = "Active",
  Pending = "Pending",
  Disabled = "Disabled",
  Suspended = "Suspended",
  Blocked = "Blocked",
}

enum InvoiceStatus {
  Unpaid = "Unpaid",
  Paid = "Paid",
  Invalidated = "Invalidated",
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

enum InvoiceType {
  Test = "Test",
  Live = "Live",
}

enum ServiceFeeBilling {
  Payer = "Payer",
}

enum SettlementFrequency {
  Instant = "Instant",
  Daily = "Daily",
}

enum InvoiceExpirationPeriod {
  OneHour = "OneHour",
  TwentyFourHours = "TwentyFourHours",
  FortyEightHours = "FortyEightHours",
}

enum ClientRequestStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}
```

## Features & API Reference

### Collection Operations

#### Get Collection Details

Retrieves detailed information about a specific collection.

**Response Type:**

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
    linkedAccount: {
      id: string;
      accountName: string;
      accountNumber: string;
      bank: {
        id: string;
        name: string;
        code: string;
        logo: string;
      };
      merchant: {
        merchantId: string;
        businessName: string;
      };
    };
  }[];
  collectionClient?: {
    clientId: string;
    clientName: string;
    status: ClientRequestStatus;
  };
}

type GetCollectionResponse = ApiResponse<Collection>;
```

**Example Usage:**

```typescript
try {
  const response = await tranzakt.getCollection(
    "37a71e2e-ed54-4e46-a3a9-47a211c352ea"
  );
  console.log(response.status); // "success"
  console.log(response.message); // "Collection fetched successfully"
  console.log(response.data); // Collection details
} catch (error) {
  console.error(error);
}
```

#### List Collection Invoices

Retrieves a paginated list of invoices associated with a collection.

**Parameters:**

```typescript
interface GetCollectionInvoicesParams {
  invoiceStatus?: InvoiceStatus;
  search?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  InvoiceType?: InvoiceType;
  linkedAccountId?: string;
  IsDownloading?: boolean;
  page?: number;
  pageSize?: number;
}
```

**Response Type:**

```typescript
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

type GetCollectionInvoicesResponse = ApiResponse<
  PaginatedData<CollectionInvoiceItem>
>;
```

**Example Usage:**

```typescript
try {
  const response = await tranzakt.getCollectionInvoices(
    "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
    {
      invoiceStatus: InvoiceStatus.Paid,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      page: 1,
      pageSize: 20,
    }
  );
  console.log(response.status); // "success"
  console.log(response.message); // "Invoices fetched successfully"
  console.log(response.data); // Paginated invoice list
} catch (error) {
  console.error(error);
}
```

### Invoice Operations

#### Create Invoice

Creates a new invoice for a collection.

**Important Notes:**

1. If a collection has a fixed amount configured, you cannot specify an amount in the request
2. If a collection has no fixed amount, you must specify the amount in the request
3. If a collection has fixed beneficiaries (collection accounts), you cannot specify beneficiaries in the request
4. If a collection has no fixed beneficiaries, you must specify the beneficiaries in the request
5. Collection owner must be included in the beneficiaries list
6. All beneficiary accounts must either belong to the collection owner or have completed their business verification (KYB)

**Request Parameters:**

```typescript
interface CreateInvoiceProps {
  collectionId: string;
  title: string;
  payerName: string;
  payerEmail: string;
  payerPhoneNumber: string;
  billerMetaData?: Record<string, string>;
  amount?: number; // Required if collection has no fixed amount
  callBackUrl?: string;
  invoiceBeneficiaries?: {
    // Required if collection has no fixed beneficiaries
    linkedAccountId: string;
    amount: number;
  }[];
}
```

**Response Type:**

```typescript
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
  invoiceStatus: InvoiceStatus;
  serviceFeePayer: ServiceFeeBilling;
  settlementFrequency: SettlementFrequency;
  type: InvoiceType;
  paymentUrl: string;
  dateCreated: string;
  dateModified: string;
  billerMetaData?: Record<string, string>;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  invoiceBeneficiaries: Array<{
    amount: string;
    linkedAccountId: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    businessName: string;
  }>;
  callBackUrl?: string;
}

type CreateInvoiceResponse = ApiResponse<Invoice>;
```

**Example Usage:**

```typescript
try {
  const response = await tranzakt.createInvoice({
    collectionId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
    payerEmail: "john.doe@example.com",
    payerName: "John Doe",
    payerPhoneNumber: "07078955432",
    title: "Checkout Invoice",
    amount: 40000, // Only if collection has no fixed amount
    invoiceBeneficiaries: [
      // Only if collection has no fixed beneficiaries
      {
        linkedAccountId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
        amount: 20000,
      },
      {
        linkedAccountId: "57871e2e-6754-4e46-a3a9-47a211c35cdw",
        amount: 20000,
      },
    ],
    billerMetaData: {
      "order-id": "12345",
    },
    callBackUrl: "https://your-callback-url.com/webhook",
  });
  console.log(response.status); // "success"
  console.log(response.message); // "Invoice created successfully"
  console.log(response.data); // Created invoice details
} catch (error) {
  console.error(error);
}
```

#### Get Invoice Details

Retrieves detailed information about a specific invoice.

**Response Type:**

```typescript
type GetInvoiceResponse = ApiResponse<Invoice>;
```

**Example Usage:**

```typescript
try {
  const response = await tranzakt.getInvoice(
    "22205053-02c7-4607-9cb5-5fa58cecae6d"
  );
  console.log(response.status); // "success"
  console.log(response.message); // "Invoice fetched successfully"
  console.log(response.data); // Invoice details
} catch (error) {
  console.error(error);
}
```

#### Invalidate Invoice

Invalidates an unpaid invoice.

**Response Type:**

```typescript
type InvalidateInvoiceResponse = ApiResponse<null>;
```

**Example Usage:**

```typescript
try {
  const response = await tranzakt.invalidateInvoice(
    "22205053-02c7-4607-9cb5-5fa58cecae6d"
  );
  console.log(response.status); // "success"
  console.log(response.message); // "Invoice invalidated successfully"
} catch (error) {
  console.error(error);
}
```

## Error Handling

```typescript
try {
  const response = await tranzakt.createInvoice(/* ... */);
} catch (error: ApiError) {
  console.error(`Error ${error.status}: ${error.message}`);
  console.error("Error type:", error.type);
  console.error("Detailed errors:", error.errors);
}
```

Common Error Responses:

- 400 Bad Request

  - Collection not found
  - Amount specified when collection has fixed amount
  - No amount specified when collection needs it
  - Beneficiaries specified when collection has fixed beneficiaries
  - No beneficiaries specified when collection needs them
  - Invalid beneficiary account IDs
  - Total beneficiary amounts don't match invoice amount

- 403 Forbidden

  - Collection is disabled
  - Collection is blocked or suspended
  - Test API key used for live collection or vice versa

- 412 Precondition Failed
  - Beneficiary account not verified (missing KYB)
  - Collection owner not included in beneficiaries

## Testing

The SDK includes comprehensive tests using Jest. Run the test suite with:

```bash
npm run test
```

## Support

For support, please contact:

- Email: support@tranzakt.com
- Documentation: https://docs.tranzakt.com

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.

Copyright (c) TRANZAKT FINANCIAL SERVICES LIMITED.

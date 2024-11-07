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

## Features

- Invoice Management (Create, Get, Invalidate)
- Collection Management (Get Details, List Invoices)
- Comprehensive Type Support
- Error Handling
- Pagination Support

## API Reference

### Invoice Operations

#### Create Static Invoice

```typescript
try {
  const invoice = await tranzakt.createInvoice({
    collectionId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
    payerEmail: "john.doe@example.com",
    payerName: "John Doe",
    payerPhoneNumber: "07078955432",
    title: "Checkout Invoice",
    billerMetaData: {
      "custom-field": "value",
      "order-id": "12345",
    },
    callBackUrl: "https://your-callback-url.com/webhook",
  });
  console.log(invoice);
} catch (error) {
  console.error(error);
}
```

#### Create Dynamic Invoice with Multiple Beneficiaries

```typescript
try {
  const invoice = await tranzakt.createInvoice({
    collectionId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
    payerEmail: "john.doe@example.com",
    payerName: "John Doe",
    payerPhoneNumber: "07078955432",
    title: "Split Payment Invoice",
    amount: 40000,
    invoiceBeneficiaries: [
      {
        linkedAccountId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
        amount: 20000,
      },
      {
        linkedAccountId: "57871e2e-6754-4e46-a3a9-47a211c35cdw",
        amount: 20000,
      },
    ],
    callBackUrl: "https://your-callback-url.com/webhook",
  });
  console.log(invoice);
} catch (error) {
  console.error(error);
}
```

#### Get Invoice Details

```typescript
try {
  const invoice = await tranzakt.getInvoice(
    "22205053-02c7-4607-9cb5-5fa58cecae6d"
  );
  console.log(invoice);
} catch (error) {
  console.error(error);
}
```

#### Invalidate Invoice

```typescript
try {
  const result = await tranzakt.invalidateInvoice(
    "22205053-02c7-4607-9cb5-5fa58cecae6d"
  );
  console.log(result);
} catch (error) {
  console.error(error);
}
```

### Collection Operations

#### Get Collection Details

```typescript
try {
  const collection = await tranzakt.getCollection(
    "37a71e2e-ed54-4e46-a3a9-47a211c352ea"
  );
  console.log(collection);
} catch (error) {
  console.error(error);
}
```

#### List Collection Invoices

```typescript
try {
  const invoices = await tranzakt.getCollectionInvoices(
    "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
    {
      invoiceStatus: "Paid",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      page: 1,
      pageSize: 20,
    }
  );
  console.log(invoices);
} catch (error) {
  console.error(error);
}
```

## Types

### Payment Enums

```typescript
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
```

### Invoice Status

```typescript
enum InvoiceStatus {
  Unpaid = "Unpaid",
  Paid = "Paid",
  Invalidated = "Invalidated",
}
```

### Collection Status

```typescript
enum CollectionStatus {
  Active = "Active",
  Pending = "Pending",
  Disabled = "Disabled",
  Suspended = "Suspended",
  Blocked = "Blocked",
}
```

## Error Handling

The SDK includes comprehensive error handling with typed error responses:

```typescript
interface ApiError {
  status: number;
  message: string;
  type: string;
  errors: string[];
}
```

Example error handling:

```typescript
try {
  const invoice = await tranzakt.createInvoice(/* ... */);
} catch (error: ApiError) {
  console.error(`Error ${error.status}: ${error.message}`);
  console.error("Detailed errors:", error.errors);
}
```

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

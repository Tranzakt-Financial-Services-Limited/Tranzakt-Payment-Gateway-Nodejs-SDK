![TRANZAKT FINANCIAL SERVICES LIMITED logo](https://tranzakt.s3.eu-west-1.amazonaws.com/app-images/logo-small.png "TRANZAKT FINANCIAL SERVICES LIMITED")

# Tranzakt Payment Platform (TPP) NodeJs SDK

This Node library simplifies access to TPP APIs for your Node applications. It abstracts the complexities of direct integration, enabling you to make quick and easy API calls.

## Installation

```sh
npm install --save tranzakt-node-sdk
```

or

```sh
yarn add tranzakt-node-sdk
```

## Usage

```javascript
import Tranzakt from "tranzakt-node-sdk";

const tranzakt = new Tranzakt("secret-key");
```

or

```javascript
var Tranzakt = require("tranzakt-node-sdk");

const tranzakt = new Tranzakt("secret-key");
```

### Create static payment invoice

```javascript
try {
  const result = await tranzakt.createInvoice({
    collectionId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
    payerEmail: "john.doe@yopmail.com",
    payerName: "John Doe",
    payerPhoneNumber: "07078955432",
    title: "Checkout Invoice",
    billerMetaData: {
      "string-1": "any value",
      "string-2": "any value",
    },
  });
  console.log(result);
} catch (error) {
  console.log(error);
}
```

### Create dynamic payment invoice

```javascript
try {
    const result = await tranzakt.createInvoice({
      collectionId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
      payerEmail: "john.doe@yopmail.com",
      payerName: "John Doe",
      payerPhoneNumber: "07078955432",
      title: "Checkout Invoice",
      amount:40000,
      invoiceBeneficiaries:
        [
            {
                linkedAccountId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
                amount: 20000;
            },
            {
                linkedAccountId: 57871e2e-6754-4e46-a3a9-47a211c35cdw;
                amount: 20000;
            }
        ]
    });
    console.log(result);
} catch (error) {
    console.log(error);
}
```

### Get invoice details

```javascript
try {
  const result = await tranzakt.getInvoiceDetails(
    "22205053-02c7-4607-9cb5-5fa58cecae6d"
  );
  console.log(result);
} catch (error) {
  console.log(error);
}
```

## Testing

All of the libraries tests are run on jest. They can be run by running the test command in your terminal.

```sh
npm run test
```

## License

By contributing to this library, you agree that your contributions will be licensed under its [MIT license](/LICENSE).
Copyright (c) TRANZAKT FINANCIAL SERVICES LIMITED.

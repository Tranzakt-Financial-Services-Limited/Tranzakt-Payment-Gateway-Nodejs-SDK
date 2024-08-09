![Trazakt logo](https://tranzakt.s3.eu-west-1.amazonaws.com/app-images/logo-small.png "Trazakt")

# Tranzakt Payment Platform NodeJs SDK

Tranzakt is a payment gateway fast and reliable

## Installation

```bash
npm install --save tranzakt-node-sdk
```

or

```bash
yarn add tranzakt-node-sdk
```

## Usage

```bash
import Tranzakt from "tranzakt-node-sdk";

const tranzakt = new Tranzakt("secret-key");
```

### Create static payment invoice

```bash
try{
    const result = await tranzakt.createStaticInvoice({
    collectionId: "37a71e2e-ed54-4e46-a3a9-47a211c352ea",
    payerEmail: "john.doe@yopmail.com",
    payerName: "John Doe",
    payerPhoneNumber: "07078955432",
    title: "Checkout Invoice",
    billerMetaData:
    {
        "string-1":"any value",
        "string-2":"any value",
    }
    });
    console.log(result);
} catch (error) {
    console.log(error);
}
```

### Create dynamic payment invoice

```bash
try {
    const result = await tranzakt.createStaticInvoice({
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

## TODO

- Add Test
- Add more methods

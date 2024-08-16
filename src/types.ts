export type CreateInvoiceProps = {
  collectionId: string;
  title: string;
  payerName: string;
  payerEmail: string;
  payerPhoneNumber: string;
  billerMetaData?: Record<string, string>;
  amount?: number;
  invoiceBeneficiaries?: {
    linkedAccountId: string;
    amount: number;
  }[];
};

export type InvoiceBeneficiary = {
  amount: string;
  linkedAccountId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  businessName: string;
};
export enum InvoiceType {
  Test = "Test",
  Live = "Live",
}
export enum SettlementFrequency {
  Instant = "Instant",
  Daily = "Daily",
}

export enum PaymentMethod {
  Card = "Card",
  BankTransfer = "BankTransfer",
  USSD = "USSD",
}

export type Invoice = {
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
  invoiceStatus: string;
  serviceFeePayer: string;
  settlementFrequency: SettlementFrequency;
  type: InvoiceType;
  paymentUrl: string;
  dateCreated: string;
  dateModified: string;
  billerMetaData?: Record<string, string>;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  invoiceBeneficiaries: InvoiceBeneficiary[];
};

export type ApiError = {
  status: number;
  message: string;
  type: string;
  errors: string[];
};

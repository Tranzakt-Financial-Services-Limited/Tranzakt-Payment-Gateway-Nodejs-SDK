import { AxiosRequestConfig, Method } from "axios";

export interface ICreateStaticInvoice {
  collectionId: string;
  title: string;
  payerName: string;
  payerEmail: string;
  payerPhoneNumber: string;
  billerMetaData?: Record<string, string>;
}

export interface ICreateDynamicInvoice extends ICreateStaticInvoice {
  amount: number;
  invoiceBeneficiaries: {
    linkedAccountId: string;
    amount: number;
  }[];
}

export interface IRequestParam {
  url: string;
  method: Method;
  data?: any;
  headers?: AxiosRequestConfig["headers"];
}
export interface IInvoiceBeneficiary {
  amount: string;
  linkedAccountId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  businessName: string;
}
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

export interface IInvoice {
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
  invoiceBeneficiaries: IInvoiceBeneficiary[];
}

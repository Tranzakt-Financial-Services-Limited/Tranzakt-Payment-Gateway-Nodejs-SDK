import { ApiResponse, Bank } from "./common";
import {
  ClientRequestStatus,
  CollectionStatus,
  InvoiceExpirationPeriod,
  PaymentChannelType,
  ServiceFeeBilling,
  SettlementFrequency,
} from "./enums";

export interface LinkedAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bank: Bank;
  merchant: {
    merchantId: string;
    businessName: string;
  };
}

export interface CollectionClient {
  clientId: string;
  clientName: string;
  status: ClientRequestStatus;
}

export interface Collection {
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

// API Response Types
export type GetCollectionResponse = ApiResponse<Collection>;

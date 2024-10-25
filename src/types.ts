export type CreateInvoiceProps = {
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
};

export type InvoiceBeneficiary = {
  amount: string;
  linkedAccountId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  businessName: string;
};

export type Bank = {
  id: string;
  name: string;
  code: string;
  logo: string;
};

export type LinkedAccount = {
  id: string;
  accountName: string;
  accountNumber: string;
  bank: Bank;
  merchant: {
    merchantId: string;
    businessName: string;
  };
};

export type CollectionClient = {
  clientId: string;
  clientName: string;
  status: ClientRequestStatus;
};

export type GetCollectionInvoicesParams = {
  invoiceStatus?: InvoiceStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  InvoiceType?: InvoiceType;
  linkedAccountId?: string;
  IsDownloading?: boolean;
  page?: number;
  pageSize?: number;
};

export type CollectionInvoiceItem = {
  id: string;
  title: string;
  amount: number;
  status: string;
  payerName: string;
  payerEmail: string;
  dateCreated: string;
  datePaid?: string;
};

export type PaginatedData<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type GetCollectionInvoicesResponse =
  PaginatedData<CollectionInvoiceItem>;

export enum InvoiceType {
  Test = "Test",
  Live = "Live",
}
export enum InvoiceStatus {
  Unpaid = "Unpaid",
  Paid = "Paid",
  Invalidated = "Invalidated",
}
export enum ServiceFeeBilling {
  Payer = "Payer",
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

export enum InvoiceExpirationPeriod {
  One_Hour = 1,
  TwentyFour_Hours = 24,
  FortyEight_Hours = 48,
}

export enum PaymentChannelType {
  Card = "Card",
  BankTransfer = "BankTransfer",
  USSD = "USSD",
  BankBranch = "BankBranch",
}

export enum CollectionStatus {
  Active = "Active",
  Pending = "Pending",
  Disabled = "Disabled",
  Suspended = "Suspended",
  Blocked = "Blocked",
}

export enum ClientRequestStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
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
  invoiceBeneficiaries: InvoiceBeneficiary[];
  callBackUrl?: string;
};

export type Collection = {
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
  collectionAccounts?: {
    percentage: number;
    linkedAccount: LinkedAccount;
  }[];
  collectionClient?: CollectionClient;
};

export type ApiError = {
  status: number;
  message: string;
  type: string;
  errors: string[];
};

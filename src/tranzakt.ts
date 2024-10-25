import { COLLECTION_URL, INVOICE_URL } from "./config";
import { BaseResponse, requestProcessor } from "./request-processor";
import {
  Collection,
  CreateInvoiceProps,
  GetCollectionInvoicesParams,
  GetCollectionInvoicesResponse,
  Invoice,
} from "./types";

export class Tranzakt {
  constructor(private readonly secretKey: string) {}

  async getInvoiceDetails(invoiceId: string): Promise<Invoice> {
    return await requestProcessor<Invoice>({
      url: `${INVOICE_URL}/${invoiceId}`,
      method: "GET",
      headers: { "x-api-key": this.secretKey },
      expectsData: true,
    });
  }

  async createInvoice(dynamicInvoice: CreateInvoiceProps): Promise<Invoice> {
    return await requestProcessor<Invoice>({
      data: dynamicInvoice,
      url: INVOICE_URL,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
      expectsData: true,
    });
  }

  async invalidateAnInvoice(invoiceId: string): Promise<BaseResponse> {
    return await requestProcessor<BaseResponse>({
      url: `${INVOICE_URL}/${invoiceId}/invalidate`,
      method: "POST",
      headers: { Authorization: `Bearer ${this.secretKey}` },
      expectsData: false,
    });
  }

  async getCollectionDetails(collectionId: string): Promise<Collection> {
    return await requestProcessor<Collection>({
      url: `${COLLECTION_URL}/${collectionId}`,
      method: "GET",
      headers: { Authorization: `Bearer ${this.secretKey}` },
      expectsData: true,
    });
  }

  async getCollectionInvoices(
    collectionId: string,
    params?: GetCollectionInvoicesParams
  ): Promise<GetCollectionInvoicesResponse> {
    // Convert params object to URLSearchParams
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    // Construct URL with query parameters
    const url = `${COLLECTION_URL}/${collectionId}/Invoices${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    return await requestProcessor<GetCollectionInvoicesResponse>({
      url,
      method: "GET",
      headers: { Authorization: `Bearer ${this.secretKey}` },
      expectsData: true,
    });
  }
}

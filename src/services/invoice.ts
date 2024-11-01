import { INVOICE_URL } from "../config";
import {
  CreateInvoiceProps,
  CreateInvoiceResponse,
  GetInvoiceResponse,
  InvalidateInvoiceResponse,
} from "../types";
import { requestProcessor } from "../utils/request-processor";

export class InvoiceService {
  constructor(private readonly secretKey: string) {}

  async getInvoiceDetails(invoiceId: string): Promise<GetInvoiceResponse> {
    return await requestProcessor<GetInvoiceResponse>({
      url: `${INVOICE_URL}/${invoiceId}`,
      method: "GET",
      headers: { "x-api-key": this.secretKey },
    });
  }

  async createInvoice(
    dynamicInvoice: CreateInvoiceProps
  ): Promise<CreateInvoiceResponse> {
    return await requestProcessor<CreateInvoiceResponse>({
      data: dynamicInvoice,
      url: INVOICE_URL,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
    });
  }

  async invalidateAnInvoice(
    invoiceId: string
  ): Promise<InvalidateInvoiceResponse> {
    return await requestProcessor<InvalidateInvoiceResponse>({
      url: `${INVOICE_URL}/${invoiceId}/invalidate`,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
    });
  }
}

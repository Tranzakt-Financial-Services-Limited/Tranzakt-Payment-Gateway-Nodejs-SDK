import { INVOICE_URL } from "../config";
import {
  CreateInvoiceProps,
  CreateInvoiceResponse,
  GetInvoiceResponse,
  InvalidateInvoiceResponse,
  Invoice,
} from "../types";
import { requestProcessor } from "../utils/request-processor";

export class InvoiceService {
  constructor(private readonly secretKey: string) {}

  async getInvoiceDetails(invoiceId: string): Promise<GetInvoiceResponse> {
    // Cast the result to the expected response type directly
    return (await requestProcessor<Invoice>({
      url: `${INVOICE_URL}/${invoiceId}`,
      method: "GET",
      headers: { "x-api-key": this.secretKey },
    })) as unknown as GetInvoiceResponse;
  }

  async createInvoice(
    dynamicInvoice: CreateInvoiceProps
  ): Promise<CreateInvoiceResponse> {
    // Cast the result to the expected response type directly
    return (await requestProcessor<Invoice>({
      data: dynamicInvoice,
      url: INVOICE_URL,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
    })) as unknown as CreateInvoiceResponse;
  }

  async invalidateAnInvoice(
    invoiceId: string
  ): Promise<InvalidateInvoiceResponse> {
    // Cast the result to the expected response type directly
    return (await requestProcessor<null>({
      url: `${INVOICE_URL}/${invoiceId}/invalidate`,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
    })) as unknown as InvalidateInvoiceResponse;
  }
}

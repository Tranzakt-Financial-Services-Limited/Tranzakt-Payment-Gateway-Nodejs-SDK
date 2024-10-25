import { INVOICE_URL } from "../config";
import { requestProcessor } from "../request-processor";
import { CreateInvoiceProps, Invoice } from "../types";

export class InvoiceService {
  constructor(private readonly secretKey: string) {}

  async getInvoiceDetails(invoiceId: string): Promise<Invoice> {
    return await requestProcessor<Invoice>({
      url: `${INVOICE_URL}/${invoiceId}`,
      method: "GET",
      headers: { "x-api-key": this.secretKey },
    });
  }

  async createInvoice(dynamicInvoice: CreateInvoiceProps): Promise<Invoice> {
    return await requestProcessor<Invoice>({
      data: dynamicInvoice,
      url: INVOICE_URL,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
    });
  }

  async invalidateAnInvoice(invoiceId: string): Promise<null> {
    return await requestProcessor<null>({
      url: `${INVOICE_URL}/${invoiceId}/invalidate`,
      method: "POST",
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });
  }
}

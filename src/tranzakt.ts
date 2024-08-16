import { INVOICE_URL } from "./config";
import { requestProcessor } from "./request-processor";
import { CreateInvoiceProps, Invoice } from "./types";

export class Tranzakt {
  constructor(private readonly secretKey: string) {}

  async getInvoiceDetails(invoiceId: string) {
    return await requestProcessor<Invoice>({
      url: `${INVOICE_URL}/${invoiceId}`,
      method: "GET",
      headers: { "x-api-key": this.secretKey },
    });
  }

  async createInvoice(dynamicInvoice: CreateInvoiceProps) {
    const response = await requestProcessor<Invoice>({
      data: dynamicInvoice,
      url: INVOICE_URL,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
    });
    return response;
  }
}

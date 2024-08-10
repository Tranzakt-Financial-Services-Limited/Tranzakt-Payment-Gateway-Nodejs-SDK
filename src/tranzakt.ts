import { DYNAMIC_INVOICE_URL, STATIC_INVOICE_URL } from "./config";
import { requestProcessor } from "./request-processor";
import {
  CreateDynamicInvoiceProps,
  CreateStaticInvoiceProps,
  Invoice,
} from "./types";

export class Tranzakt {
  constructor(private readonly secretKey: string) {}

  async createStaticInvoice(staticInvoice: CreateStaticInvoiceProps) {
    return await requestProcessor<Invoice>({
      data: staticInvoice,
      url: STATIC_INVOICE_URL,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
    });
  }

  async createDynamicInvoice(dynamicInvoice: CreateDynamicInvoiceProps) {
    const response = await requestProcessor<Invoice>({
      data: dynamicInvoice,
      url: DYNAMIC_INVOICE_URL,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
    });
    return response;
  }
}

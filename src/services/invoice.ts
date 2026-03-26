import { INVOICE_URL } from "../config";
import {
  AccountType,
  CreateInvoiceProps,
  CreateInvoiceResponse,
  GenerateVirtualAccountResponse,
  GetInvoiceResponse,
  InvalidateInvoiceResponse,
  Invoice,
  VirtualAccount,
} from "../types";
import { requestProcessor } from "../utils/request-processor";

export class InvoiceService {
  constructor(private readonly secretKey: string) {}

  async getInvoiceDetails(invoiceId: string): Promise<GetInvoiceResponse> {
    return await requestProcessor<Invoice>({
      url: `${INVOICE_URL}/${invoiceId}`,
      method: "GET",
      headers: { "x-api-key": this.secretKey },
    });
  }

  async createInvoice(
    dynamicInvoice: CreateInvoiceProps,
  ): Promise<CreateInvoiceResponse> {
    return await requestProcessor<Invoice>({
      data: dynamicInvoice,
      url: INVOICE_URL,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
    });
  }

  async invalidateAnInvoice(
    invoiceId: string,
  ): Promise<InvalidateInvoiceResponse> {
    return await requestProcessor<void>({
      url: `${INVOICE_URL}/${invoiceId}/invalidate`,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
    });
  }

  async generateVirtualAccount(
    invoiceId: string,
    accountType: AccountType,
  ): Promise<GenerateVirtualAccountResponse> {
    return await requestProcessor<VirtualAccount>({
      url: `${INVOICE_URL}/${invoiceId}/generate-virtual-account`,
      method: "POST",
      data: { accountType },
      headers: { "x-api-key": this.secretKey },
    });
  }
}

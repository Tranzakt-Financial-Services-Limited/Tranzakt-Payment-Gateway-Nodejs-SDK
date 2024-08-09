import {
  DYNAMIC_INVOICE_URL,
  ICreateDynamicInvoice,
  ICreateStaticInvoice,
  IInvoice,
  requestProcessor,
  STATIC_INVOICE_URL,
} from "./src";

export default class Tranzakt {
  constructor(private readonly secretKey: string) {}

  /*
    Create static invoice
  */
  async createStaticInvoice(staticInvoice: ICreateStaticInvoice) {
    return await requestProcessor<IInvoice>({
      data: staticInvoice,
      url: STATIC_INVOICE_URL,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
    });
  }

  /*
    Create dynamic invoice
  */
  async createDynamicInvoice(dynamicInvoice: ICreateDynamicInvoice) {
    const response = await requestProcessor<IInvoice>({
      data: dynamicInvoice,
      url: DYNAMIC_INVOICE_URL,
      method: "POST",
      headers: { "x-api-key": this.secretKey },
    });
    return response;
  }
}

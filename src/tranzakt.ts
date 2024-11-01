import { CollectionService } from "./services/collection";
import { InvoiceService } from "./services/invoice";
import {
  CreateInvoiceProps,
  CreateInvoiceResponse,
  GetCollectionInvoicesParams,
  GetCollectionInvoicesResponse,
  GetCollectionResponse,
  GetInvoiceResponse,
  InvalidateInvoiceResponse,
} from "./types";

export class Tranzakt {
  private readonly invoiceService: InvoiceService;
  private readonly collectionService: CollectionService;

  constructor(secretKey: string) {
    this.invoiceService = new InvoiceService(secretKey);
    this.collectionService = new CollectionService(secretKey);
  }

  async getInvoice(invoiceId: string): Promise<GetInvoiceResponse> {
    return this.invoiceService.getInvoiceDetails(invoiceId);
  }

  async createInvoice(
    dynamicInvoice: CreateInvoiceProps
  ): Promise<CreateInvoiceResponse> {
    return this.invoiceService.createInvoice(dynamicInvoice);
  }

  async invalidateInvoice(
    invoiceId: string
  ): Promise<InvalidateInvoiceResponse> {
    return this.invoiceService.invalidateAnInvoice(invoiceId);
  }

  async getCollection(collectionId: string): Promise<GetCollectionResponse> {
    return this.collectionService.getCollectionDetails(collectionId);
  }

  async getCollectionInvoices(
    collectionId: string,
    params?: GetCollectionInvoicesParams
  ): Promise<GetCollectionInvoicesResponse> {
    return this.collectionService.getCollectionInvoices(collectionId, params);
  }
}

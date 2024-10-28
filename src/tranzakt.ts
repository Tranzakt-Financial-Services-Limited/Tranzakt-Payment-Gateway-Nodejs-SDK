import { CollectionService } from "./repository/collection";
import { InvoiceService } from "./repository/invoice";
import {
  Collection,
  CreateInvoiceProps,
  GetCollectionInvoicesParams,
  GetCollectionInvoicesResponse,
  Invoice,
} from "./types";

export class Tranzakt {
  private readonly invoiceService: InvoiceService;
  private readonly collectionService: CollectionService;

  constructor(secretKey: string) {
    this.invoiceService = new InvoiceService(secretKey);
    this.collectionService = new CollectionService(secretKey);
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    return this.invoiceService.getInvoiceDetails(invoiceId);
  }

  async createInvoice(dynamicInvoice: CreateInvoiceProps): Promise<Invoice> {
    return this.invoiceService.createInvoice(dynamicInvoice);
  }

  async invalidateInvoice(invoiceId: string): Promise<null> {
    return this.invoiceService.invalidateAnInvoice(invoiceId);
  }

  async getCollection(collectionId: string): Promise<Collection> {
    return this.collectionService.getCollectionDetails(collectionId);
  }

  async getCollectionInvoices(
    collectionId: string,
    params?: GetCollectionInvoicesParams
  ): Promise<GetCollectionInvoicesResponse> {
    return this.collectionService.getCollectionInvoices(collectionId, params);
  }
}

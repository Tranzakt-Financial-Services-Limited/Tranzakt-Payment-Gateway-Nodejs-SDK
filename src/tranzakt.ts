import { CollectionService } from "./services/collection";
import { InvoiceService } from "./services/invoice";
import {
  AccountType,
  CreateInvoiceProps,
  CreateInvoiceResponse,
  GenerateVirtualAccountResponse,
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
    dynamicInvoice: CreateInvoiceProps,
  ): Promise<CreateInvoiceResponse> {
    return this.invoiceService.createInvoice(dynamicInvoice);
  }
  /**
   *
   * @param invoiceId Invoice ID for which the virtual account is to be generated
   * @param accountType Dynamic account type expires in 1 hour, Static account type expires in 3 days
   * @returns
   */
  async generateVirtualAccount(
    invoiceId: string,
    accountType: AccountType,
  ): Promise<GenerateVirtualAccountResponse> {
    return this.invoiceService.generateVirtualAccount(invoiceId, accountType);
  }

  async invalidateInvoice(
    invoiceId: string,
  ): Promise<InvalidateInvoiceResponse> {
    return this.invoiceService.invalidateAnInvoice(invoiceId);
  }

  async getCollection(collectionId: string): Promise<GetCollectionResponse> {
    return this.collectionService.getCollectionDetails(collectionId);
  }

  async getCollectionInvoices(
    collectionId: string,
    params?: GetCollectionInvoicesParams,
  ): Promise<GetCollectionInvoicesResponse> {
    return this.collectionService.getCollectionInvoices(collectionId, params);
  }
}

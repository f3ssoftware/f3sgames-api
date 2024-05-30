export class PagseguroCreateOrderDto {
  reference_id!: string;
  customer!: {
    name: string;
    email: string;
    tax_id: string;
    phones: {
      country: string;
      area: string;
      number: string;
      type: string;
    }[];
  };
  items!: {
    name: string;
    quantity: number;
    unit_amount: number;
  }[];
  shipping!: {
    address: {
      street: string;
      number: string;
      complement: string;
      locality: string;
      city: string;
      region_code: string;
      country: string;
      postal_code: string;
    };
  };
  notification_urls!: string[];
}

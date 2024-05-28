export class PagseguroCreateOrderCreditCardDto {
  reference_id: string;
  customer: {
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
  items: {
    reference_id?: string;
    name: string;
    quantity: number;
    unit_amount: number;
  }[];
  shipping: {
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
  notification_urls: string[];
  charges: {
    reference_id: string;
    description: string;
    amount: {
      value: number;
      currency: string;
    };
    payment_method: {
      type: string;
      installments: number;
      capture: boolean;
      soft_descriptor: string;
      card: {
        number: string;
        exp_month: string;
        exp_year: string;
        security_code: string;
        holder: {
          name: string;
          tax_id: string;
        };
      };
    };
    sub_merchant: {
      reference_id: string;
      name: string;
      tax_id: string;
      mcc: string;
      address: {
        country: string;
        region_code: string;
        city: string;
        postal_code: string;
        street: string;
        number: string;
        locality: string;
        complement: string;
      };
      phones: {
        country: string;
        area: string;
        number: string;
        type: string;
      }[];
    };
    notification_urls: string[];
  }[];
}

// types/order.ts
export interface Order {
    id: string;
    customer: {
      name: string;
    };
    business: string;
    amount: number;
    status: 'requested' | 'approving' | 'scraping' | 'scraped' | 'analysing';
    createdAt: string; // ISO date string
  }
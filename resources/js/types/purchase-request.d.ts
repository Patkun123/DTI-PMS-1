export interface PurchaseRequestItem {
  id: number;
  item_description: string;
  stock_no: number;
  unit: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
}

export interface PurchaseRequests {
  id: number;
  pr_number: string;
  ris_number: string;
  status: "ongoing" | "approved" | "completed" | "cancelled";
  requested_date: string;
  purpose: string;
  ris_status: string;
  user: {
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  items: PurchaseRequestItem[];
}

export interface Machine {
  id?: string;
  name: string;
  manufacturer?: string;
  category?: string;
  purchase_price?: number;
  purchase_date?: string | null;
  vendor?: string;
  past_maintenances?: string[] | null;
  next_maintenance_date?: string | null;
  afa?: number
}
export interface Machine {
  id?: string;
  name: string;
  manufacturer?: string | null;
  manufacturing_year?: string | null;
  category?: string | null;
  original_price?: number | null;
  purchase_price?: number | null;
  purchase_date?: string | null;
  vendor?: string | null;
  past_maintenances?: string[] | null;
  last_maintenance_date?: string | null;
  last_maintenance_costs?: number | null;
  next_maintenance_date?: string | null;
  article_number?: string | null;
  afa?: number
  files?: {
    id: string,
    file_path: string,
    original_filename: string,
    file_type: string,
    mime_type: string
  }[]
}
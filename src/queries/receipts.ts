import { api } from "@/lib/axios";

export interface ReceiptOcrData {
  store?: string;
  date?: string;
  amount?: number;
  vat?: number;
  products?: { name: string; price: number; category?: string }[];
}

export interface Receipt {
  _id: string;
  cloudinaryUrl: string;
  ocrData?: ReceiptOcrData;
  status: "PENDING" | "VALIDATED" | "REJECTED";
}

export const receiptQueries = {
  upload: async (base64Image: string) => {
    return api.post<any, Receipt>("/receipts/upload", { base64Image });
  },
};

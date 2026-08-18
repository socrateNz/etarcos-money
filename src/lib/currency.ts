import { DEFAULT_CURRENCY } from "@/config";

/**
 * Formats an amount as a currency string (e.g. "1 000 FCFA", "12,50 €").
 * Defaults to the app's default currency (XAF) when none is provided,
 * since most amounts in this app aren't yet tied to a specific account.
 */
export function formatCurrency(amount: number, currency: string = DEFAULT_CURRENCY) {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
  }
}


import type { Invoice } from '../types/api';

export type InvoiceDueSort =
  | 'default'
  | 'amount-desc'
  | 'due-date-asc'
  | 'customer-asc';

export function sortDueInvoices(
  invoices: Invoice[],
  sort: InvoiceDueSort,
): Invoice[] {
  // Keep the API's original order when the default is selected.
  if (sort === 'default') {
    return invoices;
  }

  return [...invoices].sort((a, b) => {
    switch (sort) {
      case 'amount-desc':
        return b.outstanding_amount - a.outstanding_amount;

      case 'due-date-asc': {
        // Invoices without a due date appear after dated invoices.
        if (!a.due_date) return b.due_date ? 1 : 0;
        if (!b.due_date) return -1;
        return a.due_date.localeCompare(b.due_date);
      }

      case 'customer-asc': {
        const nameA = (a.ledger_name ?? '').toLowerCase();
        const nameB = (b.ledger_name ?? '').toLowerCase();

        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      }

      default:
        return 0;
    }
  });
}

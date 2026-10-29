import { describe, expect, it } from 'vitest';
import { sortDueInvoices } from './invoiceDuesSorting';
import type { Invoice } from '../types/api';

function invoice(
  id: number,
  amount: number,
  dueDate: string | null,
  customer: string | null,
): Invoice {
  return {
    id,
    outstanding_amount: amount,
    due_date: dueDate,
    ledger_name: customer,
  } as Invoice;
}

const invoices = [
  invoice(1, 100, '2026-10-20', 'Zebra Ltd'),
  invoice(2, 300, '2026-10-10', 'acme Ltd'),
  invoice(3, 200, null, 'Beta Ltd'),
];

describe('sortDueInvoices', () => {
  it('preserves the original order by default', () => {
    expect(sortDueInvoices(invoices, 'default')).toEqual(invoices);
  });

  it('sorts amount due from highest to lowest', () => {
    expect(
      sortDueInvoices(invoices, 'amount-desc').map((item) => item.id),
    ).toEqual([2, 3, 1]);
  });

  it('sorts oldest due date first and puts missing dates last', () => {
    expect(
      sortDueInvoices(invoices, 'due-date-asc').map((item) => item.id),
    ).toEqual([2, 1, 3]);
  });

  it('sorts customer names alphabetically without case sensitivity', () => {
    expect(
      sortDueInvoices(invoices, 'customer-asc').map((item) => item.id),
    ).toEqual([2, 3, 1]);
  });

  it('does not mutate the input array', () => {
    const originalOrder = invoices.map((item) => item.id);

    sortDueInvoices(invoices, 'amount-desc');

    expect(invoices.map((item) => item.id)).toEqual(originalOrder);
  });
});

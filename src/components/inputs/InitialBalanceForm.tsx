import { useBudgetStore } from '@/store/budgetStore';
import { formatCurrency } from '@/lib/utils';
import { DebouncedNumberInput } from './DebouncedNumberInput';

export function InitialBalanceForm() {
  const { initialBalance, setInitialBalance, projectionMonths, setProjectionMonths } =
    useBudgetStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Current Cash on Hand
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <DebouncedNumberInput
            value={initialBalance}
            onChange={setInitialBalance}
            step="100"
            className="w-full rounded-md border border-input bg-background px-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Starting balance: {formatCurrency(initialBalance)}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Projection Length
        </label>
        <select
          value={projectionMonths}
          onChange={(e) => setProjectionMonths(Number(e.target.value))}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value={3}>3 months</option>
          <option value={6}>6 months</option>
          <option value={12}>12 months</option>
          <option value={18}>18 months</option>
          <option value={24}>24 months</option>
        </select>
      </div>
    </div>
  );
}

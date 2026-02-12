import { useBudgetStore } from '@/store/budgetStore';
import { Plus, Trash2 } from 'lucide-react';
import { EditableLabel } from './EditableLabel';
import { DebouncedNumberInput } from './DebouncedNumberInput';

export function OneTimeIncomeForm() {
  const {
    oneTimeIncomes,
    addOneTimeIncome,
    updateOneTimeIncome,
    removeOneTimeIncome,
  } = useBudgetStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">One-Time Income</h3>
        <button
          onClick={addOneTimeIncome}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {oneTimeIncomes.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No one-time income. Add items like tax refunds, stipends, gifts, etc.
        </p>
      )}

      {oneTimeIncomes.map((income) => (
        <div
          key={income.id}
          className="rounded-lg border border-input p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <EditableLabel
              value={income.label}
              onChange={(val) =>
                updateOneTimeIncome(income.id, { label: val })
              }
              placeholder="Description"
              className="flex-1"
            />
            <button
              onClick={() => removeOneTimeIncome(income.id)}
              className="text-muted-foreground hover:text-destructive transition-colors p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Amount ($)
              </label>
              <DebouncedNumberInput
                value={income.amount}
                onChange={(val) =>
                  updateOneTimeIncome(income.id, { amount: val })
                }
                min={0}
                step="100"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Date
              </label>
              <input
                type="date"
                value={income.date}
                onChange={(e) =>
                  updateOneTimeIncome(income.id, { date: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

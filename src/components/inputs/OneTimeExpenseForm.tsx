import { useBudgetStore } from '@/store/budgetStore';
import { Plus, Trash2 } from 'lucide-react';
import { EditableLabel } from './EditableLabel';
import { DebouncedNumberInput } from './DebouncedNumberInput';

export function OneTimeExpenseForm() {
  const {
    oneTimeExpenses,
    addOneTimeExpense,
    updateOneTimeExpense,
    removeOneTimeExpense,
  } = useBudgetStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">One-Time Expenses</h3>
        <button
          onClick={addOneTimeExpense}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {oneTimeExpenses.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No one-time expenses. Add items like tuition, a new laptop, etc.
        </p>
      )}

      {oneTimeExpenses.map((expense) => (
        <div
          key={expense.id}
          className="rounded-lg border border-input p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <EditableLabel
              value={expense.label}
              onChange={(val) =>
                updateOneTimeExpense(expense.id, { label: val })
              }
              placeholder="Description"
              className="flex-1"
            />
            <button
              onClick={() => removeOneTimeExpense(expense.id)}
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
                value={expense.amount}
                onChange={(val) =>
                  updateOneTimeExpense(expense.id, { amount: val })
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
                value={expense.date}
                onChange={(e) =>
                  updateOneTimeExpense(expense.id, { date: e.target.value })
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

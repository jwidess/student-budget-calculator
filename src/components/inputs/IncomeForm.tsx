import { useBudgetStore } from '@/store/budgetStore';
import { Plus, Trash2, X } from 'lucide-react';
import type { PayFrequency } from '@/engine/types';
import { format, addMonths, parseISO, differenceInCalendarDays, addDays, getDate } from 'date-fns';
import { EditableLabel } from './EditableLabel';
import { DebouncedNumberInput } from './DebouncedNumberInput';
import { SortableItem } from './SortableItem';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export function IncomeForm() {
  const {
    recurringIncomes,
    addRecurringIncome,
    updateRecurringIncome,
    removeRecurringIncome,
    reorderRecurringIncomes,
    projectionMonths,
  } = useBudgetStore();

  const minDate = format(new Date(), 'yyyy-MM-dd');
  const maxDate = format(addMonths(new Date(), projectionMonths), 'yyyy-MM-dd');

  const isDateOutOfRange = (dateStr: string) => {
    return dateStr < minDate || dateStr > maxDate;
  };

  // Snap end date to nearest valid pay date based on frequency
  const snapToValidPayDate = (startDateStr: string, endDateStr: string, frequency: PayFrequency): string => {
    const startDate = parseISO(startDateStr);
    const endDate = parseISO(endDateStr);
    const daysDiff = differenceInCalendarDays(endDate, startDate);

    if (daysDiff < 0) return startDateStr;

    let snappedDate: Date;
    switch (frequency) {
      case 'weekly': {
        const weeks = Math.round(daysDiff / 7);
        snappedDate = addDays(startDate, weeks * 7);
        break;
      }
      case 'biweekly': {
        const biweeks = Math.round(daysDiff / 14);
        snappedDate = addDays(startDate, biweeks * 14);
        break;
      }
      case 'monthly': {
        // For monthly, ensure it's the same day of month as start date
        const startDay = getDate(startDate);
        let testDate = new Date(endDate);
        testDate.setDate(startDay);
        // If the month doesn't have that day, use the last day of the month
        if (getDate(testDate) !== startDay) {
          testDate.setDate(0); // Sets to last day of previous month
        }
        snappedDate = testDate;
        break;
      }
      default:
        snappedDate = endDate;
    }

    return format(snappedDate, 'yyyy-MM-dd');
  };

  // Calculate number of paychecks between start and end dates
  const countPaychecks = (startDateStr: string, endDateStr: string | undefined, frequency: PayFrequency): number => {
    if (!endDateStr) return -1; // Indefinite
    
    const startDate = parseISO(startDateStr);
    const endDate = parseISO(endDateStr);
    const daysDiff = differenceInCalendarDays(endDate, startDate);

    if (daysDiff < 0) return 0;

    switch (frequency) {
      case 'weekly':
        return Math.floor(daysDiff / 7) + 1;
      case 'biweekly':
        return Math.floor(daysDiff / 14) + 1;
      case 'monthly': {
        // Count months between dates
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                       (endDate.getMonth() - startDate.getMonth());
        return months + 1;
      }
      default:
        return 0;
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = recurringIncomes.findIndex((i) => i.id === active.id);
      const newIndex = recurringIncomes.findIndex((i) => i.id === over.id);
      reorderRecurringIncomes(oldIndex, newIndex);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Recurring Income</h3>
        <button
          onClick={addRecurringIncome}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/80 hover:shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {recurringIncomes.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No recurring income added yet.
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={recurringIncomes.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {recurringIncomes.map((income) => {
            const isOutOfRange = isDateOutOfRange(income.startDate) || (income.endDate && isDateOutOfRange(income.endDate));
            return (
            <SortableItem key={income.id} id={income.id} className={isOutOfRange ? 'border-2 border-red-500 bg-orange-100' : ''}>
              <div className="flex items-center gap-2">
                <EditableLabel
                  value={income.label}
                  onChange={(val) => updateRecurringIncome(income.id, { label: val })}
                  placeholder="Income label"
                  className="flex-1"
                />
                <button
                  onClick={() => removeRecurringIncome(income.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-red-100 rounded-md transition-all p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Hours/week
                  </label>
                  <DebouncedNumberInput
                    value={income.hoursPerWeek}
                    onChange={(val) => updateRecurringIncome(income.id, { hoursPerWeek: val })}
                    min={0}
                    step="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Hourly rate ($)
                  </label>
                  <DebouncedNumberInput
                    value={income.hourlyRate}
                    onChange={(val) => updateRecurringIncome(income.id, { hourlyRate: val })}
                    min={0}
                    step="0.50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Pay frequency
                  </label>
                  <select
                    value={income.frequency}
                    onChange={(e) =>
                      updateRecurringIncome(income.id, { frequency: e.target.value as PayFrequency })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Biweekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    First pay date
                  </label>
                  <input
                    type="date"
                    value={income.startDate}
                    onChange={(e) =>
                      updateRecurringIncome(income.id, { startDate: e.target.value })
                    }
                    min={minDate}
                    max={maxDate}
                    className="w-full rounded-md border border-input bg-background px-1 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Last pay date (optional)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={income.endDate || ''}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        if (!rawValue) {
                          updateRecurringIncome(income.id, { endDate: undefined });
                        } else {
                          const snapped = snapToValidPayDate(income.startDate, rawValue, income.frequency);
                          updateRecurringIncome(income.id, { endDate: snapped });
                        }
                      }}
                      min={income.startDate}
                      max={maxDate}
                      className="w-full rounded-md border border-input bg-background px-1 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-8"
                    />
                    {income.endDate && (
                      <button
                        type="button"
                        onClick={() => updateRecurringIncome(income.id, { endDate: undefined })}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        title="Clear end date"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {income.endDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {countPaychecks(income.startDate, income.endDate, income.frequency)} paychecks included
                    </p>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                ≈ ${(income.hoursPerWeek * income.hourlyRate * (income.frequency === 'biweekly' ? 2 : income.frequency === 'monthly' ? 52 / 12 : 1)).toFixed(0)}{' '}
                per {income.frequency === 'biweekly' ? '2 weeks' : income.frequency}
              </p>
            </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}

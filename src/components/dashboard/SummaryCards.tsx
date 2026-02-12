import { useProjection } from '@/hooks/useProjection';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AlertTriangle, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

export function SummaryCards() {
  const { lowestPoint, totalIncome, totalExpenses } = useProjection();

  const cards = [
    {
      label: 'Total Projected Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      label: 'Total Projected Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: 'text-red-500',
    },
    {
      label: 'Net',
      value: formatCurrency(totalIncome - totalExpenses),
      icon: DollarSign,
      color: totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-500',
    },
    {
      label: 'Lowest Balance',
      value: lowestPoint ? formatCurrency(lowestPoint.balance) : '—',
      subtitle: lowestPoint
        ? formatDate(new Date(lowestPoint.date + 'T00:00:00'))
        : undefined,
      icon: AlertTriangle,
      color: lowestPoint && lowestPoint.balance < 0 ? 'text-red-500' : 'text-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border bg-card p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">
              {card.label}
            </span>
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </div>
          <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          {card.subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function WarningBanner() {
  const { dangerDate, lowestPoint } = useProjection();

  if (!dangerDate) return null;

  const deficit = lowestPoint ? Math.abs(lowestPoint.balance) : 0;

  return (
    <div className="rounded-xl border-2 border-red-400 bg-red-50 dark:bg-red-950/30 p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
          Warning: Balance goes negative!
        </p>
        <p className="text-sm text-red-600 dark:text-red-300 mt-1">
          At current projections, you'll run out of money on{' '}
          <strong>{formatDate(new Date(dangerDate.date + 'T00:00:00'))}</strong>.
          {deficit > 0 && (
            <>
              {' '}
              Your lowest point is{' '}
              <strong>{formatCurrency(-deficit)}</strong>. Consider reducing
              expenses or adding income of at least{' '}
              <strong>{formatCurrency(deficit)}</strong>.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

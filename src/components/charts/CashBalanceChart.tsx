import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useProjection } from '@/hooks/useProjection';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { DailySnapshot } from '@/engine/types';

interface ChartDataPoint {
  date: string;
  balance: number;
  positive: number | null;
  negative: number | null;
  events: string[];
}

function prepareChartData(snapshots: DailySnapshot[]): ChartDataPoint[] {
  return snapshots.map((s) => ({
    date: s.date,
    balance: s.balance,
    positive: s.balance >= 0 ? s.balance : null,
    negative: s.balance < 0 ? s.balance : null,
    events: s.events,
  }));
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.[0]) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border bg-card p-3 shadow-md">
      <p className="text-sm font-medium">{formatDate(new Date(data.date + 'T00:00:00'))}</p>
      <p
        className={`text-lg font-bold ${
          data.balance >= 0 ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {formatCurrency(data.balance)}
      </p>
      {data.events.length > 0 && (
        <div className="mt-1 border-t pt-1">
          {data.events.map((e, i) => (
            <p key={i} className="text-xs text-muted-foreground">
              • {e}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function CashBalanceChart() {
  const { snapshots } = useProjection();
  const data = prepareChartData(snapshots);

  // Smart sampling: always include days with events (expenses/income),
  // plus enough regular points for a smooth line
  const sampled = useMemo(() => {
    if (data.length <= 180) return data; // Under 6 months: show all days

    const step = Math.max(2, Math.floor(data.length / 180));
    const result: ChartDataPoint[] = [];
    const included = new Set<number>();

    // Always include days with events
    data.forEach((d, i) => {
      if (d.events.length > 0) included.add(i);
    });

    // Add regularly spaced points for smooth curve
    for (let i = 0; i < data.length; i += step) {
      included.add(i);
    }
    // Always include first and last
    included.add(0);
    included.add(data.length - 1);

    // Sort indices and build result
    const sorted = Array.from(included).sort((a, b) => a - b);
    for (const idx of sorted) {
      const point = data[idx];
      if (point) result.push(point);
    }
    return result;
  }, [data]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Cash Balance Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={sampled}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.05} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => {
              const date = new Date(d + 'T00:00:00');
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
            }}
            interval={Math.floor(sampled.length / 8)}
            fontSize={12}
          />
          <YAxis
            tickFormatter={(v: number) => formatCurrency(v)}
            fontSize={12}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="positive"
            stroke="#22c55e"
            fill="url(#colorPositive)"
            strokeWidth={2}
            connectNulls={false}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="negative"
            stroke="#ef4444"
            fill="url(#colorNegative)"
            strokeWidth={2}
            connectNulls={false}
            dot={false}
          />
          {/* Full balance line for continuity */}
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#6366f1"
            fill="none"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

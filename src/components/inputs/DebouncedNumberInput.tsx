import { useState, useCallback, useRef, useEffect } from 'react';

interface DebouncedNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: string;
  className?: string;
}

/**
 * A number input that uses local state while typing and only commits
 * to the store on blur or Enter. This prevents chart recalculations
 * on every keystroke.
 */
export function DebouncedNumberInput({
  value,
  onChange,
  min,
  max,
  step,
  className = '',
}: DebouncedNumberInputProps) {
  const [local, setLocal] = useState(String(value));
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!focused) {
      setLocal(String(value));
    }
  }, [value, focused]);

  const commit = useCallback(() => {
    setFocused(false);
    let num = Number(local);
    if (isNaN(num)) num = 0;
    if (min !== undefined) num = Math.max(min, num);
    if (max !== undefined) num = Math.min(max, num);
    if (num !== value) {
      onChange(num);
    }
    setLocal(String(num));
  }, [local, value, onChange, min, max]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        inputRef.current?.blur();
      }
    },
    []
  );

  return (
    <input
      ref={inputRef}
      type="number"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      min={min}
      max={max}
      step={step}
      className={
        className ||
        'w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
      }
    />
  );
}

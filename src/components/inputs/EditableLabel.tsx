import { useState, useCallback, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';

interface EditableLabelProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * A text input that looks styled as a visible field with a pencil icon,
 * and only commits changes to the store on blur (not every keystroke).
 */
export function EditableLabel({
  value,
  onChange,
  placeholder = 'Enter name...',
  className = '',
}: EditableLabelProps) {
  const [local, setLocal] = useState(value);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync from store when value changes externally (e.g. reset)
  useEffect(() => {
    if (!focused) {
      setLocal(value);
    }
  }, [value, focused]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    if (local !== value) {
      onChange(local);
    }
  }, [local, value, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        inputRef.current?.blur();
      }
    },
    []
  );

  return (
    <div
      className={`group relative flex items-center gap-1.5 ${className}`}
    >
      <input
        ref={inputRef}
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full text-sm font-semibold rounded-md border border-input bg-background px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
      />
      <Pencil className="absolute right-2.5 w-3 h-3 text-muted-foreground pointer-events-none opacity-50 group-focus-within:opacity-0 transition-opacity" />
    </div>
  );
}

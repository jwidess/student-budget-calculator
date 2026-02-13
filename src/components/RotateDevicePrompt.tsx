import { Smartphone } from 'lucide-react';

export function RotateDevicePrompt() {
  return (
    <div className="rotate-prompt">
      <div className="rotate-prompt-content">
        <div className="rotate-icon">
          <Smartphone className="w-16 h-16" />
        </div>
        <h2 className="rotate-prompt-title">Please Rotate Your Device</h2>
        <p className="rotate-prompt-text">
          This app works best in landscape mode
        </p>
      </div>
    </div>
  );
}

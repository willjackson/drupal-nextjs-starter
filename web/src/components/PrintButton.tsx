'use client';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="text-primary hover:text-accent transition-colors robot-text text-sm"
    >
      Print Resume
    </button>
  );
}
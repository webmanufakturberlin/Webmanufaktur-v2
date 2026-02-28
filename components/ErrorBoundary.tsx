import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallbackMessage?: string }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[300px] text-center p-8">
          <div>
            <h2 className="text-xl font-bold text-ink mb-4">
              {this.props.fallbackMessage || 'Etwas ist schiefgelaufen.'}
            </h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

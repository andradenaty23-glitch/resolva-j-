import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from './ErrorState';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error | ErrorInfo, errorInfo?: ErrorInfo) {
    console.error('Aplicação encontrou um erro inesperado.');
  }

  public render() {
    const { hasError } = (this as any).state || {};
    if (hasError) {
      return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
          <ErrorState 
            type="unexpected" 
            onRetry={() => window.location.reload()}
            onGoHome={() => {
              window.location.href = '/';
            }}
          />
        </div>
      );
    }

    return (this as any).props?.children;
  }
}

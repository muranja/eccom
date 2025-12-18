/**
 * ============================================================================
 * ERROR BOUNDARY COMPONENT
 * ============================================================================
 * 
 * Catches React component errors and prevents full app crashes.
 * Provides fallback UI and error logging.
 * 
 * ============================================================================
 */

import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { analytics } from '../utils/analytics';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * Error Boundary Component
 * Wrap React components to prevent crashes
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log to console
        console.error('Error caught by boundary:', error, errorInfo);

        // Track error
        analytics.trackError(
            error.message,
            error.stack,
            errorInfo.componentStack || 'unknown'
        );

        // Call custom error handler
        this.props.onError?.(error, errorInfo);

        // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div className="flex-1">
                            <h3 className="font-bold text-red-900 mb-1">
                                Something went wrong
                            </h3>
                            <p className="text-red-700 text-sm mb-3">
                                We're sorry for the inconvenience. Please refresh the page.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm transition-colors"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>

                    {/* Show error details in development */}
                    {import.meta.env.DEV && this.state.error && (
                        <details className="mt-4 text-xs">
                            <summary className="cursor-pointer text-red-800 font-semibold">
                                Error Details (Dev Only)
                            </summary>
                            <pre className="mt-2 p-2 bg-red-100 rounded text-red-900 overflow-auto">
                                {this.state.error.message}
                                {'\n\n'}
                                {this.state.error.stack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

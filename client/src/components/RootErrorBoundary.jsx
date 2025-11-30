

import React from 'react';
import { useTranslation } from 'react-i18next';
import StackPreview from './StackPreview';
import { sendErrorReport } from '@/utils/reportError';

export default class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null,
      ticketId: null,
      reporting: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Keep component stack for the reporter button
    this.setState({ info });
    if (import.meta?.env?.DEV) {
      console.error('[RootErrorBoundary]', error, info?.componentStack);
    }
  }

  handleReload = () => {
    try {
      // Soft reset (let the user retry without full reload)
      this.setState({
        hasError: false,
        error: null,
        info: null,
        ticketId: null,
        reporting: false,
      });
    } catch {
      if (typeof window !== 'undefined') window.location.reload();
    }
  };

  handleReport = async () => {
    const { error, info } = this.state;
    this.setState({ reporting: true });
    try {
      const res = await sendErrorReport({
        message: error?.message || 'Unknown error',
        name: error?.name || 'Error',
        stack: error?.stack || '',
        componentStack: info?.componentStack || '',
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        appReady: typeof window !== 'undefined' ? !!window.__APP_READY : false,
        time: new Date().toISOString(),
      });
      this.setState({ ticketId: res?.ticketId || null });
    } catch {
      // non-blocking
    } finally {
      this.setState({ reporting: false });
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    // Inner function component to safely use hooks (i18n)
    const BoundaryUI = () => {
      const { t, i18n } = useTranslation('common');
      const isRTL = typeof i18n.dir === 'function' ? i18n.dir() === 'rtl' : false;
      const message =
        this.state.error?.message ||
        t('error.generic', { defaultValue: 'Something went wrong.' });

      return (
        <section
          className="container mx-auto px-inline py-10"
          dir={isRTL ? 'rtl' : 'ltr'}
          data-testid="root-error-boundary"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-2xl mx-auto rounded-xl border border-[var(--stroke,#e5e7eb)] bg-[var(--card,#fff)] p-6 shadow-md">
            <h1 className="text-2xl font-semibold text-[var(--fg,#0f1115)] mb-2">
              {t('error.title', { defaultValue: 'Unexpected error' })}
            </h1>
            <p className="text-[var(--muted,#667085)]">
              {message}
            </p>

            <StackPreview stack={this.state.error?.stack} />

            {this.state.ticketId ? (
              <p className="mt-4 text-sm text-[var(--muted,#667085)]">
                {t('error.ticket', { defaultValue: 'Report ID:' })}{' '}
                <span className="font-mono">{this.state.ticketId}</span>
              </p>
            ) : null}

            <div className={`mt-5 flex gap-3 ${isRTL ? 'justify-start' : 'justify-end'}`}>
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-[var(--stroke)] bg-white hover:bg-[color-mix(in_oklab,white,black_5%)]"
                onClick={this.handleReload}
              >
                {t('error.tryAgain', { defaultValue: 'Try again' })}
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-[var(--brand,#0D3B4C)] text-white hover:opacity-90 disabled:opacity-60"
                onClick={this.handleReport}
                disabled={this.state.reporting}
              >
                {this.state.reporting
                  ? t('error.reporting', { defaultValue: 'Reporting…' })
                  : t('error.report', { defaultValue: 'Report issue' })}
              </button>
            </div>
          </div>
        </section>
      );
    };

    return <BoundaryUI />;
  }
}

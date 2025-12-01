import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './test/mocks/server';

// Provide a safe global fetch mock for tests that expect network calls.
// Assign a vi.fn() directly so tests can call .mockResolvedValueOnce() on it.
const fetchMock = vi.fn(() =>
	Promise.resolve({
		ok: true,
		status: 200,
		json: async () => ({}),
		headers: { get: () => null }
	} as unknown as Response)
);
globalThis.fetch = fetchMock as any;

// Ensure tests run with an "online" navigator so offline guards don't block submission
if (typeof (globalThis as any).navigator === 'undefined') {
	(globalThis as any).navigator = { onLine: true };
} else {
	try { (globalThis as any).navigator.onLine = true } catch (e) { /* ignore */ }
}

// Mark environment as Vitest so components that check globalThis.__VITEST__ can
// detect test runs and skip runtime-only behaviors (e.g. time-trap updates).
(globalThis as any).__VITEST__ = true;

// Mock IntersectionObserver for framer-motion viewport animations
(globalThis as any).IntersectionObserver = class IntersectionObserver {
	constructor() {}
	disconnect() {}
	observe() {}
	takeRecords() { return []; }
	unobserve() {}
};

// Mock i18n.dir() method for test compatibility (i18next may not fully initialize in jsdom)
// Import happens after i18n.js has initialized, so we can safely patch it
// @ts-ignore - i18n.js is not typed
import('./i18n').then(({ default: i18n }) => {
	if (!i18n.dir) {
		i18n.dir = () => 'ltr';
	}
}).catch(() => {
	// If import fails in test environment, that's OK
});

// If MSW server is available, start it for all tests and ensure handlers are reset between tests.
try {
	beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());
} catch (e) {
	// If the server module is not present or fails, don't break the test setup.
}

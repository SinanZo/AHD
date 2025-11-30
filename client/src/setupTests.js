// src/setupTests.js
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

globalThis.__VITEST__ = true

// Give JSDOM a sensible origin (helps react-router, URL(), cookies, etc.)
if (typeof window !== 'undefined' && !window.location?.origin) {
	Object.defineProperty(window, 'location', {
		value: new URL('http://localhost/'),
		writable: true,
	})
}

// matchMedia (your original)
if (typeof window !== 'undefined' && !window.matchMedia) {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(), // deprecated
			removeListener: vi.fn(), // deprecated
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	})
}

// rAF/cAF (helps framer-motion, animations, timers)
if (!globalThis.requestAnimationFrame) {
	globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16)
}
if (!globalThis.cancelAnimationFrame) {
	globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
}

// scrollTo stub (avoids “not implemented” errors)
if (typeof window !== 'undefined' && !window.scrollTo) {
	window.scrollTo = vi.fn()
}

// IntersectionObserver shim (your original, fine)
if (!globalThis.IntersectionObserver) {
	globalThis.IntersectionObserver = class {
		constructor() {}
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords() { return [] }
	}
}

// ResizeObserver shim (commonly needed for charts/layout libs)
if (!globalThis.ResizeObserver) {
	globalThis.ResizeObserver = class {
		constructor() {}
		observe() {}
		unobserve() {}
		disconnect() {}
	}
}

// crypto + TextEncoder/Decoder (occasionally needed for UUIDs/i18n)
try {
	if (!globalThis.crypto?.getRandomValues) {
		const { webcrypto } = await import('node:crypto')
		globalThis.crypto = webcrypto
	}
} catch (err) {
	// Log and continue if webcrypto isn't available in this environment
	console.warn('setupTests: webcrypto polyfill failed, continuing without it:', err)
}
if (!globalThis.TextEncoder) {
	const { TextEncoder, TextDecoder } = await import('node:util')
	Object.assign(globalThis, { TextEncoder, TextDecoder })
}

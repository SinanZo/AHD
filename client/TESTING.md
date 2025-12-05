# Testing Guide - @ahd/client

This document explains the testing setup, conventions, and best practices for the AHD client application.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Network Mocking](#network-mocking)
- [Path Aliases](#path-aliases)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Known Limitations](#known-limitations)
- [Troubleshooting](#troubleshooting)

---

## Overview

We use **Vitest** with **React Testing Library** to test our components. Tests focus on user behavior and actual component output rather than implementation details.

**Current Status**: 25/25 tests passing ✅

---

## Testing Stack

### Core Tools

- **[Vitest](https://vitest.dev/)** (v2.1.9) - Fast unit test framework with native ESM support
- **[React Testing Library](https://testing-library.com/react)** (v16.3.0) - User-centric component testing
- **[jsdom](https://github.com/jsdom/jsdom)** (v27.2.0) - DOM environment for Node.js
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro)** (v14.6.1) - Realistic user interactions
- **[MSW](https://mswjs.io/)** (v2.12.3) - API mocking (currently unused, global fetch mock preferred)

### Test Utilities

- **Custom `renderWithProviders`** - Wraps components with required providers (Theme, I18n, Router)
- **Global fetch mock** - Intercepts network requests in tests
- **IntersectionObserver polyfill** - Enables framer-motion animations in tests

---

## Running Tests

### Full Test Suite

```bash
# Run all tests once
pnpm --filter @ahd/client test -- --run

# Run in watch mode (automatically re-runs on file changes)
pnpm --filter @ahd/client test

# Run with verbose output
pnpm --filter @ahd/client test -- --run --reporter=verbose
```

### Specific Test Files

```bash
# Run tests matching a pattern
pnpm --filter @ahd/client test -- --run "ProductsSection"
pnpm --filter @ahd/client test -- --run "ContactSection"
pnpm --filter @ahd/client test -- --run "Header"

# Run a specific test file
pnpm --filter @ahd/client test -- --run src/components/__tests__/ContactForm.test.jsx
```

### From Repository Root

```powershell
# Windows PowerShell
Set-Location "C:\path\to\AHD"
pnpm --filter @ahd/client test -- --run
```

---

## Test Structure

### File Organization

```
client/
├── src/
│   ├── setupTests.ts              # Global test configuration
│   ├── test/
│   │   ├── utils.ts               # Custom render helpers
│   │   └── mocks/
│   │       └── server.ts          # MSW server setup (optional)
│   └── components/
│       └── __tests__/             # Component tests
│           ├── ContactForm.test.jsx
│           ├── ContactSection.int.test.jsx
│           └── ProductsSection.int.test.jsx
└── vitest.config.ts               # Vitest configuration
```

### Setup Files

**`setupTests.ts`** - Runs before all tests:
- Polyfills IntersectionObserver for framer-motion
- Mocks global `fetch` for network requests
- Mocks `navigator.onLine` for offline tests
- Mocks i18n `dir()` function
- Configures MSW server lifecycle

**`test/utils.ts`** - Test utilities:
```typescript
import { renderWithProviders } from '@/test/utils';

// Wraps component with all required providers
const { container } = renderWithProviders(<MyComponent />);
```

---

## Network Mocking

### Global Fetch Mock

Tests use a **global fetch mock** instead of MSW for simplicity:

```javascript
// In your test
import { vi } from 'vitest';

test('fetches data', async () => {
  // Mock fetch for this test
  globalThis.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'value' }),
    headers: { get: () => 'application/json' }
  });

  // Render component that calls fetch
  renderWithProviders(<MyComponent />);

  // Assert on results
  await waitFor(() => {
    expect(screen.getByText(/value/i)).toBeInTheDocument();
  });

  // Verify fetch was called
  expect(globalThis.fetch).toHaveBeenCalledWith('/api/endpoint');
});
```

### ProductsSection Example

The `ProductsSection` component fetches `/images/products/manifest.json`:

```javascript
test('displays products when manifest loads successfully', async () => {
  const mockManifest = {
    products: [
      {
        id: 'roller-blinds',
        name: 'Roller Blinds',
        category: 'blinds',
        coverImage: '/images/products/roller-blinds.jpg',
        description: 'Classic roller blinds'
      }
    ]
  };

  globalThis.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => mockManifest,
    headers: { get: () => 'application/json' }
  });

  renderWithProviders(<ProductsSection />);

  // Wait for products to appear
  await waitFor(() => {
    const hasProducts = screen.queryByText(/roller blinds/i);
    expect(hasProducts).toBeTruthy();
  }, { timeout: 3000 });
});
```

### ContactForm API Mocking

ContactForm posts to `/api/contact`. Tests override the endpoint behavior:

```javascript
test('successful submit shows thank-you copy', async () => {
  server.use(
    http.post('/api/contact', async () => {
      await new Promise(r => setTimeout(r, 100)); // Simulate delay
      return HttpResponse.json({ ok: true, ticketId: 'AD-424242' }, { status: 200 });
    })
  );

  renderWithProviders(<ContactSection />);
  
  // Fill form and submit
  await userEvent.type(screen.getByLabelText(/name/i), 'Ahmad');
  await userEvent.type(screen.getByLabelText(/email/i), 'ahmad@example.com');
  await userEvent.type(screen.getByLabelText(/message/i), 'Hello from tests!');
  await userEvent.click(screen.getByRole('button', { name: /send|submit/i }));

  // Wait for success message
  await waitFor(() => {
    const success = screen.queryByText(/thank|success|sent/i);
    expect(success).toBeTruthy();
  }, { timeout: 3000 });
});
```

---

## Path Aliases

Tests support the same path aliases as the application:

### Available Aliases

```typescript
import Component from '@/components/Component';        // → src/components/Component
import { utility } from '@/utils/utility';             // → src/utils/utility
import { CONSTANT } from '@shared/const';              // → ../shared/const
```

### Configuration

Aliases are configured in:
1. **`tsconfig.json`** - TypeScript path mapping
2. **`vitest.config.ts`** - Vitest resolver
3. **`vite.config.ts`** - Vite bundler

All three must stay in sync. Example from `vitest.config.ts`:

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
});
```

---

## Best Practices

### 1. Test User Behavior, Not Implementation

✅ **Good** - Test what users see and do:
```javascript
await userEvent.click(screen.getByRole('button', { name: /submit/i }));
expect(screen.getByText(/success/i)).toBeInTheDocument();
```

❌ **Bad** - Test internal state:
```javascript
expect(component.state.isSubmitting).toBe(false);
```

### 2. Use Accessible Queries

Prefer queries that reflect how users find elements:

```javascript
// Priority order (best to worst):
screen.getByRole('button', { name: /submit/i })      // Best - semantic
screen.getByLabelText(/email/i)                      // Good - accessible
screen.getByText(/welcome/i)                         // OK - visible text
screen.getByTestId('submit-button')                  // Last resort
```

### 3. Wait for Async Updates

Always use `waitFor` or `findBy*` for async operations:

```javascript
// ❌ Don't do this - race condition
expect(screen.getByText(/success/i)).toBeInTheDocument();

// ✅ Do this - waits for element
expect(await screen.findByText(/success/i)).toBeInTheDocument();

// ✅ Or this - custom condition
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
}, { timeout: 3000 });
```

### 4. Handle Multiple Matching Elements

Use `getAllBy*` or `queryAllBy*` when multiple elements match:

```javascript
// Product titles appear multiple times in carousel
const products = screen.queryAllByText(/roller blinds/i);
expect(products.length).toBeGreaterThan(0);

// Get first matching button
const button = screen.getAllByRole('button', { name: /next/i })[0];
await userEvent.click(button);
```

### 5. Support I18n Fallbacks

Use regex patterns that match both translated text and i18n keys:

```javascript
// Accepts "Please enter your name" OR "form.errors.name"
const errors = screen.queryAllByText(/please enter|form\.errors/i);
expect(errors.length).toBeGreaterThan(0);
```

### 6. Test Realistic User Flows

Simulate complete user interactions:

```javascript
test('user can submit contact form', async () => {
  renderWithProviders(<ContactSection />);
  
  // User types in fields
  await userEvent.type(screen.getByLabelText(/name/i), 'Ahmad');
  await userEvent.type(screen.getByLabelText(/email/i), 'ahmad@example.com');
  await userEvent.type(screen.getByLabelText(/message/i), 'Hello, I need help with...');
  
  // User clicks submit
  await userEvent.click(screen.getByRole('button', { name: /send/i }));
  
  // User sees success message
  expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
});
```

---

## Common Patterns

### Pattern 1: Async Component Rendering

```javascript
test('displays data after loading', async () => {
  globalThis.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({ items: [{ name: 'Item 1' }] })
  });

  renderWithProviders(<DataComponent />);

  // Wait for data to appear
  await waitFor(() => {
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
  }, { timeout: 3000 });
});
```

### Pattern 2: Form Validation

```javascript
test('shows validation errors', async () => {
  renderWithProviders(<ContactForm />);

  // Submit empty form
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  // Expect validation messages
  await waitFor(() => {
    const errors = screen.queryAllByText(/required|please enter/i);
    expect(errors.length).toBeGreaterThan(0);
  });
});
```

### Pattern 3: User Interactions

```javascript
test('clicking button triggers action', async () => {
  const handleClick = vi.fn();
  renderWithProviders(<Button onClick={handleClick}>Click me</Button>);

  await userEvent.click(screen.getByRole('button', { name: /click me/i }));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Pattern 4: Checking Form State Changes

```javascript
test('disables submit button while pending', async () => {
  server.use(
    http.post('/api/contact', async () => {
      await new Promise(r => setTimeout(r, 500));
      return HttpResponse.json({ ok: true });
    })
  );

  renderWithProviders(<ContactForm />);

  const submit = screen.getByRole('button', { name: /submit/i });
  
  await userEvent.click(submit);

  // Button should be disabled during request
  await waitFor(() => {
    expect(
      submit.hasAttribute('disabled') ||
      submit.getAttribute('aria-disabled') === 'true'
    ).toBe(true);
  });

  // Button re-enables after completion
  await waitFor(() => {
    expect(submit.hasAttribute('disabled')).toBe(false);
  }, { timeout: 3000 });
});
```

### Pattern 5: Testing Text Split Across Elements

```javascript
test('success message appears', async () => {
  renderWithProviders(<ContactForm />);
  
  // Submit form...
  
  // Text might be split: "Thank you! Your message has been sent."
  // Use a function matcher or check parts separately
  await waitFor(() => {
    const hasThank = screen.queryByText(/thank/i);
    const hasSent = screen.queryByText(/sent/i);
    expect(hasThank && hasSent).toBeTruthy();
  }, { timeout: 3000 });
});
```

---

## Known Limitations

### Theme Toggle Test (next-themes + jsdom)

**Issue**: The `next-themes` library uses `localStorage` and system preference detection that don't work reliably in jsdom.

**Impact**: Header theme toggle test is skipped with this comment:

```javascript
// SKIP theme toggle assertions: next-themes uses localStorage + system 
// preference detection which doesn't work reliably in jsdom environment. 
// Theme functionality is tested in E2E/browser tests instead.
const themeBtn = getToggleThemeBtn();
expect(themeBtn).not.toBeDisabled();
await userEvent.click(themeBtn); // Verify it doesn't crash
```

**Workaround**: Test theme functionality in E2E tests using Playwright or Cypress where real browser APIs are available.

**Alternative**: Mock `next-themes` entirely:

```javascript
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    systemTheme: 'light'
  }),
  ThemeProvider: ({ children }) => children
}));
```

---

## Troubleshooting

### Tests Timing Out

**Symptom**: Tests fail with "Exceeded timeout of 5000ms"

**Solutions**:
1. Increase timeout in `waitFor`:
   ```javascript
   await waitFor(() => {
     expect(screen.getByText(/result/i)).toBeInTheDocument();
   }, { timeout: 10000 });
   ```

2. Add timeout to individual test:
   ```javascript
   test('slow operation', async () => {
     // test code
   }, 15000); // 15 second timeout
   ```

3. Check if async operation is actually completing:
   ```javascript
   console.log('DOM state:', screen.debug());
   ```

### Element Not Found

**Symptom**: "Unable to find element with text: /submit/i"

**Solutions**:
1. Check if element is rendered:
   ```javascript
   screen.debug(); // Prints entire DOM
   screen.debug(screen.getByRole('button')); // Prints specific element
   ```

2. Use more flexible queries:
   ```javascript
   // Instead of exact match
   screen.getByText('Submit')
   
   // Use regex for flexibility
   screen.getByText(/submit/i)
   
   // Or partial match
   screen.getByText('Submit', { exact: false })
   ```

3. Wait for element to appear:
   ```javascript
   // ❌ Synchronous query fails
   expect(screen.getByText(/result/i)).toBeInTheDocument();
   
   // ✅ Async query waits
   expect(await screen.findByText(/result/i)).toBeInTheDocument();
   ```

### Multiple Elements Found

**Symptom**: "Found multiple elements with text: /product/i"

**Solutions**:
```javascript
// Use getAllBy to get array
const products = screen.getAllByText(/product/i);
expect(products.length).toBe(3);

// Or get first matching element
const firstProduct = screen.getAllByText(/product/i)[0];
await userEvent.click(firstProduct);

// Or use more specific query
screen.getByRole('heading', { name: /product/i })
```

### Fetch Not Mocked

**Symptom**: "TypeError: fetch is not defined" or actual network requests

**Solution**: Mock fetch in your test:
```javascript
beforeEach(() => {
  globalThis.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('my test', async () => {
  globalThis.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'value' })
  });
  
  // test code
});
```

### React Version Mismatch

**Symptom**: Tests fail with "Cannot read property of undefined" or version conflicts

**Solution**: Check `pnpm-lock.yaml` for duplicate React versions. The repository uses `pnpm.overrides` to force React 18.3.1:

```json
{
  "pnpm": {
    "overrides": {
      "react": "18.3.1",
      "react-dom": "18.3.1"
    }
  }
}
```

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Docs](https://testing-library.com/react)
- [Testing Library Queries Cheatsheet](https://testing-library.com/docs/queries/about)
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [MSW Documentation](https://mswjs.io/docs/)

---

## Contributing

When adding new tests:

1. Follow existing patterns in `__tests__/` directories
2. Use `renderWithProviders` for components that need context
3. Mock network requests with global fetch or MSW
4. Add timeouts for slow async operations
5. Document any new test utilities in this guide

When tests fail:
1. Read the error message carefully
2. Use `screen.debug()` to inspect DOM
3. Check if you need `await` for async operations
4. Verify mocks are set up correctly

---

**Last Updated**: December 1, 2025  
**Test Coverage**: 25/25 tests passing ✅  
**Maintained By**: AHD Development Team

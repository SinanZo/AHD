import { setupServer } from 'msw/node';

// Minimal MSW server used by integration tests. Tests call `server.use(...)` to
// add per-test handlers. This file intentionally exports an empty server that
// tests will configure.
export const server = setupServer();

export default server;

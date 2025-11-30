import React from 'react';
import { Route, Switch } from 'wouter';

function TestHome() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Home Page</h1>
      <p>If you see this, routing is working!</p>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Switch>
        <Route path="/" component={TestHome} />
      </Switch>
    </div>
  );
}

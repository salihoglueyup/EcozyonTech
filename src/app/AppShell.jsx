import { AppProvider } from './providers/AppProvider';
import { AppRoutes } from './router';

// Router-agnostic app tree. The router is supplied by the entry:
// BrowserRouter on the client, StaticRouter during prerender.
export default function AppShell() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

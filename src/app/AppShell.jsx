import { AppProvider } from './providers/AppProvider';
import { AppRoutes } from './router';
import { ToastProvider } from '@/shared/ui/Toast';

// Router-agnostic app tree. The router is supplied by the entry:
// BrowserRouter on the client, StaticRouter during prerender.
export default function AppShell() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AppProvider>
  );
}

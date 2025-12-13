import AuthGuard from '@/components/AuthGuard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <AnalyticsDashboard />
    </AuthGuard>
  );
}

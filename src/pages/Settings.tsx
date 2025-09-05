import { Layout } from '@/components/layout/Layout';

export default function Settings() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage system settings and configurations</p>
      </div>
    </Layout>
  );
}
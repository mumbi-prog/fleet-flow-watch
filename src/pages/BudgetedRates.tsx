import { Layout } from '@/components/layout/Layout';

export default function BudgetedRates() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Budgeted Rates</h1>
        <p className="text-muted-foreground">Manage budgeted fuel consumption rates for trucks</p>
      </div>
    </Layout>
  );
}
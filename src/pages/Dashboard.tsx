import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel, TrendingUp, TrendingDown, Truck, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { FuelTransaction } from '@/types/database';

export default function Dashboard() {
  // Fetch recent transactions
  const { data: recentTransactions = [] } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fuel_transactions')
        .select(`
          *,
          trucks!inner(truck_number),
          drivers!inner(driver_name),
          customers!inner(customer_name)
        `)
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch summary statistics
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const { data: monthlyData, error } = await supabase
        .from('fuel_transactions')
        .select('litres_issued, km_covered, variance, consumption_rate')
        .gte('date', startOfMonth.toISOString());

      if (error) throw error;

      const transactions = monthlyData as Pick<FuelTransaction, 'litres_issued' | 'km_covered' | 'variance' | 'consumption_rate'>[] | null;
      
      const totalLitres = transactions?.reduce((sum, t) => sum + (t.litres_issued || 0), 0) || 0;
      const totalKm = transactions?.reduce((sum, t) => sum + (t.km_covered || 0), 0) || 0;
      const avgConsumption = transactions?.length 
        ? transactions.reduce((sum, t) => sum + (t.consumption_rate || 0), 0) / transactions.length 
        : 0;
      const totalVariance = transactions?.reduce((sum, t) => sum + Math.abs(t.variance || 0), 0) || 0;

      return {
        totalLitres: totalLitres.toFixed(2),
        totalKm,
        avgConsumption: avgConsumption.toFixed(3),
        totalVariance: totalVariance.toFixed(2),
      };
    },
  });

  // Fetch consumption trend data
  const { data: trendData = [] } = useQuery({
    queryKey: ['consumption-trend'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fuel_transactions')
        .select('date, consumption_rate, budgeted_rate')
        .order('date', { ascending: true })
        .limit(30);

      if (error) throw error;
      
      const transactions = data as Pick<FuelTransaction, 'date' | 'consumption_rate' | 'budgeted_rate'>[] | null;
      
      return transactions?.map(d => ({
        date: format(new Date(d.date), 'MMM dd'),
        actual: parseFloat(d.consumption_rate?.toFixed(3) || '0'),
        budgeted: parseFloat(d.budgeted_rate?.toFixed(3) || '0'),
      })) || [];
    },
  });

  const statCards = [
    {
      title: 'Total Fuel Issued',
      value: `${stats?.totalLitres || '0'} L`,
      description: 'This month',
      icon: Fuel,
      trend: 'up',
      color: 'text-primary',
    },
    {
      title: 'Distance Covered',
      value: `${stats?.totalKm || '0'} km`,
      description: 'This month',
      icon: Truck,
      trend: 'up',
      color: 'text-success',
    },
    {
      title: 'Avg Consumption',
      value: `${stats?.avgConsumption || '0'} L/km`,
      description: 'This month',
      icon: TrendingUp,
      trend: 'neutral',
      color: 'text-info',
    },
    {
      title: 'Total Variance',
      value: `${stats?.totalVariance || '0'} L`,
      description: 'This month',
      icon: AlertTriangle,
      trend: 'down',
      color: 'text-warning',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your fuel management dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Consumption Trend</CardTitle>
              <CardDescription>
                Actual vs Budgeted consumption over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="hsl(var(--primary))" 
                    name="Actual"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budgeted" 
                    stroke="hsl(var(--accent))" 
                    name="Budgeted"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest fuel transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.slice(0, 5).map((transaction: any) => (
                  <div key={transaction.transaction_id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {transaction.trucks?.truck_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.drivers?.driver_name} • {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {transaction.litres_issued?.toFixed(2)} L
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.km_covered} km
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
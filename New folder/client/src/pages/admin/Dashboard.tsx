import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Package, Users, Activity, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: metrics, isLoading } = trpc.admin.metrics.useQuery();

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your GAGE Solutions Hub performance.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Products"
            value={metrics?.totalProducts ?? 0}
            icon={Package}
            loading={isLoading}
            description="Solutions in the hub"
          />
          <MetricCard
            title="Total Leads"
            value={metrics?.totalLeads ?? 0}
            icon={Users}
            loading={isLoading}
            description="Contact submissions"
          />
          <MetricCard
            title="Downloads"
            value={metrics?.totalDownloads ?? 0}
            icon={Activity}
            loading={isLoading}
            description="Total activity events"
          />
          <MetricCard
            title="Registered Users"
            value={metrics?.totalUsers ?? 0}
            icon={TrendingUp}
            loading={isLoading}
            description="Signed-up users"
          />
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : metrics?.recentLeads && metrics.recentLeads.length > 0 ? (
              <div className="space-y-3">
                {metrics.recentLeads.map((lead: any) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{lead.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                    </div>
                    <div className="text-right">
                      {lead.company && (
                        <p className="text-xs text-muted-foreground">{lead.company}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No leads yet. They'll appear here when visitors submit the contact form.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  loading,
  description,
}: {
  title: string;
  value: number;
  icon: any;
  loading: boolean;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-100 rounded animate-pulse mt-1" />
            ) : (
              <p className="text-3xl font-bold mt-1">{value}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-[#2C3E2D]/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-[#2C3E2D]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


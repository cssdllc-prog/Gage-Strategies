import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Activity as ActivityIcon, Download, Eye, FileText, UserPlus } from "lucide-react";

const ACTION_ICONS: Record<string, any> = {
  download: Download,
  whitelabel: FileText,
  view: Eye,
  lead_submit: UserPlus,
};

const ACTION_COLORS: Record<string, string> = {
  download: "bg-blue-100 text-blue-700",
  whitelabel: "bg-purple-100 text-purple-700",
  view: "bg-gray-100 text-gray-700",
  lead_submit: "bg-green-100 text-green-700",
};

export default function AdminActivity() {
  const { data: activities, isLoading } = trpc.admin.activity.list.useQuery();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground mt-1">
            Track downloads, white-label requests, and client interactions.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {activities.map((activity: any) => {
                  const Icon = ACTION_ICONS[activity.action] || ActivityIcon;
                  const colorClass = ACTION_COLORS[activity.action] || "bg-gray-100 text-gray-700";
                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-4">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          <span className="capitalize">{activity.action.replace("_", " ")}</span>
                          {activity.productName && (
                            <span className="text-muted-foreground"> — {activity.productName}</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.userEmail || "Anonymous"}
                          {activity.metadata && ` • ${activity.metadata}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <ActivityIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No activity recorded yet.</p>
            <p className="text-xs mt-1">Downloads, white-label requests, and views will appear here.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


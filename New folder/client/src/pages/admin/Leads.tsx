import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Search, Trash2, Mail, Building2, MessageSquare, Headphones, CreditCard, Lightbulb, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const INQUIRY_TYPE_MAP: Record<string, { label: string; email: string; color: string }> = {
  general: { label: "General", email: "hello@gage-strategies.com", color: "bg-gray-100 text-gray-700" },
  solutions: { label: "Solutions", email: "solutions@gage-strategies.com", color: "bg-blue-100 text-blue-700" },
  hub: { label: "Hub", email: "hub@gage-strategies.com", color: "bg-green-100 text-green-700" },
  support: { label: "Support", email: "support@gage-strategies.com", color: "bg-orange-100 text-orange-700" },
  billing: { label: "Billing", email: "billing@gage-strategies.com", color: "bg-purple-100 text-purple-700" },
};

export default function AdminLeads() {
  const { data: leads, isLoading, refetch } = trpc.admin.leads.list.useQuery();
  const [search, setSearch] = useState("");

  const deleteMutation = trpc.admin.leads.delete.useMutation({
    onSuccess: () => { toast.success("Lead removed"); refetch(); },
    onError: (err) => toast.error(err.message),
  });

  const filteredLeads = leads?.filter((l: any) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.company && l.company.toLowerCase().includes(search.toLowerCase()))
  ) ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">
            Contact form submissions and interested prospects.
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLeads.map((lead: any) => (
              <Card key={lead.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#2C3E2D]/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-[#2C3E2D]">
                            {lead.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm">{lead.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {lead.email}
                            </span>
                            {lead.company && (
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {lead.company}
                              </span>
                            )}
                            {lead.inquiryType && lead.inquiryType !== "general" && (
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${INQUIRY_TYPE_MAP[lead.inquiryType]?.color || "bg-gray-100 text-gray-700"}`}>
                                <Tag className="h-2.5 w-2.5" />
                                {INQUIRY_TYPE_MAP[lead.inquiryType]?.label || lead.inquiryType} → {INQUIRY_TYPE_MAP[lead.inquiryType]?.email || "hello@gage-strategies.com"}
                              </span>
                            )}
                            {(!lead.inquiryType || lead.inquiryType === "general") && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700">
                                <Tag className="h-2.5 w-2.5" />
                                General → hello@gage-strategies.com
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {lead.message && (
                        <div className="ml-12 p-2 rounded bg-gray-50 text-xs text-muted-foreground flex items-start gap-2">
                          <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{lead.message}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <span className="text-xs text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm("Remove this lead?")) {
                            deleteMutation.mutate({ id: lead.id });
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredLeads.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No leads found.</p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {filteredLeads.length} leads shown
        </p>
      </div>
    </AdminLayout>
  );
}

function Users(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useOrg } from "@/contexts/OrgContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Building2, Plus, Users, Crown, Shield, User, Trash2, Copy, Mail } from "lucide-react";

export default function Organizations() {
  const { user } = useAuth();
  const { organizations, activeOrg, setActiveOrg, refetch } = useOrg();
  const [createOpen, setCreateOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgWebsite, setNewOrgWebsite] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");

  const createOrg = trpc.org.create.useMutation({
    onSuccess: () => {
      toast.success("Organization created!");
      setCreateOpen(false);
      setNewOrgName("");
      setNewOrgWebsite("");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteOrg = trpc.org.delete.useMutation({
    onSuccess: () => {
      toast.success("Organization deleted");
      setSelectedOrgId(null);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const selectedOrg = selectedOrgId ? organizations.find(o => o.id === selectedOrgId) : null;

  const { data: members = [], refetch: refetchMembers } = trpc.org.members.list.useQuery(
    { orgId: selectedOrgId! },
    { enabled: !!selectedOrgId }
  );

  const { data: invites = [], refetch: refetchInvites } = trpc.org.invites.list.useQuery(
    { orgId: selectedOrgId! },
    { enabled: !!selectedOrgId && (selectedOrg?.role === "owner" || selectedOrg?.role === "admin") }
  );

  const createInvite = trpc.org.invites.create.useMutation({
    onSuccess: (data) => {
      toast.success("Invite created! Share the link with your team member.");
      navigator.clipboard.writeText(data.inviteUrl);
      toast.info("Invite link copied to clipboard");
      setInviteEmail("");
      refetchInvites();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteInvite = trpc.org.invites.delete.useMutation({
    onSuccess: () => {
      toast.success("Invite cancelled");
      refetchInvites();
    },
    onError: (err) => toast.error(err.message),
  });

  const removeMember = trpc.org.members.remove.useMutation({
    onSuccess: () => {
      toast.success("Member removed");
      refetchMembers();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateRole = trpc.org.members.updateRole.useMutation({
    onSuccess: () => {
      toast.success("Role updated");
      refetchMembers();
    },
    onError: (err) => toast.error(err.message),
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-20 text-center">
          <p className="text-foreground/60">Please sign in to manage organizations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Organizations</h1>
            <p className="text-foreground/60 mt-1">Manage your teams and share purchases across members.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Organization</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Organization Name</label>
                  <Input
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="e.g., Acme Corp"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Website (optional)</label>
                  <Input
                    value={newOrgWebsite}
                    onChange={(e) => setNewOrgWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={() => createOrg.mutate({ name: newOrgName, website: newOrgWebsite || undefined })}
                  disabled={!newOrgName.trim() || createOrg.isPending}
                  className="w-full"
                >
                  {createOrg.isPending ? "Creating..." : "Create Organization"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Org List */}
          <div className="space-y-3">
            {organizations.length === 0 ? (
              <Card className="p-6 text-center">
                <Building2 className="w-10 h-10 mx-auto text-foreground/30 mb-3" />
                <p className="text-sm text-foreground/60">No organizations yet.</p>
                <p className="text-xs text-foreground/40 mt-1">Create one to start collaborating with your team.</p>
              </Card>
            ) : (
              organizations.map((org) => (
                <Card
                  key={org.id}
                  className={`p-4 cursor-pointer transition-all hover:border-primary/30 ${
                    selectedOrgId === org.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedOrgId(org.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{org.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {org.role === "owner" ? <Crown className="w-2.5 h-2.5 mr-0.5" /> : null}
                          {org.role}
                        </Badge>
                        {activeOrg?.id === org.id && (
                          <span className="text-[10px] text-primary font-medium">Active</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Org Detail / Team Management */}
          <div className="lg:col-span-2">
            {selectedOrg ? (
              <div className="space-y-6">
                {/* Org Header */}
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">{selectedOrg.name}</h2>
                      <p className="text-sm text-foreground/50 mt-0.5">
                        {selectedOrg.role === "owner" ? "You own this organization" : `You are a ${selectedOrg.role}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {activeOrg?.id !== selectedOrg.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setActiveOrg(selectedOrg); toast.success(`Switched to ${selectedOrg.name}`); }}
                        >
                          Set Active
                        </Button>
                      )}
                      {selectedOrg.role === "owner" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if (confirm(`Delete "${selectedOrg.name}"? This cannot be undone.`)) {
                              deleteOrg.mutate({ id: selectedOrg.id });
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Members */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Members ({members.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div key={member.userId} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                            {member.user?.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{member.user?.name || "Unknown"}</p>
                            <p className="text-xs text-foreground/50">{member.user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]">
                            {member.role === "owner" && <Crown className="w-2.5 h-2.5 mr-0.5" />}
                            {member.role === "admin" && <Shield className="w-2.5 h-2.5 mr-0.5" />}
                            {member.role === "member" && <User className="w-2.5 h-2.5 mr-0.5" />}
                            {member.role}
                          </Badge>
                          {(selectedOrg.role === "owner" || selectedOrg.role === "admin") && member.role !== "owner" && member.userId !== user.id && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => updateRole.mutate({
                                  orgId: selectedOrg.id,
                                  userId: member.userId,
                                  role: member.role === "admin" ? "member" : "admin"
                                })}
                              >
                                {member.role === "admin" ? "Demote" : "Promote"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-destructive"
                                onClick={() => {
                                  if (confirm(`Remove ${member.user?.name} from this organization?`)) {
                                    removeMember.mutate({ orgId: selectedOrg.id, userId: member.userId });
                                  }
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Invite Members */}
                {(selectedOrg.role === "owner" || selectedOrg.role === "admin") && (
                  <Card className="p-6">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                      <Mail className="w-4 h-4" />
                      Invite Team Members
                    </h3>
                    <div className="flex gap-2">
                      <Input
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="team@example.com"
                        type="email"
                        className="flex-1"
                      />
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as "admin" | "member")}
                        className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                      <Button
                        onClick={() => createInvite.mutate({
                          orgId: selectedOrg.id,
                          email: inviteEmail,
                          role: inviteRole,
                          origin: window.location.origin,
                        })}
                        disabled={!inviteEmail.trim() || createInvite.isPending}
                      >
                        {createInvite.isPending ? "Sending..." : "Send Invite"}
                      </Button>
                    </div>
                    <p className="text-xs text-foreground/40 mt-2">An invite link will be generated and copied to your clipboard. Share it with your team member.</p>

                    {/* Pending Invites */}
                    {invites.length > 0 && (
                      <div className="mt-4 border-t border-border pt-4">
                        <p className="text-xs font-medium text-foreground/60 mb-2">Pending Invites</p>
                        {invites.map((invite) => (
                          <div key={invite.id} className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm text-foreground">{invite.email}</p>
                              <p className="text-xs text-foreground/40">
                                Role: {invite.role} · Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-destructive"
                              onClick={() => deleteInvite.mutate({ orgId: selectedOrg.id, inviteId: invite.id })}
                            >
                              Cancel
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto text-foreground/20 mb-4" />
                <p className="text-foreground/60">Select an organization to manage its team</p>
                <p className="text-sm text-foreground/40 mt-1">Or create a new one to get started</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

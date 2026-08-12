import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Building2, CheckCircle, XCircle } from "lucide-react";

export default function InviteAccept() {
  const { token } = useParams<{ token: string }>();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const { data: inviteData, isLoading } = trpc.org.invites.getByToken.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  const acceptInvite = trpc.org.invites.accept.useMutation({
    onSuccess: (data) => {
      toast.success(`Welcome to ${data.organization?.name}!`);
      navigate("/organizations");
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="animate-pulse">
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4" />
            <div className="h-4 bg-muted rounded w-48 mx-auto mb-2" />
            <div className="h-3 bg-muted rounded w-32 mx-auto" />
          </div>
        </Card>
      </div>
    );
  }

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Invite Not Found</h1>
          <p className="text-foreground/60 text-sm">This invite link may have expired or been cancelled.</p>
          <Button onClick={() => navigate("/")} className="mt-6">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  if (inviteData.invite.status !== "pending") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Invite Already Accepted</h1>
          <p className="text-foreground/60 text-sm">This invite has already been used.</p>
          <Button onClick={() => navigate("/organizations")} className="mt-6">
            View Organizations
          </Button>
        </Card>
      </div>
    );
  }

  if (new Date(inviteData.invite.expiresAt) < new Date()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Invite Expired</h1>
          <p className="text-foreground/60 text-sm">This invite link has expired. Ask the organization admin to send a new one.</p>
          <Button onClick={() => navigate("/")} className="mt-6">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">
          Join {inviteData.organization?.name}
        </h1>
        <p className="text-foreground/60 text-sm mb-1">
          You've been invited to join as a <span className="font-medium text-foreground">{inviteData.invite.role}</span>.
        </p>
        <p className="text-foreground/40 text-xs mb-6">
          Invited: {inviteData.invite.email}
        </p>

        {isAuthenticated ? (
          <Button
            onClick={() => acceptInvite.mutate({ token: token || "" })}
            disabled={acceptInvite.isPending}
            className="w-full"
            size="lg"
          >
            {acceptInvite.isPending ? "Joining..." : "Accept Invite & Join"}
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-foreground/60">Sign in to accept this invite.</p>
            <a href={getLoginUrl()} className="block">
              <Button className="w-full" size="lg">
                Sign In to Accept
              </Button>
            </a>
          </div>
        )}
      </Card>
    </div>
  );
}

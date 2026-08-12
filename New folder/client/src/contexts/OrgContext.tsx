import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type Organization = {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  website: string | null;
  ownerId: number;
  role: string;
};

type OrgContextType = {
  organizations: Organization[];
  activeOrg: Organization | null;
  setActiveOrg: (org: Organization | null) => void;
  isLoading: boolean;
  refetch: () => void;
};

const OrgContext = createContext<OrgContextType>({
  organizations: [],
  activeOrg: null,
  setActiveOrg: () => {},
  isLoading: false,
  refetch: () => {},
});

export function OrgProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activeOrg, setActiveOrgState] = useState<Organization | null>(null);

  const { data: organizations = [], isLoading, refetch } = trpc.org.list.useQuery(undefined, {
    enabled: !!user,
  });

  // Restore active org from localStorage or pick first
  useEffect(() => {
    if (organizations.length > 0 && !activeOrg) {
      const savedOrgId = localStorage.getItem("activeOrgId");
      const saved = savedOrgId ? organizations.find(o => o.id === Number(savedOrgId)) : null;
      setActiveOrgState(saved || organizations[0]);
    }
  }, [organizations, activeOrg]);

  const setActiveOrg = (org: Organization | null) => {
    setActiveOrgState(org);
    if (org) {
      localStorage.setItem("activeOrgId", String(org.id));
    } else {
      localStorage.removeItem("activeOrgId");
    }
  };

  return (
    <OrgContext.Provider value={{ organizations: organizations as Organization[], activeOrg, setActiveOrg, isLoading, refetch }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  return useContext(OrgContext);
}

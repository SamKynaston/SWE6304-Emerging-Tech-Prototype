import { Role, RolePermission, User } from "@prototype/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { apiFetch } from "../Utilities/Fetch.utilities";

type AuthContextType = {
  user: User | null;
  role: Role | null;
  authenticated: boolean;
  loading: boolean;
  forceReset: boolean;
  isInMaintenanceMode: boolean;
  isAdmin: boolean;
  hasPermission: (permissionName: string) => boolean;
  refreshUser: () => Promise<void>;
};

export async function checkAuth(): Promise<{ body: User, success: boolean, forceReset?: boolean; } | null> {  
  const res = await apiFetch(`v1/users/me`, { credentials: "include" });

  const data = await res.json()
  if (!res.ok && res.status !== 403) return null;
  
  return data;
}

export async function checkRole(user: User): Promise<{ body: Role, success: boolean } | null> {  
  const res = await apiFetch(`v1/roles/${user.role.id}`, { credentials: "include" });

  const data = await res.json()
  if (!res.ok && res.status !== 403) return null;
  
  return data;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  authenticated: false,
  loading: true,
  forceReset: false,
  isAdmin: false,
  isInMaintenanceMode: false,
  hasPermission: () => false,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isInMaintenanceMode, setMaintenanceMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [forceReset, setForceReset] = useState(false);

  const authRequestId = useRef(0);
  
  // Function to check if a user has a specified permission, should use the permissionName type but sadly does not.
  const hasPermission = (permissionName: string) => {
    if (!role) return false;
    if (isAdmin) return true;

    return role.permissions?.some((p: RolePermission) => p.permission_string === permissionName)
  };

  // Confirms the user's identity by calling the /me route on the API, if in a forceReset state, makes it clear and forces user to always redirect to /reset-password
  const refreshUser = async () => {
    ++authRequestId.current;

    setLoading(true)

    const data = await checkAuth();

    if (!data) {
      setUser(null);
      setRole(null);
      setAuthenticated(false);
      setForceReset(false);
      setLoading(false);
      setIsAdmin(false);
      return;
    }

    const user: User = data.body

    if (data.forceReset) {
      setUser(data.body);
      setRole(null);
      setAuthenticated(false);
      setForceReset(true);
      setLoading(false);
      setIsAdmin(false);
      return;
    }

    const roleData = await checkRole(user);

    if (roleData) {
      const role: Role = roleData.body

      setRole(role)
      setUser(user);
      setAuthenticated(data.success);
      setIsAdmin(role.permissions?.some((p: RolePermission) => p.permission_string === "ADMINISTRATOR"))
      setForceReset(false);
      setLoading(false);
    }
  };

  // Check's the user's identity every time the page changes. Contains a lot of repeated code byt works otherwise.
  useEffect(() => {
    setRole(null)
    setUser(null);
    setAuthenticated(false);
    setLoading(true);

    checkAuth().then(async (data) => {
      if (!data) {
        setRole(null);
        setUser(null);
        setAuthenticated(false);
        setLoading(false);
        setForceReset(false);

        return;
      }

      if (data.forceReset) {
        setUser(data.body);
        setRole(null);
        setAuthenticated(false);
        setForceReset(true);
        setIsAdmin(false);
        
        return;
      }

      const roleData = await checkRole(data.body);

      if (!roleData) {
        setUser(null);
        setRole(null);
        setAuthenticated(false);
        setForceReset(false);
        return;
      }

      const role: Role = roleData.body;
      setRole(role);
      setUser(data.body);
      setAuthenticated(data.success);
      setIsAdmin(role.permissions?.some((p: RolePermission) => p.permission_string === "ADMINISTRATOR"))
      setForceReset(false);
    })
    .catch((err) => {
      setUser(null);
      setRole(null);
      setAuthenticated(false);
      setLoading(false);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, authenticated, forceReset, loading, isAdmin, isInMaintenanceMode, hasPermission, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
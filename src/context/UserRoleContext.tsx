import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = 'consumer' | 'actor' | 'company' | null;

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  clearUserRole: () => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

const STORAGE_KEY = "clearpath-user-role";

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    // Load from localStorage on initialization
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['consumer', 'actor', 'company'].includes(stored)) {
        return stored as UserRole;
      }
    } catch (error) {
      console.error("Failed to load user role from localStorage:", error);
    }
    return null;
  });

  // Sync to localStorage whenever role changes
  useEffect(() => {
    try {
      if (userRole) {
        localStorage.setItem(STORAGE_KEY, userRole);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save user role to localStorage:", error);
    }
  }, [userRole]);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
  };

  const clearUserRole = () => {
    setUserRoleState(null);
  };

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole, clearUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import keycloak from '../keycloak';
import type { UserRole } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string;
  roles: UserRole[];
  token: string | undefined;
  login: () => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    keycloak
      .init({ onLoad: 'login-required', checkLoginIframe: false })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        if (authenticated) {
          setToken(keycloak.token);
          setUsername(keycloak.tokenParsed?.preferred_username || '');

          const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
          const userRoles: UserRole[] = [];
          if (realmRoles.includes('ADMIN')) userRoles.push('ADMIN');
          if (realmRoles.includes('CLIENT')) userRoles.push('CLIENT');
          setRoles(userRoles);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    // Refresh token
    const interval = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak.updateToken(60).then((refreshed) => {
          if (refreshed) {
            setToken(keycloak.token);
          }
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const login = () => keycloak.login();
  const logout = () => keycloak.logout({ redirectUri: window.location.origin });
  const hasRole = (role: UserRole) => roles.includes(role);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        username,
        roles,
        token,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

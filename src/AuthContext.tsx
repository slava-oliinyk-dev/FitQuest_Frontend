import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any; 
  loading: boolean;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    fetch('http://localhost:3003/users/me', { 
      method: 'GET',
      credentials: 'include', 
    })
      .then(async (response) => {
        if (!response.ok) {
          setUser(null);
        } else {
          const data = await response.json();

          setUser(data.user);
        }
      })
      .catch((error) => {
        console.error('Error retrieving user data:', error);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

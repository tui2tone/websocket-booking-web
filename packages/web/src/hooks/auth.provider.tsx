'use client';
import { User } from "@/dto/user";
import { v4 as uuidv4 } from "uuid";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getAuth } from "@/services/auth";

interface AuthContextType {
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    async function authen() {
      let token = localStorage.getItem("authToken");
      if (!token) {
        token = uuidv4();
        localStorage.setItem("authToken", token);
      }

      if (token) {
        const result = await getAuth(token);
        setUser(result)
      }
    }
    authen();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

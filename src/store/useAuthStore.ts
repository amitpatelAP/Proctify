import { create } from 'zustand';

export type Role = 'student' | 'proctor' | 'admin' | null;

interface AuthState {
  user: {
    id: string;
    name: string;
    role: Role;
  } | null;
  login: (role: Role, name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (role, name) => set({ user: { id: Math.random().toString(36).substring(7), name, role } }),
  logout: () => set({ user: null }),
}));

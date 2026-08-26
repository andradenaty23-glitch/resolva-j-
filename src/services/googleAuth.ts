import { GoogleAuthUser, UserRole } from '../types';
import { auth, googleProvider } from '../lib/firebase';
import { signOut, signInWithPopup } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const GOOGLE_OAUTH_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
  (firebaseConfig as any)?.oAuthClientId ||
  '';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (notification?: any) => void;
          disableAutoSelect: () => void;
        };
        oauth2: {
          initTokenClient: (config: any) => any;
          revoke?: (accessToken: string, done?: () => void) => void;
        };
      };
    };
  }
}

export interface ParsedGoogleToken {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

const STORAGE_KEY = 'resolva_ja_google_auth_v1';

export function getSavedGoogleUser(): GoogleAuthUser | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveGoogleUser(user: GoogleAuthUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.warn('Failed to save user session:', e);
  }
}

export async function logoutGoogle(token?: string): Promise<void> {
  try {
    saveGoogleUser(null);
    if (auth.currentUser) {
      await signOut(auth);
    }
    
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    if (token && window.google?.accounts?.oauth2?.revoke) {
      window.google.accounts.oauth2.revoke(token, () => {
        console.log('Google OAuth token revoked successfully');
      });
    }
  } catch (err) {
    console.warn('Error during Google logout:', err);
  }
}

/**
 * Fetch Google User Profile info using an OAuth access token
 */
export async function fetchGoogleUserProfile(accessToken: string): Promise<ParsedGoogleToken | null> {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error(`Google API responded with status ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn('Error fetching Google user profile with token:', err);
    return null;
  }
}

export const DEMO_GOOGLE_ACCOUNTS: Array<{
  name: string;
  email: string;
  picture: string;
  role: UserRole;
  description: string;
}> = [
  {
    name: 'Cliente Residencial',
    email: 'cliente.resolva@gmail.com',
    picture: 'https://ui-avatars.com/api/?name=Cliente+Residencial&background=ea580c&color=ffffff&bold=true',
    role: 'cliente',
    description: 'Conta Google Residencial • Verificada'
  },
  {
    name: 'Carlos Mendes',
    email: 'carlos.mendes.engenharia@gmail.com',
    picture: 'https://ui-avatars.com/api/?name=Carlos+Mendes&background=2563eb&color=ffffff&bold=true',
    role: 'cliente',
    description: 'Conta Google • Apartamento 42'
  },
  {
    name: 'Técnico Especialista PRO',
    email: 'tecnico.resolva.pro@gmail.com',
    picture: 'https://ui-avatars.com/api/?name=Tecnico+Especialista&background=16a34a&color=ffffff&bold=true',
    role: 'prestador',
    description: 'Conta Google PRO • Prestador Credenciado'
  }
];

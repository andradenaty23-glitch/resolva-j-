import { GoogleAuthUser, UserRole, ClientProfile, ProviderProfile } from '../types';
import { auth } from '../lib/firebase';
const isFirebaseConfigured = true;
import { INITIAL_CLIENT_PROFILE, INITIAL_PROVIDER_PROFILE } from '../data/mockData';

export const GOOGLE_OAUTH_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
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

// Strictly Isolated LocalStorage Keys
const CLIENT_AUTH_KEY = 'resolva_ja_auth_cliente_v2';
const PROVIDER_AUTH_KEY = 'resolva_ja_auth_prestador_v2';
const CLIENT_PROFILE_KEY = 'resolva_ja_profile_cliente_v2';
const PROVIDER_PROFILE_KEY = 'resolva_ja_profile_prestador_v2';

// ---------------- CLIENT SESSION & PROFILE ----------------
export function getSavedClientUser(): GoogleAuthUser | null {
  try {
    const data = localStorage.getItem(CLIENT_AUTH_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveClientUser(user: GoogleAuthUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(CLIENT_AUTH_KEY);
    } else {
      localStorage.setItem(CLIENT_AUTH_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.warn('Failed to save client user:', e);
  }
}

export function getSavedClientProfile(): ClientProfile {
  try {
    const data = localStorage.getItem(CLIENT_PROFILE_KEY);
    if (!data) return INITIAL_CLIENT_PROFILE;
    return { ...INITIAL_CLIENT_PROFILE, ...JSON.parse(data) };
  } catch {
    return INITIAL_CLIENT_PROFILE;
  }
}

export function saveClientProfile(profile: ClientProfile): void {
  try {
    localStorage.setItem(CLIENT_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save client profile:', e);
  }
}

// ---------------- PROVIDER SESSION & PROFILE ----------------
export function getSavedProviderUser(): GoogleAuthUser | null {
  try {
    const data = localStorage.getItem(PROVIDER_AUTH_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveProviderUser(user: GoogleAuthUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(PROVIDER_AUTH_KEY);
    } else {
      localStorage.setItem(PROVIDER_AUTH_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.warn('Failed to save provider user:', e);
  }
}

export function getSavedProviderProfile(): ProviderProfile {
  try {
    const data = localStorage.getItem(PROVIDER_PROFILE_KEY);
    if (!data) return INITIAL_PROVIDER_PROFILE;
    return { ...INITIAL_PROVIDER_PROFILE, ...JSON.parse(data) };
  } catch {
    return INITIAL_PROVIDER_PROFILE;
  }
}

export function saveProviderProfile(profile: ProviderProfile): void {
  try {
    localStorage.setItem(PROVIDER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save provider profile:', e);
  }
}

// ---------------- INDEPENDENT LOGOUT ----------------
export async function logoutUser(role: UserRole, token?: string): Promise<void> {
  try {
    if (role === 'cliente') {
      saveClientUser(null);
    } else {
      saveProviderUser(null);
    }

    if (isFirebaseConfigured) {
      await auth.signOut();
    }
    
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    if (token && window.google?.accounts?.oauth2?.revoke) {
      window.google.accounts.oauth2.revoke(token, () => {
        console.log(`Google OAuth token revoked for ${role}`);
      });
    }
  } catch (err) {
    console.warn('Error during logout:', err);
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
    name: 'Carlos Mendes (Cliente)',
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

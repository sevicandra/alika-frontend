export interface UserRole {
  kode: string;
  nama: string;
}

export interface UserAccount {
  service: string;
  kode_satker: string | null;
  roles: UserRole[];
}

export interface UserProfile {
  sub: string;
  name: string;
  nik: string;
  nip: string;
  kode_satker: string;
  satker: string;
  gravatar: string;
}

export interface UserSession {
  user: UserProfile;
  account: UserAccount[];
}

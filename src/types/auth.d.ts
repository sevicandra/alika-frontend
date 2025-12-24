export interface UserSession {
  sub: string;
  name: string;
  nik: string;
  nip: string;
  kode_satker: string;
  satker: string;
  gravatar: string;
}

export interface AccountRole {
  kode: string;
  nama: string;
}

export interface UserAccount {
  service: string;
  kode_satker: string | null;
  roles: AccountRole[];
}

export interface SessionData {
  user: UserSession;
  account: UserAccount[];
}
// Generated by https://quicktype.io

export interface User {
  id: number;
  name: string;
  user: string;
  email_verified_at: null | string;
  created_at: string;
  updated_at: string;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}

export interface Pivot {
  model_id: number;
  role_id: number;
  model_type: string;
}

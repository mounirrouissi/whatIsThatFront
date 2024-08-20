export enum ModalType {
  Login = 'login',
  SignUp = 'signup',
}

export enum AuthStrategy {
  Google = 'oauth_google',
  Microsoft = 'oauth_microsoft',
  Slack = 'oauth_slack',
  Apple = 'oauth_apple',
}



// @/types/enums.ts

export type SpeciesCategory = 'plant' | 'animal' | 'bug';

export type Species = {
  id: string;  // UUID
  scientific_name: string;
  common_name: string | null;
  category: SpeciesCategory;
  description: string | null;
  habitat: string | null;
  created_at: string;  // ISO 8601 date string
  updated_at: string;  // ISO 8601 date string
};

export type IdentificationType = 'plant' | 'animal' | 'mushroom';

export type Identification = {
  id: number;  // bigint
  user_id: string;  // UUID
  image_url: string | null;
  species_id: string;  // UUID
  identified_at: string;  // ISO 8601 date string
  type: IdentificationType;
  original_image_url :string | null;
};

export type Fact = {
  id: string;  // UUID
  identification_id: string;  // UUID
  fact: string;
  fact_number: 1 | 2 | 3;  // Ensuring fact_number is 1, 2, or 3
};

// You might also want to define a User type if you're using it elsewhere in your app
export type User = {
  id: string;  // UUID
  email: string;
  full_name: string | null;
  created_at: string;  // ISO 8601 date string
  updated_at: string;  // ISO 8601 date string
};
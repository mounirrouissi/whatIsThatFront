export interface Identification {
  identif: string;
  "identif success": string;
  facts: string[];
  imageUrl: string; // Ensure imageUrl is included
}

export type IdentificationResponse = Identification[];

export interface BackendResponse {
  identifications: IdentificationResponse;
  imageUrls: string[]; // Add imageUrls to the response type
}






export interface IdentificationDB {
  id: string;
  userId: string;
  imageUrl: string;
  speciesId: string | null;
  identifiedAt: Date;
  type: 'plant' | 'animal' | 'mushroom' | 'bird' | 'bug';
  resemblanceRank: 1 | 2 | 3;
  originalImageUrl: string;
  facts: {
    id: string;
    fact: string;
    factNumber: 1 | 2 | 3;
  }[];
}


export type IconObject = {
  name: string;
  icon: string;
};

export type IconObjectArray = {
  [key: string]: IconObject[];
};



//encyclopedia 

// TypeScript types for Categories table
export interface Category {
  id: string; // UUID
  name: string; // text
}

// TypeScript types for EncyclopediaEntries table
export interface EncyclopediaEntry {
  id: string; // UUID
  category_id: string; // UUID
  name: string; // text
  description: string; // text
  image_url: string; // text
  scientific_name: string; // text
  habitat: string; // text
  diet: string; // text
  danger_level: string; // text
  created_at: string; // timestamp with time zone
  updated_at: string; // timestamp with time zone
}

// TypeScript types for EncyclopediaFacts table
export interface EncyclopediaFact {
  id: string; // UUID
  entry_id: string; // UUID
  fact: string; // text
}


// TypeScript types for observations

export type Observation = {
  id: number;
  identified_at: string;
  image_url: string;
  original_image_url: string;
  resemblance_rank: number;
  species_id: number | null;
  type: string;
  user_id: string;
};

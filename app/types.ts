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
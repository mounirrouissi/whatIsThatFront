export interface Identification {
    identif: string;
    "identif success": string;
    facts: string[];
  }
  
  export type IdentificationResponse = Identification[];

  export interface BackendResponse {
    identifications: IdentificationResponse;
    imageUrl: string;
  }
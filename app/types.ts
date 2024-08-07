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
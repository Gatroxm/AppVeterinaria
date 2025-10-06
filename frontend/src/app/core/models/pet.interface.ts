export interface Pet {
  _id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  dateOfBirth?: Date;
  gender: 'male' | 'female' | 'unknown';
  weight?: number;
  color?: string;
  photo?: string;
  owner: string;
  isActive: boolean;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePetRequest {
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  dateOfBirth?: string;
  gender: 'male' | 'female' | 'unknown';
  weight?: number;
  color?: string;
}
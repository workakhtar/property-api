export interface Property {
  id: number;
  address: string;
  ownerType: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Owner {
  id: number;
  propertyId: number;
  name: string;
  email?: string;
  phone?: string;
  mailingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

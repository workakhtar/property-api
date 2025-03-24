import { pgTable, serial, text, timestamp, boolean, varchar, integer, decimal, json } from 'drizzle-orm/pg-core';

export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  externalId: varchar('external_id', { length: 255 }).unique(),
  apn: varchar('apn', { length: 255 }).notNull(),
  address: text('address').notNull(),
  streetAddress: varchar('street_address', { length: 255 }).notNull(),
  ownerType: varchar('owner_type', { length: 50 }).notNull(),
  // Location details 
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 10 }),
  zip: varchar('zip', { length: 10 }),
  county: varchar('county', { length: 100 }),
  latitude: decimal('latitude', { precision: 9, scale: 6 }),
  longitude: decimal('longitude', { precision: 9, scale: 6 }),
  // Property characteristics
  bedrooms: integer('bedrooms'),
  bathrooms: decimal('bathrooms', { precision: 3, scale: 1 }),
  squareFeet: integer('square_feet'),
  yearBuilt: integer('year_built'),
  lotAcres: decimal('lot_acres', { precision: 10, scale: 2 }),
  propertyType: varchar('property_type', { length: 100 }),
  buildingStyle: varchar('building_style', { length: 100 }),
  buildingCondition: varchar('building_condition', { length: 50 }),
  buildingSquareFeet: integer('building_square_feet'),
  groundFloorSquareFeet: integer('ground_floor_square_feet'),
  livingSquareFeet: integer('living_square_feet'),
  garageSquareFeet: integer('garage_square_feet'),
  garageUnfinishedSquareFeet: integer('garage_unfinished_square_feet'),
  parkingSpaces: integer('parking_spaces'),
  // Building characteristics
  constructionType: varchar('construction_type', { length: 100 }),
  roofCoverType: varchar('roof_cover_type', { length: 100 }),
  floorCoverType: varchar('floor_cover_type', { length: 100 }),
  exteriorWallType: varchar('exterior_wall_type', { length: 100 }),
  interiorWallType: varchar('interior_wall_type', { length: 100 }),
  heatingType: varchar('heating_type', { length: 100 }),
  heatingFuelType: varchar('heating_fuel_type', { length: 50 }),
  airConditioningType: varchar('air_conditioning_type', { length: 100 }),
  // HOA information
  hoa: boolean('hoa').default(false),
  hoa1Name: varchar('hoa1_name', { length: 255 }),
  hoa1Type: varchar('hoa1_type', { length: 100 }),
  hoa1Amount: decimal('hoa1_amount', { precision: 10, scale: 2 }),
  hoa1Frequency: varchar('hoa1_frequency', { length: 50 }),
  // Market and tax information
  marketValue: decimal('market_value', { precision: 12, scale: 2 }),
  marketLandValue: decimal('market_land_value', { precision: 12, scale: 2 }),
  marketImprovementValue: decimal('market_improvement_value', { precision: 12, scale: 2 }),
  assessedValue: decimal('assessed_value', { precision: 12, scale: 2 }),
  assessedLandValue: decimal('assessed_land_value', { precision: 12, scale: 2 }),
  assessedImprovementValue: decimal('assessed_improvement_value', { precision: 12, scale: 2 }),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }),
  taxYear: integer('tax_year'),
  assessedYear: integer('assessed_year'),
  // Property status
  vacant: boolean('vacant').default(false),
  onMarket: boolean('on_market').default(false),
  ownerOccupied: boolean('owner_occupied').default(true),
  occupancyType: varchar('occupancy_type', { length: 50 }),
  isDeleted: boolean('is_deleted').default(false),
  // Flood and environmental
  withinFloodZone: boolean('within_flood_zone').default(false),
  floodZoneDescription: varchar('flood_zone_description', { length: 255 }),
  // Financial information
  estimatedValue: decimal('estimated_value', { precision: 12, scale: 2 }),
  estimatedRentAmount: decimal('estimated_rent_amount', { precision: 10, scale: 2 }),
  estimatedEquity: decimal('estimated_equity', { precision: 12, scale: 2 }),
  estimatedEquityRatio: decimal('estimated_equity_ratio', { precision: 5, scale: 2 }),
  loanBalance: decimal('loan_balance', { precision: 12, scale: 2 }),
  loanToValueRatio: decimal('loan_to_value_ratio', { precision: 5, scale: 2 }),
  // Property history
  lastSaleDate: timestamp('last_sale_date'),
  lastSaleAmount: decimal('last_sale_amount', { precision: 12, scale: 2 }),
  priorSaleDate: timestamp('prior_sale_date'),
  priorSaleAmount: decimal('prior_sale_amount', { precision: 12, scale: 2 }),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  // Additional metadata
  demographics: json('demographics').$type<{
    zip?: {
      metrics: Record<string, number>;
      location: string;
    };
    city?: {
      metrics: Record<string, number>;
      location: string;
    };
  }>(),
  taxAssessments: json('tax_assessments').$type<Array<{
    id: number;
    year: number;
    taxRate: number;
    landValue: number;
    taxAmount: number;
    assessedValue: number;
    assessedAmount: number;
    improvementValue: number;
    taxAmountChangeRate?: number;
  }>>(),
  transactions: json('transactions').$type<Array<{
    id: string;
    amount?: number;
    saleDate?: string;
    recordingDate: string;
    documentType: string;
    transactionType: string;
    buyerNames?: string;
    sellerNames?: string;
  }>>(),
  listings: json('listings').$type<Array<{
    id: string;
    amount: number;
    status: string;
    listingDate: string;
    daysOnMarket: number;
  }>>(),
});

export const owners = pgTable('owners', {
  id: serial('id').primaryKey(),
  apn: varchar('apn', { length: 255 }).notNull(),
  persons: json('persons').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  role: varchar('role', { length: 50 }).default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
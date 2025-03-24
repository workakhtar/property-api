import { DrizzleError, eq, and, or, like } from 'drizzle-orm';
import { db } from '../db';
import { owners, properties } from '../db/schema';
import { PropertyReachService } from './propertyReachService';
import { ApiError } from '../utils/errors';

interface PropertySearchParams {
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export class PropertyService {
  static async searchProperties(params: PropertySearchParams) {
    try {
      // Build the query conditions based on provided parameters
      const conditions = [];

      // Street address matching
      if (params.streetAddress) {
        const addressParts = params.streetAddress.split(' ');
        if (addressParts.length >= 2) {
          const addressStart = `${addressParts[0]} ${addressParts[1]}%`;
          conditions.push(like(properties.streetAddress, addressStart));
        } else {
          conditions.push(like(properties.streetAddress, `${params.streetAddress}%`));
        }
      }

      // Zip code matching - often the most reliable part of an address
      if (params.zip) {
        conditions.push(eq(properties.zip, params.zip));
      }

      // Use OR between conditions instead of AND
      const whereClause = conditions.length > 0 ? or(...conditions) : undefined;

      let query: any = db.select().from(properties);
      if (whereClause) {
        query = query.where(whereClause);
      }

      const dbProperties = await query.execute();

      if (dbProperties.length > 0) {
        return {
          source: 'internal',
          properties: dbProperties[0],
        }
      }

      // If not found in database, search in Property Reach API
      console.log('Searching in Property Reach API');
      // const propertyData = await PropertyReachService.searchProperties(params);
      const propertyData = await PropertyReachService.searchProperties(params);
      if (!propertyData) {
        return [];
      }

      // Store the properties in database
      const propertiesToInsert = {
        externalId: propertyData.id,
        apn: propertyData.apn,
        address: `${propertyData.streetNumber} ${propertyData.streetName}`,
        ownerType: propertyData.ownershipType || 'Unknown',
        city: propertyData.mailingCity,
        state: propertyData.mailingState,
        zip: propertyData.zip,
        county: propertyData.mailingCounty,
        propertyType: propertyData.propertyType,
        buildingStyle: propertyData.buildingStyle,
        buildingCondition: propertyData.buildingCondition,
        squareFeet: propertyData.squareFeet,
        buildingSquareFeet: propertyData.buildingSquareFeet,
        livingSquareFeet: propertyData.livingSquareFeet,
        garageSquareFeet: propertyData.garageSquareFeet,
        garageUnfinishedSquareFeet: propertyData.garageUnfinishedSquareFeet,
        parkingSpaces: propertyData.parkingSpaces,
        constructionType: propertyData.constructionType,
        roofCoverType: propertyData.roofCoverType,
        floorCoverType: propertyData.floorCoverType,
        exteriorWallType: propertyData.exteriorWallType,
        interiorWallType: propertyData.interiorWallType,
        heatingType: propertyData.heatingType,
        heatingFuelType: propertyData.heatingFuelType,
        airConditioningType: propertyData.airConditioningType,
        hoa: propertyData.hoa || false,
        hoa1Frequency: propertyData.hoa1Frequency,
        marketValue: propertyData.marketValue,
        marketLandValue: propertyData.marketLandValue,
        marketImprovementValue: propertyData.marketImprovementValue,
        assessedValue: propertyData.assessedValue,
        assessedLandValue: propertyData.assessedLandValue,
        assessedImprovementValue: propertyData.assessedImprovementValue,
        taxAmount: propertyData.taxAmount,
        assessedYear: propertyData.assessedYear,
        ownerOccupied: propertyData.ownerOccupied,
        occupancyType: propertyData.occupancyType,
        withinFloodZone: propertyData.withinFloodZone,
        floodZoneDescription: propertyData.floodZoneDescription,
        estimatedValue: propertyData.estimatedValue,
        estimatedRentAmount: propertyData.estimatedRentAmount,
        estimatedEquity: propertyData.estimatedEquity,
        estimatedEquityRatio: propertyData.estimatedEquityRatio,
        loanBalance: propertyData.loanBalance,
        loanToValueRatio: propertyData.loanToValueRatio,
        lastSaleDate: propertyData.lastSaleDate ? new Date(propertyData.lastSaleDate) : null,
        lastSaleAmount: propertyData.lastSaleAmount,
        priorSaleDate: propertyData.priorSaleDate ? new Date(propertyData.priorSaleDate) : null,
        priorSaleAmount: propertyData.priorSaleAmount,
        demographics: propertyData.demographics,
        taxAssessments: propertyData.taxAssessments,
        transactions: propertyData.transactions,
        streetAddress: propertyData.streetAddress,
      };

      const [insertedProperties] = await db
        .insert(properties)
        .values(propertiesToInsert)
        .returning();

      return {
        source: 'external',
        properties: insertedProperties,
      };
    } catch (error) {
      console.log('Error searching properties:', error);
      if (error instanceof DrizzleError) {
        throw new ApiError('Database error', 500);
      }
      throw error;
    }
  }
  
  static async searchContacts(params: any) {
    try {
      // Build the query conditions based on provided parameters
      const conditions = [];
      // Zip code matching - often the most reliable part of an address
      if (params?.target && params?.target?.apn ) {
        conditions.push(eq(owners.apn, params.target.apn));
      }

      // Use OR between conditions instead of AND
      const whereClause = conditions.length > 0 ? or(...conditions) : undefined;

      let query: any = db.select().from(owners);
      if (whereClause) {
        query = query.where(whereClause);
      }

      const dbOwners = await query.execute();

      if (dbOwners.length > 0) {
        return {
          source: 'internal',
          owners: dbOwners[0]
        }
      }

      // If not found in database, search in Property Reach API
      console.log('Searching in Property Reach API');
      // const propertyData = await PropertyReachService.searchProperties(params);
      const ownersData = await PropertyReachService.getContacts(params);
      if (!ownersData) {
        throw new ApiError('Owners not found', 404);
      }

      // Store the properties in database
      const ownersToInsert: any = {
        apn: params?.target?.apn,
        persons: ownersData,
      }

      const [insertedOwners] = await db
        .insert(owners)
        .values(ownersToInsert)
        .returning();

      return {
        source: 'external',
        owners: insertedOwners
      };
    } catch (error) {
      console.log('Error searching contacts:', error);
      if (error instanceof DrizzleError) {
        throw new ApiError('Database error', 500);
      }
      throw error;
    }
  }

  static async getProperty(id: string) {
    try {
      // Check database first
      let property = await db
        .select()
        .from(properties)
        .where(eq(properties.externalId, id))
        .limit(1);

      if (!property.length) {
        // Fetch from Property Reach API
        const propertyData = await PropertyReachService.getProperty(id);
        if (propertyData) {
          // Map API response to our schema
          const propertyValues = {
            externalId: id,
            apn: propertyData.apn,
            address: `${propertyData.streetNumber} ${propertyData.streetName}`,
            ownerType: propertyData.ownershipType || 'Unknown',
            city: propertyData.mailingCity,
            state: propertyData.mailingState,
            zip: propertyData.zip,
            county: propertyData.mailingCounty,
            propertyType: propertyData.propertyType,
            buildingStyle: propertyData.buildingStyle,
            buildingCondition: propertyData.buildingCondition,
            squareFeet: propertyData.squareFeet,
            buildingSquareFeet: propertyData.buildingSquareFeet,
            livingSquareFeet: propertyData.livingSquareFeet,
            garageSquareFeet: propertyData.garageSquareFeet,
            garageUnfinishedSquareFeet: propertyData.garageUnfinishedSquareFeet,
            parkingSpaces: propertyData.parkingSpaces,
            constructionType: propertyData.constructionType,
            roofCoverType: propertyData.roofCoverType,
            floorCoverType: propertyData.floorCoverType,
            exteriorWallType: propertyData.exteriorWallType,
            interiorWallType: propertyData.interiorWallType,
            heatingType: propertyData.heatingType,
            heatingFuelType: propertyData.heatingFuelType,
            airConditioningType: propertyData.airConditioningType,
            hoa: propertyData.hoa || false,
            hoa1Frequency: propertyData.hoa1Frequency,
            marketValue: propertyData.marketValue,
            marketLandValue: propertyData.marketLandValue,
            marketImprovementValue: propertyData.marketImprovementValue,
            assessedValue: propertyData.assessedValue,
            assessedLandValue: propertyData.assessedLandValue,
            assessedImprovementValue: propertyData.assessedImprovementValue,
            taxAmount: propertyData.taxAmount,
            assessedYear: propertyData.assessedYear,
            ownerOccupied: propertyData.ownerOccupied,
            occupancyType: propertyData.occupancyType,
            withinFloodZone: propertyData.withinFloodZone,
            floodZoneDescription: propertyData.floodZoneDescription,
            estimatedValue: propertyData.estimatedValue,
            estimatedRentAmount: propertyData.estimatedRentAmount,
            estimatedEquity: propertyData.estimatedEquity,
            estimatedEquityRatio: propertyData.estimatedEquityRatio,
            loanBalance: propertyData.loanBalance,
            loanToValueRatio: propertyData.loanToValueRatio,
            lastSaleDate: propertyData.lastSaleDate ? new Date(propertyData.lastSaleDate) : null,
            lastSaleAmount: propertyData.lastSaleAmount,
            priorSaleDate: propertyData.priorSaleDate ? new Date(propertyData.priorSaleDate) : null,
            priorSaleAmount: propertyData.priorSaleAmount,
            demographics: propertyData.demographics,
            taxAssessments: propertyData.taxAssessments,
            transactions: propertyData.transactions,
            streetAddress: propertyData.streetAddress,
          };

          property = await db
            .insert(properties)
            .values(propertyValues)
            .returning();
        } else {
          throw new ApiError('Property not found', 404);
        }
      }

      return property[0];
    } catch (error) {
      console.log('Error fetching property:', error);
      if (error instanceof DrizzleError) {
        throw new ApiError('Database error', 500);
      }
      throw error;
    }
  }

  static async getProperties(ownerType?: string) {
    try {
      const query = db.select().from(properties);

      if (ownerType) {
        query.where(eq(properties.ownerType, ownerType));
      }

      return await query;
    } catch (error) {
      console.log('Error fetching properties:', error);
      throw new ApiError('Failed to fetch properties', 500);
    }
  }
}
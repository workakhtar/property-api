import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { owners } from '../db/schema';

export class OwnerController {
  static async getOwners(req: Request, res: Response) {
    try {
      const { apn } = req.params;

      if (!apn) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }

      const result = await db
        .select()
        .from(owners)
        .where(eq(owners.apn, apn))
        .execute();

      return res.json(result);
    } catch (error) {
      console.log('Error in getOwners:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createOwner(req: Request, res: Response) {
    try {
      const { propertyId } = req.params;
      const propertyIdNum = parseInt(propertyId);
      const ownerData = req.body;

      if (isNaN(propertyIdNum)) {
        return res.status(400).json({ message: 'Invalid property ID' });
      }

      const newOwner = await db
        .insert(owners)
        .values({
          propertyId: propertyIdNum,
          ...ownerData,
        })
        .returning();

      return res.status(201).json(newOwner[0]);
    } catch (error) {
      console.log('Error in createOwner:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
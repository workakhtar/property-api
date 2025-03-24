import { Request, Response } from 'express';
import { PropertyService } from '../services/propertyService';
import { ApiError } from '../utils/errors';

export class PropertyController {
  static async searchProperties(req: Request, res: Response) {
    try {
      const { streetAddress, city, state, zip } = req.query;

      // Validate that at least streetAddress is provided
      if (!streetAddress) {
        return res.status(400).json({ message: 'Street address is required' });
      }

      const searchParams = {
        streetAddress: streetAddress as string,
        city: city as string,
        state: state as string,
        zip: zip as string,
      };

      const properties = await PropertyService.searchProperties(searchParams);
      res.json(properties);
    } catch (error) {
      console.log('Error in searchProperties:', error);
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
  
  static async searchContacts(req: Request, res: Response) {
    try {
      const payload = req.body;

      // Validate that at least streetAddress is provided
      if (!payload) {
        return res.status(400).json({ message: 'APN  is required' });
      }

      if(!payload.target || !payload.target.apn) throw new ApiError('Invalid params', 400);

      const contacts = await PropertyService.searchContacts(payload);
      res.json(contacts);
    } catch (error) {
      console.log('Error in searching contacts:', error);
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async getProperty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const property = await PropertyService.getProperty(id);
      res.json(property);
    } catch (error: unknown) {
      console.log('Error in getProperty:', error);
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async getProperties(req: Request, res: Response) {
    try {
      const { ownerType } = req.query;
      const result = await PropertyService.getProperties(ownerType as string);
      res.json(result);
    } catch (error: unknown) {
      console.log('Error in getProperties:', error);
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}
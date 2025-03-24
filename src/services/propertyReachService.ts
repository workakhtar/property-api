import axios from 'axios';
import { config } from '../config/config';
import { ApiError } from '../utils/errors';


interface PropertySearchParams {
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
}

const api = axios.create({
  baseURL: config.propertyReachApi.baseUrl,
  headers: {
    'x-api-key': `${config.propertyReachApi.apiKey}`,
    'Content-Type': 'application/json',
  },
});

export class PropertyReachService {
  static async getProperty(id: string) {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.log('Error fetching property from Property Reach API:', error);
      throw error;
    }
  }

  static async searchProperties(params: PropertySearchParams) {
    try {
      const queryParams = new URLSearchParams();

      if (params.streetAddress) {
        queryParams.append('streetAddress', params.streetAddress);
      }
      if (params.city) {
        queryParams.append('city', params.city);
      }
      if (params.state) {
        queryParams.append('state', params.state);
      }
      if (params.zip) {
        queryParams.append('zip', params.zip);
      }

      const response = await api.get(`/v1/property?${queryParams.toString()}`);
      return response.data.property;
    } catch (error) {
      console.log('Error searching properties from Property Reach API:', error);
      throw error;
    }
  }
  
  static async getContacts(params: any) {
    try {
      if(!params.target && !params?.target?.apn) throw new ApiError('Invalid params', 400);

      const response = await api.post(`/v1/skip-trace`, {
        target: {
          apn : params.target.apn
        }
      });
      return response.data.persons;
    } catch (error) {
      console.log('Error searching properties from Property Reach API:', error);
      throw error;
    }
  }
}
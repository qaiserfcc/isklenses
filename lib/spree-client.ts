import axios, { AxiosInstance } from 'axios';

export interface SpreeProduct {
  name: string;
  description?: string;
  price: number;
  sku?: string;
  track_inventory?: boolean;
  slug?: string;
  meta_description?: string;
}

export interface SpreeProductImage {
  attachment: string;
  position?: number;
  alt?: string;
}

export interface SpreeProductVariant {
  sku: string;
  price: number;
  cost_price?: number;
  weight?: number;
  height?: number;
  width?: number;
  depth?: number;
  is_master?: boolean;
}

export class SpreeClient {
  private apiClient: AxiosInstance;
  private baseUrl: string;
  private accessToken: string;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    
    this.apiClient = axios.create({
      baseURL: `${baseUrl}/api/v2`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Spree-Token': accessToken
      }
    });
  }

  async createProduct(product: SpreeProduct): Promise<any> {
    try {
      const response = await this.apiClient.post('/products', {
        product
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, product: Partial<SpreeProduct>): Promise<any> {
    try {
      const response = await this.apiClient.patch(`/products/${id}`, {
        product
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<any> {
    try {
      const response = await this.apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async listProducts(params?: Record<string, any>): Promise<any> {
    try {
      const response = await this.apiClient.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error listing products:', error);
      throw error;
    }
  }

  async createProductImage(productId: string, image: SpreeProductImage): Promise<any> {
    try {
      const response = await this.apiClient.post(`/products/${productId}/images`, {
        image
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw error;
    }
  }

  async createProductVariant(productId: string, variant: SpreeProductVariant): Promise<any> {
    try {
      const response = await this.apiClient.post(`/products/${productId}/variants`, {
        variant
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product variant:', error);
      throw error;
    }
  }

  async createTaxonomy(name: string, parent?: string): Promise<any> {
    try {
      const response = await this.apiClient.post('/taxonomies', {
        taxonomy: { name }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating taxonomy:', error);
      throw error;
    }
  }

  async addProductToTaxon(productId: string, taxonId: string): Promise<any> {
    try {
      const response = await this.apiClient.post(`/products/${productId}/taxons`, {
        taxon_id: taxonId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding product to taxon:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.apiClient.get('/products?per_page=1');
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export interface ClawMartMe {
  id: string;
  email: string;
  name: string;
  isCreator: boolean;
  subscriptionActive: boolean;
}

export interface ClawMartListing {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  about: string;
  category: string;
  capabilities: string[];
  price: number;
  productType: 'skill' | 'persona';
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingRequest {
  name: string;
  tagline: string;
  about: string;
  category: string;
  capabilities: string[];
  price: number;
  productType: 'skill' | 'persona';
}

export interface UpdateListingRequest extends Partial<CreateListingRequest> {
  published?: boolean;
}

export interface ClawMartDownload {
  id: string;
  slug: string;
  name: string;
  type: 'skill' | 'persona';
  version: string;
}

export interface DownloadPackageResponse {
  id: string;
  slug: string;
  files: Array<{
    path: string;
    content: string; // base64 or raw string
  }>;
}

export interface ClawMartError {
  error: string;
  message?: string;
}

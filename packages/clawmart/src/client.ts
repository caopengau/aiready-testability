import {
  ClawMartMe,
  ClawMartListing,
  CreateListingRequest,
  UpdateListingRequest,
  ClawMartDownload,
  DownloadPackageResponse,
  ClawMartError,
} from './types';

export class ClawMartClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    apiKey: string,
    baseUrl: string = 'https://www.shopclawmart.com/api/v1'
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorData: ClawMartError;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: response.statusText };
      }
      throw new Error(
        `ClawMart API error (${response.status}): ${errorData.message || errorData.error}`
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  async getMe(): Promise<ClawMartMe> {
    return this.request<ClawMartMe>('/me');
  }

  async getListings(): Promise<ClawMartListing[]> {
    return this.request<ClawMartListing[]>('/listings');
  }

  async searchListings(
    query: string,
    type?: string,
    limit?: number
  ): Promise<ClawMartListing[]> {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    if (limit) params.append('limit', limit.toString());
    return this.request<ClawMartListing[]>(
      `/listings/search?${params.toString()}`
    );
  }

  async createListing(data: CreateListingRequest): Promise<ClawMartListing> {
    return this.request<ClawMartListing>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateListing(
    id: string,
    data: UpdateListingRequest
  ): Promise<ClawMartListing> {
    return this.request<ClawMartListing>(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteListing(id: string): Promise<void> {
    await this.request<void>(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  async uploadVersion(
    id: string,
    files: Array<{ path: string; content: string }>
  ): Promise<any> {
    return this.request<any>(`/listings/${id}/versions`, {
      method: 'POST',
      body: JSON.stringify({ files }),
    });
  }

  async getDownloads(): Promise<ClawMartDownload[]> {
    return this.request<ClawMartDownload[]>('/downloads');
  }

  async downloadPackage(idOrSlug: string): Promise<DownloadPackageResponse> {
    return this.request<DownloadPackageResponse>(`/downloads/${idOrSlug}`);
  }
}

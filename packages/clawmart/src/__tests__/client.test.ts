import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClawMartClient } from '../client';

describe('ClawMartClient', () => {
  let client: ClawMartClient;
  const mockApiKey = 'cm_live_test';

  beforeEach(() => {
    client = new ClawMartClient(mockApiKey);
    global.fetch = vi.fn();
  });

  it('should fetch profile with correct headers', async () => {
    const mockMe = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      isCreator: true,
      subscriptionActive: true,
    };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMe,
    });

    const result = await client.getMe();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.shopclawmart.com/api/v1/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockApiKey}`,
        }),
      })
    );
    expect(result).toEqual(mockMe);
  });

  it('should search listings with query parameters', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await client.searchListings('test', 'skill', 5);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/listings/search?q=test&type=skill&limit=5'),
      expect.anything()
    );
  });

  it('should throw error on non-ok response', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ error: 'Invalid API key' }),
    });

    await expect(client.getMe()).rejects.toThrow(
      'ClawMart API error (401): Invalid API key'
    );
  });
});

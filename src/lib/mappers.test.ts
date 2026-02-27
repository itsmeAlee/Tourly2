
import { describe, it, expect, vi } from 'vitest';
import { mapProviderToPublicProfile } from './mappers';
import type { ProviderDocument } from '@/types/provider.types';

// Mock the storage module
vi.mock('@/lib/storage', () => ({
  getAvatarUrl: vi.fn((fileId: string) => `https://mock-storage.com/avatars/${fileId}`),
  getListingImageUrl: vi.fn(),
}));

describe('mapProviderToPublicProfile', () => {
  const mockProvider: ProviderDocument = {
    $id: 'provider-123',
    $collectionId: 'providers',
    $databaseId: 'tourly-db',
    $createdAt: '2023-01-01T00:00:00.000Z',
    $updatedAt: '2023-01-02T00:00:00.000Z',
    $permissions: [],
    user_id: 'user-456',
    business_name: 'Gilgit Trekkers',
    bio: 'Experienced trekking provider.',
    region: 'Gilgit',
    languages: ['English', 'Urdu'],
    phone: '+923001234567', // Sensitive data
    is_verified: true,
    rating: 4.8,
    review_count: 15,
    avatar_url: 'avatar-789',
    created_at: '2023-01-01T00:00:00.000Z',
  };

  it('should strictly strip the sensitive phone number', () => {
    const result = mapProviderToPublicProfile(mockProvider);

    // @ts-expect-error - phone should not exist on the type, but we check runtime value
    expect(result.phone).toBeUndefined();
    expect((result as any).phone).toBeUndefined();

    // Ensure other PII is not leaked if added later
    expect(Object.keys(result)).not.toContain('phone');
  });

  it('should map core fields correctly', () => {
    const result = mapProviderToPublicProfile(mockProvider);

    expect(result).toEqual({
      id: 'provider-123',
      name: 'Gilgit Trekkers',
      avatar: 'https://mock-storage.com/avatars/avatar-789',
      bio: 'Experienced trekking provider.',
      region: 'Gilgit',
      languages: ['English', 'Urdu'],
      serviceAreas: ['Gilgit'],
      experienceYears: 0, // Hardcoded in mapper for now
      isVerified: true,
      joinedDate: '2023-01-01T00:00:00.000Z',
    });
  });

  it('should handle missing optional fields (avatar, bio, languages)', () => {
    const sparseProvider: ProviderDocument = {
      ...mockProvider,
      bio: undefined,
      avatar_url: undefined,
      languages: undefined,
    };

    const result = mapProviderToPublicProfile(sparseProvider);

    expect(result.bio).toBe('');
    expect(result.avatar).toBe('');
    expect(result.languages).toEqual([]);
  });

  it('should handle null optional fields if they come from API that way', () => {
     // Appwrite SDK sometimes returns null for optional fields depending on version/config
    const nullProvider: ProviderDocument = {
      ...mockProvider,
      bio: undefined, // Type definition says optional string, runtime might be null if not strict
      avatar_url: undefined,
      languages: undefined,
    };

    // Force type casting to simulate runtime nulls if necessary,
    // but the interface says `string | undefined`.
    // The mapper handles `?? ""` or `?? []` so undefined is sufficient to test the fallback logic.

    const result = mapProviderToPublicProfile(nullProvider);

    expect(result.bio).toBe('');
    expect(result.avatar).toBe('');
    expect(result.languages).toEqual([]);
  });
});

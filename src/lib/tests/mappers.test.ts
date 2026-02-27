import { describe, it } from 'node:test';
import assert from 'node:assert';
import { mapListingWithDetailsToListing, PublicProviderProfile } from '@/lib/mappers';
import type { ListingWithDetails, StayDetailsDocument, TransportDetailsDocument, GuideDetailsDocument } from '@/types/listing.types';
import type { StayListing, TransportListing, GuideListing } from '@/components/listing/types';

// --- Test Data Helpers ---

const mockProvider: PublicProviderProfile = {
  id: 'provider-123',
  name: 'Test Provider',
  avatar: 'http://mock-avatar',
  bio: 'A test provider',
  region: 'Skardu',
  languages: ['English'],
  serviceAreas: ['Skardu'],
  experienceYears: 5,
  isVerified: true,
  joinedDate: '2023-01-01',
};

const baseListingDocument = {
  $id: 'listing-123',
  $collectionId: 'listings',
  $databaseId: 'db-1',
  $createdAt: '2023-01-01',
  $updatedAt: '2023-01-01',
  $permissions: [],
  provider_id: 'provider-123',
  title: 'Test Listing',
  description: 'Test Description',
  location: 'Skardu',
  region: 'Skardu',
  price: 100,
  price_unit: 'night',
  images: ['img-1', 'img-2'],
  highlights: ['wifi'],
  is_active: true,
  rating: 4.5,
  review_count: 10,
};

const baseStayDetails: StayDetailsDocument = {
  $id: 'details-123',
  $collectionId: 'stay-details',
  $databaseId: 'db-1',
  $createdAt: '2023-01-01',
  $updatedAt: '2023-01-01',
  $permissions: [],
  listing_id: 'listing-123',
  guests: 2,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  amenities: ['wifi', 'parking'],
  landmark: 'Near Lake',
  how_to_reach: 'By Car',
};

const baseTransportDetails: TransportDetailsDocument = {
  $id: 'details-456',
  $collectionId: 'transport-details',
  $databaseId: 'db-1',
  $createdAt: '2023-01-01',
  $updatedAt: '2023-01-01',
  $permissions: [],
  listing_id: 'listing-456',
  make: 'Toyota',
  model: 'Land Cruiser',
  year: 2022,
  four_wd: true,
  fuel_included: true,
  transmission: 'Automatic',
  seats: 5,
  routes: ['Skardu to Hunza'],
  terrains: ['Mountain'],
  driver_experience: 'Expert',
};

const baseGuideDetails: GuideDetailsDocument = {
  $id: 'details-789',
  $collectionId: 'guide-details',
  $databaseId: 'db-1',
  $createdAt: '2023-01-01',
  $updatedAt: '2023-01-01',
  $permissions: [],
  listing_id: 'listing-789',
  certifications: ['Certified Guide'],
  trek_routes: ['K2 Base Camp'],
  max_group_size: 10,
  experience_years: 5,
  equipment_provided: ['Tents'],
};

describe('mapListingWithDetailsToListing', () => {

  it('should map a STAY listing correctly', () => {
    const listing: ListingWithDetails = {
      ...baseListingDocument,
      type: 'stay',
      details: baseStayDetails,
    };

    const imageUrls = ['http://img1', 'http://img2'];

    const result = mapListingWithDetailsToListing(listing, imageUrls, mockProvider);

    assert.strictEqual(result.type, 'stay');
    assert.strictEqual(result.id, 'listing-123');
    assert.strictEqual(result.title, 'Test Listing');
    assert.strictEqual(result.provider.id, 'provider-123');

    const stayResult = result as StayListing;
    assert.deepStrictEqual(stayResult.propertyOverview, {
        guests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
    });
    assert.deepStrictEqual(stayResult.amenities, ['wifi', 'parking']);
    assert.strictEqual(stayResult.locationInfo.landmark, 'Near Lake');
  });

  it('should map a TRANSPORT listing correctly', () => {
    const listing: ListingWithDetails = {
      ...baseListingDocument,
      type: 'transport',
      details: baseTransportDetails,
    };

    const imageUrls = ['http://img1'];

    const result = mapListingWithDetailsToListing(listing, imageUrls, mockProvider);

    assert.strictEqual(result.type, 'transport');

    const transportResult = result as TransportListing;
    assert.strictEqual(transportResult.vehicleSpecs.make, 'Toyota');
    assert.strictEqual(transportResult.vehicleSpecs.fourWD, true);
    assert.deepStrictEqual(transportResult.routes, ['Skardu to Hunza']);
    assert.strictEqual(transportResult.safetyInfo.driverExperience, 'Expert');
  });

  it('should map a GUIDE listing correctly', () => {
    const listing: ListingWithDetails = {
      ...baseListingDocument,
      type: 'guide',
      details: baseGuideDetails,
    };

    const imageUrls = [];

    const result = mapListingWithDetailsToListing(listing, imageUrls, mockProvider);

    assert.strictEqual(result.type, 'guide');

    const guideResult = result as GuideListing;
    // Note: The mapper implementation transforms certifications (string[]) into objects ({name: string})
    // and trek_routes (string[]) into objects ({name: string, duration: ""})

    assert.strictEqual(guideResult.certifications.length, 1);
    assert.strictEqual(guideResult.certifications[0].name, 'Certified Guide');

    assert.strictEqual(guideResult.trekRoutes.length, 1);
    assert.strictEqual(guideResult.trekRoutes[0].name, 'K2 Base Camp');

    assert.deepStrictEqual(guideResult.equipment.provided, ['Tents']);
  });

  it('should handle missing provider by using fallback values', () => {
     const listing: ListingWithDetails = {
      ...baseListingDocument,
      type: 'stay',
      details: baseStayDetails,
    };

    const result = mapListingWithDetailsToListing(listing, [], null);

    assert.strictEqual(result.provider.name, 'Provider');
    assert.strictEqual(result.provider.id, 'provider-123'); // From listing
  });

  it('should fallback to STAY type with empty details if type/details mismatch or unknown', () => {
      // Case: Type is 'stay' but details are missing required fields or just wrong shape.
      // We pass a 'stay' type but provide 'guide' details to simulate a mismatch
      // that causes the specific type guards (e.g. 'guests' in details) to fail.

      const listing: ListingWithDetails = {
          ...baseListingDocument,
          type: 'stay',
          details: baseGuideDetails as any // Force mismatch
      };

      const result = mapListingWithDetailsToListing(listing, [], mockProvider);

      // Should hit the fallback at the bottom of the function
      assert.strictEqual(result.type, 'stay');
      const stayResult = result as StayListing;
      assert.strictEqual(stayResult.propertyOverview.guests, 0); // Default value from fallback
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { signupSchema, loginSchema, providerProfileSchema } from './schemas.js';

describe('Schemas', () => {
    describe('Signup Schema', () => {
        it('should validate valid data', () => {
            const validData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'tourist'
            };
            const result = signupSchema.safeParse(validData);
            assert.strictEqual(result.success, true);
        });

        it('should reject missing name', () => {
            const data = {
                name: '',
                email: 'john@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'tourist'
            };
            const result = signupSchema.safeParse(data);
            assert.strictEqual(result.success, false);
            if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.name);
            }
        });

        it('should reject short name', () => {
             const data = {
                name: 'J',
                email: 'john@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'tourist'
            };
            const result = signupSchema.safeParse(data);
            assert.strictEqual(result.success, false);
            if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.name);
            }
        });

        it('should reject invalid email', () => {
            const data = {
                name: 'John Doe',
                email: 'invalid-email',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'tourist'
            };
            const result = signupSchema.safeParse(data);
            assert.strictEqual(result.success, false);
             if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.email);
            }
        });

        it('should reject short password', () => {
            const data = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'pass',
                confirmPassword: 'pass',
                role: 'tourist'
            };
            const result = signupSchema.safeParse(data);
            assert.strictEqual(result.success, false);
            if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.password);
            }
        });

         it('should reject password without number', () => {
            const data = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password',
                confirmPassword: 'password',
                role: 'tourist'
            };
            const result = signupSchema.safeParse(data);
            assert.strictEqual(result.success, false);
            if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.password);
            }
        });

        it('should reject mismatching passwords', () => {
            const data = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                confirmPassword: 'password124',
                role: 'tourist'
            };
            const result = signupSchema.safeParse(data);
            assert.strictEqual(result.success, false);
            if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.confirmPassword);
            }
        });

        it('should reject missing role', () => {
             const data = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: undefined
            };
            const result = signupSchema.safeParse(data);
            assert.strictEqual(result.success, false);
             if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.role);
            }
        });
    });

    describe('Login Schema', () => {
        it('should validate valid data', () => {
            const validData = {
                email: 'john@example.com',
                password: 'password123'
            };
            const result = loginSchema.safeParse(validData);
            assert.strictEqual(result.success, true);
        });

         it('should reject invalid email', () => {
            const data = {
                email: 'invalid-email',
                password: 'password123'
            };
            const result = loginSchema.safeParse(data);
            assert.strictEqual(result.success, false);
             if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.email);
            }
        });

        it('should reject missing password', () => {
            const data = {
                email: 'john@example.com',
                password: ''
            };
            const result = loginSchema.safeParse(data);
            assert.strictEqual(result.success, false);
             if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.password);
            }
        });
    });

    describe('Provider Profile Schema', () => {
        it('should validate valid data', () => {
            const validData = {
                businessName: 'My Business',
                region: 'Hunza',
                bio: 'A great business',
                languages: ['English'],
                phone: '1234567890'
            };
            const result = providerProfileSchema.safeParse(validData);
            assert.strictEqual(result.success, true);
        });

         it('should reject missing business name', () => {
            const data = {
                businessName: '',
                region: 'Hunza'
            };
            const result = providerProfileSchema.safeParse(data);
            assert.strictEqual(result.success, false);
             if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.businessName);
            }
        });

        it('should reject short business name', () => {
            const data = {
                businessName: 'My',
                region: 'Hunza'
            };
            const result = providerProfileSchema.safeParse(data);
            assert.strictEqual(result.success, false);
             if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.businessName);
            }
        });

        it('should reject missing region', () => {
            const data = {
                businessName: 'My Business',
                region: ''
            };
            const result = providerProfileSchema.safeParse(data);
            assert.strictEqual(result.success, false);
             if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.region);
            }
        });

        it('should reject long bio', () => {
             const data = {
                businessName: 'My Business',
                region: 'Hunza',
                bio: 'a'.repeat(501)
            };
            const result = providerProfileSchema.safeParse(data);
            assert.strictEqual(result.success, false);
             if (!result.success) {
                assert.ok(result.error.flatten().fieldErrors.bio);
            }
        });
    });
});

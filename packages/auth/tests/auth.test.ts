import { describe, expect, test } from 'vitest';

import { signInSchema, signUpSchema } from '@workspace/auth/schemas/auth';

// Sign In Tests

describe('Sign In Schema', () => {
  test('accepts valid credentials', () => {
    // Parse Credentials
    const result = signInSchema.safeParse({
      email: 'user@example.com',
      password: 'password'
    });

    // Verify Schema
    expect(result.success).toBe(true);
  });

  test.each([
    ['an invalid email', { email: 'invalid', password: 'password' }, 'Invalid email'],
    ['an empty password', { email: 'user@example.com', password: '' }, 'Password is required']
  ])('rejects %s', (_case, credentials, message) => {
    // Parse Credentials
    const result = signInSchema.safeParse(credentials);
    if (result.success) throw new Error('Expected invalid credentials');

    // Verify Schema
    expect(result.error.issues.map((issue) => issue.message)).toContain(message);
  });
});

// Sign Up Tests

describe('Sign Up Schema', () => {
  test('accepts valid account details', () => {
    // Parse Details
    const result = signUpSchema.safeParse({
      name: 'Ada',
      surname: 'Lovelace',
      password: 'password',
      confirm: 'password'
    });

    // Verify Schema
    expect(result.success).toBe(true);
  });

  test('rejects a short password', () => {
    // Parse Details
    const result = signUpSchema.safeParse({
      name: 'Ada',
      surname: 'Lovelace',
      password: 'short',
      confirm: 'short'
    });
    if (result.success) throw new Error('Expected invalid account details');

    // Verify Schema
    expect(result.error.issues.map((issue) => issue.message)).toContain('Password is too short');
  });

  test('rejects different passwords', () => {
    // Parse Details
    const result = signUpSchema.safeParse({
      name: 'Ada',
      surname: 'Lovelace',
      password: 'password',
      confirm: 'different'
    });
    if (result.success) throw new Error('Expected invalid account details');

    // Verify Schema
    expect(result.error.issues).toContainEqual(expect.objectContaining({ message: 'Passwords do not match', path: ['confirm'] }));
  });
});

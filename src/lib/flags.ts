const FEATURE_FLAG_KEYS = ['healthcheck'] as const;

export type FeatureFlagKey = (typeof FEATURE_FLAG_KEYS)[number];

type FeatureFlagRecord = Record<FeatureFlagKey, boolean>;

const DEFAULT_FLAGS: FeatureFlagRecord = {
  healthcheck: true,
};

function readEnvironmentOverrides(): Partial<FeatureFlagRecord> {
  if (typeof process === 'undefined') {
    return {};
  }

  return FEATURE_FLAG_KEYS.reduce<Partial<FeatureFlagRecord>>((overrides, key) => {
    const envKey = `NEXT_PUBLIC_FLAG_${key.toUpperCase()}`;
    const value = process.env[envKey];
    if (typeof value === 'string') {
      overrides[key] = value === 'true' || value === '1' || value.toLowerCase() === 'on';
    }
    return overrides;
  }, {});
}

const ENVIRONMENT_FLAGS = readEnvironmentOverrides();

export function getAllFeatureFlags(
  overrides?: Partial<FeatureFlagRecord>,
): FeatureFlagRecord {
  return {
    ...DEFAULT_FLAGS,
    ...ENVIRONMENT_FLAGS,
    ...(overrides ?? {}),
  };
}

export function isFeatureEnabled(
  key: FeatureFlagKey,
  overrides?: Partial<FeatureFlagRecord>,
): boolean {
  const flags = getAllFeatureFlags(overrides);
  return flags[key];
}

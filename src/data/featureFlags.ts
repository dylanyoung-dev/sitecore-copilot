type FeatureFlag = {
  key: string;
  description: string;
  enabled: boolean;
};

const featureFlags: FeatureFlag[] = [
  {
    key: 'enableExperienceChat',
    description: 'Enable Sitecore Experience Chat (CDP/P)',
    enabled: false,
  },
];

export default featureFlags;

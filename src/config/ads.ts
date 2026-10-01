export const adPlacements = [
  "header",
  "content-top",
  "content-middle",
  "tool-result-bottom",
  "content-bottom",
  "sidebar",
] as const;

export type AdPlacement = (typeof adPlacements)[number];

export interface AdSlotConfig {
  placement: AdPlacement;
  enabled: boolean;
  label: string;
}

/**
 * Publisher script from AdSense. Auto ads uses this tag in the document head.
 * Manual slots stay off until an ad unit id (data-ad-slot) exists.
 */
export const adsense = {
  enabled: true,
  client: "ca-pub-1432749554317499",
} as const;

/**
 * Manual placements stay off until each one has an AdSense ad unit id.
 * Enabling one without a slot id only renders an empty labeled region.
 */
export const adSlotConfig: Record<AdPlacement, AdSlotConfig> = {
  header: {
    placement: "header",
    enabled: false,
    label: "Espacio publicitario superior",
  },
  "content-top": {
    placement: "content-top",
    enabled: false,
    label: "Espacio publicitario",
  },
  "content-middle": {
    placement: "content-middle",
    enabled: false,
    label: "Espacio publicitario",
  },
  "tool-result-bottom": {
    placement: "tool-result-bottom",
    enabled: false,
    label: "Espacio publicitario debajo del resultado",
  },
  "content-bottom": {
    placement: "content-bottom",
    enabled: false,
    label: "Espacio publicitario inferior",
  },
  sidebar: {
    placement: "sidebar",
    enabled: false,
    label: "Espacio publicitario lateral",
  },
};

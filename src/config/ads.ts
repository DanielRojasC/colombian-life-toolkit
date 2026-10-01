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
 * Slots stay off until there is a real ad network configuration.
 * Enabling one only renders a labeled region. It does not load third-party code.
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

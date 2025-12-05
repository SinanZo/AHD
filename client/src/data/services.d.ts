/**
 * Services data module - provides canonical service definitions
 * and icon mappings for the AHD services section.
 */

/** Service definition with internationalization key and icon name */
export interface Service {
  key: string;
  icon: string;
}

/** Icon name to icon identifier mapping */
export interface IconMap {
  [key: string]: string;
}

/**
 * Canonical list of services used by both locales.
 * Titles and descriptions are populated from i18n keys.
 */
export const SERVICES: Service[];

/**
 * Map of icon names to inline SVG ids or icon identifiers.
 * Used by the component to render appropriate icons.
 */
export const ICONS: IconMap;

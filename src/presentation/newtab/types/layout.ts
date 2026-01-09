/**
 * Dashboard layout configuration types
 */

export type SectionId = 'profile' | 'repository' | 'pullRequest' | 'issue';

export interface SectionConfig {
  id: SectionId;
  visible: boolean;
  order: number;
}

export interface DashboardLayoutConfig {
  sections: SectionConfig[];
}

/**
 * Default dashboard layout configuration
 */
export const DEFAULT_LAYOUT_CONFIG: DashboardLayoutConfig = {
  sections: [
    { id: 'profile', visible: true, order: 0 },
    { id: 'repository', visible: true, order: 1 },
    { id: 'pullRequest', visible: true, order: 2 },
    { id: 'issue', visible: true, order: 3 },
  ],
};

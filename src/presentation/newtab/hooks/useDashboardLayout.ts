import { useState, useEffect, useCallback } from 'react';
import { Container } from '@/application/di/Container';
import { StorageKeys } from '@/infrastructure/storage/StorageKeys';
import {
  DashboardLayoutConfig,
  SectionConfig,
  SectionId,
  DEFAULT_LAYOUT_CONFIG,
} from '../types/layout';

export function useDashboardLayout() {
  const [config, setConfig] = useState<DashboardLayoutConfig>(DEFAULT_LAYOUT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Load layout configuration from storage
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const container = Container.getInstance();
        const storage = container.getStorage();
        const savedConfig = await storage.get<DashboardLayoutConfig>(StorageKeys.DASHBOARD_LAYOUT);

        if (savedConfig && savedConfig.sections && Array.isArray(savedConfig.sections)) {
          setConfig(savedConfig);
        } else {
          // Use default config and save it
          setConfig(DEFAULT_LAYOUT_CONFIG);
          await storage.set(StorageKeys.DASHBOARD_LAYOUT, DEFAULT_LAYOUT_CONFIG);
        }
      } catch (error) {
        console.error('Failed to load dashboard layout:', error);
        setConfig(DEFAULT_LAYOUT_CONFIG);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Save configuration to storage
  const saveConfig = useCallback(async (newConfig: DashboardLayoutConfig) => {
    try {
      const container = Container.getInstance();
      const storage = container.getStorage();
      await storage.set(StorageKeys.DASHBOARD_LAYOUT, newConfig);
      setConfig(newConfig);
    } catch (error) {
      console.error('Failed to save dashboard layout:', error);
      throw error;
    }
  }, []);

  // Reorder sections
  const reorderSections = useCallback(
    (sourceId: SectionId, targetId: SectionId) => {
      const sourceSection = config.sections.find((s) => s.id === sourceId);
      const targetSection = config.sections.find((s) => s.id === targetId);

      if (!sourceSection || !targetSection) {
        return;
      }

      const newSections = [...config.sections];
      const sourceIndex = newSections.findIndex((s) => s.id === sourceId);
      const targetIndex = newSections.findIndex((s) => s.id === targetId);

      // Swap orders
      const tempOrder = sourceSection.order;
      sourceSection.order = targetSection.order;
      targetSection.order = tempOrder;

      // Swap positions in array
      [newSections[sourceIndex], newSections[targetIndex]] = [
        newSections[targetIndex],
        newSections[sourceIndex],
      ];

      const newConfig: DashboardLayoutConfig = {
        sections: newSections.sort((a, b) => a.order - b.order),
      };

      saveConfig(newConfig);
    },
    [config, saveConfig]
  );

  // Toggle section visibility
  const toggleSectionVisibility = useCallback(
    (sectionId: SectionId) => {
      const newSections = config.sections.map((section) =>
        section.id === sectionId ? { ...section, visible: !section.visible } : section
      );

      const newConfig: DashboardLayoutConfig = {
        sections: newSections,
      };

      saveConfig(newConfig);
    },
    [config, saveConfig]
  );

  // Get ordered and visible sections
  const getOrderedVisibleSections = useCallback((): SectionConfig[] => {
    return config.sections
      .filter((section) => section.visible)
      .sort((a, b) => a.order - b.order);
  }, [config]);

  // Get section by ID
  const getSection = useCallback(
    (sectionId: SectionId): SectionConfig | undefined => {
      return config.sections.find((s) => s.id === sectionId);
    },
    [config]
  );

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  return {
    config,
    loading,
    editMode,
    toggleEditMode,
    reorderSections,
    toggleSectionVisibility,
    getOrderedVisibleSections,
    getSection,
    saveConfig,
  };
}

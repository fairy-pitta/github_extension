import { useState, useEffect, useCallback } from 'react';
import { useServices } from '../../context/ServiceContext';
import {
  DashboardLayoutConfig,
  SectionConfig,
  SectionId,
  DEFAULT_LAYOUT_CONFIG,
} from '../types/layout';
import type { DashboardLayoutConfig as SettingsDashboardLayoutConfig } from '@/application/services/SettingsService';

export function useDashboardLayout() {
  const services = useServices();
  const [config, setConfig] = useState<DashboardLayoutConfig>(DEFAULT_LAYOUT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Load layout configuration from storage
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const settingsService = services.getSettingsService();
        const savedConfig = await settingsService.getDashboardLayout();

        if (savedConfig && savedConfig.sections && Array.isArray(savedConfig.sections)) {
          setConfig(savedConfig as DashboardLayoutConfig);
        } else {
          // Use default config and save it
          setConfig(DEFAULT_LAYOUT_CONFIG);
          await settingsService.setDashboardLayout(DEFAULT_LAYOUT_CONFIG as SettingsDashboardLayoutConfig);
        }
      } catch (error) {
        console.error('Failed to load dashboard layout:', error);
        setConfig(DEFAULT_LAYOUT_CONFIG);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [services]);

  // Save configuration to storage
  const saveConfig = useCallback(async (newConfig: DashboardLayoutConfig) => {
    try {
      const settingsService = services.getSettingsService();
      await settingsService.setDashboardLayout(newConfig as SettingsDashboardLayoutConfig);
      setConfig(newConfig);
    } catch (error) {
      console.error('Failed to save dashboard layout:', error);
      throw error;
    }
  }, [services]);

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

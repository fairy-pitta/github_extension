import { IStorage } from '@/infrastructure/storage/IStorage';
import { StorageKeys } from '../config/StorageKeys';

export type Theme = 'light' | 'dark' | 'light-blue' | 'light-purple' | 'light-green' | 'light-pink' | 'light-white';
export type Language = 'en' | 'ja';

export interface DashboardLayoutConfig {
  sections: Array<{
    id: string;
    order: number;
    visible: boolean;
  }>;
}

/**
 * Settings service
 * Manages user preferences and settings
 */
export class SettingsService {
  constructor(private readonly storage: IStorage) {}

  /**
   * Get theme setting
   */
  async getTheme(): Promise<Theme> {
    const theme = await this.storage.get<Theme>(StorageKeys.THEME);
    const validThemes: Theme[] = ['light', 'dark', 'light-blue', 'light-purple', 'light-green', 'light-pink', 'light-white'];
    if (theme && validThemes.includes(theme)) {
      return theme;
    }
    return 'light';
  }

  /**
   * Set theme setting
   */
  async setTheme(theme: Theme): Promise<void> {
    await this.storage.set(StorageKeys.THEME, theme);
  }

  /**
   * Get language setting
   */
  async getLanguage(): Promise<Language> {
    const language = await this.storage.get<Language>(StorageKeys.LANGUAGE);
    if (language === 'en' || language === 'ja') {
      return language;
    }
    return 'en';
  }

  /**
   * Set language setting
   */
  async setLanguage(language: Language): Promise<void> {
    await this.storage.set(StorageKeys.LANGUAGE, language);
  }

  /**
   * Get show on GitHub setting
   */
  async getShowOnGitHub(): Promise<boolean> {
    const value = await this.storage.get<boolean>(StorageKeys.SHOW_ON_GITHUB);
    return value !== false; // Default to true
  }

  /**
   * Set show on GitHub setting
   */
  async setShowOnGitHub(value: boolean): Promise<void> {
    await this.storage.set(StorageKeys.SHOW_ON_GITHUB, value);
  }

  /**
   * Get show motivation message setting
   */
  async getShowMotivationMessage(): Promise<boolean> {
    const value = await this.storage.get<boolean>(StorageKeys.SHOW_MOTIVATION_MESSAGE);
    return value !== false; // Default to true
  }

  /**
   * Set show motivation message setting
   */
  async setShowMotivationMessage(value: boolean): Promise<void> {
    await this.storage.set(StorageKeys.SHOW_MOTIVATION_MESSAGE, value);
  }

  /**
   * Get dashboard layout configuration
   */
  async getDashboardLayout(): Promise<DashboardLayoutConfig | null> {
    return await this.storage.get<DashboardLayoutConfig>(StorageKeys.DASHBOARD_LAYOUT);
  }

  /**
   * Set dashboard layout configuration
   */
  async setDashboardLayout(config: DashboardLayoutConfig): Promise<void> {
    await this.storage.set(StorageKeys.DASHBOARD_LAYOUT, config);
  }
}


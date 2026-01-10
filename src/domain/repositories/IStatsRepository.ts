import { StatsData } from '../entities/StatsData';

/**
 * Interface for statistics repository
 */
export interface IStatsRepository {
  /**
   * Get statistics data (weekly and monthly)
   */
  getStatsData(): Promise<StatsData>;
}



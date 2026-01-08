import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardData } from '../useDashboardData';
import { Container } from '@/application/di/Container';
import { DashboardData } from '@/domain/usecases/GetDashboardData';

describe('useDashboardData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch dashboard data on mount', async () => {
    const mockData: DashboardData = {
      createdPRs: [],
      reviewRequestedPRs: [],
      involvedIssues: [],
      recentlyUpdatedRepos: [],
    };

    const mockContainer = {
      getDashboardService: vi.fn(() => ({
        getDashboardData: vi.fn().mockResolvedValue(mockData),
      })),
    };

    vi.spyOn(Container, 'getInstance').mockReturnValue(mockContainer as unknown as Container);

    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    const mockError = new Error('Failed to fetch');

    const mockContainer = {
      getDashboardService: vi.fn(() => ({
        getDashboardData: vi.fn().mockRejectedValue(mockError),
      })),
    };

    vi.spyOn(Container, 'getInstance').mockReturnValue(mockContainer as unknown as Container);

    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeNull();
  });

  it('should provide refresh function', async () => {
    const mockData: DashboardData = {
      createdPRs: [],
      reviewRequestedPRs: [],
      involvedIssues: [],
      recentlyUpdatedRepos: [],
    };

    const mockGetDashboardData = vi.fn().mockResolvedValue(mockData);
    const mockContainer = {
      getDashboardService: vi.fn(() => ({
        getDashboardData: mockGetDashboardData,
      })),
    };

    vi.spyOn(Container, 'getInstance').mockReturnValue(mockContainer as unknown as Container);

    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.refresh).toBeDefined();
    expect(typeof result.current.refresh).toBe('function');

    await result.current.refresh();

    expect(mockGetDashboardData).toHaveBeenCalledTimes(2); // Initial + refresh
  });
});



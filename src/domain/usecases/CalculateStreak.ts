import { ContributionCalendar } from '../entities/ContributionCalendar';
import { ContributionStreak } from '../entities/ContributionStreak';

/**
 * Use case: Calculate contribution streak
 * Calculates current streak, longest streak, and today's contribution status
 */
export class CalculateStreak {
  execute(calendar: ContributionCalendar): ContributionStreak {
    // Get all contribution days sorted by date
    const allDays: Array<{ date: string; count: number }> = [];
    calendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        allDays.push({
          date: day.date,
          count: day.contributionCount,
        });
      });
    });

    // Sort by date (ascending)
    allDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastContributionDate: Date | null = null;
    let todayContributed = false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Iterate backwards from today to find current streak
    for (let i = allDays.length - 1; i >= 0; i--) {
      const day = allDays[i];
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);

      // Check if today has contributions
      if (dayDate.getTime() === today.getTime() && day.count > 0) {
        todayContributed = true;
        currentStreak = 1;
        lastContributionDate = dayDate;
        continue;
      }

      // If we found today's contribution, continue counting backwards
      if (currentStreak > 0) {
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - currentStreak);
        expectedDate.setHours(0, 0, 0, 0);

        if (dayDate.getTime() === expectedDate.getTime() && day.count > 0) {
          currentStreak++;
          lastContributionDate = dayDate;
        } else {
          // Streak broken
          break;
        }
      }
    }

    // Calculate longest streak
    for (let i = 0; i < allDays.length; i++) {
      const day = allDays[i];
      if (day.count > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
        if (!lastContributionDate) {
          lastContributionDate = new Date(day.date);
        }
      } else {
        tempStreak = 0;
      }
    }

    return ContributionStreak.fromPlain({
      currentStreak,
      longestStreak,
      todayContributed,
      lastContributionDate,
    });
  }
}



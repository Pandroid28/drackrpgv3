import humanizeDuration from 'humanize-duration';

export class Utils {
  /**
   * Format a duration in milliseconds to a human-readable string
   */
  static formatDuration(ms: number, language: string = 'en'): string {
    return humanizeDuration(ms, {
      language,
      round: true,
      largest: 2
    });
  }

  /**
   * Format a number with comma separators
   */
  static formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  }

  /**
   * Get a random integer between min and max (inclusive)
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get a random element from an array
   */
  static randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Check if a user can claim a daily/weekly reward
   */
  static canClaim(lastClaim: number | undefined, cooldownMs: number): boolean {
    if (!lastClaim) return true;
    return Date.now() - lastClaim >= cooldownMs;
  }

  /**
   * Get remaining time until next claim
   */
  static getClaimCooldown(lastClaim: number | undefined, cooldownMs: number): number {
    if (!lastClaim) return 0;
    const remaining = cooldownMs - (Date.now() - lastClaim);
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Calculate level from experience
   */
  static calculateLevel(experience: number): number {
    return Math.floor(Math.sqrt(experience / 100));
  }

  /**
   * Calculate experience needed for next level
   */
  static experienceForLevel(level: number): number {
    return Math.pow(level + 1, 2) * 100;
  }

  /**
   * Truncate a string to a maximum length
   */
  static truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  }

  /**
   * Create a progress bar
   */
  static progressBar(current: number, max: number, length: number = 10): string {
    const percentage = Math.min(current / max, 1);
    const filled = Math.round(length * percentage);
    const empty = length - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
}

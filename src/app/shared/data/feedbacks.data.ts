/**
 * Represents a single feedback entry from a team member or colleague.
 */
export interface FeedbackEntry {
  /**
   * Unique key used for translation or identification.
   */
  key: string;

  /**
   * Full name of the person giving the feedback.
   */
  name: string;

  /**
   * Source project or context in which the person worked with you.
   */
  source: string;

  /**
   * Optional LinkedIn profile URL of the person.
   */
  linkedin?: string;
}

/**
 * Static list of feedback entries displayed in the portfolio.
 * Used to showcase testimonials and recommendations from past projects.
 */
export const FEEDBACKS: FeedbackEntry[] = [
  {
    key: 'patrick',
    name: 'Patrick Frey',
    source: 'Join',
    linkedin: 'https://www.linkedin.com/in/patrick-frey-690000164/',
  },
  {
    key: 'stephanie',
    name: 'Stephanie Englberger',
    source: 'Join',
    linkedin: 'https://www.linkedin.com/in/stephanie-englberger/',
  },
  {
    key: 'jennifer',
    name: 'Jennifer Thomas',
    source: 'Join',
    linkedin: 'https://www.linkedin.com/in/jennifer-thomas-595735360/',
  },
  {
    key: 'ha',
    name: 'Ha Dao',
    source: 'Kochwelt',
    linkedin: 'https://www.linkedin.com/in/dao-cong-viet-ha/',
  },
  {
    key: 'taher',
    name: 'Taher Abdel Megid',
    source: 'Kochwelt',
  },
];

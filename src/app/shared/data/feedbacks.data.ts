export interface FeedbackEntry {
  key: string;
  name: string;
  source: string;
  linkedin?: string;
}

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

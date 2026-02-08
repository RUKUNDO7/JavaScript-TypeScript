export interface InvitationData {
  category: 'Announcements' | 'Birthdays'; // New selection
  subFamily: 'Wihogora' | 'Light' | 'Hope';
  title: string;
  slogan: string;
  agenda: string;
  date: string;
  time: string;
  location: string;
  additionalNotes: string;
  host: string;
}

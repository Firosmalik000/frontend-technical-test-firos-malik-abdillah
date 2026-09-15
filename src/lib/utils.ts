export { cn } from 'cn';

export const FormatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
};

export const FormatStatus = (status: string) => {
  return status
    .toLowerCase()
    .replace('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

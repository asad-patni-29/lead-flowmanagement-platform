import moment from 'moment';

export const dateFormatter = (
  dateJson: string | Date | moment.Moment | null | undefined,
  format = 'YYYY-MM-DD'
): string => {
  if (!dateJson) return '-';
  const date = new Date(dateJson as string | Date);
  return moment(date).format(format);
};

export const formatDateTime = (
  dateJson: string | Date | moment.Moment | null | undefined,
  format = 'DD-MM-YYYY hh:mm A'
): string => {
  if (!dateJson) return '-';
  const date = new Date(dateJson as string | Date);
  return moment(date).format(format);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

export default dateFormatter;

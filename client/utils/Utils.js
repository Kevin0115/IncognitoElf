import moment from 'moment';

export function formatDate(date) {
  let formattedDate = moment(date).format('MMM Do, YYYY');
  return formattedDate;
}
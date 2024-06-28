export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

interface TimeStatus {
  text: string;
  chipText: string;
  isOverdue: boolean;
  urgency: 'low' | 'medium' | 'high'
}

export function calculateTimeStatus(dueDateString: string): TimeStatus {
  const dueDate = new Date(dueDateString);
  if (isNaN(dueDate.getTime())) {
    return { text: "Invalid date", chipText: "Invalid", isOverdue: false, urgency: 'low' };
  }

  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  const minutesDiff = Math.round(diff / (1000 * 60));
  const hoursDiff = Math.round(diff / (1000 * 60 * 60));
  const daysDiff = Math.round(diff / (1000 * 60 * 60 * 24));
  const monthsDiff = Math.round(daysDiff / 30);

  let text: string;
  let chipText: string;
  let isOverdue = false;
  let urgency: 'low' | 'medium' | 'high' = 'low';

  if (diff < 0) {
    isOverdue = true;
    urgency = 'high';
    chipText = "Overdue";
    if (Math.abs(minutesDiff) < 60) {
      text = `Overdue by ${Math.abs(minutesDiff)} minute${Math.abs(minutesDiff) !== 1 ? 's' : ''}`;
    } else if (Math.abs(hoursDiff) < 24) {
      text = `Overdue by ${Math.abs(hoursDiff)} hour${Math.abs(hoursDiff) !== 1 ? 's' : ''}`;
    } else if (Math.abs(daysDiff) < 30) {
      text = `Overdue by ${Math.abs(daysDiff)} day${Math.abs(daysDiff) !== 1 ? 's' : ''}`;
    } else {
      text = `Overdue by ${Math.abs(monthsDiff)} month${Math.abs(monthsDiff) !== 1 ? 's' : ''}`;
    }
  } else {
    if (minutesDiff < 60) {
      text = `Due in ${minutesDiff} minute${minutesDiff !== 1 ? 's' : ''}`;
      chipText = "Soon";
      urgency = 'high';
    } else if (hoursDiff < 24) {
      text = `Due in ${hoursDiff} hour${hoursDiff !== 1 ? 's' : ''}`;
      chipText = "Today";
      urgency = 'medium';
    } else if (daysDiff === 1) {
      text = "Due tomorrow";
      chipText = "Tomorrow";
      urgency = 'medium';
    } else if (daysDiff < 7) {
      text = `Due in ${daysDiff} days`;
      chipText = "This week";
      urgency = 'medium';
    } else if (daysDiff < 30) {
      text = `Due in ${daysDiff} days`;
      chipText = "This month";
      urgency = 'low';
    } else if (monthsDiff < 12) {
      text = `Due in ${monthsDiff} month${monthsDiff !== 1 ? 's' : ''}`;
      chipText = monthsDiff === 1 ? "Next month" : "Upcoming";
      urgency = 'low';
    } else {
      const yearsDiff = Math.floor(monthsDiff / 12);
      text = `Due in ${yearsDiff} year${yearsDiff !== 1 ? 's' : ''}`;
      chipText = "Future";
      urgency = 'low';
    }
  }

  return { text, chipText, isOverdue, urgency };
}

export const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

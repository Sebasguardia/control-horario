import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: Date | string, formatStr: string = 'PP') => {
    return format(new Date(date), formatStr, { locale: es });
};

export const getWeekDays = (date: Date = new Date()) => {
    const start = startOfWeek(date, { locale: es });
    const end = endOfWeek(date, { locale: es });
    return eachDayOfInterval({ start, end });
};

export const isToday = (date: Date | string) => {
    return isSameDay(new Date(date), new Date());
};

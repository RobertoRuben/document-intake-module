export const formatDateLima = (date: Date | string | undefined): string => {
    if (!date) return "N/A";

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Lima'
    };

    return new Intl.DateTimeFormat('es-PE', options).format(dateObj);
};
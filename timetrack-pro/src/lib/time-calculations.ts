export const calculateDuration = (start: string, end: string | null) => {
    if (!end) return 0;
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return Math.floor((endTime - startTime) / 1000);
};

export const calculateNetWorkMinutes = (totalSeconds: number, breakMinutes: number) => {
    const totalMinutes = Math.floor(totalSeconds / 60);
    return Math.max(0, totalMinutes - breakMinutes);
};

export const mockUser = {
    id: "user-1",
    email: "carlos.garcia@email.com",
    full_name: "Carlos García",
    avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=Carlos&backgroundColor=166534&textColor=ffffff",
    expected_hours_per_day: 8,
    timezone: "America/Lima",
    gender: "No especificado",
    city: "Lima",
    position: "Desarrollador Senior",
    department: "Tecnología",
    schedule: {
        start: "08:00",
        end: "17:00"
    }
};

export const mockStats = {
    totalHoursThisWeek: 34.5,
    totalHoursLastWeek: 32,
    sessionsThisWeek: 5,
    sessionsLastWeek: 5,
    breakMinutesThisWeek: 210,
    breakMinutesLastWeek: 195,
    overtimeMinutesThisWeek: 90,
    overtimeMinutesLastWeek: 45,
};

export const mockWeeklyData = [
    { day: "Lun", hours: 8.2, target: 8 },
    { day: "Mar", hours: 7.5, target: 8 },
    { day: "Mié", hours: 8.8, target: 8 },
    { day: "Jue", hours: 6.5, target: 8 },
    { day: "Vie", hours: 3.5, target: 8 },
    { day: "Sáb", hours: 0, target: 0 },
    { day: "Dom", hours: 0, target: 0 },
];

export const mockRecentSessions = [
    {
        id: "s2",
        date: "2026-02-10",
        startTime: "08:15",
        endTime: "17:30",
        totalMinutes: 495, // (9h15 - 1h break)
        breakMinutes: 60,
        status: "completed" as const,
    },
    {
        id: "s3",
        date: "2026-02-07",
        startTime: "09:00",
        endTime: "18:00",
        totalMinutes: 495, // (9h - 45m break)
        breakMinutes: 45,
        status: "completed" as const,
    },
    {
        id: "s4",
        date: "2026-02-06",
        startTime: "08:30",
        endTime: "17:00",
        totalMinutes: 450, // (8.5h - 1h break)
        breakMinutes: 60,
        status: "completed" as const,
    },
    {
        id: "s5",
        date: "2026-02-05",
        startTime: "08:00",
        endTime: "16:45",
        totalMinutes: 495, // (8h45 - 30m break)
        breakMinutes: 30,
        status: "completed" as const,
    },
];

export const mockMonthlyData = [
    { week: "Sem 1", hours: 40, target: 40 },
    { week: "Sem 2", hours: 38, target: 40 },
    { week: "Sem 3", hours: 42, target: 40 },
    { week: "Sem 4", hours: 34.5, target: 40 },
];

export const mockBreakTypes = [
    { name: "Almuerzo", value: 120, color: "#166534" },
    { name: "Descanso", value: 60, color: "#22c55e" },
    { name: "Personal", value: 30, color: "#86efac" },
];

export const mockProjects = [
    { id: "p1", name: "TimeTrack Pro", color: "#166534", isActive: true },
    { id: "p2", name: "Marketing Website", color: "#0284c7", isActive: true },
    { id: "p3", name: "API Integration", color: "#d97706", isActive: true },
    { id: "p4", name: "Mobile App", color: "#7c3aed", isActive: false },
];

export const mockProductivityData = [
    { day: "Lun", productivity: 92 },
    { day: "Mar", productivity: 85 },
    { day: "Mié", productivity: 95 },
    { day: "Jue", productivity: 78 },
    { day: "Vie", productivity: 88 },
];

export const mockHistorySessions = [
    ...mockRecentSessions,
    {
        id: "s6",
        date: "2026-02-04",
        startTime: "08:00",
        endTime: "17:15",
        totalMinutes: 510, // (9h15 - 45m break)
        breakMinutes: 45,
        status: "completed" as const,
    },
    {
        id: "s7",
        date: "2026-02-03",
        startTime: "08:30",
        endTime: "17:30",
        totalMinutes: 480, // (9h - 1h break)
        breakMinutes: 60,
        status: "completed" as const,
    },
    {
        id: "s8",
        date: "2026-01-31",
        startTime: "09:00",
        endTime: "18:00",
        totalMinutes: 480,
        breakMinutes: 60,
        status: "completed" as const,
    },
    {
        id: "s9",
        date: "2026-01-30",
        startTime: "08:00",
        endTime: "16:30",
        totalMinutes: 480,
        breakMinutes: 30,
        status: "completed" as const,
    },
    {
        id: "s10",
        date: "2026-01-29",
        startTime: "08:15",
        endTime: "17:45",
        totalMinutes: 510,
        breakMinutes: 60,
        status: "completed" as const,
    },
];

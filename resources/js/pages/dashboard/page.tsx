'use client';
import { CardStat } from '@/components/kendaraan/card-stat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    CalendarClock,
    Car,
    ClipboardList,
    Gauge,
    Users,
    Wrench,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

export default function DashboardPage() {
    // Simulated summary stats (could be synced with localStorage if needed)
    const stats = [
        {
            title: 'Total Kendaraan',
            value: 24,
            icon: <Car className="size-5 text-muted-foreground" />,
        },
        {
            title: 'Total Sopir',
            value: 12,
            icon: <Users className="size-5 text-muted-foreground" />,
        },
        {
            title: 'Penggunaan Aktif',
            value: 5,
            icon: <ClipboardList className="size-5 text-muted-foreground" />,
        },
    ];

    // Metrik ringkas baru
    const extraStats = [
        {
            title: 'Unit Tersedia',
            value: 19,
            icon: <Gauge className="size-5 text-muted-foreground" />,
        },
        {
            title: 'Jadwal Servis',
            value: 3,
            icon: <Wrench className="size-5 text-muted-foreground" />,
        },
        {
            title: 'Rata2 Penggunaan/Hari',
            value: 8,
            icon: <CalendarClock className="size-5 text-muted-foreground" />,
        },
    ];

    // Dataset chart simulasi
    const pemakaianBulanan = [
        { bulan: 'Jan', penggunaan: 42 },
        { bulan: 'Feb', penggunaan: 38 },
        { bulan: 'Mar', penggunaan: 51 },
        { bulan: 'Apr', penggunaan: 46 },
        { bulan: 'Mei', penggunaan: 57 },
        { bulan: 'Jun', penggunaan: 62 },
    ];

    const komposisiKendaraan = [
        { name: 'Aktif', value: 18 },
        { name: 'Servis', value: 4 },
        { name: 'Tidak Aktif', value: 2 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((s) => (
                    <CardStat
                        key={s.title}
                        title={s.title}
                        value={s.value}
                        icon={s.icon}
                    />
                ))}
            </div>

            {/* Kartu extra */}
            <div className="grid gap-4 md:grid-cols-3">
                {extraStats.map((s) => (
                    <CardStat
                        key={s.title}
                        title={s.title}
                        value={s.value}
                        icon={s.icon}
                    />
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-balance">
                        Penggunaan Kendaraan per Bulan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        className="h-[280px]"
                        config={{
                            penggunaan: {
                                label: 'Penggunaan',
                                color: 'hsl(var(--chart-1))',
                            },
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={pemakaianBulanan}
                                margin={{ left: 8, right: 8 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="bulan" />
                                <YAxis />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />
                                <Legend />
                                <Bar
                                    dataKey="penggunaan"
                                    fill="var(--color-penggunaan)"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-balance">
                        Komposisi Status Kendaraan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        className="h-[280px]"
                        config={{
                            aktif: {
                                label: 'Aktif',
                                color: 'hsl(var(--chart-2))',
                            },
                            servis: {
                                label: 'Servis',
                                color: 'hsl(var(--chart-3))',
                            },
                            nonaktif: {
                                label: 'Tidak Aktif',
                                color: 'hsl(var(--chart-4))',
                            },
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />
                                <Legend />
                                <Pie
                                    data={komposisiKendaraan}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={90}
                                    paddingAngle={4}
                                >
                                    <Cell fill="var(--color-aktif)" />
                                    <Cell fill="var(--color-servis)" />
                                    <Cell fill="var(--color-nonaktif)" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}

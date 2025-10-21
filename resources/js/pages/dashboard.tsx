'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, Clock, Gauge, TrendingUp, Users, Zap } from 'lucide-react';
import { useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penggunaan',
        href: dashboard().url,
    },
];

export default function DashboardPage({
    kendaraanData,
    sopirData,
    penggunaanData,
}: any) {
    // Calculate KPI metrics
    const totalKendaraan = kendaraanData.length;
    const kendaraanAktif = kendaraanData.filter(
        (k: any) => k.status === 'Active',
    ).length;
    const kendaraanDalamPerjalanan = penggunaanData.filter(
        (p: any) => p.status === 'Dalam Perjalanan',
    ).length;
    const sopirAktif = sopirData.filter(
        (s: any) => s.status === 'Active',
    ).length;

    // Trip bulan ini
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const tripBulanIni = penggunaanData.filter((p: any) => {
        const date = new Date(p.tanggal_mulai);
        return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
        );
    }).length;

    // Rata-rata durasi perjalanan
    const selesaiData = penggunaanData.filter(
        (p: any) => p.status === 'Selesai' && p.tanggal_selesai,
    );

    const rataRataDurasi =
        selesaiData.length > 0
            ? (
                  selesaiData.reduce((acc: any, p: any) => {
                      const mulai = new Date(
                          `${p.tanggal_mulai}T${p.waktu_mulai}`,
                      );
                      const selesai = new Date(
                          `${p.tanggal_selesai}T${p.waktu_selesai}`,
                      );
                      const durasi =
                          (selesai.getTime() - mulai.getTime()) /
                          (1000 * 60 * 60);
                      return acc + durasi;
                  }, 0) / selesaiData.length
              ).toFixed(1)
            : 0;

    // Chart data: Status Kendaraan
    const statusKendaraanChart = [
        {
            name: 'Active',
            value: kendaraanData.filter((k: any) => k.status === 'Active')
                .length,
        },
        {
            name: 'Maintenance',
            value: kendaraanData.filter((k: any) => k.status === 'Maintenance')
                .length,
        },
        {
            name: 'Inactive',
            value: kendaraanData.filter((k: any) => k.status === 'Inactive')
                .length,
        },
    ];

    // Chart data: Tren Perjalanan (30 hari)
    const trenPerjalananChart = useMemo(() => {
        const days = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = penggunaanData.filter(
                (p: any) => p.tanggal_mulai === dateStr,
            ).length;
            days.push({
                date: date.toLocaleDateString('id-ID', {
                    month: 'short',
                    day: 'numeric',
                }),
                trips: count,
            });
        }
        return days;
    }, []);

    // Chart data: Utilisasi Kendaraan
    const utilisasiKendaraanChart = useMemo(() => {
        const kendaraanMap: { [key: string]: number } = {};
        penggunaanData.forEach((p: any) => {
            if (!kendaraanMap[p.kendaraan?.nomor_polisi])
                kendaraanMap[p.kendaraan?.nomor_polisi] = 0;
            if (p.tanggal_selesai && p.waktu_selesai) {
                const mulai = new Date(`${p.tanggal_mulai}T${p.waktu_mulai}`);
                const selesai = new Date(
                    `${p.tanggal_selesai}T${p.waktu_selesai}`,
                );
                const durasi =
                    (selesai.getTime() - mulai.getTime()) / (1000 * 60 * 60);
                kendaraanMap[p.kendaraan?.nomor_polisi] += durasi;
            }
        });
        return Object.entries(kendaraanMap).map(([id, hours]) => ({
            kendaraan: id,
            jam: Number.parseFloat(hours.toFixed(1)),
        }));
    }, []);

    // Chart data: Aktivitas Sopir
    const aktivitasSopirChart = useMemo(() => {
        const sopirMap: { [key: string]: number } = {};

        penggunaanData.forEach((p: any) => {
            if (!sopirMap[p.sopir?.nama]) sopirMap[p.sopir?.nama] = 0;
            sopirMap[p.sopir?.nama] += 1;
        });

        return Object.entries(sopirMap).map(([id, trips]) => ({
            sopir: id,
            trips: trips,
        }));
    }, []);

    const COLORS = ['#3b82f6', '#f97316', '#ef4444'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="mb-3">
                    <h1 className="text-2xl font-bold">
                        Dashboard Manajemen Kendaraan
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Ringkasan operasional dan analitik kendaraan
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Total Kendaraan
                            </CardTitle>
                            <Gauge className="size-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">
                                {totalKendaraan}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Unit dalam sistem
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Kendaraan Aktif
                            </CardTitle>
                            <TrendingUp className="size-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">
                                {kendaraanAktif}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {(
                                    (kendaraanAktif / totalKendaraan) *
                                    100
                                ).toFixed(0)}
                                % dari total
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-white">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Dalam Perjalanan
                            </CardTitle>
                            <Zap className="size-5 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600">
                                {kendaraanDalamPerjalanan}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Kendaraan aktif sekarang
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Driver Aktif
                            </CardTitle>
                            <Users className="size-5 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-600">
                                {sopirAktif}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {(
                                    (sopirAktif / sopirData.length) *
                                    100
                                ).toFixed(0)}
                                % dari total
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-cyan-500 bg-gradient-to-br from-cyan-50 to-white">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Trip Bulan Ini
                            </CardTitle>
                            <Calendar className="size-5 text-cyan-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-cyan-600">
                                {tripBulanIni}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Perjalanan tercatat
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-rose-500 bg-gradient-to-br from-rose-50 to-white">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                Rata-rata Durasi
                            </CardTitle>
                            <Clock className="size-5 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-rose-600">
                                {rataRataDurasi}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Jam per perjalanan
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Status Kendaraan Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Komposisi Status Kendaraan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                className="h-[300px]"
                                config={{
                                    aktif: { label: 'Aktif', color: '#3b82f6' },
                                    service: {
                                        label: 'Service',
                                        color: '#f97316',
                                    },
                                    nonaktif: {
                                        label: 'Non Aktif',
                                        color: '#ef4444',
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
                                            data={statusKendaraanChart}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                        >
                                            {statusKendaraanChart.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Tren Perjalanan Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Tren Perjalanan (30 Hari Terakhir)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                className="h-[300px]"
                                config={{
                                    trips: {
                                        label: 'Perjalanan',
                                        color: '#06b6d4',
                                    },
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={trenPerjalananChart}
                                        margin={{
                                            left: 0,
                                            right: 0,
                                            top: 5,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#e2e8f0"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="trips"
                                            stroke="#06b6d4"
                                            strokeWidth={2}
                                            dot={false}
                                            name="Perjalanan"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Utilisasi Kendaraan Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Utilisasi Kendaraan (Total Jam)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                className="h-[300px]"
                                config={{
                                    jam: { label: 'Jam', color: '#8b5cf6' },
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={utilisasiKendaraanChart}
                                        margin={{
                                            left: 0,
                                            right: 0,
                                            top: 5,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#e2e8f0"
                                        />
                                        <XAxis
                                            dataKey="kendaraan"
                                            tick={{ fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            interval={0}
                                            height={60}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Legend
                                            verticalAlign="top"
                                            height={32}
                                        />
                                        <Bar
                                            dataKey="jam"
                                            fill="#8b5cf6"
                                            radius={[6, 6, 0, 0]}
                                            name="Jam Pemakaian"
                                            height={60}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Aktivitas Sopir Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Aktivitas Driver (Jumlah Trip)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                className="h-[320px]"
                                config={{
                                    trips: { label: 'Trip', color: '#ec4899' },
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={aktivitasSopirChart}
                                        margin={{
                                            left: 0,
                                            right: 0,
                                            top: 5,
                                            bottom: 55,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#e2e8f0"
                                        />
                                        <XAxis
                                            dataKey="sopir"
                                            tick={{ fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            interval={0}
                                            height={55}
                                        />

                                        <YAxis tick={{ fontSize: 12 }} />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Legend
                                            verticalAlign="top"
                                            height={32}
                                        />
                                        <Bar
                                            dataKey="trips"
                                            fill="#ec4899"
                                            radius={[6, 6, 0, 0]}
                                            name="Jumlah Trip"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

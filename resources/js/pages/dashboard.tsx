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
import { useMemo, useState } from 'react';
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

// Mock data from other pages
const kendaraanData = [
    { id_kendaraan: 'K-001', status: 'Aktif' },
    { id_kendaraan: 'K-002', status: 'Aktif' },
    { id_kendaraan: 'K-003', status: 'Service' },
    { id_kendaraan: 'K-004', status: 'Aktif' },
    { id_kendaraan: 'K-005', status: 'Non Aktif' },
    { id_kendaraan: 'K-006', status: 'Aktif' },
];

const sopirData = [
    { id_sopir: 'S-001', status: 'Aktif' },
    { id_sopir: 'S-002', status: 'Aktif' },
    { id_sopir: 'S-003', status: 'Aktif' },
    { id_sopir: 'S-004', status: 'Cuti' },
    { id_sopir: 'S-005', status: 'Aktif' },
    { id_sopir: 'S-006', status: 'Aktif' },
];

const penggunaanData = [
    {
        id_penggunaan: 'P-001',
        kendaraan_id: 'K-001',
        sopir_id: 'S-001',
        tanggal_mulai: '2025-10-12',
        waktu_mulai: '08:00',
        tanggal_selesai: '2025-10-12',
        waktu_selesai: '17:00',
        status: 'Selesai',
    },
    {
        id_penggunaan: 'P-002',
        kendaraan_id: 'K-002',
        sopir_id: 'S-002',
        tanggal_mulai: '2025-10-18',
        waktu_mulai: '09:30',
        tanggal_selesai: '',
        waktu_selesai: '',
        status: 'Dalam Perjalanan',
    },
    {
        id_penggunaan: 'P-003',
        kendaraan_id: 'K-003',
        sopir_id: 'S-003',
        tanggal_mulai: '2025-10-15',
        waktu_mulai: '10:00',
        tanggal_selesai: '2025-10-15',
        waktu_selesai: '15:30',
        status: 'Selesai',
    },
    {
        id_penggunaan: 'P-004',
        kendaraan_id: 'K-004',
        sopir_id: 'S-004',
        tanggal_mulai: '2025-10-16',
        waktu_mulai: '07:00',
        tanggal_selesai: '2025-10-16',
        waktu_selesai: '18:00',
        status: 'Selesai',
    },
    {
        id_penggunaan: 'P-005',
        kendaraan_id: 'K-005',
        sopir_id: 'S-005',
        tanggal_mulai: '2025-10-18',
        waktu_mulai: '11:00',
        tanggal_selesai: '',
        waktu_selesai: '',
        status: 'Dalam Perjalanan',
    },
    {
        id_penggunaan: 'P-006',
        kendaraan_id: 'K-001',
        sopir_id: 'S-006',
        tanggal_mulai: '2025-10-17',
        waktu_mulai: '13:00',
        tanggal_selesai: '2025-10-17',
        waktu_selesai: '16:45',
        status: 'Selesai',
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penggunaan',
        href: dashboard().url,
    },
];

export default function DashboardPage() {
    const [dateFrom, setDateFrom] = useState('2025-09-18');
    const [dateTo, setDateTo] = useState('2025-10-18');
    const [filterKendaraan, setFilterKendaraan] = useState('all');
    const [filterSopir, setFilterSopir] = useState('all');

    // Calculate KPI metrics
    const totalKendaraan = kendaraanData.length;
    const kendaraanAktif = kendaraanData.filter(
        (k) => k.status === 'Aktif',
    ).length;
    const kendaraanDalamPerjalanan = penggunaanData.filter(
        (p) => p.status === 'Dalam Perjalanan',
    ).length;
    const sopirAktif = sopirData.filter((s) => s.status === 'Aktif').length;

    // Trip bulan ini
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const tripBulanIni = penggunaanData.filter((p) => {
        const date = new Date(p.tanggal_mulai);
        return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
        );
    }).length;

    // Rata-rata durasi perjalanan
    const selesaiData = penggunaanData.filter(
        (p) => p.status === 'Selesai' && p.tanggal_selesai,
    );

    const rataRataDurasi =
        selesaiData.length > 0
            ? (
                  selesaiData.reduce((acc, p) => {
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
            name: 'Aktif',
            value: kendaraanData.filter((k) => k.status === 'Aktif').length,
        },
        {
            name: 'Service',
            value: kendaraanData.filter((k) => k.status === 'Service').length,
        },
        {
            name: 'Non Aktif',
            value: kendaraanData.filter((k) => k.status === 'Non Aktif').length,
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
                (p) => p.tanggal_mulai === dateStr,
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
        penggunaanData.forEach((p) => {
            if (!kendaraanMap[p.kendaraan_id]) kendaraanMap[p.kendaraan_id] = 0;
            if (p.tanggal_selesai && p.waktu_selesai) {
                const mulai = new Date(`${p.tanggal_mulai}T${p.waktu_mulai}`);
                const selesai = new Date(
                    `${p.tanggal_selesai}T${p.waktu_selesai}`,
                );
                const durasi =
                    (selesai.getTime() - mulai.getTime()) / (1000 * 60 * 60);
                kendaraanMap[p.kendaraan_id] += durasi;
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
        penggunaanData.forEach((p) => {
            if (!sopirMap[p.sopir_id]) sopirMap[p.sopir_id] = 0;
            sopirMap[p.sopir_id] += 1;
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
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="jam"
                                            fill="#8b5cf6"
                                            radius={[6, 6, 0, 0]}
                                            name="Jam Pemakaian"
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
                                className="h-[300px]"
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
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#e2e8f0"
                                        />
                                        <XAxis
                                            dataKey="sopir"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Legend />
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

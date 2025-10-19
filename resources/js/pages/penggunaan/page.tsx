'use client';
import { FormModal } from '@/components/kendaraan/form-modal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { destroy, index, status, store } from '@/routes/penggunaan';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

type Penggunaan = {
    kode_penggunaan: string;
    kendaraan_id: string;
    sopir_id: string;
    tanggal_mulai: string;
    waktu_mulai: string;
    tanggal_selesai: string;
    waktu_selesai: string;
    tujuan: string;
    catatan: string;
    status: string;
};

const ITEMS_PER_PAGE = 10;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Penggunaan',
        href: index().url,
    },
];

export default function PenggunaanPage({
    sopirList,
    kendaraanList,
    initialData,
}: any) {
    console.log(initialData);

    const [data, setData] = useState<Penggunaan[]>(initialData);
    const [open, setOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<Penggunaan | null>(
        null,
    );
    const [editing, setEditing] = useState<Penggunaan | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();

    const [form, setForm] = useState<Penggunaan>({
        kode_penggunaan: '',
        kendaraan_id: '',
        sopir_id: '',
        tanggal_mulai: '',
        waktu_mulai: '',
        tanggal_selesai: '',
        waktu_selesai: '',
        tujuan: '',
        catatan: '',
        status: 'Dalam Perjalanan',
    });

    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const penggunaanSelesaiHariIni = data.filter(
        (p) =>
            p.status === 'Selesai' &&
            p.tanggal_selesai === today.toISOString().split('T')[0],
    ).length;

    const penggunaanSelesaiMingguIni = data.filter((p) => {
        if (p.status !== 'Selesai' || !p.tanggal_selesai) return false;
        const date = new Date(p.tanggal_selesai);
        return date >= thisWeekStart && date <= today;
    }).length;

    const kendaraanDalamPerjalanan = data.filter(
        (p) => p.status === 'Dalam Perjalanan',
    ).length;

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = data.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const openAdd = () => {
        setEditing(null);
        setForm({
            kode_penggunaan: '',
            kendaraan_id: '',
            sopir_id: '',
            tanggal_mulai: '',
            waktu_mulai: '',
            tanggal_selesai: '',
            waktu_selesai: '',
            tujuan: '',
            catatan: '',
            status: 'Dalam Perjalanan',
        });
        setOpen(true);
    };

    const openEdit = (row: Penggunaan) => {
        setEditing(row);
        setForm(row);
        setOpen(true);
    };

    const openDetail = (row: Penggunaan) => {
        setSelectedDetail(row);
        setDetailOpen(true);
    };

    const onSubmit = () => {
        if (editing) {
            console.log('[UPDATE PENGGUNAAN]', form);
            setData((prev) =>
                prev.map((r) =>
                    r.kode_penggunaan === editing.kode_penggunaan ? form : r,
                ),
            );
            toast({
                title: 'Data berhasil disimpan',
                description: 'Perubahan penggunaan telah disimpan.',
            });
        } else {
            router.post(store().url, form, {
                forceFormData: true,
                onSuccess: () => {
                    toast({
                        title: 'Data berhasil disimpan',
                        description: 'Penggunaan baru telah ditambahkan.',
                    });
                },
                onError: (err) => {
                    console.log(err);

                    // toast({
                    //     title: 'Data gagal disimpan',
                    //     description: err,
                    // });
                },
            });
        }
        setOpen(false);
    };

    const onFinish = (kode: any) => {
        const now = new Date();
        const waktuSelesai = now.toTimeString().slice(0, 5);

        router.patch(
            status(kode).url,
            {},
            {
                onSuccess: () => {
                    toast({
                        title: 'Penggunaan selesai',
                        description: `Kendaraan telah kembali pada ${waktuSelesai}.`,
                    });
                    setDetailOpen(false);
                },
                onError: (err) => {
                    console.log(err);
                },
            },
        );
    };

    const onDelete = (kode_penggunaan: string) => {
        router.delete(destroy(kode_penggunaan).url, {
            onSuccess: () => {
                setData((prev) =>
                    prev.filter((r) => r.kode_penggunaan !== kode_penggunaan),
                );
                toast({
                    title: 'Data berhasil dihapus',
                    description: `Driver ${kode_penggunaan} dihapus.`,
                });
            },
        });
    };

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Manajemen Penggunaan Kendaraan
                    </h1>
                    <Button onClick={openAdd}>
                        <Plus className="mr-2 size-4" />
                        Tambah Penggunaan
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="border-2 border-blue-200 bg-blue-50">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Selesai Hari Ini
                            </CardTitle>
                            <div className="text-2xl text-blue-600">📅</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {penggunaanSelesaiHariIni}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-green-200 bg-green-50">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Selesai Minggu Ini
                            </CardTitle>
                            <div className="text-2xl text-green-600">📊</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">
                                {penggunaanSelesaiMingguIni}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-purple-200 bg-purple-50">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Dalam Perjalanan
                            </CardTitle>
                            <div className="text-2xl text-purple-600">🚗</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-600">
                                {kendaraanDalamPerjalanan}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Penggunaan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Kendaraan</TableHead>
                                        <TableHead>Driver</TableHead>
                                        <TableHead>Mulai</TableHead>
                                        <TableHead>Selesai</TableHead>
                                        <TableHead>Tujuan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.map((row) => (
                                        <TableRow key={row.kode_penggunaan}>
                                            <TableCell>
                                                {row.kode_penggunaan}
                                            </TableCell>
                                            <TableCell>
                                                {row.kendaraan?.nomor_polisi +
                                                    ' - ' +
                                                    row.kendaraan?.merk +
                                                    ' ' +
                                                    row.kendaraan?.tipe}
                                            </TableCell>
                                            <TableCell>
                                                {row.sopir?.nama}
                                            </TableCell>
                                            <TableCell>
                                                {row.tanggal_mulai}{' '}
                                                {row.waktu_mulai}
                                            </TableCell>
                                            <TableCell>
                                                {row.tanggal_selesai
                                                    ? `${row.tanggal_selesai} ${row.waktu_selesai}`
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>{row.tujuan}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        row.status === 'Selesai'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}
                                                >
                                                    {row.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() =>
                                                            openDetail(row)
                                                        }
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                    {/* <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() =>
                                                            openEdit(row)
                                                        }
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button> */}
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                            >
                                                                <Trash className="size-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Hapus
                                                                    Penggunaan?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Tindakan ini
                                                                    tidak dapat
                                                                    dibatalkan.
                                                                    Data
                                                                    penggunaan{' '}
                                                                    {
                                                                        row.kode_penggunaan
                                                                    }{' '}
                                                                    akan
                                                                    dihapus.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Batal
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        onDelete(
                                                                            row.kode_penggunaan,
                                                                        )
                                                                    }
                                                                >
                                                                    Hapus
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="text-center text-muted-foreground"
                                            >
                                                Belum ada data penggunaan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Halaman {currentPage} dari {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.max(1, p - 1),
                                            )
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="size-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(totalPages, p + 1),
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                Detail Penggunaan Kendaraan
                            </DialogTitle>
                            <DialogDescription>
                                Informasi lengkap penggunaan kendaraan
                            </DialogDescription>
                        </DialogHeader>
                        {selectedDetail && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            ID Penggunaan
                                        </Label>
                                        <p className="font-medium">
                                            {selectedDetail.kode_penggunaan}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Status
                                        </Label>
                                        <p className="font-medium">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                    selectedDetail.status ===
                                                    'Selesai'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}
                                            >
                                                {selectedDetail.status}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Kendaraan
                                        </Label>
                                        <p className="font-medium">
                                            {selectedDetail.kendaraan_id}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Driver
                                        </Label>
                                        <p className="font-medium">
                                            {selectedDetail.sopir_id}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Tujuan
                                        </Label>
                                        <p className="font-medium">
                                            {selectedDetail.tujuan}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Tanggal & Waktu Mulai
                                        </Label>
                                        <p className="font-medium">
                                            {selectedDetail.tanggal_mulai}{' '}
                                            {selectedDetail.waktu_mulai}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Tanggal & Waktu Selesai
                                        </Label>
                                        <p className="font-medium">
                                            {selectedDetail.tanggal_selesai
                                                ? `${selectedDetail.tanggal_selesai} ${selectedDetail.waktu_selesai}`
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        Catatan
                                    </Label>
                                    <p className="rounded-md bg-muted p-3 text-sm font-medium">
                                        {selectedDetail.catatan || '-'}
                                    </p>
                                </div>
                                {selectedDetail.status ===
                                    'Dalam Perjalanan' && (
                                    <Button
                                        onClick={() =>
                                            onFinish(
                                                selectedDetail.kode_penggunaan,
                                            )
                                        }
                                        className="mt-4 w-full"
                                    >
                                        Tandai Selesai
                                    </Button>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                <FormModal
                    title={
                        editing
                            ? `Ubah Penggunaan ${editing.kode_penggunaan}`
                            : 'Tambah Penggunaan'
                    }
                    open={open}
                    onOpenChange={setOpen}
                    onSubmit={onSubmit}
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="kendaraan_id">Kendaraan</Label>
                            <Select
                                value={form.kendaraan_id}
                                onValueChange={(value) =>
                                    setForm({ ...form, kendaraan_id: value })
                                }
                            >
                                <SelectTrigger id="kendaraan_id">
                                    <SelectValue placeholder="Pilih Kendaraan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kendaraanList.map((k: any) => (
                                        <SelectItem key={k.id} value={k.id}>
                                            {k.nomor_polisi +
                                                ' - ' +
                                                k.merk +
                                                ' ' +
                                                k.tipe}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sopir_id">Driver</Label>
                            <Select
                                value={form.sopir_id}
                                onValueChange={(value) =>
                                    setForm({ ...form, sopir_id: value })
                                }
                            >
                                <SelectTrigger id="sopir_id">
                                    <SelectValue placeholder="Pilih Driver" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sopirList.map((s: any) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                            <Input
                                id="tanggal_mulai"
                                type="date"
                                value={form.tanggal_mulai}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        tanggal_mulai: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="waktu_mulai">Waktu Mulai</Label>
                            <Input
                                id="waktu_mulai"
                                type="time"
                                value={form.waktu_mulai}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        waktu_mulai: e.target.value,
                                    })
                                }
                            />
                        </div>
                        {editing && (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="tanggal_selesai">
                                        Tanggal Selesai
                                    </Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="date"
                                        value={form.tanggal_selesai}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                tanggal_selesai: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="waktu_selesai">
                                        Waktu Selesai
                                    </Label>
                                    <Input
                                        id="waktu_selesai"
                                        type="time"
                                        value={form.waktu_selesai}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                waktu_selesai: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </>
                        )}
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="tujuan">Tujuan</Label>
                            <Input
                                id="tujuan"
                                value={form.tujuan}
                                onChange={(e) =>
                                    setForm({ ...form, tujuan: e.target.value })
                                }
                                placeholder="Tujuan perjalanan"
                            />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="catatan">
                                Catatan ({form.catatan.length}/250)
                            </Label>
                            <textarea
                                id="catatan"
                                value={form.catatan}
                                onChange={(e) => {
                                    if (e.target.value.length <= 250) {
                                        setForm({
                                            ...form,
                                            catatan: e.target.value,
                                        });
                                    }
                                }}
                                placeholder="Catatan penggunaan kendaraan (opsional)"
                                className="resize-none rounded-md border p-2 text-sm"
                                rows={3}
                            />
                        </div>
                    </div>
                </FormModal>
            </div>
        </AppLayout>
    );
}

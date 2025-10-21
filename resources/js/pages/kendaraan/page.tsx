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
import { destroy, index, store, update } from '@/routes/kendaraan';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ImageIcon,
    Pencil,
    Plus,
    Trash,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Kendaraan = {
    kode_kendaraan: string;
    nomor_polisi: string;
    merk: string;
    tipe: string;
    tahun_pembuatan: string;
    warna: string;
    nomor_rangka: string;
    nomor_mesin: string;
    status: string;
    foto_kendaraan?: string | File | null;
    fotoPreview?: string;
};

const ITEMS_PER_PAGE = 10;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kendaraan',
        href: index().url,
    },
];

export default function KendaraanPage({ initialData }: any) {
    const [data, setData] = useState<Kendaraan[]>(initialData);
    const [open, setOpen] = useState(false);
    const [photoOpen, setPhotoOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [editing, setEditing] = useState<Kendaraan | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();

    const [form, setForm] = useState<Kendaraan>({
        kode_kendaraan: '',
        nomor_polisi: '',
        merk: '',
        tipe: '',
        tahun_pembuatan: '',
        warna: '',
        nomor_rangka: '',
        nomor_mesin: '',
        status: '',
        foto_kendaraan: null as File | null, // file untuk dikirim ke BE
        fotoPreview: '' as string, // base64 untuk preview
    });

    const totalKendaraan = data.length;
    const kendaraanTersedia = data.filter((k) => k.status === 'Active').length;
    const kendaraanService = data.filter(
        (k) => k.status === 'Maintenance',
    ).length;
    const kendaraanInactive = data.filter(
        (k) => k.status === 'Inactive',
    ).length;

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = data.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const openAdd = () => {
        setEditing(null);
        setForm({
            kode_kendaraan: '',
            nomor_polisi: '',
            merk: '',
            tipe: '',
            tahun_pembuatan: '',
            warna: '',
            nomor_rangka: '',
            nomor_mesin: '',
            status: '',
            foto_kendaraan: null,
            fotoPreview: '',
        });
        setOpen(true);
    };

    const openEdit = (row: Kendaraan) => {
        setEditing(row);
        setForm({
            ...row,
            fotoPreview:
                typeof row.foto_kendaraan === 'string' && row.foto_kendaraan
                    ? row.foto_kendaraan
                    : '',
        });
        setOpen(true);
    };

    const openPhotoPreview = (foto: string | undefined) => {
        if (foto) {
            setSelectedPhoto(foto);
            setPhotoOpen(true);
        }
    };

    const onSubmit = () => {
        const { fotoPreview, ...payload } = form;

        if (editing) {
            router.post(
                update(payload.kode_kendaraan).url,
                {
                    ...payload,
                    _method: 'PUT',
                },
                {
                    forceFormData: true,

                    onSuccess: () => {
                        setData((prev) =>
                            prev.map((r) =>
                                r.kode_kendaraan === editing.kode_kendaraan
                                    ? form
                                    : r,
                            ),
                        );

                        toast({
                            title: 'Data berhasil disimpan',
                            description: 'Perubahan kendaraan telah disimpan.',
                        });
                    },
                    onError: (errors) => {
                        const firstError = Object.values(errors)[0];
                        const errorMessage = Array.isArray(firstError)
                            ? firstError[0]
                            : String(firstError ?? 'Terjadi kesalahan.');

                        toast({
                            title: 'Data gagal disimpan',
                            description: errorMessage,
                        });
                    },
                },
            );
        } else {
            router.post(store().url, payload, {
                forceFormData: true,
                onSuccess: () => {
                    toast({
                        title: 'Data berhasil disimpan',
                        description: 'Kendaraan baru telah ditambahkan.',
                    });
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0];
                    const errorMessage = Array.isArray(firstError)
                        ? firstError[0]
                        : String(firstError ?? 'Terjadi kesalahan.');

                    toast({
                        title: 'Data gagal disimpan',
                        description: errorMessage,
                    });
                },
            });
        }
        setOpen(false);
    };

    const onDelete = (kode_kendaraan: string) => {
        router.delete(destroy(kode_kendaraan).url, {
            onSuccess: () => {
                setData((prev) =>
                    prev.filter((r) => r.kode_kendaraan !== kode_kendaraan),
                );
                toast({
                    title: 'Data berhasil dihapus',
                    description: `Kendaraan ${kode_kendaraan} dihapus.`,
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
                    <h1 className="text-2xl font-bold">Manajemen Kendaraan</h1>
                    <Button onClick={openAdd}>
                        <Plus className="mr-2 size-4" />
                        Tambah Kendaraan
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-2 border-blue-200 bg-blue-50">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                Total Kendaraan
                            </CardTitle>
                            <div className="text-2xl text-blue-600">📊</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {totalKendaraan}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-green-200 bg-green-50">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                Kendaraan Tersedia
                            </CardTitle>
                            <div className="text-2xl text-green-600">✓</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">
                                {kendaraanTersedia}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-orange-200 bg-orange-50">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                Dalam Perawatan
                            </CardTitle>
                            <div className="text-2xl text-orange-600">🔧</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600">
                                {kendaraanService}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-red-200 bg-red-50">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                Tidak dapat digunakan
                            </CardTitle>
                            <div className="text-2xl text-red-600">⚠️</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">
                                {kendaraanInactive}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Kendaraan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Foto</TableHead>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Nomor Polisi</TableHead>
                                        <TableHead>Merk</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead>Tahun</TableHead>
                                        <TableHead>Warna</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.map((row) => (
                                        <TableRow key={row.kode_kendaraan}>
                                            <TableCell>
                                                <button
                                                    onClick={() =>
                                                        openPhotoPreview(
                                                            row.foto_kendaraan,
                                                        )
                                                    }
                                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-muted transition-colors hover:bg-muted/80"
                                                >
                                                    <ImageIcon className="size-5 text-muted-foreground" />
                                                </button>
                                            </TableCell>
                                            <TableCell>
                                                {row.kode_kendaraan}
                                            </TableCell>
                                            <TableCell>
                                                {row.nomor_polisi}
                                            </TableCell>
                                            <TableCell>{row.merk}</TableCell>
                                            <TableCell>{row.tipe}</TableCell>
                                            <TableCell>
                                                {row.tahun_pembuatan}
                                            </TableCell>
                                            <TableCell>{row.warna}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        row.status === 'Active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : row.status ===
                                                                'Maintenance'
                                                              ? 'bg-orange-100 text-orange-800'
                                                              : 'bg-red-100 text-red-800'
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
                                                            openEdit(row)
                                                        }
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
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
                                                                    Kendaraan?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Tindakan ini
                                                                    tidak dapat
                                                                    dibatalkan.
                                                                    Kendaraan{' '}
                                                                    {
                                                                        row.nomor_polisi
                                                                    }{' '}
                                                                    akan dihapus
                                                                    dari sistem.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Batal
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        onDelete(
                                                                            row.kode_kendaraan,
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
                                                colSpan={9}
                                                className="text-center text-muted-foreground"
                                            >
                                                Belum ada data kendaraan.
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

                <Dialog open={photoOpen} onOpenChange={setPhotoOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Preview Foto Kendaraan</DialogTitle>
                        </DialogHeader>
                        {selectedPhoto ? (
                            <div className="relative h-80 w-full overflow-hidden rounded-md bg-muted">
                                <img
                                    src={
                                        `/storage/${selectedPhoto}` ||
                                        '/placeholder.svg'
                                    }
                                    alt="Foto Kendaraan"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex h-80 w-full items-center justify-center rounded-md bg-muted">
                                <p className="text-muted-foreground">
                                    Tidak ada foto
                                </p>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                <FormModal
                    title={
                        editing
                            ? `Ubah Kendaraan ${editing.kode_kendaraan}`
                            : 'Tambah Kendaraan'
                    }
                    open={open}
                    onOpenChange={setOpen}
                    onSubmit={onSubmit}
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="nomor_polisi">Nomor Polisi</Label>
                            <Input
                                id="nomor_polisi"
                                value={form.nomor_polisi}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        nomor_polisi: e.target.value,
                                    })
                                }
                                placeholder="B 1234 SP"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="merk">Merk</Label>
                            <Input
                                id="merk"
                                value={form.merk}
                                onChange={(e) =>
                                    setForm({ ...form, merk: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tipe">Tipe</Label>
                            <Input
                                id="tipe"
                                value={form.tipe}
                                onChange={(e) =>
                                    setForm({ ...form, tipe: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tahun_pembuatan">
                                Tahun Pembuatan
                            </Label>
                            <Input
                                id="tahun_pembuatan"
                                value={form.tahun_pembuatan}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        tahun_pembuatan: e.target.value,
                                    })
                                }
                                placeholder="2020"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="warna">Warna</Label>
                            <Input
                                id="warna"
                                value={form.warna}
                                onChange={(e) =>
                                    setForm({ ...form, warna: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nomor_rangka">Nomor Rangka</Label>
                            <Input
                                id="nomor_rangka"
                                value={form.nomor_rangka}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        nomor_rangka: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nomor_mesin">Nomor Mesin</Label>
                            <Input
                                id="nomor_mesin"
                                value={form.nomor_mesin}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        nomor_mesin: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={form.status}
                                onValueChange={(value) =>
                                    setForm({ ...form, status: value })
                                }
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">
                                        Aktif
                                    </SelectItem>
                                    <SelectItem value="Maintenance">
                                        Maintenance
                                    </SelectItem>
                                    <SelectItem value="Inactive">
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="foto_kendaraan">
                                Upload Foto Kendaraan
                            </Label>
                            <Input
                                id="foto_kendaraan"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    // Simpan file asli untuk dikirim ke BE
                                    setForm((prev) => ({
                                        ...prev,
                                        foto_kendaraan: file,
                                    }));

                                    // Buat preview base64
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        setForm((prev) => ({
                                            ...prev,
                                            fotoPreview: event.target
                                                ?.result as string,
                                        }));
                                    };
                                    reader.readAsDataURL(file);
                                }}
                            />
                            {form.fotoPreview && (
                                <div className="relative h-40 w-full overflow-hidden rounded-md bg-muted">
                                    <img
                                        src={
                                            form.fotoPreview.startsWith(
                                                'data:image',
                                            )
                                                ? form.fotoPreview // kalau base64
                                                : `/storage/${form.fotoPreview}` // kalau path dari DB
                                        }
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </FormModal>
            </div>
        </AppLayout>
    );
}

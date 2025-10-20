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
import { index as indexDriver } from '@/routes/driver';
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

import { destroy, store, update } from '@/routes/driver';

type Sopir = {
    kode_sopir: string;
    nama: string;
    nip: string;
    no_hp: string;
    status: string;
    sim: string;
    masa_berlaku_sim: string;
    foto?: string | File | null;
    fotoPreview?: string;
};

const ITEMS_PER_PAGE = 10;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Driver',
        href: indexDriver().url,
    },
];

export default function SopirPage({ initialData }: any) {
    const [data, setData] = useState<Sopir[]>(initialData);
    const [open, setOpen] = useState(false);
    const [photoOpen, setPhotoOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [editing, setEditing] = useState<Sopir | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();

    const [form, setForm] = useState<Sopir>({
        kode_sopir: '',
        nama: '',
        nip: '',
        no_hp: '',
        status: '',
        sim: '',
        masa_berlaku_sim: '',
        foto: null as File | null, // file untuk dikirim ke BE
        fotoPreview: '' as string, // base64 untuk preview
    });

    const totalDriver = data.length;
    const driverAktif = data.filter((s) => s.status === 'Active').length;
    const driverOff = data.filter((s) => s.status === 'Off').length;
    const driverNonAktif = data.filter((s) => s.status === 'Inactive').length;

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = data.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const openAdd = () => {
        setEditing(null);
        setForm({
            kode_sopir: '',
            nama: '',
            nip: '',
            no_hp: '',
            status: '',
            sim: '',
            masa_berlaku_sim: '',
            foto: null,
            fotoPreview: '',
        });
        setOpen(true);
    };

    const openEdit = (row: Sopir) => {
        setEditing(row);
        setForm({
            ...row,
            fotoPreview:
                typeof row.foto === 'string' && row.foto ? row.foto : '',
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
                update(payload.kode_sopir).url,
                {
                    ...payload,
                    _method: 'PUT',
                },
                {
                    forceFormData: true,

                    onSuccess: () => {
                        setData((prev) =>
                            prev.map((r) =>
                                r.kode_sopir === editing.kode_sopir ? form : r,
                            ),
                        );

                        toast({
                            title: 'Data berhasil disimpan',
                            description: 'Perubahan driver telah disimpan.',
                        });
                    },
                    onError: (err) => {
                        console.log(err);

                        // toast({
                        //     title: 'Data gagal disimpan',
                        //     description: err,
                        // });
                    },
                },
            );
        } else {
            router.post(store().url, payload, {
                forceFormData: true,
                onSuccess: () => {
                    toast({
                        title: 'Data berhasil disimpan',
                        description: 'Driver baru telah ditambahkan.',
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

    const onDelete = (kode_sopir: string) => {
        router.delete(destroy(kode_sopir).url, {
            onSuccess: () => {
                setData((prev) =>
                    prev.filter((r) => r.kode_sopir !== kode_sopir),
                );
                toast({
                    title: 'Data berhasil dihapus',
                    description: `Driver ${kode_sopir} dihapus.`,
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
                    <h1 className="text-2xl font-bold">Manajemen Driver</h1>
                    <Button onClick={openAdd}>
                        <Plus className="mr-2 size-4" />
                        Tambah Driver
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-2 border-blue-200 bg-blue-50">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                Total Driver
                            </CardTitle>
                            <div className="text-2xl text-blue-600">👥</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {totalDriver}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-green-200 bg-green-50">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                Driver Aktif
                            </CardTitle>
                            <div className="text-2xl text-green-600">✓</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">
                                {driverAktif}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-yellow-200 bg-yellow-50">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                Driver Off
                            </CardTitle>
                            <div className="text-2xl text-yellow-600">🚗</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-yellow-600">
                                {driverOff}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-purple-200 bg-purple-50">
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium text-muted-foreground">
                                Driver Non Aktif
                            </CardTitle>
                            <div className="text-2xl text-purple-600">⚠️</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-600">
                                {driverNonAktif}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Driver</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Foto</TableHead>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>NIP</TableHead>
                                        <TableHead>No HP</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>SIM</TableHead>
                                        <TableHead>Berlaku SIM</TableHead>
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.map((row) => (
                                        <TableRow key={row.kode_sopir}>
                                            <TableCell>
                                                <button
                                                    onClick={() =>
                                                        openPhotoPreview(
                                                            row.foto,
                                                        )
                                                    }
                                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-muted transition-colors hover:bg-muted/80"
                                                >
                                                    <ImageIcon className="size-5 text-muted-foreground" />
                                                </button>
                                            </TableCell>
                                            <TableCell>
                                                {row.kode_sopir}
                                            </TableCell>
                                            <TableCell>{row.nama}</TableCell>
                                            <TableCell>{row.nip}</TableCell>
                                            <TableCell>{row.no_hp}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        row.status === 'Active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : row.status ===
                                                                'Off'
                                                              ? 'bg-yellow-100 text-yellow-800'
                                                              : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {row.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>{row.sim}</TableCell>
                                            <TableCell>
                                                {row.masa_berlaku_sim}
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
                                                                    Driver?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Tindakan ini
                                                                    tidak dapat
                                                                    dibatalkan.
                                                                    Driver{' '}
                                                                    {row.nama}{' '}
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
                                                                            row.kode_sopir,
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
                                                Belum ada data driver.
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
                            <DialogTitle>Preview Foto Driver</DialogTitle>
                        </DialogHeader>
                        {selectedPhoto ? (
                            <div className="relative h-80 w-full overflow-hidden rounded-md bg-muted">
                                <img
                                    src={selectedPhoto || '/placeholder.svg'}
                                    alt="Foto Driver"
                                    className="object-cover"
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
                            ? `Ubah Driver ${editing.kode_sopir}`
                            : 'Tambah Driver'
                    }
                    open={open}
                    onOpenChange={setOpen}
                    onSubmit={onSubmit}
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="nama">Nama</Label>
                            <Input
                                id="nama"
                                value={form.nama}
                                onChange={(e) =>
                                    setForm({ ...form, nama: e.target.value })
                                }
                                placeholder="Nama Driver"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nip">NIP</Label>
                            <Input
                                id="nip"
                                value={form.nip}
                                onChange={(e) =>
                                    setForm({ ...form, nip: e.target.value })
                                }
                                placeholder="19780101 200501 1 001"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="no_hp">No HP</Label>
                            <Input
                                id="no_hp"
                                value={form.no_hp}
                                onChange={(e) =>
                                    setForm({ ...form, no_hp: e.target.value })
                                }
                                placeholder="081234567890"
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
                                        Active
                                    </SelectItem>
                                    <SelectItem value="Off">Off</SelectItem>
                                    <SelectItem value="ee">ee</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sim">SIM</Label>
                            <Select
                                value={form.sim}
                                onValueChange={(value) =>
                                    setForm({ ...form, sim: value })
                                }
                            >
                                <SelectTrigger id="sim">
                                    <SelectValue placeholder="Pilih Jenis SIM" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">A</SelectItem>
                                    <SelectItem value="B">B</SelectItem>
                                    <SelectItem value="C">C</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="masa_berlaku_sim">
                                Masa Berlaku SIM
                            </Label>
                            <Input
                                id="masa_berlaku_sim"
                                type="date"
                                value={form.masa_berlaku_sim}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        masa_berlaku_sim: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="foto">Upload Foto Driver</Label>
                            <Input
                                id="foto"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    // Simpan file asli untuk dikirim ke BE
                                    setForm((prev) => ({
                                        ...prev,
                                        foto: file,
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

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
('use client');

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

type Penggunaan = {
    id_penggunaan: string;
    kendaraan_id: string;
    sopir_id: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    tujuan: string;
    catatan: string;
    dibuat_oleh: string;
};

const initialData: Penggunaan[] = [
    {
        id_penggunaan: 'P-001',
        kendaraan_id: 'K-001',
        sopir_id: 'S-001',
        tanggal_mulai: '2025-10-12',
        tanggal_selesai: '2025-10-12',
        tujuan: 'Rapat Koordinasi',
        catatan: 'Siapkan BBM',
        dibuat_oleh: 'admin',
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function PenggunaanPage() {
    const [data, setData] = useState<Penggunaan[]>(initialData);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Penggunaan | null>(null);
    const { toast } = useToast();

    const [form, setForm] = useState<Penggunaan>({
        id_penggunaan: '',
        kendaraan_id: '',
        sopir_id: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        tujuan: '',
        catatan: '',
        dibuat_oleh: '',
    });

    const openAdd = () => {
        setEditing(null);
        setForm({
            id_penggunaan: '',
            kendaraan_id: '',
            sopir_id: '',
            tanggal_mulai: '',
            tanggal_selesai: '',
            tujuan: '',
            catatan: '',
            dibuat_oleh: '',
        });
        setOpen(true);
    };
    const openEdit = (row: Penggunaan) => {
        setEditing(row);
        setForm(row);
        setOpen(true);
    };

    const onSubmit = () => {
        if (editing) {
            console.log('[UPDATE PENGGUNAAN]', form);
            setData((prev) =>
                prev.map((r) =>
                    r.id_penggunaan === editing.id_penggunaan ? form : r,
                ),
            );
            toast({
                title: 'Data berhasil disimpan',
                description: 'Perubahan penggunaan telah disimpan.',
            });
        } else {
            console.log('[CREATE PENGGUNAAN]', form);
            setData((prev) => [
                {
                    ...form,
                    id_penggunaan:
                        form.id_penggunaan ||
                        `P-${String(prev.length + 1).padStart(3, '0')}`,
                },
                ...prev,
            ]);
            toast({
                title: 'Data berhasil disimpan',
                description: 'Penggunaan baru telah ditambahkan.',
            });
        }
        setOpen(false);
    };

    const onDelete = (row: Penggunaan) => {
        console.log('[DELETE PENGGUNAAN]', row);
        setData((prev) =>
            prev.filter((r) => r.id_penggunaan !== row.id_penggunaan),
        );
        toast({
            title: 'Data berhasil dihapus',
            description: `Penggunaan ${row.id_penggunaan} dihapus.`,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Data Penggunaan</h1>
                    <Button onClick={openAdd}>
                        <Plus className="mr-2 size-4" />
                        Tambah Penggunaan
                    </Button>
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
                                        <TableHead>Sopir</TableHead>
                                        <TableHead>Mulai</TableHead>
                                        <TableHead>Selesai</TableHead>
                                        <TableHead>Tujuan</TableHead>
                                        <TableHead>Dibuat Oleh</TableHead>
                                        <TableHead className="text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((row) => (
                                        <TableRow key={row.id_penggunaan}>
                                            <TableCell>
                                                {row.id_penggunaan}
                                            </TableCell>
                                            <TableCell>
                                                {row.kendaraan_id}
                                            </TableCell>
                                            <TableCell>
                                                {row.sopir_id}
                                            </TableCell>
                                            <TableCell>
                                                {row.tanggal_mulai}
                                            </TableCell>
                                            <TableCell>
                                                {row.tanggal_selesai}
                                            </TableCell>
                                            <TableCell>{row.tujuan}</TableCell>
                                            <TableCell>
                                                {row.dibuat_oleh}
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
                                                                    Hapus data?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Tindakan ini
                                                                    tidak dapat
                                                                    dibatalkan.
                                                                    Penggunaan{' '}
                                                                    {
                                                                        row.id_penggunaan
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
                                                                            row,
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
                                                Belum ada data.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <FormModal
                    title={
                        editing
                            ? `Ubah Penggunaan ${editing.id_penggunaan}`
                            : 'Tambah Penggunaan'
                    }
                    open={open}
                    onOpenChange={setOpen}
                    onSubmit={onSubmit}
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="id_penggunaan">ID Penggunaan</Label>
                            <Input
                                id="id_penggunaan"
                                value={form.id_penggunaan}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        id_penggunaan: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="kendaraan_id">Kendaraan ID</Label>
                            <Input
                                id="kendaraan_id"
                                value={form.kendaraan_id}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        kendaraan_id: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sopir_id">Sopir ID</Label>
                            <Input
                                id="sopir_id"
                                value={form.sopir_id}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        sopir_id: e.target.value,
                                    })
                                }
                            />
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
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="tujuan">Tujuan</Label>
                            <Input
                                id="tujuan"
                                value={form.tujuan}
                                onChange={(e) =>
                                    setForm({ ...form, tujuan: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="catatan">Catatan</Label>
                            <Textarea
                                id="catatan"
                                value={form.catatan}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        catatan: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="dibuat_oleh">Dibuat Oleh</Label>
                            <Input
                                id="dibuat_oleh"
                                value={form.dibuat_oleh}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        dibuat_oleh: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </FormModal>
            </div>
        </AppLayout>
    );
}

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
import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
('use client');
('use client');

import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';

type Kendaraan = {
    id_kendaraan: string;
    nomor_polisi: string;
    merk: string;
    tipe: string;
    tahun_pembuatan: string;
    warna: string;
    nomor_rangka: string;
    nomor_mesin: string;
    status: string;
    foto_kendaraan?: string;
};

const initialData: Kendaraan[] = [
    {
        id_kendaraan: 'K-001',
        nomor_polisi: 'B 1234 SP',
        merk: 'Toyota',
        tipe: 'Innova',
        tahun_pembuatan: '2019',
        warna: 'Hitam',
        nomor_rangka: 'NRK-001',
        nomor_mesin: 'NMS-001',
        status: 'Aktif',
        foto_kendaraan: '',
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function KendaraanPage() {
    const [data, setData] = useState<Kendaraan[]>(initialData);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Kendaraan | null>(null);
    const { toast } = useToast();

    const [form, setForm] = useState<Kendaraan>({
        id_kendaraan: '',
        nomor_polisi: '',
        merk: '',
        tipe: '',
        tahun_pembuatan: '',
        warna: '',
        nomor_rangka: '',
        nomor_mesin: '',
        status: '',
        foto_kendaraan: '',
    });

    const openAdd = () => {
        setEditing(null);
        setForm({
            id_kendaraan: '',
            nomor_polisi: '',
            merk: '',
            tipe: '',
            tahun_pembuatan: '',
            warna: '',
            nomor_rangka: '',
            nomor_mesin: '',
            status: '',
            foto_kendaraan: '',
        });
        setOpen(true);
    };

    const openEdit = (row: Kendaraan) => {
        setEditing(row);
        setForm(row);
        setOpen(true);
    };

    const onSubmit = () => {
        if (editing) {
            console.log('[UPDATE KENDARAAN]', form);
            setData((prev) =>
                prev.map((r) =>
                    r.id_kendaraan === editing.id_kendaraan ? form : r,
                ),
            );
            toast({
                title: 'Data berhasil disimpan',
                description: 'Perubahan kendaraan telah disimpan.',
            });
        } else {
            console.log('[CREATE KENDARAAN]', form);
            setData((prev) => [
                {
                    ...form,
                    id_kendaraan:
                        form.id_kendaraan ||
                        `K-${String(prev.length + 1).padStart(3, '0')}`,
                },
                ...prev,
            ]);
            toast({
                title: 'Data berhasil disimpan',
                description: 'Kendaraan baru telah ditambahkan.',
            });
        }
        setOpen(false);
    };

    const onDelete = (row: Kendaraan) => {
        console.log('[DELETE KENDARAAN]', row);
        setData((prev) =>
            prev.filter((r) => r.id_kendaraan !== row.id_kendaraan),
        );
        toast({
            title: 'Data berhasil dihapus',
            description: `Kendaraan ${row.id_kendaraan} dihapus.`,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Data Kendaraan</h1>
                    <Button onClick={openAdd}>
                        <Plus className="mr-2 size-4" />
                        Tambah Kendaraan
                    </Button>
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
                                    {data.map((row) => (
                                        <TableRow key={row.id_kendaraan}>
                                            <TableCell>
                                                <div className="relative h-10 w-16 overflow-hidden rounded-md bg-muted">
                                                    <img
                                                        src={
                                                            row.foto_kendaraan ||
                                                            `/placeholder.svg?height=40&width=64&query=foto%20kendaraan`
                                                        }
                                                        alt={`Foto ${row.nomor_polisi}`}
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {row.id_kendaraan}
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
                                            <TableCell>{row.status}</TableCell>
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
                                                                    Kendaraan{' '}
                                                                    {
                                                                        row.id_kendaraan
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
                                                colSpan={9}
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
                            ? `Ubah Kendaraan ${editing.id_kendaraan}`
                            : 'Tambah Kendaraan'
                    }
                    open={open}
                    onOpenChange={setOpen}
                    onSubmit={onSubmit}
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="id_kendaraan">ID Kendaraan</Label>
                            <Input
                                id="id_kendaraan"
                                value={form.id_kendaraan}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        id_kendaraan: e.target.value,
                                    })
                                }
                                placeholder="mis. K-002"
                            />
                        </div>
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
                            <Input
                                id="status"
                                value={form.status}
                                onChange={(e) =>
                                    setForm({ ...form, status: e.target.value })
                                }
                                placeholder="Aktif/Tidak Aktif"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="foto_kendaraan">URL Foto</Label>
                            <Input
                                id="foto_kendaraan"
                                value={form.foto_kendaraan}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        foto_kendaraan: e.target.value,
                                    })
                                }
                                placeholder="/images/k-001.jpg"
                            />
                        </div>
                    </div>
                </FormModal>
            </div>
        </AppLayout>
    );
}

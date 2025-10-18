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
} from '@/components/ui/alert-dialog'; // Import AlertDialog for delete confirm
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast'; // Added import for useToast
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

type Sopir = {
    id_sopir: string;
    nama: string;
    nip: string;
    no_hp: string;
    status: string;
    sim: string;
    masa_berlaku_sim: string;
    foto?: string;
};

const initialData: Sopir[] = [
    {
        id_sopir: 'S-001',
        nama: 'Budi Santoso',
        nip: '19780101 200501 1 001',
        no_hp: '081234567890',
        status: 'Aktif',
        sim: 'A',
        masa_berlaku_sim: '2027-12-31',
        foto: '',
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function SopirPage() {
    const [data, setData] = useState<Sopir[]>(initialData);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Sopir | null>(null);
    const { toast } = useToast(); // useToast is now properly imported

    const [form, setForm] = useState<Sopir>({
        id_sopir: '',
        nama: '',
        nip: '',
        no_hp: '',
        status: '',
        sim: '',
        masa_berlaku_sim: '',
        foto: '',
    });

    const openAdd = () => {
        setEditing(null);
        setForm({
            id_sopir: '',
            nama: '',
            nip: '',
            no_hp: '',
            status: '',
            sim: '',
            masa_berlaku_sim: '',
            foto: '',
        });
        setOpen(true);
    };
    const openEdit = (row: Sopir) => {
        setEditing(row);
        setForm(row);
        setOpen(true);
    };

    const onSubmit = () => {
        if (editing) {
            console.log('[UPDATE SOPIR]', form);
            setData((prev) =>
                prev.map((r) => (r.id_sopir === editing.id_sopir ? form : r)),
            );
            toast({
                title: 'Data berhasil disimpan',
                description: 'Perubahan sopir telah disimpan.',
            });
        } else {
            console.log('[CREATE SOPIR]', form);
            setData((prev) => [
                {
                    ...form,
                    id_sopir:
                        form.id_sopir ||
                        `S-${String(prev.length + 1).padStart(3, '0')}`,
                },
                ...prev,
            ]);
            toast({
                title: 'Data berhasil disimpan',
                description: 'Sopir baru telah ditambahkan.',
            });
        }
        setOpen(false);
    };

    const onDelete = (row: Sopir) => {
        console.log('[DELETE SOPIR]', row);
        setData((prev) => prev.filter((r) => r.id_sopir !== row.id_sopir));
        toast({
            title: 'Data berhasil dihapus',
            description: `Sopir ${row.id_sopir} dihapus.`,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Data Sopir</h1>
                    <Button onClick={openAdd}>
                        <Plus className="mr-2 size-4" />
                        Tambah Sopir
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Sopir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
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
                                    {data.map((row) => (
                                        <TableRow key={row.id_sopir}>
                                            <TableCell>
                                                {row.id_sopir}
                                            </TableCell>
                                            <TableCell>{row.nama}</TableCell>
                                            <TableCell>{row.nip}</TableCell>
                                            <TableCell>{row.no_hp}</TableCell>
                                            <TableCell>{row.status}</TableCell>
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
                                                    {/* Confirm before delete */}
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
                                                                    Sopir{' '}
                                                                    {
                                                                        row.id_sopir
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
                            ? `Ubah Sopir ${editing.id_sopir}`
                            : 'Tambah Sopir'
                    }
                    open={open}
                    onOpenChange={setOpen}
                    onSubmit={onSubmit}
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            {/* Placeholder for Label and Input components */}
                        </div>
                        {/* Additional form fields here */}
                    </div>
                </FormModal>
            </div>
        </AppLayout>
    );
}

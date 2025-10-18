#!/bin/bash
# =========================================
# 🧹 Laravel Cache & Sampah Cleaner
# =========================================
# Bersihkan semua cache, view, config, route, dll.
# Tested on Laravel 10–12
# =========================================

echo "🔄 Membersihkan cache Laravel..."

# 1. Bersihkan semua cache
php artisan optimize:clear

# 2. Bersihkan cache konfigurasi
php artisan config:clear

# 3. Bersihkan cache route
php artisan route:clear

# 4. Bersihkan cache view
php artisan view:clear

# 5. Bersihkan cache event
php artisan event:clear

# 6. Bersihkan cache aplikasi
php artisan cache:clear

# 7. Bersihkan file hasil compile
php artisan clear-compiled

# 8. Regenerasi autoload Composer
composer dump-autoload

# 9. Hapus file sampah manual di storage/framework
echo "🗑️ Menghapus file di storage/framework..."
rm -rf bootstrap/cache/*.php
rm -rf storage/framework/cache/*
rm -rf storage/framework/views/*
rm -rf storage/framework/sessions/*

echo "✅ Semua cache & file sampah Laravel sudah dibersihkan!"

# Cara pakai:
# Simpan file di root proyek Laravel (sejajar dengan artisan).
# Jadikan file bisa dieksekusi:
# chmod +x clean.sh
# Jalankan:
# ./clean.sh atau bash clean.sh


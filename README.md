# ProcureFlow

ProcureFlow adalah aplikasi frontend untuk alur pengadaan barang yang dibuat sebagai bagian dari technical test frontend.

Aplikasi ini mensimulasikan alur utama pengadaan:

**Purchase Request → Approval → Purchase Order → Goods Receipt → Inventory Update**

Fokus utama project ini adalah alur pengguna yang jelas, pembagian aksi berdasarkan role, pengelolaan server state, validasi form, tampilan responsif, mock API, serta automated testing.

---

## Fitur Utama

### Purchase Request

Fitur yang tersedia:

- melihat daftar Purchase Request;
- melakukan pencarian dan filter;
- melihat detail Purchase Request;
- membuat Purchase Request baru;
- mengedit Purchase Request yang masih berstatus `DRAFT`;
- melakukan submit Purchase Request;
- melakukan approve pada Purchase Request berstatus `SUBMITTED`;
- melakukan reject pada Purchase Request berstatus `SUBMITTED`;
- menyimpan alasan penolakan atau rejection reason.

Status Purchase Request:

- `DRAFT`
- `SUBMITTED`
- `APPROVED`
- `REJECTED`

---

### Purchase Order

Fitur yang tersedia:

- melihat daftar Purchase Order;
- melakukan pencarian dan filter;
- melihat detail Purchase Order;
- mencatat Goods Receipt;
- menerima barang secara sebagian atau partial receipt;
- memperbarui status Purchase Order sesuai jumlah barang yang diterima.

Status Purchase Order:

- `DRAFT`
- `ORDERED`
- `PARTIALLY_RECEIVED`
- `RECEIVED`
- `CANCELLED`

---

### Inventory

Fitur yang tersedia:

- melihat stok inventory saat ini;
- melakukan pencarian berdasarkan nama produk atau SKU;
- melakukan filter berdasarkan warehouse;
- memperbarui stok secara otomatis setelah Goods Receipt berhasil dilakukan.

---

## Role Pengguna

Aplikasi memiliki dua role yang disimulasikan di frontend.

### USER

USER dapat:

- membuat Purchase Request;
- mengedit Purchase Request berstatus `DRAFT`;
- melakukan submit Purchase Request;
- melihat Purchase Order;
- mencatat Goods Receipt;
- melihat Inventory.

### APPROVER

APPROVER dapat:

- melihat daftar dan detail Purchase Request;
- melakukan approve pada Purchase Request berstatus `SUBMITTED`;
- melakukan reject pada Purchase Request berstatus `SUBMITTED`;
- memberikan rejection reason saat melakukan reject.

Authentication tidak menjadi bagian dari scope technical test ini, sehingga role disimulasikan menggunakan role switcher di frontend dan disimpan melalui browser storage.

---

## Tech Stack

Project ini menggunakan:

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- MSW (Mock Service Worker)
- Vitest
- React Testing Library

---

## Struktur Project

```text
src/
├── api/
│   └── fungsi untuk berkomunikasi dengan API
│
├── components/
│   ├── common/
│   ├── layout/
│   └── ui/
│
├── features/
│   ├── purchase-requests/
│   ├── purchase-orders/
│   └── inventory/
│
├── mocks/
│   ├── data/
│   └── handlers/
│
├── routes/
│
├── test/
│
└── types/
```

Struktur ini memisahkan tampilan, feature logic, API access, mock API, dan type agar project lebih mudah dibaca dan dikembangkan.

---

## Instalasi

### Kebutuhan

Pastikan sudah tersedia:

- Node.js
- npm

### Install Dependency

```bash
npm install
```

### Menjalankan Development Server

```bash
npm run dev
```

Buka URL lokal yang diberikan oleh Vite di terminal.

Project ini tidak membutuhkan environment variable khusus karena API yang digunakan masih berupa mock API dengan MSW.

---

## Build Production

Untuk membuat production build:

```bash
npm run build
```

Build harus berhasil tanpa TypeScript error sebelum project dianggap siap untuk dikirim.

---

## Lint

Untuk menjalankan ESLint:

```bash
npm run lint
```

---

## Testing

Untuk menjalankan automated test:

```bash
npm run test
```

Project menggunakan **Vitest** untuk menjalankan test.

Test yang tersedia mencakup behavior penting seperti:

- validasi form Purchase Request;
- approval flow Purchase Request;
- rejection flow Purchase Request;
- validasi rejection reason;
- integrasi Goods Receipt dengan perubahan stok Inventory;
- perubahan received quantity pada Purchase Order setelah Goods Receipt.

Test dibuat untuk memeriksa business behavior yang penting, bukan hanya mengecek apakah component berhasil dirender.

---

## Strategi Mock API

Aplikasi menggunakan **MSW (Mock Service Worker)** sebagai mock API layer.

Frontend tidak mengambil data mock langsung dari file data. Component tetap berkomunikasi melalui API abstraction yang berada di:

```text
src/api
```

Contoh request yang digunakan aplikasi:

```text
GET  /api/purchase-requests
POST /api/purchase-requests/:id/submit
POST /api/purchase-requests/:id/approve
POST /api/purchase-requests/:id/reject
GET  /api/purchase-orders
POST /api/purchase-orders/:id/receipt
GET  /api/inventory
```

MSW menangkap request tersebut dan menjalankan handler yang berada di:

```text
src/mocks/handlers
```

Sedangkan data awal mock disimpan di:

```text
src/mocks/data
```

Pendekatan ini membuat frontend tetap menggunakan pola request HTTP seperti saat menggunakan backend sungguhan.

Mock data disimpan di memory selama aplikasi berjalan. Karena itu, perubahan data akan tetap terlihat selama session berjalan, tetapi akan kembali ke seeded data saat browser direfresh.

---

## Server State dengan TanStack Query

TanStack Query digunakan untuk mengelola server state.

Secara sederhana:

```text
useQuery
= membaca data

queryKey
= identitas data di cache

queryFn
= fungsi yang mengambil data

useMutation
= mengubah data

queryClient
= pengelola cache TanStack Query

invalidateQueries
= menandai cache sebagai stale agar data dapat diambil ulang
```

Contoh pada Inventory:

```ts
useQuery({
  queryKey: ['inventory'],
  queryFn: getInventories,
});
```

Artinya:

- `queryKey` memberi nama data cache yaitu `inventory`;
- `queryFn` menentukan fungsi yang digunakan untuk mengambil data inventory.

Setelah mutation mengubah data, cache yang terkait dapat di-invalidate.

Contoh setelah Goods Receipt:

```text
Goods Receipt berhasil
        ↓
Purchase Order berubah
        ↓
Inventory berubah
        ↓
invalidate Purchase Order query
invalidate Inventory query
        ↓
UI mendapatkan data terbaru
```

---

## Alur Purchase Request

Alur normal:

```text
DRAFT
  ↓
SUBMITTED
  ↓
APPROVED
```

Atau jika ditolak:

```text
DRAFT
  ↓
SUBMITTED
  ↓
REJECTED
```

Purchase Request hanya dapat diedit ketika masih berstatus `DRAFT`.

Approval dan rejection hanya dapat dilakukan pada Purchase Request berstatus `SUBMITTED`.

---

## Alur Goods Receipt

Goods Receipt dapat dilakukan oleh USER ketika Purchase Order memiliki status:

```text
ORDERED
```

atau:

```text
PARTIALLY_RECEIVED
```

Validasi Receive Quantity:

```text
Receive Qty > 0
```

dan:

```text
Receive Qty <= Remaining Qty
```

Setelah Goods Receipt berhasil:

```text
ORDERED
   ↓
PARTIALLY_RECEIVED
   ↓
RECEIVED
```

Jika seluruh ordered quantity sudah diterima, status Purchase Order menjadi `RECEIVED`.

Inventory pada warehouse yang sesuai juga akan bertambah berdasarkan quantity yang diterima.

---

## Technical Decisions

### TanStack Query untuk Server State

TanStack Query digunakan karena aplikasi memiliki beberapa resource API yang saling berhubungan seperti Purchase Request, Purchase Order, dan Inventory.

TanStack Query membantu menangani:

- loading state;
- error state;
- mutation;
- cache;
- invalidasi cache;
- refetch data setelah terjadi perubahan.

---

### API Abstraction

Request HTTP dipisahkan dari React component dan ditempatkan di `src/api`.

Tujuannya agar component fokus pada UI dan interaksi pengguna, sedangkan komunikasi dengan API ditangani oleh layer tersendiri.

Jika nanti mock API diganti dengan backend sungguhan, perubahan utama dapat dilakukan pada API layer tanpa harus mengubah banyak component.

---

### MSW sebagai Mock API

MSW digunakan agar aplikasi tetap berkomunikasi melalui request HTTP normal.

Mock data tidak di-import langsung ke dalam component.

Pendekatan ini lebih mendekati pola aplikasi production yang menggunakan REST API.

---

### React Hook Form dan Zod

React Hook Form digunakan untuk mengelola form state.

Zod digunakan untuk schema validation.

Kombinasi ini membuat validation rule lebih terpusat, mudah dibaca, dan dapat digunakan kembali pada testing.

---

### Simulasi Role

Authentication tidak termasuk dalam requirement technical test.

Karena itu, USER dan APPROVER disimulasikan di frontend tanpa login system.

---

## Asumsi Implementasi

### Purchase Order Tidak Dibuat Otomatis Setelah Approval

Purchase Order menggunakan seeded mock data.

Approved Purchase Request tidak otomatis membuat Purchase Order baru.

Alasannya, pembentukan Purchase Order secara lengkap biasanya membutuhkan informasi tambahan seperti supplier atau vendor, sementara data tersebut tidak tersedia pada flow Purchase Request yang diberikan dalam technical test.

Karena itu, automatic Purchase Order generation dianggap di luar minimum scope.

---

### Inventory Bersifat Warehouse-Specific

Inventory dicocokkan berdasarkan:

- `productId`;
- `warehouseId`.

Saat Goods Receipt dilakukan, stock hanya bertambah pada product dan warehouse yang sesuai dengan Purchase Order.

---

### Mock Data Tidak Persisten

Mock data hanya disimpan di memory.

Jika browser direfresh, data akan kembali ke seeded data awal.

Hal ini sesuai dengan kebutuhan mock API untuk technical test dan bukan pengganti database sebenarnya.

---

### Validasi Goods Receipt

Receive quantity harus:

- lebih besar dari `0`;
- tidak lebih besar dari remaining quantity.

Validasi dilakukan sebelum data Purchase Order dan Inventory diubah.

---

## UI State

Aplikasi menangani state penting pada proses asynchronous:

- Loading
- Empty
- Error
- Submitting
- Success

Aksi juga ditampilkan berdasarkan role pengguna dan status data saat ini.

Contohnya:

- Edit hanya tersedia untuk Purchase Request `DRAFT`;
- Approve dan Reject hanya tersedia untuk `SUBMITTED`;
- Goods Receipt hanya tersedia untuk `ORDERED` dan `PARTIALLY_RECEIVED`.

---

## Responsive Design

Aplikasi dirancang agar tetap dapat digunakan pada:

- mobile;
- tablet;
- desktop.

Table menggunakan horizontal scroll pada layar kecil, sementara sidebar, header, form action, dan tombol menyesuaikan ukuran layar.

---

## Final Quality Check

Sebelum project dikirim, jalankan:

```bash
npm run test
npm run lint
npm run build
```

Semua command harus berhasil tanpa error.

Setelah itu lakukan pengecekan flow utama secara manual:

```text
USER
Create Purchase Request
        ↓
Save Draft
        ↓
Edit
        ↓
Submit
        ↓
APPROVER
Approve / Reject
        ↓
USER
Purchase Order
        ↓
Goods Receipt
        ↓
Inventory Updated
```

---

## Pengembangan Selanjutnya

Beberapa pengembangan yang dapat dilakukan di luar scope technical test:

- authentication dan authorization sungguhan;
- backend dan database persisten;
- automatic Purchase Order generation;
- supplier management;
- inventory movement history;
- audit log;
- pagination;
- end-to-end testing menggunakan Playwright atau Cypress.

---

## Kesimpulan

ProcureFlow dibuat untuk menunjukkan implementasi frontend yang terstruktur dengan fokus pada business flow, validasi, server state, role-based action, mock API, responsive design, dan automated testing.

Arsitektur project dibuat agar mudah dipahami dan tetap cukup dekat dengan pola aplikasi production sehingga mock API dapat diganti dengan backend sebenarnya tanpa harus mengubah keseluruhan frontend.

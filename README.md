# ProcureFlow

ProcureFlow adalah aplikasi frontend untuk mensimulasikan alur pengadaan barang yang dibuat sebagai bagian dari technical test Frontend Developer.

Aplikasi mengimplementasikan alur procurement utama:

**Purchase Request → Approval → Purchase Order → Goods Receipt → Inventory Update**

Project berfokus pada business flow yang saling terhubung, role-based action, server state management, form validation, mock REST API, responsive UI, visual consistency berdasarkan referensi Figma, serta automated testing untuk behavior penting.

---

## Business Flow

Alur utama aplikasi:

```text
Purchase Request
      ↓
    Submit
      ↓
   Approval
   ↙      ↘
Reject   Approve
           ↓
    Purchase Order
           ↓
     Goods Receipt
           ↓
       Inventory
```

Ketika Purchase Request disetujui, aplikasi otomatis membuat Purchase Order berdasarkan data Purchase Request tersebut.

Goods Receipt kemudian memperbarui Purchase Order dan stok Inventory pada warehouse yang sesuai.

---

## Fitur Utama

### Dashboard

Dashboard menampilkan ringkasan data procurement yang berasal dari data aplikasi yang sama.

Informasi yang ditampilkan antara lain:

- total Purchase Request;
- Purchase Request yang masih membutuhkan proses;
- Purchase Order aktif;
- Purchase Order yang partially received;
- recent Purchase Requests;
- recent procurement activity.

Dashboard tidak menggunakan dataset terpisah, tetapi dihitung dari data Purchase Request, Purchase Order, dan Inventory yang tersedia melalui API layer.

---

### Purchase Request

Fitur yang tersedia:

- melihat daftar Purchase Request;
- melakukan pencarian;
- melakukan filter berdasarkan status;
- melihat detail Purchase Request;
- membuat Purchase Request baru;
- mengedit Purchase Request yang masih berstatus `DRAFT`;
- melakukan submit Purchase Request;
- melakukan approve pada Purchase Request berstatus `SUBMITTED`;
- melakukan reject pada Purchase Request berstatus `SUBMITTED`;
- menyimpan alasan penolakan atau `rejectionReason`.

Status Purchase Request:

```text
DRAFT
SUBMITTED
APPROVED
REJECTED
```

Flow normal:

```text
DRAFT
  ↓
SUBMITTED
  ↓
APPROVED
```

Flow rejection:

```text
DRAFT
  ↓
SUBMITTED
  ↓
REJECTED
```

Purchase Request hanya dapat diedit ketika masih berstatus `DRAFT`.

Approve dan Reject hanya dapat dilakukan ketika Purchase Request berstatus `SUBMITTED`.

---

### Purchase Order

Purchase Order terhubung langsung dengan Purchase Request.

Ketika Purchase Request berstatus `SUBMITTED` disetujui oleh APPROVER:

```text
Purchase Request
SUBMITTED
    ↓
APPROVED
    ↓
Purchase Order dibuat
    ↓
ORDERED
```

Purchase Order menyimpan referensi:

```text
purchaseRequestId
```

sehingga hubungan antara Purchase Request dan Purchase Order tetap dapat dilacak.

Fitur yang tersedia:

- melihat daftar Purchase Order;
- melakukan pencarian dan filter;
- melihat detail Purchase Order;
- melihat Purchase Request asal;
- melihat ordered quantity;
- melihat received quantity;
- mencatat Goods Receipt;
- menerima barang secara sebagian;
- memperbarui status Purchase Order berdasarkan quantity yang diterima.

Status Purchase Order:

```text
DRAFT
ORDERED
PARTIALLY_RECEIVED
RECEIVED
CANCELLED
```

Purchase Order hasil approval dibuat dengan status awal:

```text
ORDERED
```

dan:

```text
receivedQuantity = 0
```

---

### Goods Receipt

Goods Receipt tersedia sebagai menu tersendiri untuk memudahkan USER melihat Purchase Order yang masih dapat menerima barang.

Purchase Order yang dapat diproses adalah:

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
Purchase Order
      ↓
receivedQuantity bertambah
      ↓
status PO diperbarui
      ↓
Inventory bertambah
```

Contoh partial receipt:

```text
ORDERED
   ↓
PARTIALLY_RECEIVED
```

Ketika seluruh ordered quantity sudah diterima:

```text
PARTIALLY_RECEIVED
        ↓
     RECEIVED
```

---

### Inventory

Inventory bersifat warehouse-specific.

Inventory dicocokkan berdasarkan kombinasi:

```text
productId + warehouseId
```

Fitur yang tersedia:

- melihat stok Inventory saat ini;
- melakukan pencarian berdasarkan nama produk atau SKU;
- melakukan filter berdasarkan warehouse;
- melihat unit produk;
- memperbarui stok secara otomatis setelah Goods Receipt berhasil.

Inventory tidak berubah ketika:

```text
Purchase Request dibuat
Purchase Request disubmit
Purchase Request diapprove
```

Inventory hanya berubah ketika:

```text
Goods Receipt berhasil
```

---

### Reports

Reports menyediakan ringkasan procurement berdasarkan data aplikasi yang sama.

Data Reports dihitung dari:

- Purchase Request;
- Purchase Order;
- Inventory.

Reports tidak menggunakan dataset report terpisah.

Pendekatan ini memastikan perubahan pada business data juga tercermin pada laporan setelah query terkait diperbarui.

---

## Role Pengguna

Aplikasi memiliki dua role yang disimulasikan di frontend.

### USER

USER dapat:

- membuka Dashboard;
- membuat Purchase Request;
- mengedit Purchase Request berstatus `DRAFT`;
- melakukan submit Purchase Request;
- melihat Purchase Request;
- melihat Purchase Order;
- mencatat Goods Receipt;
- melihat Inventory;
- melihat Reports.

### APPROVER

APPROVER difokuskan pada proses approval Purchase Request.

APPROVER dapat:

- melihat daftar Purchase Request;
- melihat detail Purchase Request;
- melakukan approve pada Purchase Request berstatus `SUBMITTED`;
- melakukan reject pada Purchase Request berstatus `SUBMITTED`;
- memberikan rejection reason.

Authentication tidak termasuk dalam scope technical test.

Karena itu, role disimulasikan menggunakan role switcher di frontend.

Role disimpan menggunakan browser storage dan dikelola melalui React Context sehingga perubahan role tidak membutuhkan full page reload.

---

## Master Data

Project memiliki beberapa master data statis:

```text
Products
Warehouses
Suppliers
```

Master data digunakan sebagai referensi ketika membuat Purchase Request dan Purchase Order.

CRUD master data tidak diimplementasikan karena berada di luar scope technical test.

---

## Centralized Mock Data

Seluruh mock data dipusatkan pada satu mock data source.

Secara konsep:

```text
db
├── products
├── warehouses
├── suppliers
├── purchaseRequests
├── purchaseOrders
└── inventories
```

Pendekatan ini digunakan agar Purchase Request, Purchase Order, Goods Receipt, dan Inventory menggunakan sumber data yang konsisten.

Relasi antar resource menggunakan identifier seperti:

```text
productId
warehouseId
purchaseRequestId
```

---

## Tech Stack

Project menggunakan:

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- Lucide React
- MSW
- Vitest
- React Testing Library

---

## Struktur Project

```text
src/
├── api/
│   └── API abstraction
│
├── components/
│   ├── common/
│   ├── layout/
│   └── ui/
│
├── context/
│   └── role context
│
├── features/
│   ├── dashboard/
│   ├── purchase-requests/
│   ├── purchase-orders/
│   ├── goods-receipts/
│   ├── inventory/
│   └── reports/
│
├── lib/
│   └── utility dan role helper
│
├── mocks/
│   ├── data.ts
│   └── handlers/
│
├── routes/
├── test/
└── types/
```

Struktur project memisahkan UI component, feature logic, API access, mock API, server state, role state, type, dan routing agar project lebih mudah dibaca dan dikembangkan.

---

## Instalasi

### Kebutuhan

Pastikan tersedia:

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

Project tidak membutuhkan environment variable khusus karena backend masih disimulasikan menggunakan MSW.

---

## Build Production

```bash
npm run build
```

Production build sebaiknya berhasil tanpa TypeScript error sebelum submission.

---

## Lint

```bash
npm run lint
```

---

## Testing

```bash
npm run test
```

Project menggunakan Vitest dan React Testing Library.

Testing difokuskan pada behavior penting seperti:

- validasi Purchase Request;
- approval flow;
- rejection flow;
- validasi rejection reason;
- Goods Receipt;
- perubahan received quantity;
- perubahan status Purchase Order;
- integrasi Goods Receipt dengan Inventory.

Testing tidak hanya memeriksa apakah component dapat dirender, tetapi juga behavior bisnis yang penting.

---

## Mock API

Aplikasi menggunakan **MSW (Mock Service Worker)** sebagai mock API layer.

React component tidak mengambil mock data langsung dari `data.ts`.

Component tetap berkomunikasi melalui API abstraction:

```text
src/api/
```

Alurnya:

```text
React Component
      ↓
API Function
      ↓
HTTP Request
      ↓
MSW Handler
      ↓
Centralized Mock DB
```

Contoh endpoint:

```text
GET   /api/purchase-requests
POST  /api/purchase-requests
PATCH /api/purchase-requests/:id
PATCH /api/purchase-requests/:id/submit
PATCH /api/purchase-requests/:id/approve
PATCH /api/purchase-requests/:id/reject

GET   /api/purchase-orders
GET   /api/purchase-orders/:id
POST  /api/purchase-orders/:id/receipt

GET   /api/inventory
```

MSW handler berada di:

```text
src/mocks/handlers/
```

Centralized mock data berada di:

```text
src/mocks/data.ts
```

Pendekatan ini membuat frontend tetap menggunakan pola komunikasi HTTP seperti saat menggunakan backend sebenarnya.

---

## Persistence Mock Data

Mock database berjalan di memory selama aplikasi aktif.

Perubahan seperti:

```text
Create PR
Submit PR
Approve PR
Create PO
Goods Receipt
Inventory Update
```

akan tetap terlihat selama aplikasi tidak melakukan full refresh.

Jika browser direfresh, mock database kembali menggunakan seeded data awal.

---

## Server State dengan TanStack Query

TanStack Query digunakan untuk mengelola server state.

Konsep utama:

```text
useQuery
= membaca server state

queryKey
= identitas data dalam cache

queryFn
= fungsi pengambil data

useMutation
= melakukan perubahan data

queryClient
= mengelola query cache

invalidateQueries
= menandai query sebagai stale agar data diperbarui
```

Contoh:

```ts
useQuery({
  queryKey: ['inventory'],
  queryFn: getInventories,
});
```

Setelah Goods Receipt:

```text
Goods Receipt berhasil
        ↓
Purchase Order berubah
        ↓
Inventory berubah
        ↓
invalidate Purchase Order
invalidate Inventory
        ↓
UI diperbarui
```

Setelah Purchase Request diapprove:

```text
Purchase Request
SUBMITTED
    ↓
APPROVED
    ↓
Purchase Order dibuat
    ↓
invalidate Purchase Requests
invalidate Purchase Orders
    ↓
UI diperbarui
```

---

## Sinkronisasi Purchase Request dan Purchase Order

Purchase Request dan Purchase Order saling terhubung melalui business flow.

Saat Purchase Request dibuat:

```text
Create PR
   ↓
DRAFT
```

Belum ada Purchase Order.

Setelah submit:

```text
DRAFT
  ↓
SUBMITTED
```

Purchase Order juga belum dibuat.

Ketika APPROVER melakukan approve:

```text
SUBMITTED
    ↓
APPROVED
    ↓
Purchase Order dibuat
    ↓
ORDERED
```

Purchase Order mengambil informasi seperti:

- `purchaseRequestId`;
- warehouse;
- item;
- ordered quantity;
- unit;
- supplier mock.

Satu Purchase Request yang telah diapprove hanya menghasilkan satu Purchase Order.

---

## API Abstraction

Request HTTP dipisahkan dari React component dan ditempatkan pada:

```text
src/api/
```

Tujuannya agar React component fokus pada UI dan interaksi pengguna, sedangkan komunikasi HTTP ditangani oleh API layer.

Jika MSW diganti dengan backend sebenarnya, perubahan utama dapat dilakukan pada API layer tanpa harus mengubah seluruh component.

---

## React Hook Form dan Zod

React Hook Form digunakan untuk mengelola form state.

Zod digunakan untuk schema validation.

Kombinasi ini membuat:

- validation rule lebih terpusat;
- form lebih mudah dibaca;
- schema dapat diuji secara terpisah;
- error validation lebih konsisten.

---

## UI dan Design System

UI mengacu pada referensi Figma yang diberikan pada technical test.

Figma digunakan sebagai acuan untuk:

- typography;
- font;
- color palette;
- spacing;
- sidebar;
- header;
- dashboard;
- visual hierarchy.

Font utama:

```text
Instrument Sans
```

Palette utama menggunakan neutral surface dengan blue sebagai brand/action color.

```text
Background      #F9FAFB
Card            #FFFFFF
Muted Surface   #F0F3F6
Border          #E6ECF3

Primary Text    #1D242D
Muted Text      #546881

Primary         #043C86
Primary Hover   #043679
Primary Active  #03306B
```

Warna biru digunakan terutama untuk:

- primary action;
- active state;
- links;
- focus state;
- navigation emphasis.

Sebagian besar surface menggunakan putih dan abu-abu agar sesuai dengan visual language Figma.

---

## Sidebar dan Navigation

Sidebar menyediakan menu:

```text
MAIN
├── Dashboard
├── Purchase Requests
├── Purchase Orders
└── Inventory

EXTENSIONS
├── Goods Receipt
└── Reports
```

Sidebar juga memiliki:

- navigation search;
- Purchase Request indicator;
- Settings sebagai visual item;
- user information.

Menu menyesuaikan berdasarkan role.

APPROVER difokuskan pada section Purchase Request.

---

## Header

Header menampilkan nama section berdasarkan route aktif.

Contoh:

```text
/                       → Dashboard
/purchase-requests      → Purchase Requests
/purchase-orders        → Purchase Orders
/inventory              → Inventory
/goods-receipts         → Goods Receipt
/reports                → Reports
```

Route detail tetap menggunakan nama section induknya.

Contoh:

```text
/purchase-requests/pr-001
→ Purchase Requests
```

Header juga menyediakan role switcher untuk berpindah antara USER dan APPROVER.

---

## UI State

Aplikasi menangani state asynchronous penting:

- Loading
- Empty
- Error
- Pending / Submitting
- Success melalui refresh data setelah mutation

Action ditampilkan berdasarkan role dan status data.

```text
USER + DRAFT
→ Edit
→ Submit

APPROVER + SUBMITTED
→ Approve
→ Reject

ORDERED / PARTIALLY_RECEIVED
→ Goods Receipt
```

---

## Responsive Design

Aplikasi dirancang untuk digunakan pada:

- mobile;
- tablet;
- desktop.

Beberapa penyesuaian responsive:

- sidebar compact pada layar kecil;
- responsive header;
- horizontal scroll untuk table;
- responsive form;
- responsive action;
- adaptive spacing.

---

## Technical Decisions

### TanStack Query untuk Server State

TanStack Query digunakan karena Purchase Request, Purchase Order, Goods Receipt, Inventory, Dashboard, dan Reports memiliki data yang saling berhubungan.

TanStack Query digunakan untuk:

- loading state;
- error state;
- mutation;
- caching;
- invalidation;
- refetch;
- sinkronisasi UI setelah perubahan data.

### Centralized Mock Database

Mock data dipusatkan agar setiap feature menggunakan entity yang sama dan tidak memiliki data yang saling bertentangan.

### Automatic Purchase Order Generation

Purchase Order otomatis dibuat setelah Purchase Request diapprove.

Flow utama menjadi:

```text
PR
↓
Approval
↓
PO
↓
Goods Receipt
↓
Inventory
```

Supplier menggunakan static master data karena supplier management tidak termasuk scope.

### Reports Derived dari Existing Data

Reports dihitung dari data Purchase Request, Purchase Order, dan Inventory.

Reports tidak menggunakan dataset terpisah.

### Role Simulation

Authentication dan backend authorization tidak termasuk scope.

USER dan APPROVER disimulasikan melalui frontend role context.

Role disimpan di browser storage dan React Context menjaga UI tetap reactive tanpa full page reload.

---

## Asumsi Implementasi

### Master Data Bersifat Statis

Product, Warehouse, dan Supplier merupakan static mock master data.

CRUD master data berada di luar scope technical test.

### Inventory Warehouse-Specific

Inventory dicocokkan menggunakan:

```text
productId + warehouseId
```

Goods Receipt hanya memengaruhi Inventory pada warehouse dan product yang sesuai.

### Purchase Order Dibuat Saat Approval

Purchase Order tidak dibuat ketika:

```text
Create PR
Submit PR
```

Purchase Order baru dibuat ketika:

```text
Approve PR
```

### Mock Data Tidak Persisten

Mock database berjalan di memory.

Browser refresh mengembalikan data ke seeded state.

### Pagination

Pagination tidak diimplementasikan karena bukan bagian utama requirement technical test.

Table tetap menyediakan pencarian, filtering, responsive horizontal scrolling, dan UI state yang relevan.

---

## Final Quality Check

Sebelum submission jalankan:

```bash
npm run test
npm run lint
npm run build
```

Kemudian lakukan manual regression test:

```text
USER

Create Purchase Request
        ↓
DRAFT
        ↓
Edit
        ↓
Submit
        ↓
SUBMITTED

APPROVER

Open Purchase Request
        ↓
Approve
    atau
Reject + Reason
        ↓

Jika Approved

Purchase Order Created
        ↓
ORDERED

USER

Open Purchase Order
        ↓
Goods Receipt
        ↓
PARTIALLY_RECEIVED
        ↓
Goods Receipt Remaining Qty
        ↓
RECEIVED
        ↓
Inventory Updated
```

Periksa juga:

```text
Dashboard
Reports
Search
Filter
Role Switch
Responsive Layout
Loading State
Empty State
Error State
```

---

## Pengembangan Selanjutnya

Beberapa pengembangan yang dapat dilakukan di luar scope technical test:

- authentication dan authorization sebenarnya;
- backend REST API;
- persistent database;
- supplier management;
- product management;
- warehouse management;
- inventory movement history;
- audit log;
- notification system;
- pagination;
- server-side filtering;
- end-to-end testing menggunakan Playwright atau Cypress;
- advanced reporting dan chart;
- export report.

---

## Kesimpulan

ProcureFlow dibuat untuk menunjukkan implementasi frontend procurement yang terstruktur dan saling terhubung.

Core business flow:

```text
Purchase Request
      ↓
Approval
      ↓
Purchase Order
      ↓
Goods Receipt
      ↓
Inventory Update
```

Project menggunakan API abstraction, MSW, centralized mock database, TanStack Query, role-based interaction, validation, responsive design, automated testing, serta design system yang mengacu pada Figma.

Arsitektur dibuat agar cukup dekat dengan pola aplikasi production sehingga mock API dapat diganti dengan backend sebenarnya tanpa perlu merombak keseluruhan frontend.

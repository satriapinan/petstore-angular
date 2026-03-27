# petstore-angular

Angular CRUD application using Petstore API implementing component-based architecture, dependency injection, RxJS observables, two-way data binding, authentication, authorization, and unit testing.

# Angular - Overview

## Apa itu Angular?

Angular adalah framework front-end berbasis TypeScript yang dikembangkan dan dikelola oleh Google. Angular dirancang untuk membangun aplikasi web yang skalabel, maintainable, dan berperforma tinggi, baik skala kecil maupun enterprise.

---

## Fitur Utama

- **Two-Way Data Binding** — Sinkronisasi otomatis antara model (data) dan view (UI), sehingga perubahan pada satu sisi langsung tercermin di sisi lainnya.
- **Component-Based Architecture** — Aplikasi dibangun dari komponen-komponen mandiri yang memiliki template, logika, dan styling masing-masing.
- **Dependency Injection (DI)** — Sistem DI bawaan Angular memudahkan pengelolaan dependensi antar class/service, meningkatkan modularitas dan testability.
- **Directives** — Memungkinkan manipulasi DOM secara deklaratif melalui atribut HTML khusus (`*ngIf`, `*ngFor`, dsb).
- **RxJS & Observables** — Pengelolaan operasi asinkron dan event menggunakan reactive programming berbasis RxJS.
- **Angular CLI** — Command-line interface resmi untuk membuat, menjalankan, build, dan testing proyek Angular secara efisien.
- **Routing** — Modul routing bawaan untuk membangun Single Page Application (SPA) dengan navigasi antar halaman.
- **Forms** — Mendukung dua pendekatan form: Template-driven dan Reactive Forms.
- **TypeScript** — Ditulis dengan TypeScript secara penuh, memberikan type safety dan tooling yang lebih baik.
- **Unit Testing** — Terintegrasi langsung dengan Jasmine dan Karma untuk unit testing, serta Protractor/Cypress untuk end-to-end testing.

---

## Kelebihan

- **Struktur yang terstandarisasi** — Konvensi yang jelas membuat kode mudah dibaca dan dipahami lintas tim.
- **Full-featured framework** — Tidak memerlukan library tambahan untuk routing, form, HTTP client, atau state management dasar.
- **Dukungan TypeScript penuh** — Mengurangi bug sejak dini dan meningkatkan pengalaman developer.
- **Ekosistem & komunitas besar** — Didukung Google, memiliki dokumentasi lengkap dan komunitas yang aktif.
- **Skalabilitas tinggi** — Cocok untuk aplikasi enterprise berskala besar dengan banyak modul dan tim.
- **Lazy Loading** — Modul hanya dimuat saat dibutuhkan, meningkatkan performa initial load.

---

## Kekurangan

- **Kurva belajar tinggi** — Konsep seperti Decorators, DI, RxJS, dan module system membutuhkan waktu untuk dipahami.
- **Boilerplate code** — Memerlukan lebih banyak kode awal dibandingkan framework seperti Vue atau React.
- **Ukuran bundle lebih besar** — Secara default ukuran aplikasi Angular lebih besar, meskipun dapat dioptimasi dengan lazy loading dan tree-shaking.
- **Overkill untuk proyek kecil** — Kompleksitasnya kurang ideal untuk proyek sederhana atau prototipe cepat.
- **Perubahan breaking di versi mayor** — Beberapa pembaruan versi besar memerlukan migrasi yang tidak trivial.

---

_Framework ini digunakan dalam proyek ini untuk membangun aplikasi CRUD Pet Store dengan autentikasi, memanfaatkan API dari [Swagger Petstore](https://petstore.swagger.io/)._

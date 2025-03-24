# Temperature Converter App

## Mô tả dự án

Ứng dụng di động đa nền tảng dùng **Capacitor** để chuyển đổi nhiệt độ từ °C sang °F, tích hợp tính năng native (Android/iOS) và chia sẻ trên web.

### Tính năng
- Chuyển đổi nhiệt độ °C sang °F (có validation).
- Thông báo cục bộ sau khi chuyển đổi (Android/iOS).
- Chia sẻ kết quả (Android/iOS: `@capacitor/share`, Web: Web Share API).
- Lấy vị trí (Android/iOS, bonus).
- Giao diện đẹp, responsive.

### Môi trường
- **Capacitor**, Android (Pixel 9 API 30), Web (Chrome).
- HTML, CSS, JavaScript, Node.js.

---
## Yêu cầu
- Node.js (14+): [Tải](https://nodejs.org/).
- Android Studio: [Tải](https://developer.android.com/studio).
- Trình duyệt (Chrome, Edge) hỗ trợ Web Share API.

---
## Cài đặt

### Clone repository

```bash
git clone <repository-url>
cd <ten-thu-muc>
```

### Cài đặt dependency

```bash
npm install
```

## Cài đặt các plugin Capacitor

```bash
npm npm install @capacitor/core @capacitor/android @capacitor/local-notifications @capacitor/share @capacitor/geolocation
```

### Đồng bộ dự án với Android

```bash
npx cap sync
```


### Mở và chạy trên Android

```bash
npx cap open android
```

Sau đó, trong Android Studio, chọn thiết bị (giả lập hoặc thiết bị thật) và nhấn **Run**.

## Sử dụng

1. Nhập **nhiệt độ (C)**.
2. Nhấn **"Chuyển đổi"** để xem kết quả.
3. Sử dụng **"Chia sẻ kết quả"** hoặc **"Lấy vị trí"** (nếu muốn).
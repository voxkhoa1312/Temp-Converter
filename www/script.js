// Truy cập các plugin từ window.Capacitor.Plugins
const { LocalNotifications } = window.Capacitor.Plugins;
const { Share } = window.Capacitor.Plugins;
const { Geolocation } = window.Capacitor.Plugins;
const { Capacitor } = window;

let temperatureF = 0;
let locationData = null; // Lưu trữ thông tin vị trí

// Hàm validate nhiệt độ
function validateTemperature(celsius) {
    if (isNaN(celsius)) {
        return "Vui lòng nhập nhiệt độ hợp lệ (số)!";
    }
    if (celsius < -273.15) {
        return "Nhiệt độ không thể thấp hơn -273.15°C (0 Kelvin)!";
    }
    return null; // Không có lỗi
}

async function convertTemperature() {
    const celsiusInput = document.getElementById('celsius').value.trim();
    const celsius = parseFloat(celsiusInput);
    const resultElement = document.getElementById('result');

    // Validation
    const validationError = validateTemperature(celsius);
    if (validationError) {
        resultElement.innerText = validationError;
        document.getElementById('shareBtn').style.display = 'none'; // Ẩn nút chia sẻ nếu lỗi
        return;
    }

    temperatureF = (celsius * 9 / 5) + 32;
    resultElement.innerText = `${celsius}°C = ${temperatureF.toFixed(2)}°F`;
    document.getElementById('shareBtn').style.display = 'block';

    // Kiểm tra nền tảng hiện tại
    const platform = Capacitor.getPlatform();

    if (platform === 'android' || platform === 'ios') {
        // Hiển thị thông báo cục bộ trên thiết bị di động
        try {
            // Kiểm tra và yêu cầu quyền thông báo
            const { display } = await LocalNotifications.checkPermissions();
            if (display !== 'granted') {
                const { display: newStatus } = await LocalNotifications.requestPermissions();
                if (newStatus !== 'granted') {
                    throw new Error('Quyền thông báo không được cấp.');
                }
            }

            await LocalNotifications.schedule({
                notifications: [{
                    title: "Kết quả chuyển đổi nhiệt độ",
                    body: `${celsius}°C = ${temperatureF.toFixed(2)}°F`,
                    id: 1,
                    schedule: { at: new Date(Date.now() + 1000) }
                }]
            });
        } catch (error) {
            console.error('Lỗi khi hiển thị thông báo:', error.message, error.stack);
            alert('Không thể hiển thị thông báo. Vui lòng thử lại! Lỗi: ' + error.message);
        }
    }
}

async function shareResult() {
    const platform = Capacitor.getPlatform();

    try {
        if (temperatureF === 0) {
            alert("Vui lòng chuyển đổi nhiệt độ trước khi chia sẻ!");
            return;
        }

        // Tạo nội dung chia sẻ bao gồm cả nhiệt độ và vị trí (nếu có)
        let shareText = `${document.getElementById('result').innerText}`;
        if (locationData) {
            shareText += `\nVị trí: ${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}`;
        }

        if (platform === 'android' || platform === 'ios') {
            // Chia sẻ trên Android/iOS
            await Share.share({
                title: 'Kết quả chuyển đổi nhiệt độ',
                text: shareText,
                url: 'https://example.com',
                dialogTitle: 'Chia sẻ kết quả'
            });
        } else if (platform === 'web') {
            // Chia sẻ trên web sử dụng Web Share API
            if (navigator.share) {
                await navigator.share({
                    title: 'Kết quả chuyển đổi nhiệt độ',
                    text: shareText,
                    url: 'https://example.com'
                });
            } else {
                // Fallback nếu trình duyệt không hỗ trợ Web Share API
                alert('Trình duyệt của bạn không hỗ trợ chia sẻ. Bạn có thể sao chép kết quả: ' + shareText);
            }
        }
    } catch (error) {
        // Xử lý lỗi chia sẻ
        if (platform === 'android' || platform === 'ios') {
            if (error.message.includes('ActivityNotFoundException')) {
                alert('Không có ứng dụng nào để chia sẻ. Vui lòng cài đặt ứng dụng hỗ trợ chia sẻ!');
            } else if (error.message.includes('canceled') || error.message.includes('dismissed')) {
                console.log('Người dùng đã hủy chia sẻ:', error.message);
            } else {
                console.error('Lỗi khi chia sẻ:', error.message, error.stack);
                alert('Không thể chia sẻ kết quả. Vui lòng thử lại! Lỗi: ' + error.message);
            }
        } else if (platform === 'web') {
            // Xử lý lỗi trên web
            if (error.name === 'AbortError') {
                console.log('Người dùng đã hủy chia sẻ trên web:', error.message);
            } else {
                console.error('Lỗi khi chia sẻ trên web:', error.message, error.stack);
                alert('Không thể chia sẻ kết quả trên web. Vui lòng thử lại! Lỗi: ' + error.message);
            }
        }
    }
}

async function getLocation() {
    const platform = Capacitor.getPlatform();
    const locationResult = document.getElementById('locationResult');

    if (platform === 'android' || platform === 'ios') {
        try {
            const position = await Geolocation.getCurrentPosition();
            const { latitude, longitude } = position.coords;
            locationData = { latitude, longitude }; // Lưu vị trí vào biến toàn cục
            locationResult.innerText = `Vị trí: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        } catch (error) {
            console.error('Lỗi khi lấy vị trí:', error.message, error.stack);
            locationResult.innerText = 'Không thể lấy vị trí. Vui lòng thử lại!';
            locationData = null; // Reset nếu lỗi
        }
    } else {
        locationResult.innerText = 'Tính năng lấy vị trí chỉ khả dụng trên ứng dụng di động!';
        locationData = null;
    }
}

// Gắn sự kiện cho các nút
document.getElementById('convertBtn').addEventListener('click', convertTemperature);
document.getElementById('shareBtn').addEventListener('click', shareResult);
document.getElementById('locationBtn').addEventListener('click', getLocation);
# Bluetooth File Transfer Application

A cross-platform file transfer application that enables sending files from a desktop/laptop to an Android device via Bluetooth. The application includes real-time transfer speed monitoring and a modern user interface.

## Features

- Bluetooth device scanning and connection
- Multiple file type support
- Real-time transfer speed visualization
- Progress tracking
- Modern and intuitive user interface
- Cross-platform support (Windows, Linux, macOS for sender; Android for receiver)

## Project Structure

```
.
├── android/                 # Android application
│   └── app/
│       └── src/
│           └── main/
│               ├── java/
│               │   └── com/
│               │       └── filetransfer/
│               │           └── MainActivity.java
│               └── res/
│                   └── layout/
│                       └── activity_main.xml
└── desktop/                # Python desktop application
    ├── sender.py
    └── requirements.txt
```

## Android Application Setup

1. Open the project in Android Studio
2. Build and run the application on your Android device
3. Grant the necessary permissions when prompted:
   - Bluetooth
   - Location
   - Storage

## Desktop Application Setup

1. Install Python 3.7 or later
2. Install the required dependencies:
   ```bash
   cd desktop
   pip install -r requirements.txt
   ```

3. Run the sender application:
   ```bash
   python sender.py
   ```

## Usage

### Android Device (Receiver)

1. Launch the Android application
2. Tap "Start Server" to begin listening for incoming connections
3. The app will display the connection status and transfer progress
4. Received files will be saved in the app's private storage

### Desktop/Laptop (Sender)

1. Launch the Python application
2. Click "Refresh" to scan for nearby Bluetooth devices
3. Select your Android device from the dropdown list
4. Click "Add Files" to select files for transfer
5. Click "Send Files" to begin the transfer
6. Monitor the transfer progress and speed in real-time

## Requirements

### Android
- Android 6.0 or later
- Bluetooth support
- Storage permission

### Desktop
- Python 3.7 or later
- PyBluez library
- Matplotlib
- NumPy
- Bluetooth adapter

## Troubleshooting

1. **Bluetooth not working**
   - Ensure Bluetooth is enabled on both devices
   - Check if the devices are paired
   - Verify Bluetooth permissions are granted

2. **Connection issues**
   - Keep devices within range
   - Ensure no other applications are using Bluetooth
   - Try restarting both applications

3. **File transfer errors**
   - Check available storage space on Android device
   - Verify file permissions
   - Ensure stable Bluetooth connection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
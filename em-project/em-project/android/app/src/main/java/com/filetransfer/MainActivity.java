package com.filetransfer;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private static final int REQUEST_ENABLE_BT = 1;
    private static final int REQUEST_PERMISSIONS = 2;
    private static final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    private static final String NAME = "FileTransfer";

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothServerSocket serverSocket;
    private BluetoothSocket clientSocket;
    private Handler handler;
    private TextView statusText;
    private ProgressBar progressBar;
    private TextView speedText;
    private Button startButton;
    private Button stopButton;
    private boolean isTransferring = false;
    private long startTime;
    private long bytesReceived;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize UI components
        statusText = findViewById(R.id.statusText);
        progressBar = findViewById(R.id.progressBar);
        speedText = findViewById(R.id.speedText);
        startButton = findViewById(R.id.startButton);
        stopButton = findViewById(R.id.stopButton);

        handler = new Handler(Looper.getMainLooper());
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();

        // Check if Bluetooth is supported
        if (bluetoothAdapter == null) {
            Toast.makeText(this, "Bluetooth is not supported on this device", Toast.LENGTH_LONG).show();
            finish();
            return;
        }

        // Set up button click listeners
        startButton.setOnClickListener(v -> startServer());
        stopButton.setOnClickListener(v -> stopServer());

        // Request necessary permissions
        requestPermissions();
    }

    private void requestPermissions() {
        String[] permissions = {
            Manifest.permission.BLUETOOTH,
            Manifest.permission.BLUETOOTH_ADMIN,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.READ_EXTERNAL_STORAGE
        };

        for (String permission : permissions) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, permissions, REQUEST_PERMISSIONS);
                break;
            }
        }
    }

    private void startServer() {
        if (!bluetoothAdapter.isEnabled()) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
            return;
        }

        new Thread(() -> {
            try {
                serverSocket = bluetoothAdapter.listenUsingRfcommWithServiceRecord(NAME, MY_UUID);
                updateStatus("Waiting for connection...");
                
                clientSocket = serverSocket.accept();
                updateStatus("Connected to " + clientSocket.getRemoteDevice().getName());
                
                startFileTransfer();
            } catch (IOException e) {
                updateStatus("Error: " + e.getMessage());
            }
        }).start();
    }

    private void startFileTransfer() {
        isTransferring = true;
        startTime = System.currentTimeMillis();
        bytesReceived = 0;

        new Thread(() -> {
            try {
                InputStream inputStream = clientSocket.getInputStream();
                byte[] buffer = new byte[1024];
                int bytes;
                File downloadDir = new File(getExternalFilesDir(null), "ReceivedFiles");
                if (!downloadDir.exists()) {
                    downloadDir.mkdirs();
                }

                while (isTransferring && (bytes = inputStream.read(buffer)) != -1) {
                    // Process received data
                    bytesReceived += bytes;
                    updateProgress(bytes);
                    updateSpeed();
                }
            } catch (IOException e) {
                updateStatus("Transfer error: " + e.getMessage());
            } finally {
                stopServer();
            }
        }).start();
    }

    private void stopServer() {
        isTransferring = false;
        try {
            if (clientSocket != null) {
                clientSocket.close();
            }
            if (serverSocket != null) {
                serverSocket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        updateStatus("Server stopped");
    }

    private void updateStatus(String message) {
        handler.post(() -> statusText.setText(message));
    }

    private void updateProgress(int bytes) {
        handler.post(() -> {
            progressBar.setProgress((int) ((bytesReceived * 100) / (1024 * 1024))); // Assuming max file size of 1MB
        });
    }

    private void updateSpeed() {
        long currentTime = System.currentTimeMillis();
        long timeElapsed = currentTime - startTime;
        if (timeElapsed > 0) {
            double speed = (bytesReceived * 1000.0) / timeElapsed; // bytes per second
            handler.post(() -> speedText.setText(String.format("Speed: %.2f KB/s", speed / 1024)));
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        stopServer();
    }
} 
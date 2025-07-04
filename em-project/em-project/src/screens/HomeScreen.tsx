import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';

const bleManager = new BleManager();

const HomeScreen = ({ navigation }: any) => {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    checkBluetoothPermissions();
    return () => {
      bleManager.destroy();
    };
  }, []);

  const checkBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      const permission = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (permission === RESULTS.DENIED) {
        const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (result === RESULTS.GRANTED) {
          checkBluetoothState();
        }
      } else if (permission === RESULTS.GRANTED) {
        checkBluetoothState();
      }
    } else {
      checkBluetoothState();
    }
  };

  const checkBluetoothState = () => {
    bleManager.state().then((state) => {
      setIsBluetoothEnabled(state === 'PoweredOn');
    });
  };

  const startScan = () => {
    if (!isBluetoothEnabled) {
      Alert.alert('Error', 'Please enable Bluetooth to continue');
      return;
    }

    setIsScanning(true);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        setIsScanning(false);
        return;
      }

      if (device) {
        navigation.navigate('Transfer', { device });
        setIsScanning(false);
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  return (
    <View style={styles.container}>
      <Icon
        name={isBluetoothEnabled ? 'bluetooth-connected' : 'bluetooth-disabled'}
        size={100}
        color={isBluetoothEnabled ? '#2196F3' : '#757575'}
      />
      <Text style={styles.status}>
        Bluetooth is {isBluetoothEnabled ? 'enabled' : 'disabled'}
      </Text>
      <TouchableOpacity
        style={[styles.button, !isBluetoothEnabled && styles.buttonDisabled]}
        onPress={startScan}
        disabled={!isBluetoothEnabled || isScanning}>
        <Text style={styles.buttonText}>
          {isScanning ? 'Scanning...' : 'Start Transfer'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FileList')}>
        <Text style={styles.buttonText}>View Received Files</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  status: {
    fontSize: 18,
    marginVertical: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 
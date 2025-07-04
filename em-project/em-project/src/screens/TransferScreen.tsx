import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TransferScreen = ({ route, navigation }: any) => {
  const { device } = route.params;
  const [transferSpeed, setTransferSpeed] = useState<number[]>([]);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [receivedFiles, setReceivedFiles] = useState<string[]>([]);

  useEffect(() => {
    startFileTransfer();
    return () => {
      // Cleanup if needed
    };
  }, []);

  const startFileTransfer = async () => {
    try {
      // Simulate file transfer for demonstration
      // In a real app, this would use the BLE connection to receive files
      const files = ['image1.jpg', 'document.pdf', 'video.mp4'];
      
      for (const file of files) {
        setCurrentFile(file);
        let currentProgress = 0;
        
        // Simulate file transfer progress
        const interval = setInterval(() => {
          currentProgress += 10;
          setProgress(currentProgress);
          
          // Simulate transfer speed (KB/s)
          const speed = Math.floor(Math.random() * 1000) + 500;
          setTransferSpeed(prev => [...prev.slice(-19), speed]);
          
          if (currentProgress >= 100) {
            clearInterval(interval);
            setReceivedFiles(prev => [...prev, file]);
            setProgress(0);
          }
        }, 500);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to transfer files');
    }
  };

  const renameFile = (oldName: string) => {
    Alert.prompt(
      'Rename File',
      'Enter new name:',
      (newName) => {
        if (newName) {
          setReceivedFiles(prev =>
            prev.map(file => (file === oldName ? newName : file))
          );
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Transfer Speed (KB/s)</Text>
        <LineChart
          data={{
            labels: [],
            datasets: [
              {
                data: transferSpeed,
              },
            ],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.currentFile}>
          Current File: {currentFile || 'None'}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>

      <ScrollView style={styles.fileList}>
        <Text style={styles.fileListTitle}>Received Files:</Text>
        {receivedFiles.map((file, index) => (
          <TouchableOpacity
            key={index}
            style={styles.fileItem}
            onPress={() => renameFile(file)}>
            <Icon name="insert-drive-file" size={24} color="#2196F3" />
            <Text style={styles.fileName}>{file}</Text>
            <Icon name="edit" size={20} color="#757575" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },
  currentFile: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  progressText: {
    textAlign: 'center',
    marginTop: 5,
    color: '#666',
  },
  fileList: {
    flex: 1,
  },
  fileListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  fileName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default TransferScreen; 
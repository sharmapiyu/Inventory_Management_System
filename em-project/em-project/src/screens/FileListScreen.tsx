import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FileInfo {
  name: string;
  path: string;
  size: number;
  type: string;
}

const FileListScreen = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const downloadPath = RNFS.DownloadDirectoryPath;
      const result = await RNFS.readDir(downloadPath);
      
      const fileList = await Promise.all(
        result.map(async (item) => {
          const stats = await RNFS.stat(item.path);
          return {
            name: item.name,
            path: item.path,
            size: stats.size,
            type: item.name.split('.').pop() || '',
          };
        })
      );

      setFiles(fileList);
    } catch (error) {
      Alert.alert('Error', 'Failed to load files');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      case 'pdf':
        return 'picture-as-pdf';
      case 'mp4':
      case 'mov':
        return 'videocam';
      default:
        return 'insert-drive-file';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const deleteFile = async (file: FileInfo) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete ${file.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await RNFS.unlink(file.path);
              setFiles(files.filter((f) => f.path !== file.path));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete file');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: FileInfo }) => (
    <View style={styles.fileItem}>
      <Icon name={getFileIcon(item.type)} size={24} color="#2196F3" />
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        <Text style={styles.fileSize}>{formatFileSize(item.size)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteFile(item)}>
        <Icon name="delete" size={24} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.path}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No files found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
});

export default FileListScreen; 
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Switch, Image } from 'react-native';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [sound, setSound] = useState();
  const [fileUri, setFileUri] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load sound from the selected file
  async function loadSound(uri) {
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    await sound.playAsync();
    setIsPlaying(true);
  }

  // Pick a music file
  const pickMusic = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
    });

    if (result.type === 'success') {
      setFileUri(result.uri);
      loadSound(result.uri);
    }
  };

  // Play or pause the sound
  const playPauseSound = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  // Stop the sound
  const stopSound = async () => {
    await sound.stopAsync();
    setIsPlaying(false);
  };

  // Share the music file
  const shareMusic = async () => {
    if (fileUri) {
      await Sharing.shareAsync(fileUri);
    }
  };

  // Toggle dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Clean up the sound on unmount
  useEffect(() => {
    return sound ? () => {
      sound.unloadAsync();
    } : undefined;
  }, [sound]);

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
        Offline Music Player
      </Text>
      <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={pickMusic}>
        <Text style={[styles.buttonText, isDarkMode ? styles.darkText : styles.lightText]}>Pick Music</Text>
      </TouchableOpacity>

      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlButton, isDarkMode ? styles.darkControlButton : styles.lightControlButton]} onPress={playPauseSound}>
          <Text style={styles.controlButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, isDarkMode ? styles.darkControlButton : styles.lightControlButton]} onPress={stopSound}>
          <Text style={styles.controlButtonText}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, isDarkMode ? styles.darkControlButton : styles.lightControlButton]} onPress={shareMusic}>
          <Text style={styles.controlButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleText, isDarkMode ? styles.darkText : styles.lightText]}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      {fileUri && (
        <Text style={[styles.fileInfo, isDarkMode ? styles.darkText : styles.lightText]}>
          Playing: {fileUri.split('/').pop()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#282c34',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#ffffff',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  lightButton: {
    backgroundColor: '#61dafb',
  },
  darkButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    fontSize: 18,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  controlButton: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
    flex: 1,
    alignItems: 'center',
  },
  lightControlButton: {
    backgroundColor: '#61dafb',
  },
  darkControlButton: {
    backgroundColor: '#4caf50',
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  toggleText: {
    marginRight: 10,
    fontSize: 16,
  },
  fileInfo: {
    marginTop: 20,
    fontSize: 16,
  },
}
);
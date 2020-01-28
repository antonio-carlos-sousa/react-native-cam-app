import React, { useState } from 'react';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import uuid from 'react-native-uuid';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const { app } = firebase.storage();

const App = () => {

  const [imgSource, setImageSource] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const options = {
    title: 'Select Image',
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };

  launchCamera = () => {

    ImagePicker.launchCamera(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };

        setImageSource(source);

        uploadImage();
      }
    });
  }

  uploadImage = () => {

    const ext = imgSource.uri.split('.').pop(); // Extract image extension
    const filename = `${uuid()}.${ext}`; // Generate unique name

    setUploading(true);

    firebase
      .storage()
      .ref(`marriage/photos/${filename}`)
      .putFile(imgSource.uri)
      .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        error => {
          unsubscribe();
          alert('Sorry, Try again.');
        }, () => {
          setProgress(0);
          setUploading(false);
        }
      );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>

            <View style={styles.container}>
              <Text style={styles.welcome}>React Native Firebase Image Upload </Text>
              <Text style={styles.instructions}>Hello 👋, Let us upload an Image</Text>
              {/** Select Image button */}
              <TouchableOpacity style={styles.btn} onPress={this.launchCamera}>
                <View>
                  <Text style={styles.btnTxt}>Pick image</Text>
                </View>
              </TouchableOpacity>
              {/** Display selected image */}
              {imgSource ? (
                <Image
                  source={imgSource}
                  style={styles.image}
                />
              ) : (
                  <Text>Select an Image!</Text>
                )}

              {uploading && (
                <View
                  style={[styles.progressBar, { width: `${progress}%` }]}
                />
              )}
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  btn: {
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.3)',
    backgroundColor: 'rgb(68, 99, 147)'
  },
  btnTxt: {
    color: '#fff'
  },
  image: {
    marginTop: 20,
    minWidth: 200,
    height: 200
  },
  progressBar: {
    marginTop: 40,
    backgroundColor: 'rgb(3, 154, 229)',
    height: 3,
    shadowColor: '#000',
  }
});

export default App;

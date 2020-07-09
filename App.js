/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, useReducer } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import NativeBridge from './src/NativeBridge';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const reducer = (state, action) => {
  switch (action.type) {
    case 'inc': return state + action.value;
    case 'reset': return 0;
  }
}

const statusToString = status => {
  switch (status) {
    case 0: return 'ready';
    case 1: return 'waiting for user';
    case 2: return 'downloading';
    case 3: return 'completed/ready';
    case 4: return 'error/user cancelled';
  }
}

const App: () => React$Node = (props) => {
  let [items, setItems] = useReducer(reducer, 0);
  let [status, setStatus] = useState(0);

  const onFileData = (data) => {
    console.log(data);
    try {
      const asJson = JSON.parse(data);
      setItems({type:'inc', value: asJson.length});
      setStatus(2);
    }
    catch (e) {
      console.log("file parse error");
    }
  }

  const onCompleted = () => {
    console.log("completed");
    setStatus(3);
  }

  const onError = () => {
    console.log("error");
    setStatus(4);
  }

  useEffect(()=> {
    const nativeBridge = NativeBridge.getNativeBridge();
    nativeBridge.addListener("error", onError);
    nativeBridge.addListener("fileData", onFileData);
    nativeBridge.addListener("completed", onCompleted);

    return () => {
      nativeBridge.removeListener("error", onError);
      nativeBridge.removeListener("fileData", onFileData);
      nativeBridge.removeListener("completed", onCompleted);
    }
  }, [])

  return (
    <View>
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
            <Button title="Get data" styles={styles.button}
              disabled={status == 1 || status == 2}
              onPress={() => {
                setItems({type:'reset'});
                setStatus(1);

                const nativeBridge = NativeBridge.getNativeBridge();
                nativeBridge.initSDK(
                  "fJI8P5Z4cIhP3HawlXVvxWBrbyj5QkTF",
                  "YOUR_APP_ID",
                  "fJI8P5Z4cIhP3HawlXVvxWBrbyj5QkTF",
                  "monkey periscope"
                );
              }
            }/>

          <Text>status: {statusToString(status)}</Text>
          <Text>downloaded {items} items</Text>

          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
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
  button: {
    width: '30px',
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
});

export default App;

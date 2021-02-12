/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  useTVEventHandler,
  HWFocusEvent,
  
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import 'react-native/tvos-types.d';

import Loader from './components/Loader'

declare const global: {HermesInternal: null | {}};



const App = () => {
  
  const [lastEventType, setLastEventType] = React.useState('');
  const myTVEventHandler = (evt: HWFocusEvent) => {
    setLastEventType(evt.eventType);
  };
  useTVEventHandler(myTVEventHandler);
  return (
    <>
      <SafeAreaView style={styles.body}>

        <View style={styles.engine}>
            
          
        

            <Loader />
           
        </View>

            {/* </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView> */}
      </SafeAreaView>
    </>
  );
};






const styles = StyleSheet.create({

  engine: {
    backgroundColor: 'skyblue',
    position: 'absolute',
    borderColor: 'lightgray',
    shadowRadius: 5,
    shadowOpacity: .5,
    borderWidth: 2,
    borderRadius:5,
    minWidth: 600,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    backgroundColor: Colors.dark,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default App;

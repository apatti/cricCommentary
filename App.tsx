import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import {Main} from './components/Main';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {MatchList} from "./components/MatchList";
import {Commentary} from "./components/Commentary";


const Stack = createStackNavigator();
export default function App() {
    return(
        <NavigationContainer>
              <Stack.Navigator>
                  <Stack.Screen name="Main" component={Main} options={{title:"Cricket Commentary"}} />
                  <Stack.Screen name="MatchList" component={MatchList} />
                  <Stack.Screen name="Commentary" component={Commentary} />
              </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    root:{
        padding: 40
    }
});

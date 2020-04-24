import React from "react";
import {View, Text} from "react-native";
import {mainStyles} from "../styles/mainStyle";
import {MatchList} from "./MatchList";

export interface Props {
    navigation
}

export const Main: React.FC<Props> = (props) =>{
    return(
        <View style={mainStyles.root}>
            <MatchList navigation={props.navigation}/>
        </View>
    );

}


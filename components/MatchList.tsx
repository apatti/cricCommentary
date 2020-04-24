import React, {useEffect, useState} from "react";
import {ActivityIndicator, Picker, Dimensions, View, Button} from "react-native";
import {MatchApi, Match} from "../utils/MatchApi";

export interface Props {
    navigation
}

export const MatchList: React.FC<Props> = (props)=>{
    const width = Dimensions.get('window').width;

    //this.setState({loading:true,match:undefined});
    const [loading, toggleLoading] = useState(false);
    const [match,setMatchData] = useState({title:"",url:""});
    const [matchList,setMatchList] = useState([]);

    useEffect(()=>{
        async function fetchData() {
            //Get the match list.
            const matchApi = new MatchApi();
            const matchList = await matchApi.getMatchList();
            return matchList;
        }
        fetchData().then((matchList)=>{
            setMatchList(matchList);
            toggleLoading(true);
        });
    },[]);

    let matches = matchList.map((m)=>{
       return <Picker.Item key={m.url} value={m} label={m.title} />
    });

    if(loading) {
        return (
            <View>
            <Picker selectedValue={match}
                    onValueChange={(itemValue, itemPosition) => {if(itemPosition!=0)setMatchData(itemValue)}}
                    style={{height: 50, width}}
            >
                <Picker.Item value="" label="Select the game" />
                {matches}
            </Picker>
            <Button title="Start" onPress={()=>{
                if(match.title!="")
                    props.navigation.navigate('Commentary',match)
            }} />
            </View>
        );
    }
    else{
        return (
            <ActivityIndicator />
        );
    }
}


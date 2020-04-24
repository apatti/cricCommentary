import React, {useEffect, useState} from "react";
import {View, Text, FlatList, ActivityIndicator} from "react-native";
import {mainStyles} from "../styles/mainStyle";
import {CommentaryApi} from "../utils/MatchCommentary";
import {SpeechHelper} from "../utils/SpeechHelper";

export interface Props {
    navigation,
    route
}

export const Commentary: React.FC<Props> = (props) =>{

    //this.setState({loading:true,match:undefined});
    const [loading, toggleLoading] = useState(false);
    const [commentaryData,setCommentaryData] = useState([]);
    const api = new CommentaryApi(props.route.params.url);

    useEffect(()=>{
        GetLatestCommentary().then(()=>toggleLoading(true));
        let timer = setInterval(async ()=>{
            await GetLatestCommentary();
        },(15*1000)); //Every minute
        return function cleanUp() {
            SpeechHelper.stop().then(()=>console.log("Stopped"));
            clearInterval(timer);
        }
    },[]);

    async function GetLatestCommentary() {
        console.log("Getting latest commentary");
        const latestCommentaryData = await api.getLatestCommentary();
        latestCommentaryData.reverse();
        commentaryData.push(...latestCommentaryData);
        //console.log(commentaryData);
        setCommentaryData(
            commentaryData
        );
        //toggleLoading(true);
        SpeechHelper.readContent(latestCommentaryData);
    }

    if(loading) {
        return (
            <View style={mainStyles.root}>
                <Text style={mainStyles.title}>
                    {props.route.params.title}
                </Text>
                <FlatList
                    data={commentaryData}
                    numColumns={1}
                    keyExtractor={(item) => 'D'+item.id.toString()}
                    renderItem={({item}) => {
                        return (
                            <View>
                                <Text style={mainStyles.title}>
                                    {item.ball!='' && item.ball} {item.action!='' && item.action}
                                </Text>
                                {item.comment!='' && <Text style={mainStyles.title}>{item.comment}</Text>}
                            </View>
                        )
                    }}
                />
            </View>
        );
    }
    else{
        return (
            <ActivityIndicator />
        );
    }

}


import * as Speech from 'expo-speech';
import {CommentaryData} from "./MatchCommentary";

export class SpeechHelper{
    static ballMap = {
        "1":"first",
        "2":"second",
        "3":"third",
        "4":"fourth",
        "5":"fifth",
        "6":"last"
    };
    static wicketMap = {
        "0":" for no loss",
        "1":" for 1",
        "2":" for 2",
        "3":" for 3",
        "4":" for 4",
        "5":" for 5",
        "6":" for 6",
        "7":" for 7",
        "8":" for 8",
        "9":" for 9",
        "10":" all out",
    };
    static readText(text:string){
        Speech.speak(text);
    }

    static async stop() {
        const isSpeaking = await Speech.isSpeakingAsync();
        if (isSpeaking) {
            await Speech.stop();
        }
    }

    static readContent(content:CommentaryData[]){
        content.forEach((c)=>{
            let toSpeak="";
            if(c.end_of_over!=true){
                let ball = c.ball.split('.')[1];
                let over = c.ball.split('.')[0];
                if(ball=='1'){
                    Speech.speak(`Start of ${over} over`,{
                        pitch:1.1,
                        rate:0.8,
                    });
                }
                toSpeak=`${this.ballMap[ball]} ball. ${c.action}`;
                Speech.speak(toSpeak,{
                    pitch:1,
                    rate:1
                });
                if(c.comment!=''){
                    Speech.speak(c.comment,{
                       pitch:0.9,
                       rate:1.2
                    });
                }
            }
            else{
                let wicket = c.action.substr(c.action.indexOf('/')+1);
                let regex = /\/\d+/;
                toSpeak = c.action.replace(regex,this.wicketMap[wicket]);
                Speech.speak(toSpeak);
            }
            console.log(toSpeak);
        });
    }

}

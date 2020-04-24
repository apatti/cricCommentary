import * as cheerio from "cheerio-without-node-native";
import bcrypt from "react-native-bcrypt";
export interface CommentaryData{
    id: string,
    action: string,
    comment: string,
    ball: string,
    end_of_over: boolean
}

export class CommentaryApi {
    private readonly matchUrl:string;
    private commentaryData:CommentaryData[]=[];
    private index:String=undefined;
    private salt:String=bcrypt.genSaltSync(1);

    constructor(url){
        if(!url.startsWith('http')){
            this.matchUrl=`https://www.espncricinfo.com/${url}`;
        }
        else{
            this.matchUrl=url;
        }

    }

    async getLatestCommentary() : Promise<CommentaryData[]>{
        try{
            console.log(`Fetching scorecard list data:${this.matchUrl}`);
            let response = await fetch(this.matchUrl,{headers:{
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                }});
            //console.log(response);
            let responseData = await response.text();
            //console.log(responseData);
            if(this.commentaryData.length!=0){

            }
            const data = this.extractCommentary(responseData);
            console.log(data[0].action);
            const latestCommentary:CommentaryData[]=[];
            for(let i=0;i<data.length;i++){
                //console.log(`${data[i].id} -${data[i].ball} - ${data[i].action}`);
                if(data[i].id==this.index){
                    break;
                }
                this.commentaryData.push(data[i]);
                latestCommentary.push(data[i]);
            }
            this.index=data[0].id;
            //console.log(this.index);
            return latestCommentary;
        }
        catch (e) {
            console.error(e);
        }
        //return this.commentaryData;
    }

    private extractCommentary(matchData: string): CommentaryData[] {
        let data: CommentaryData[] = [];
        const $ = cheerio.load(matchData);
        const commentary = $('div.cricinfo__content__detail')[0];
        for (let i = 0; i < commentary.children.length; i++) {
            const child = commentary.children[i];
            switch (child.name) {
                case 'ul': {
                    // over detail
                    data.push(...this.extractOverDetail($, child));
                    break;
                }
                case 'div': {
                    // over summary
                    data.push(this.extractEndOfOver($, child));
                    break;
                }
            }
        }
        return data;
    }

    private extractOverDetail($, overElement):CommentaryData[] {
        let overDetail: CommentaryData[] = [];
        let ballInfoHandled = true;
        let ball = "";
        for (let i = 0; i < overElement.children.length; i++) {
            const ballsElement = overElement.children[i];
            for(let j=0;j< ballsElement.children.length;j++){
                const child = ballsElement.children[j];
                let comment = "";
                if (ballInfoHandled) {
                    ball = "";
                }
                let action = "";
                switch (child.name) {
                    case 'div': {
                        //Comment
                        if ($(child).attr('class') == 'comment') {
                            comment = $(child).text();
                            ballInfoHandled = true;
                        }
                        break;
                    }
                    case 'span': {
                        //Ball detail
                        if ($(child).attr('class') == 'cricinfo__type__weight--bold') {
                            ball = $(child).text();
                            ballInfoHandled = false;
                        } else {
                            action = $(child).text();
                            ballInfoHandled = true;
                        }
                        break;
                    }
                }
                if (ballInfoHandled) {
                    overDetail.push({
                        id: bcrypt.hashSync(`${ball}${action}${comment}`,this.salt),
                        end_of_over: false,
                        comment: comment,
                        action,
                        ball
                    });
                }
            }

        }
        return overDetail;
    }

    private extractEndOfOver($, endOfOverElement): CommentaryData {
        return {
            id: bcrypt.hashSync($(endOfOverElement).text(),this.salt),
            end_of_over: true,
            ball: "",
            comment: "",
            action: $(endOfOverElement).text()
        };
    }
}

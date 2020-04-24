import * as cheerio from "cheerio-without-node-native";

export interface Match{
    url: string,
    title: string
}

export class MatchApi{
    private readonly scoresUrl:string;
    constructor(){
        this.scoresUrl = 'https://www.espncricinfo.com/scores';
        //this.scoresUrl = 'www.google.com';
    }

    async getMatchList() : Promise<Match[]> {
        try{
            console.log("Fetching scorecard list data");
            let response = await fetch(this.scoresUrl);
            //console.log(response);
            let responseData = await response.text();
            //console.log(responseData);
            return this.extractMatchList(responseData);
        }
        catch (e) {
            console.error(e);
        }

    }

    private extractMatchList(matchListData:string) : Match[]{
        let matchList: Match[] = [];
        const $ = cheerio.load(matchListData);
        const scoreCardCollection = $('div.scoreCollection.cricket');
        for(let i=0; i<scoreCardCollection.length; i++) {
            const scoreDataList = $(scoreCardCollection[i]).find('div.cscore.cscore--live.cricket.cscore--watchNotes');
            for(let j=0;j<scoreDataList.length;j++) {
                let matchUrl = $(scoreDataList[j]).find('a.cscore_details')[0];
                const homeTeam = $(scoreDataList[j]).find('span.cscore_name.cscore_name--abbrev')[0];
                const awayTeam = $(scoreDataList[j]).find('span.cscore_name.cscore_name--abbrev')[1];
                const notes = $(scoreDataList[j]).find('span.cscore_notes_game')[0];
                if(matchUrl){
                    matchUrl = $(matchUrl).attr('href');
                }
                //console.log(matchUrl);
                matchList.push({url:matchUrl,title:`${$(homeTeam).text()} vs ${$(awayTeam).text()} - ${$(notes).text()}`});
            }
        }
        console.log(`Returning: ${matchList.map((m)=>{return m.title})}\n`);
        return matchList;
    }

}

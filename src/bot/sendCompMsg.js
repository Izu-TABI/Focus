import 'whatwg-fetch'

export default function sendCompMsg(username, time) {

    const WEBHOOK_URL = process.env.REACT_APP_WEBHOOK_URL;
    const date = new Date();
    const todayString = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate()+ " "+ date.getHours() + ":" + date.getMinutes();

    try {
        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: "---\n"+todayString+"\n"+"**"+username+"** さんが __**"+Math.floor((time) / 3600)+" 時間 "+Math.ceil((time) % 3600 / 60)+" 分**__ "+"作業を続けて目標を達成しました！\n---",
            })
        })
    } catch(err) {
        console.error(err)
    }    
}
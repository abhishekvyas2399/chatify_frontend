export default function formatLocalStringTime_forMsg(time){
    const msgDate=new Date(time);
    const now=new Date();

    const isToday=msgDate.toDateString()==now.toDateString();

    const yesterday=new Date();
    yesterday.setDate(now.getDate()-1);
    const isYesterday=msgDate.toDateString()===yesterday.toDateString();

    const DaysDiffrence=(now-msgDate)/(1000*60*60*24);


    if(isToday) return msgDate.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:true});
    else if(isYesterday)    return "yesterday";
    else if(DaysDiffrence<7)    return msgDate.toLocaleDateString([],{weekday:"short"});
    else if(now.getFullYear()==msgDate.getFullYear())   return  msgDate.toLocaleDateString([],{day:"2-digit",month:"short"});
    else return msgDate.toLocaleDateString();
}
/* SHOPSHIFT — deterministic simulation, independent of DOM and platform. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.Shopshift=api;})(globalThis,function(){
'use strict';
const PRODUCTS=[
{id:'serum',name:'Dewdrop',kind:'Serum nawilżające',cost:24,price:59,color:'#c65969',shape:'dropper'},
{id:'cream',name:'Cloud Nine',kind:'Krem do twarzy',cost:19,price:49,color:'#c1c1c1',shape:'jar'},
{id:'cleanser',name:'Fresh Start',kind:'Żel oczyszczający',cost:14,price:39,color:'#bababa',shape:'pump'},
{id:'mist',name:'Soft Rain',kind:'Mgiełka do twarzy',cost:12,price:35,color:'#b3b3b3',shape:'spray'},
{id:'mask',name:'Sunday Reset',kind:'Maska regenerująca',cost:17,price:45,color:'#de939d',shape:'jar'},
{id:'oil',name:'Golden Hour',kind:'Olejek do twarzy',cost:28,price:69,color:'#c4c4c4',shape:'dropper'}];
const LEVELS=[{name:'Domowe studio',size:'24 m²',capacity:150,rent:35,limit:25,upgrade:0},{name:'Pracownia marki',size:'70 m²',capacity:450,rent:85,limit:65,upgrade:2400},{name:'Centrum wysyłek',size:'180 m²',capacity:1200,rent:170,limit:160,upgrade:6000}];
const CAMPAIGNS=[{name:'Ruch organiczny',cost:0,visits:24},{name:'Social starter',cost:60,visits:95},{name:'Beauty creators',cost:180,visits:220},{name:'Pełna kampania',cost:480,visits:430}];
const empty=()=>({sales:0,cogs:0,shipping:0,fees:0,ads:0,fixed:0,refunds:0,returnFees:0,setup:0});
const profit=l=>l.sales-l.cogs-l.shipping-l.fees-l.ads-l.fixed-l.refunds-l.returnFees-l.setup;
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
function create(seed=18371){return {version:1,seed,day:1,phase:'plan',cash:10000,level:0,rating:4.6,ratingCount:5,stock:PRODUCTS.map(()=>({qty:0,value:0})),prices:PRODUCTS.map(p=>p.price),deliveries:[],orders:[],returns:[],reviews:[],history:[],ledger:empty(),total:empty(),campaign:1,freeShipping:false,worker:false,shipped:0,packedToday:0,visits:0,lost:0,nextId:1001,tutorial:0,log:['Witaj w swoim pierwszym sklepie. Kup towar, ustaw ceny i otwórz dzień.']};}
function rng(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
function log(s,msg){s.log.unshift(msg);s.log=s.log.slice(0,12);}
function entry(s,key,n){n=round(n);s.ledger[key]=round(s.ledger[key]+n);s.total[key]=round(s.total[key]+n);}
function used(s){return s.stock.reduce((a,b)=>a+b.qty,0)+s.deliveries.reduce((a,b)=>a+b.qty,0)+s.orders.filter(o=>o.status==='new'||o.status==='packed').length;}
function buy(s,index,qty,supplier=0){
if(s.phase!=='plan')throw Error('Zatowarowanie jest dostępne przed otwarciem dnia.');
if(!Number.isInteger(index)||!PRODUCTS[index]||!Number.isInteger(qty)||qty<1||qty>500||![0,1].includes(supplier))throw Error('Nieprawidłowa dostawa.');
const unit=round(PRODUCTS[index].cost*(supplier===1?.86:1));const cost=round(unit*qty);
if(qty<(supplier===1?20:5))throw Error('Minimum dostawcy: '+(supplier===1?20:5)+' sztuk.');
if(used(s)+qty>LEVELS[s.level].capacity)throw Error('Brak miejsca w magazynie. Zmniejsz dostawę lub rozbuduj firmę.');
if(cost>s.cash)throw Error('Brakuje gotówki na tę dostawę.');
s.cash=round(s.cash-cost);
if(supplier===1)s.deliveries.push({index,qty,value:cost,due:s.day+1});else{s.stock[index].qty+=qty;s.stock[index].value=round(s.stock[index].value+cost);}
s.tutorial=Math.max(s.tutorial,1);log(s,'Zakup: '+qty+' × '+PRODUCTS[index].name+' za '+cost+' zł'+(supplier===1?' · dostawa jutro.':' · towar na regale.'));return cost;
}
function price(s,index,value){if(s.phase!=='plan')throw Error('Ceny zmienisz przed kolejnym dniem.');if(!PRODUCTS[index]||!Number.isFinite(value)||value<5||value>300)throw Error('Cena musi wynosić 5–300 zł.');s.prices[index]=round(value);s.tutorial=Math.max(s.tutorial,2);}
function review(s,stars,text){s.rating=(s.rating*s.ratingCount+stars)/(s.ratingCount+1);s.ratingCount++;s.reviews.unshift({day:s.day,stars,text});s.reviews=s.reviews.slice(0,25);}
// Plan demand once; accept each order only when its arrival timer expires.
function open(s){
if(s.phase!=='plan')throw Error('Dzień jest już otwarty.');const ad=CAMPAIGNS[s.campaign];
if(!ad)throw Error('Wybierz kampanię.');if(ad.cost>0&&s.cash<ad.cost)throw Error('Brak gotówki na kampanię. Wybierz ruch organiczny.');
s.cash=round(s.cash-ad.cost);entry(s,'ads',ad.cost);s.phase='fulfill';s.visits=Math.round(ad.visits*(.85+rng(s)*.3)*(s.rating/4.5));s.orders=[];s.lost=0;s.packedToday=0;
const available=PRODUCTS.map((_,i)=>i).filter(i=>s.stock[i].qty>0),remaining=s.stock.map(x=>x.qty),queue=[];
if(available.length)for(let n=0;n<s.visits;n++){
const i=available[Math.floor(rng(s)*available.length)],relative=s.prices[i]/PRODUCTS[i].price;
if(rng(s)>Math.min(.65,.24*Math.pow(1/relative,2.8)))continue;
if(!remaining[i]||queue.length>=LEVELS[s.level].limit){s.lost++;continue;}
remaining[i]--;queue.push({index:i,price:s.prices[i],freeShipping:s.freeShipping,returnRoll:rng(s),quality:relative>1.3});
}
s.live={queue,nextIn:queue.length?delay(s):0,job:null};s.tutorial=Math.max(s.tutorial,3);
log(s,'Sklep otwarty. Nowe zamówienia będą pojawiać się pojedynczo co 20–30 sekund.');
}
function delay(s){return 20000+Math.floor(rng(s)*10001);}
function ensureLive(s){if(!s.live)s.live={queue:[],nextIn:0,job:null};return s.live;}
function packingDuration(s){return s.worker?9000:16000;}
function advance(s,ms){
if(!Number.isFinite(ms)||ms<0||ms>3600000)throw Error('Nieprawidłowy krok czasu.');
if(s.phase!=='fulfill')return [];const live=ensureLive(s),events=[];
function assign(){if(live.job&&!s.orders.some(o=>o.id===live.job.id&&o.status==='new'))live.job=null;if(!live.job){const o=s.orders.find(o=>o.status==='new');if(o)live.job={id:o.id,elapsed:0};}}
assign();
while(ms>0){
const arrival=live.queue.length?live.nextIn:Infinity,packing=live.job?packingDuration(s)-live.job.elapsed:Infinity;
const step=Math.min(ms,arrival,packing);if(!Number.isFinite(step))break;
if(live.queue.length)live.nextIn=Math.max(0,live.nextIn-step);if(live.job)live.job.elapsed+=step;ms-=step;
if(live.queue.length&&live.nextIn<=0){
const planned=live.queue.shift(),st=s.stock[planned.index];
if(st.qty>0){const cost=round(st.value/st.qty);st.qty--;st.value=st.qty?round(st.value-cost):0;const order={...planned,id:s.nextId++,cost,status:'new'};s.orders.push(order);events.push({type:'order',order});log(s,'Nowe zamówienie #'+order.id+' · '+PRODUCTS[order.index].name+'.');}else s.lost++;
live.nextIn=live.queue.length?delay(s):0;
}
if(live.job&&live.job.elapsed>=packingDuration(s)){const id=live.job.id;pack(s,id);events.push({type:'packed',id});live.job=null;}
assign();if(!live.queue.length&&!live.job)break;
}
return events;
}
function pack(s,id){if(s.phase!=='fulfill')throw Error('Otwórz najpierw dzień sprzedaży.');const o=s.orders.find(o=>o.id===id&&o.status==='new');if(!o)throw Error('Brak zamówienia do pakowania.');o.status='packed';s.packedToday++;}
function ship(s){if(s.phase!=='fulfill')throw Error('Kurier przyjeżdża w otwartym dniu.');const pending=s.orders.filter(o=>o.status==='packed');if(!pending.length)throw Error('Najpierw spakuj zamówienie.');for(const o of pending){const sales=o.price+(o.freeShipping?0:9);const fee=round(sales*.02);s.cash=round(s.cash+sales-11-fee);entry(s,'sales',sales);entry(s,'cogs',o.cost);entry(s,'shipping',11);entry(s,'fees',fee);o.status='shipped';s.shipped++;s.returns.push({...o,due:s.day+2,sales});if(o.returnRoll>.15)review(s,5,'Piękne opakowanie i szybka wysyłka. Wrócę po więcej!');}s.tutorial=Math.max(s.tutorial,4);log(s,'Kurier odebrał '+pending.length+' paczek. Wpływy trafiły na konto.');return pending.length;}
function close(s){if(s.phase!=='fulfill')throw Error('Dzień nie jest otwarty.');for(const o of s.orders.filter(o=>o.status!=='shipped')){s.stock[o.index].qty++;s.stock[o.index].value=round(s.stock[o.index].value+o.cost);o.status='cancelled';review(s,2,'Zamówienie nie zostało wysłane. Anuluję zakup.');}const fixed=LEVELS[s.level].rent+(s.worker?95:0);entry(s,'fixed',fixed);s.cash=round(s.cash-fixed);s.phase='report';s.live={queue:[],nextIn:0,job:null};const result={day:s.day,...s.ledger,profit:round(profit(s.ledger)),orders:s.orders.filter(o=>o.status==='shipped').length,visits:s.visits};s.history.push(result);s.tutorial=Math.max(s.tutorial,5);log(s,'Wynik dnia '+s.day+': '+result.profit+' zł.');return result;}
function next(s){if(s.phase!=='report')throw Error('Najpierw podsumuj dzień.');s.day++;s.ledger=empty();s.orders=[];s.live={queue:[],nextIn:0,job:null};s.phase='plan';for(const d of s.deliveries.filter(d=>d.due<=s.day)){s.stock[d.index].qty+=d.qty;s.stock[d.index].value=round(s.stock[d.index].value+d.value);log(s,'Dostawa dotarła: '+d.qty+' × '+PRODUCTS[d.index].name+'.');}s.deliveries=s.deliveries.filter(d=>d.due>s.day);for(const o of s.returns.filter(o=>o.due<=s.day)){if(o.returnRoll<(o.quality?.16:.07)){entry(s,'refunds',o.sales);entry(s,'returnFees',6);s.cash=round(s.cash-o.sales-6);review(s,3,'Produkt nie spełnił oczekiwań. Zwrot został rozliczony.');log(s,'Zwrot #'+o.id+': −'+(o.sales+6)+' zł. Otwarty kosmetyk nie wraca do sprzedaży.');}}s.returns=s.returns.filter(o=>o.due>s.day);}
function upgrade(s){if(s.phase!=='plan')throw Error('Rozbudowę zaplanuj przed otwarciem dnia.');if(s.level>=2)throw Error('Masz największy magazyn MVP.');const cost=LEVELS[s.level+1].upgrade;if(s.shipped<(s.level===0?20:100))throw Error('Najpierw wyślij '+(s.level===0?20:100)+' zamówień.');if(s.cash<cost)throw Error('Brak środków na przeprowadzkę.');s.cash=round(s.cash-cost);entry(s,'setup',cost);s.level++;log(s,'Nowa siedziba: '+LEVELS[s.level].name+'!');}
function hire(s){if(s.phase!=='plan')throw Error('Zespół zmienisz przed otwarciem dnia.');if(s.level<1)throw Error('Magazynier wymaga Pracowni marki.');s.worker=!s.worker;}
function validate(s){
const num=(n,min=0,max=1e12)=>Number.isFinite(n)&&n>=min&&n<=max;
const integer=(n,min=0,max=1e7)=>Number.isInteger(n)&&n>=min&&n<=max;
const arr=(v,max)=>Array.isArray(v)&&v.length<=max;
const entryOK=l=>l&&Object.keys(empty()).every(k=>num(l[k]));
const orderOK=o=>o&&integer(o.id,1001)&&integer(o.index,0,5)&&num(o.price,5,300)&&num(o.cost)&&['new','packed','shipped','cancelled'].includes(o.status)&&typeof o.freeShipping==='boolean'&&typeof o.quality==='boolean'&&num(o.returnRoll,0,1);
const liveOK=s=>s.live===undefined||!!(s.live&&arr(s.live.queue,160)&&s.live.queue.every(o=>o&&integer(o.index,0,5)&&num(o.price,5,300)&&typeof o.freeShipping==='boolean'&&typeof o.quality==='boolean'&&num(o.returnRoll,0,1))&&num(s.live.nextIn,0,30000)&&(s.live.queue.length?s.live.nextIn>0:s.live.nextIn===0)&&(s.live.job===null||(s.live.job&&integer(s.live.job.id,1001)&&num(s.live.job.elapsed,0,s.worker?9000:16000))));
return !!(s&&liveOK(s)&&s.version===1&&integer(s.day,1)&&['plan','fulfill','report'].includes(s.phase)&&num(s.cash,-1e12)&&integer(s.level,0,2)&&integer(s.seed,0,4294967295)&&num(s.rating,1,5)&&integer(s.ratingCount,1)&&integer(s.shipped)&&integer(s.packedToday)&&integer(s.visits)&&integer(s.lost)&&integer(s.nextId,1001)&&integer(s.tutorial,0,5)&&typeof s.freeShipping==='boolean'&&typeof s.worker==='boolean'&&integer(s.campaign,0,3)&&arr(s.stock,6)&&s.stock.length===6&&s.stock.every(x=>x&&integer(x.qty,0,1200)&&num(x.value))&&arr(s.prices,6)&&s.prices.length===6&&s.prices.every(x=>num(x,5,300))&&arr(s.orders,160)&&s.orders.every(orderOK)&&arr(s.deliveries,240)&&s.deliveries.every(d=>d&&integer(d.index,0,5)&&integer(d.qty,1,1200)&&num(d.value)&&integer(d.due,1))&&arr(s.returns,320)&&s.returns.every(o=>orderOK(o)&&integer(o.due,1)&&num(o.sales))&&arr(s.reviews,25)&&s.reviews.every(r=>r&&integer(r.day,1)&&integer(r.stars,1,5)&&typeof r.text==='string'&&r.text.length<=1000)&&arr(s.log,12)&&s.log.every(x=>typeof x==='string'&&x.length<2000)&&arr(s.history,100000)&&s.history.every(h=>entryOK(h)&&integer(h.day,1)&&num(h.profit,-1e12)&&integer(h.orders)&&integer(h.visits))&&entryOK(s.ledger)&&entryOK(s.total));
}
return {PRODUCTS,LEVELS,CAMPAIGNS,create,profit,round,used,buy,price,open,advance,ensureLive,packingDuration,pack,ship,close,next,upgrade,hire,validate};
});



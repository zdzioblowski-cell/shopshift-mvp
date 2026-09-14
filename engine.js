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

// Market references and editable scenario assumptions are documented in REALIA.md.
const CHANNELS=[
{id:'google',name:'Google Ads',cpc:1.2,cvr:.035,description:'Wyszukiwanie: większa intencja zakupu.'},
{id:'meta',name:'Meta Ads · Facebook',cpc:.8,cvr:.018,description:'Szerokie dotarcie, niższa intencja zakupu.'},
{id:'instagram',name:'Instagram',cpc:.9,cvr:.015,description:'Osobna pula reklam wizualnych; część ekosystemu Meta.'},
{id:'tiktok',name:'TikTok',cpc:.55,cvr:.01,description:'Tańszy ruch, duża zmienność i niższa konwersja.'},
{id:'articles',name:'Artykuły zewnętrzne',cpc:0,cvr:.02,description:'350 zł za publikację; ruch polecający i wolny rozwój marki.'}];
const EXTRA_COSTS=['agency','packaging','payroll','software'];
function defaults(){return {budgets:{google:150,meta:0,instagram:0,tiktok:0,articles:0},agency:true,seoBudget:0,seoPoints:0,seoPending:[],seoAge:0,brand:0,promo:{type:'none',percent:10},rates:{agencyMonthly:1500,agencyPercent:10,parcel:13.5,packaging:1.8,customerDelivery:12.99,salaryGross:5500,employerPercent:20.48,softwareMonthly:99,returnHandling:6,paymentPercent:1.5,paymentFixed:1}};}
function migrate(s){if(!s.business){s.business=defaults();s.business.budgets.google=CAMPAIGNS[s.campaign]?.cost||0;}if(!s.business.seoPending)s.business.seoPending=[];for(const l of [s.ledger,s.total,...s.history])for(const k of EXTRA_COSTS)if(l[k]===undefined)l[k]=0;return s;}
function config(s){return s.business||defaults();}
function qty(o){return o.qty||1;}
function spend(s){const b=config(s);return round(Object.values(b.budgets).reduce((a,n)=>a+n,0)+b.seoBudget);}
function dayCosts(s){const b=config(s),r=b.rates;return {ads:spend(s),agencyVariable:b.agency?round(spend(s)*r.agencyPercent/100):0,agencyFixed:b.agency?round(r.agencyMonthly/30):0,payroll:s.worker?round(r.salaryGross*(1+r.employerPercent/100)/30):0,software:round(r.softwareMonthly/30),rent:LEVELS[s.level].rent};}
function settings(s,field,value){if(s.phase!=='plan')throw Error('Plan zmienisz przed kolejnym dniem.');migrate(s);const b=s.business;
if(field.startsWith('budget:')){const id=field.slice(7);if(!CHANNELS.some(c=>c.id===id)||!Number.isFinite(value)||value<0||value>3000||(id==='articles'&&value%350!==0))throw Error('Budżet: 0–3000 zł. Publikacje po 350 zł/szt.');b.budgets[id]=round(value);}
else if(field==='agency'){if(typeof value!=='boolean')throw Error('Nieprawidłowa obsługa kampanii.');b.agency=value;}
else if(field==='seoBudget'){if(!Number.isFinite(value)||value<0||value>500)throw Error('Budżet SEO: 0–500 zł/dzień.');b.seoBudget=round(value);}
else if(field==='promo'){if(!['none','sale','coupon','bundle'].includes(value))throw Error('Nieprawidłowa promocja.');b.promo.type=value;}
else if(field==='discount'){if(!Number.isFinite(value)||value<1||value>50)throw Error('Rabat: 1–50%.');b.promo.percent=round(value);}
else if(field.startsWith('rate:')){const id=field.slice(5),limits={agencyMonthly:[0,10000],agencyPercent:[0,30],parcel:[5,50],packaging:[.5,15],customerDelivery:[0,30],salaryGross:[4806,20000],employerPercent:[0,40],softwareMonthly:[0,3000],returnHandling:[0,50],paymentPercent:[0,5],paymentFixed:[0,5]};if(!limits[id]||!Number.isFinite(value)||value<limits[id][0]||value>limits[id][1])throw Error('Wartość poza zakresem dla tego kosztu.');b.rates[id]=round(value);}
else throw Error('Nieznane ustawienie.');}
function offer(s,index,units=1,useCoupon=true){const b=config(s),p=b.promo;let quantity=p.type==='bundle'?4:units;const base=round(s.prices[index]*quantity),discount=p.type==='bundle'?s.prices[index]:((p.type==='sale'||p.type==='coupon'&&useCoupon)?round(base*p.percent/100):0);const price=round(base-discount),deliveryCharge=s.freeShipping?0:b.rates.customerDelivery;return {qty:quantity,basePrice:base,discount,price,promo:p.type,deliveryCharge,shippingCost:b.rates.parcel,packagingCost:round(b.rates.packaging+(quantity>2?.6:0)),paymentRate:b.rates.paymentPercent/100,paymentFixed:b.rates.paymentFixed,returnHandling:b.rates.returnHandling};}
function unitEconomics(s,index,units=1){const o=offer(s,index,units),st=s.stock[index],cost=round((st.qty?st.value/st.qty:PRODUCTS[index].cost)*o.qty),fee=round((o.price+o.deliveryCharge)*o.paymentRate+o.paymentFixed);return {...o,cost,fee,contribution:round(o.price+o.deliveryCharge-cost-o.shippingCost-o.packagingCost-fee)};}

const empty=()=>({sales:0,cogs:0,shipping:0,fees:0,ads:0,fixed:0,refunds:0,returnFees:0,setup:0,agency:0,packaging:0,payroll:0,software:0});
const profit=l=>l.sales-l.cogs-l.shipping-l.fees-l.ads-l.fixed-l.refunds-l.returnFees-l.setup-(l.agency||0)-(l.packaging||0)-(l.payroll||0)-(l.software||0);
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
function create(seed=18371){return {version:1,business:defaults(),seed,day:1,phase:'plan',cash:10000,level:0,rating:4.6,ratingCount:5,stock:PRODUCTS.map(()=>({qty:0,value:0})),prices:PRODUCTS.map(p=>p.price),deliveries:[],orders:[],returns:[],reviews:[],history:[],ledger:empty(),total:empty(),campaign:1,freeShipping:false,worker:false,shipped:0,packedToday:0,visits:0,lost:0,nextId:1001,tutorial:0,log:['Witaj w swoim pierwszym sklepie. Kup towar, ustaw ceny i otwórz dzień.']};}
function rng(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
function log(s,msg){s.log.unshift(msg);s.log=s.log.slice(0,12);}
function entry(s,key,n){n=round(n);s.ledger[key]=round((s.ledger[key]||0)+n);s.total[key]=round((s.total[key]||0)+n);}
function used(s){return s.stock.reduce((a,b)=>a+b.qty,0)+s.deliveries.reduce((a,b)=>a+b.qty,0)+s.orders.filter(o=>o.status==='new'||o.status==='packed').reduce((n,o)=>n+qty(o),0);}
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
if(s.phase!=='plan')throw Error('Dzień jest już otwarty.');migrate(s);const b=s.business,costs=dayCosts(s),upfront=round(costs.ads+costs.agencyVariable);
if(upfront>0&&s.cash<upfront)throw Error('Brak gotówki na reklamę i prowizję agencji. Zmniejsz budżety.');
s.cash=round(s.cash-upfront);entry(s,'ads',costs.ads);entry(s,'agency',costs.agencyVariable);b.dayCosts=costs;s.phase='fulfill';s.orders=[];s.lost=0;s.packedToday=0;s.visits=0;
const available=PRODUCTS.map((_,i)=>i).filter(i=>s.stock[i].qty>0),remaining=s.stock.map(x=>x.qty),queue=[];b.channelStats=[];
const organic=Math.round(2+rng(s)*3+Math.min(100,b.brand*.4)+(b.seoAge>=30?Math.min(250,b.seoPoints*.025):0));
const sources=[{id:'organic',name:'Organiczne / marka',budget:0,visits:organic,cvr:.012}];
for(const channel of CHANNELS){const budget=b.budgets[channel.id];if(!budget)continue;const random=.7+rng(s)*.6;const overlap=channel.id==='instagram'&&b.budgets.meta>0?.85:1;const visits=channel.id==='articles'?Math.round(budget/350*(15+rng(s)*25)):Math.round(budget/(channel.cpc/random)*overlap);sources.push({id:channel.id,name:channel.name,budget,visits,cvr:channel.cvr});}
for(const source of sources){const stats={id:source.id,name:source.name,spend:source.budget,visits:source.visits,accepted:0,orders:0,sales:0,contribution:0};b.channelStats.push(stats);s.visits+=source.visits;
for(let n=0;n<source.visits&&available.length;n++){
const index=available[Math.floor(rng(s)*available.length)],promotion=b.promo.type,relative=s.prices[index]/PRODUCTS[index].price;
const promoLift=promotion==='sale'?1+b.promo.percent*.02:promotion==='coupon'?1+b.promo.percent*.012:promotion==='bundle'?1.22:1;
const trust=Math.max(.45,Math.min(1.3,s.rating/4.5))*(1+Math.min(.3,b.brand*.002));const cvr=Math.min(.12,source.cvr*trust*Math.pow(1/relative,1.7)*promoLift*(s.freeShipping?1.08:1));
if(rng(s)>cvr)continue;const units=rng(s)<.55?1:(rng(s)<.7?2:3),useCoupon=rng(s)<.65,o=offer(s,index,units,useCoupon);
if(remaining[index]<o.qty||queue.length>=LEVELS[s.level].limit){s.lost++;continue;}
remaining[index]-=o.qty;queue.push({...o,index,channel:source.id,freeShipping:s.freeShipping,returnRoll:rng(s),quality:relative>1.3});
}}
// Spread channels throughout the session instead of delivering in source order.
for(let n=queue.length-1;n>0;n--){const j=Math.floor(rng(s)*(n+1));[queue[n],queue[j]]=[queue[j],queue[n]];}
s.live={queue,nextIn:queue.length?delay(s):0,job:null};s.tutorial=Math.max(s.tutorial,3);
log(s,'Sklep otwarty: '+s.visits+' wizyt. Reklama i obsługa: '+upfront+' zł. Konwersja nie jest gwarantowana.');
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
if(st.qty>=qty(planned)){const cost=round(st.value/st.qty*qty(planned));st.qty-=qty(planned);st.value=st.qty?round(st.value-cost):0;const order={...planned,id:s.nextId++,cost,status:'new'};s.orders.push(order);const channel=s.business?.channelStats?.find(c=>c.id===order.channel);if(channel)channel.accepted++;events.push({type:'order',order});log(s,'Nowe zamówienie #'+order.id+' · '+PRODUCTS[order.index].name+'.');}else s.lost++;
live.nextIn=live.queue.length?delay(s):0;
}
if(live.job&&live.job.elapsed>=packingDuration(s)){const id=live.job.id;pack(s,id);events.push({type:'packed',id});live.job=null;}
assign();if(!live.queue.length&&!live.job)break;
}
return events;
}
function pack(s,id){if(s.phase!=='fulfill')throw Error('Otwórz najpierw dzień sprzedaży.');const o=s.orders.find(o=>o.id===id&&o.status==='new');if(!o)throw Error('Brak zamówienia do pakowania.');o.status='packed';s.packedToday++;}
function ship(s){if(s.phase!=='fulfill')throw Error('Kurier przyjeżdża w otwartym dniu.');const pending=s.orders.filter(o=>o.status==='packed');if(!pending.length)throw Error('Najpierw spakuj zamówienie.');
for(const o of pending){const sales=round(o.price+(o.deliveryCharge??(o.freeShipping?0:9))),shipping=o.shippingCost??11,packaging=o.packagingCost??0,fee=round(sales*(o.paymentRate??.02)+(o.paymentFixed??0));s.cash=round(s.cash+sales-shipping-packaging-fee);entry(s,'sales',sales);entry(s,'cogs',o.cost);entry(s,'shipping',shipping);entry(s,'packaging',packaging);entry(s,'fees',fee);o.status='shipped';s.shipped++;s.returns.push({...o,due:s.day+2,sales});const channel=s.business?.channelStats?.find(c=>c.id===o.channel);if(channel){channel.orders++;channel.sales=round(channel.sales+sales);channel.contribution=round(channel.contribution+sales-o.cost-shipping-packaging-fee);}if(o.returnRoll>.15)review(s,5,'Dobrze zapakowane kosmetyki i szybka wysyłka.');}
s.tutorial=Math.max(s.tutorial,4);log(s,'Kurier odebrał '+pending.length+' paczek.');return pending.length;}
function close(s){if(s.phase!=='fulfill')throw Error('Dzień nie jest otwarty.');for(const o of s.orders.filter(o=>o.status!=='shipped')){s.stock[o.index].qty+=qty(o);s.stock[o.index].value=round(s.stock[o.index].value+o.cost);o.status='cancelled';review(s,2,'Zamówienie nie zostało wysłane. Anuluję zakup.');}const daily=s.business?.dayCosts;const fixed=daily?daily.rent:LEVELS[s.level].rent+(s.worker?95:0);entry(s,'fixed',fixed);s.cash=round(s.cash-fixed);if(daily){for(const [key,amount] of [['agency',daily.agencyFixed],['payroll',daily.payroll],['software',daily.software]]){entry(s,key,amount);s.cash=round(s.cash-amount);}const b=s.business;b.seoAge++;b.seoPoints=round(b.seoPoints*.997);if(b.seoBudget>0)b.seoPending.push({amount:b.seoBudget,due:s.day+30});b.brand=round(Math.min(300,b.brand*.995+b.budgets.articles/350*.7+s.orders.filter(o=>o.status==='shipped').length*.03));delete b.dayCosts;}s.phase='report';s.live={queue:[],nextIn:0,job:null};const result={day:s.day,...s.ledger,profit:round(profit(s.ledger)),orders:s.orders.filter(o=>o.status==='shipped').length,visits:s.visits};s.history.push(result);s.tutorial=Math.max(s.tutorial,5);log(s,'Wynik dnia '+s.day+': '+result.profit+' zł.');return result;}
function next(s){if(s.phase!=='report')throw Error('Najpierw podsumuj dzień.');s.day++;if(s.business){const b=s.business;for(const investment of (b.seoPending||[]).filter(x=>x.due<=s.day))b.seoPoints=round(b.seoPoints+investment.amount);b.seoPending=(b.seoPending||[]).filter(x=>x.due>s.day);delete b.channelStats;}s.ledger=empty();s.orders=[];s.live={queue:[],nextIn:0,job:null};s.phase='plan';for(const d of s.deliveries.filter(d=>d.due<=s.day)){s.stock[d.index].qty+=d.qty;s.stock[d.index].value=round(s.stock[d.index].value+d.value);log(s,'Dostawa dotarła: '+d.qty+' × '+PRODUCTS[d.index].name+'.');}s.deliveries=s.deliveries.filter(d=>d.due>s.day);for(const o of s.returns.filter(o=>o.due<=s.day)){if(o.returnRoll<(o.quality?.16:.07)){entry(s,'refunds',o.sales);const handling=o.returnHandling??6;entry(s,'returnFees',handling);s.cash=round(s.cash-o.sales-handling);review(s,3,'Produkt nie spełnił oczekiwań. Zwrot został rozliczony.');log(s,'Zwrot #'+o.id+': −'+(o.sales+handling)+' zł. Otwarty kosmetyk nie wraca do sprzedaży.');}}s.returns=s.returns.filter(o=>o.due>s.day);}
function upgrade(s){if(s.phase!=='plan')throw Error('Rozbudowę zaplanuj przed otwarciem dnia.');if(s.level>=2)throw Error('Masz największy magazyn MVP.');const cost=LEVELS[s.level+1].upgrade;if(s.shipped<(s.level===0?20:100))throw Error('Najpierw wyślij '+(s.level===0?20:100)+' zamówień.');if(s.cash<cost)throw Error('Brak środków na przeprowadzkę.');s.cash=round(s.cash-cost);entry(s,'setup',cost);s.level++;log(s,'Nowa siedziba: '+LEVELS[s.level].name+'!');}
function hire(s){if(s.phase!=='plan')throw Error('Zespół zmienisz przed otwarciem dnia.');if(s.level<1)throw Error('Magazynier wymaga Pracowni marki.');s.worker=!s.worker;}
function validate(s){
const num=(n,min=0,max=1e12)=>Number.isFinite(n)&&n>=min&&n<=max;
const integer=(n,min=0,max=1e7)=>Number.isInteger(n)&&n>=min&&n<=max;
const arr=(v,max)=>Array.isArray(v)&&v.length<=max;
const entryOK=l=>l&&Object.keys(empty()).every(k=>num(l[k])||(EXTRA_COSTS.includes(k)&&l[k]===undefined));
const offerOK=o=>(o.qty===undefined||integer(o.qty,1,4))&&(o.channel===undefined||['organic',...CHANNELS.map(c=>c.id)].includes(o.channel))&&['basePrice','discount','deliveryCharge','shippingCost','packagingCost','paymentRate','paymentFixed','returnHandling'].every(k=>o[k]===undefined||num(o[k],0,1500));
const businessOK=b=>b===undefined||!!(b&&(b.planConfirmed===undefined||typeof b.planConfirmed==='boolean')&&b.budgets&&CHANNELS.every(c=>num(b.budgets[c.id],0,3000))&&b.budgets.articles%350===0&&typeof b.agency==='boolean'&&num(b.seoBudget,0,500)&&num(b.seoPoints)&&(b.seoPending===undefined||arr(b.seoPending,31)&&b.seoPending.every(x=>x&&num(x.amount,0,500)&&integer(x.due,1)))&&integer(b.seoAge)&&num(b.brand,0,300)&&b.promo&&['none','sale','coupon','bundle'].includes(b.promo.type)&&num(b.promo.percent,1,50)&&b.rates&&Object.keys(defaults().rates).every(k=>num(b.rates[k],0,20000))&&(b.dayCosts===undefined||['ads','agencyVariable','agencyFixed','payroll','software','rent'].every(k=>num(b.dayCosts[k])))&&(b.channelStats===undefined||arr(b.channelStats,6)&&b.channelStats.every(c=>['organic',...CHANNELS.map(x=>x.id)].includes(c.id)&&typeof c.name==='string'&&c.name.length<100&&['spend','visits','accepted','orders','sales'].every(k=>num(c[k]))&&num(c.contribution,-1e12))));
const orderOK=o=>o&&integer(o.id,1001)&&integer(o.index,0,5)&&num(o.price,.01,1200)&&num(o.cost)&&['new','packed','shipped','cancelled'].includes(o.status)&&typeof o.freeShipping==='boolean'&&typeof o.quality==='boolean'&&num(o.returnRoll,0,1)&&offerOK(o);
const liveOK=s=>s.live===undefined||!!(s.live&&arr(s.live.queue,160)&&s.live.queue.every(o=>o&&offerOK(o)&&integer(o.index,0,5)&&num(o.price,.01,1200)&&typeof o.freeShipping==='boolean'&&typeof o.quality==='boolean'&&num(o.returnRoll,0,1))&&num(s.live.nextIn,0,30000)&&(s.live.queue.length?s.live.nextIn>0:s.live.nextIn===0)&&(s.live.job===null||(s.live.job&&integer(s.live.job.id,1001)&&num(s.live.job.elapsed,0,s.worker?9000:16000))));
return !!(s&&liveOK(s)&&businessOK(s.business)&&s.version===1&&integer(s.day,1)&&['plan','fulfill','report'].includes(s.phase)&&num(s.cash,-1e12)&&integer(s.level,0,2)&&integer(s.seed,0,4294967295)&&num(s.rating,1,5)&&integer(s.ratingCount,1)&&integer(s.shipped)&&integer(s.packedToday)&&integer(s.visits)&&integer(s.lost)&&integer(s.nextId,1001)&&integer(s.tutorial,0,5)&&typeof s.freeShipping==='boolean'&&typeof s.worker==='boolean'&&integer(s.campaign,0,3)&&arr(s.stock,6)&&s.stock.length===6&&s.stock.every(x=>x&&integer(x.qty,0,1200)&&num(x.value))&&arr(s.prices,6)&&s.prices.length===6&&s.prices.every(x=>num(x,5,300))&&arr(s.orders,160)&&s.orders.every(orderOK)&&arr(s.deliveries,240)&&s.deliveries.every(d=>d&&integer(d.index,0,5)&&integer(d.qty,1,1200)&&num(d.value)&&integer(d.due,1))&&arr(s.returns,320)&&s.returns.every(o=>orderOK(o)&&integer(o.due,1)&&num(o.sales))&&arr(s.reviews,25)&&s.reviews.every(r=>r&&integer(r.day,1)&&integer(r.stars,1,5)&&typeof r.text==='string'&&r.text.length<=1000)&&arr(s.log,12)&&s.log.every(x=>typeof x==='string'&&x.length<2000)&&arr(s.history,100000)&&s.history.every(h=>entryOK(h)&&integer(h.day,1)&&num(h.profit,-1e12)&&integer(h.orders)&&integer(h.visits))&&entryOK(s.ledger)&&entryOK(s.total));
}
return {PRODUCTS,LEVELS,CAMPAIGNS,CHANNELS,defaults,migrate,config,settings,spend,dayCosts,offer,unitEconomics,qty,create,profit,round,used,buy,price,open,advance,ensureLive,packingDuration,pack,ship,close,next,upgrade,hire,validate};
});



/* Real-time adapter: foreground simulation only; no offline bursts. */
(function(){
let paused=false,last=performance.now(),sinceSave=0,observedGame=game,noticeTimer,context=null,warnedDay=null;
const strip=document.createElement('div');strip.id='live-strip';strip.innerHTML='<span class="live-dot"></span><strong id="live-state">Sklep zamknięty</strong><span id="arrival-clock"></span><strong id="day-clock"></strong><button id="pause-live" class="small" aria-pressed="false">Ⅱ Pauza</button>';
document.querySelector('.game-grid').before(strip);
const notice=document.createElement('button');notice.id='order-notice';notice.type='button';notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');document.body.append(notice);
notice.addEventListener('click',()=>{go('orders');notice.classList.remove('show');document.querySelector('.operations').scrollIntoView({behavior:'smooth',block:'start'});});
try{muted=localStorage.getItem('shopshift-sound')==='off';}catch{}
function soundLabel(){const b=$('sound');b.textContent='Dźwięk: '+(muted?'wył.':'wł.');b.setAttribute('aria-label',muted?'Włącz dźwięk':'Wyłącz dźwięk');}
function unlock(){if(muted)return;try{if(!context){const C=window.AudioContext||window.webkitAudioContext;if(C)context=new C();}if(context?.state==='suspended')context.resume().catch(()=>{});}catch{}}
window.LiveAudio={play(kind){if(muted||!context||context.state!=='running')return;const now=context.currentTime,notes=kind==='order'?[660,880,1100]:[720];notes.forEach((frequency,i)=>{const o=context.createOscillator(),g=context.createGain(),at=now+i*.13;o.type='sine';o.frequency.value=frequency;o.connect(g);g.connect(context.destination);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(kind==='order'?.12:.025,at+.015);g.gain.exponentialRampToValueAtTime(.001,at+.35);o.start(at);o.stop(at+.38);o.onended=()=>{o.disconnect();g.disconnect();};});}};
document.addEventListener('pointerdown',unlock,{capture:true});document.addEventListener('keydown',unlock,{capture:true});
document.addEventListener('click',e=>{if(e.target.closest('#sound')){try{localStorage.setItem('shopshift-sound',muted?'off':'on');}catch{}unlock();soundLabel();}});
$('pause-live').addEventListener('click',()=>{paused=!paused;last=performance.now();refreshLiveUI();});
function arrivalNotice(o){notice.innerHTML='<span class="notice-icon">▣</span><span><small>NOWE ZAMÓWIENIE</small><strong>#'+o.id+' · '+basketLabel(o)+'</strong><span>'+money(o.price)+' · '+E.qty(o)+' szt. · kliknij, aby zobaczyć</span></span>';notice.classList.remove('show');void notice.offsetWidth;notice.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.remove('show'),2200);LiveAudio.play('order');}
window.refreshLiveUI=function(){
window.refreshStockAlerts?.();
window.refreshCampaignPulse?.();
const seconds=Math.max(0,Math.ceil((E.DAY_DURATION-(game.dayElapsed||0))/1000));$('day-clock').hidden=game.phase!=='fulfill';$('day-clock').textContent='Koniec dnia za '+Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');$('day-clock').classList.toggle('deadline-soon',seconds<=30);
if(game.phase==='fulfill'&&seconds<=30&&warnedDay!==game.day){warnedDay=game.day;toast('Ostatnie 30 sekund! Wyślij paczki przed końcem dnia. Niewysłane zamówienia przejdą na jutro.');}

const active=game.phase==='fulfill',live=active?E.ensureLive(game):null,stopped=paused||document.hidden||$('dialog').open;
const incoming=game.deliveries.filter(d=>d.remainingMs!==undefined);strip.hidden=!active&&!incoming.length;document.querySelectorAll('[data-delivery-clock]').forEach((el,i)=>{if(incoming[i])el.textContent=Math.ceil(incoming[i].remainingMs/1000)+' s';});$('pause-live').setAttribute('aria-pressed',String(paused));$('pause-live').textContent=paused?'▶ Wznów':'Ⅱ Pauza';Warehouse.setPaused?.(active?stopped:(document.hidden||$('dialog').open));
if(!active){$('scene-pack').classList.remove('pack-ready');$('scene-pack').textContent='Do spakowania: '+game.orders.filter(o=>o.status==='new').length+' ↗';$('main-action').disabled=false;window.refreshJourney?.();window.refreshMobileControls?.();$('live-state').textContent=stopped?'Pauza':'Dostawy w drodze';$('arrival-clock').textContent=incoming.length?'Najbliższa dostawa za '+Math.ceil(Math.min(...incoming.map(d=>d.remainingMs))/1000)+' s':'';strip.classList.toggle('is-paused',stopped);return;}
const pending=E.hasDemand(game);const waiting=game.orders.filter(o=>o.status==='new').length,packed=game.orders.filter(o=>o.status==='packed').length;
$('live-state').textContent=stopped?'Pauza':pending?'Sklep działa na żywo':'Ruch dzisiejszej kampanii zakończony';strip.classList.toggle('is-paused',stopped);
$('arrival-clock').textContent=pending?(game.blockedVisits?'Przepustowość strony wyczerpana — wybierz większy pakiet w Rozwoju':!E.packingLeft(game)&&waiting?'Wydajność zespołu wykorzystana — nowe zakupy przyjmujemy, kolejka przejdzie na jutro':!game.stock.some(x=>x.qty>=(E.config(game).promo.type==='bundle'?4:1))?'Brak towaru do sprzedaży — zamów dostawę':'Ruch z marketingu i organika · zakupy zależą od cen i promocji'):'Dzisiejszy ruch zakończony';
if(incoming.length)$('arrival-clock').textContent+=' · dostawa za '+Math.ceil(Math.min(...incoming.map(d=>d.remainingMs))/1000)+' s';

const canPack=waiting>0&&E.packingLeft(game)>0,canShip=packed>=10;
document.querySelectorAll('[data-pack],#pack-five,#scene-pack').forEach(el=>{el.disabled=!canPack;});if($('ship'))$('ship').disabled=!canShip;
$('packing-status').textContent=(canPack?'Kliknij, aby spakować paczkę':!E.packingLeft(game)?'Wydajność na dziś wykorzystana':'Stanowisko gotowe')+' · '+game.packedToday+' spakowanych';
$('scene-status').textContent=packed?packed+' paczek gotowych · odbiór od 10':waiting?'Zamówienia czekają — spakuj paczkę':'Czekamy na kolejnego klienta';
$('scene-pack').textContent='Do spakowania: '+waiting+' ↗';$('scene-pack').classList.toggle('pack-ready',canPack);
$('mission-title').textContent=canShip?'Partia gotowa do wysyłki.':canPack?'Czas spakować paczkę!':'Zbieramy kolejną partię.';
$('mission-copy').textContent='Każde kliknięcie pakuje jedno zamówienie. Kurier odbiera od 10 paczek; mniejsze partie i zaległości przechodzą na kolejny dzień.';
$('main-action').textContent=canShip?'Wyślij '+packed+' paczek →':'Do wysyłki pozostało min. '+(10-packed)+' paczek';
$('main-action').disabled=!canShip;
window.refreshMobileControls?.();$('action-note').textContent='Zespół: '+(1+E.staffCount(game))+' osób · '+game.packedToday+'/'+E.dailyCapacity(game)+' spakowanych dziś · partia: '+packed+'/10 minimum';

};
setInterval(()=>{
const now=performance.now(),dt=Math.min(1000,Math.max(0,now-last));last=now;
if(observedGame!==game){observedGame=game;warnedDay=null;paused=false;sinceSave=0;notice.classList.remove('show');}
const active=(game.phase==='fulfill'||game.deliveries.length>0)&&!paused&&!document.hidden&&!$('dialog').open;
if(active){const events=E.tick(game,dt);sinceSave+=dt;if(events.length){if(events.some(e=>e.type!=='traffic')||(tab==='analytics'&&!document.activeElement?.matches('input,select')))render();for(const event of events){if(event.type==='day-ended'){notice.classList.remove('show');clearTimeout(noticeTimer);tab='finance';render();showReport();}else if(event.type==='order'&&game.phase==='fulfill')arrivalNotice(event.order);else if(event.type!=='traffic'){Warehouse.pulse();if(event.type==='delivery')toast('Dostawa dotarła: '+event.delivery.qty+' × '+E.PRODUCTS[event.delivery.index].name+'.');}}save();sinceSave=0;}else if(sinceSave>=2000){save();sinceSave=0;}}
refreshLiveUI();
},100);
document.addEventListener('visibilitychange',()=>{last=performance.now();save();refreshLiveUI();});
window.addEventListener('pagehide',()=>{save();});
soundLabel();refreshLiveUI();
})();

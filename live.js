/* Real-time adapter: foreground simulation only; no offline bursts. */
(function(){
let paused=false,last=performance.now(),sinceSave=0,observedGame=game,noticeTimer,context=null;
const strip=document.createElement('div');strip.id='live-strip';strip.innerHTML='<span class="live-dot"></span><strong id="live-state">Sklep zamknięty</strong><span id="arrival-clock"></span><button id="pause-live" class="small" aria-pressed="false">Ⅱ Pauza</button>';
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
function arrivalNotice(o){notice.innerHTML='<span class="notice-icon">▣</span><span><small>NOWE ZAMÓWIENIE</small><strong>#'+o.id+' · '+E.PRODUCTS[o.index].name+'</strong><span>'+money(o.price)+' · '+E.qty(o)+' szt. · kliknij, aby zobaczyć</span></span>';notice.classList.remove('show');void notice.offsetWidth;notice.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.remove('show'),8000);LiveAudio.play('order');}
window.refreshLiveUI=function(){
window.refreshStockAlerts?.();
window.refreshCampaignPulse?.();
const active=game.phase==='fulfill',live=active?E.ensureLive(game):null,stopped=paused||document.hidden||$('dialog').open;
const incoming=game.deliveries.filter(d=>d.remainingMs!==undefined);strip.hidden=!active&&!incoming.length;document.querySelectorAll('[data-delivery-clock]').forEach((el,i)=>{if(incoming[i])el.textContent=Math.ceil(incoming[i].remainingMs/1000)+' s';});$('pause-live').setAttribute('aria-pressed',String(paused));$('pause-live').textContent=paused?'▶ Wznów':'Ⅱ Pauza';Warehouse.setPaused?.(active?stopped:(document.hidden||$('dialog').open));
if(!active){$('main-action').disabled=false;window.refreshJourney?.();window.refreshMobileControls?.();$('live-state').textContent=stopped?'Pauza':'Dostawy w drodze';$('arrival-clock').textContent=incoming.length?'Najbliższa dostawa za '+Math.ceil(Math.min(...incoming.map(d=>d.remainingMs))/1000)+' s':'';strip.classList.toggle('is-paused',stopped);return;}
const pending=E.hasDemand(game);const waiting=game.orders.filter(o=>o.status==='new').length,packed=game.orders.filter(o=>o.status==='packed').length;
$('live-state').textContent=stopped?'Pauza':pending?'Sklep działa na żywo':'Ruch dzisiejszej kampanii zakończony';strip.classList.toggle('is-paused',stopped);
$('arrival-clock').textContent=live.queue.length?'Nowe zamówienie za około '+Math.ceil(live.nextIn/1000)+' s · kolejne odstępy 10–50 s':pending?'Trwa napływ odwiedzających · '+Math.ceil((game.traffic.duration-game.traffic.elapsed)/1000)+' s kampanii':'Dzisiejszy ruch zakończony';
if(incoming.length)$('arrival-clock').textContent+=' · dostawa za '+Math.ceil(Math.min(...incoming.map(d=>d.remainingMs))/1000)+' s';
const job=live.job&&game.orders.find(o=>o.id===live.job.id&&o.status==='new');
const progress=job?live.job.elapsed/E.packingDuration(game):0;
const operation=job?(progress<.32?'Idzie po produkt':progress<.52?'Przenosi produkt':progress<.86?'Pakuje zamówienie':'Odnosi paczkę'):'Przygotowuje stanowisko';
$('packing-status').textContent=stopped?'Praca wstrzymana':operation+(job?' #'+job.id:'')+' · '+game.packedToday+' spakowanych';
$('scene-status').textContent=packed?packed+' paczek gotowych dla kuriera':job?operation:pending?'Czekamy na kolejnego klienta':'Realizacja zamówień zakończona';
$('mission-title').textContent=packed?'Paczki gotowe do drogi.':waiting?'Magazyn pracuje.':pending?'Sklep jest otwarty.':'Dzisiejszy ruch obsłużony.';
$('mission-copy').textContent=packed?'Postać sama kompletuje i pakuje kolejne zamówienia. Odbierz gotowe paczki przyciskiem wysyłki.':waiting?'Zobacz, jak produkt wędruje z regału do paczki. Pakowanie odbywa się automatycznie; możesz też pomóc.':pending?'Sesje napływają na żywo. Cena, promocja i źródło ruchu decydują o zakupie. Zamówienia z kolejki pojawiają się co 10–50 sekund; brak konwersji wydłuża oczekiwanie.':'Możesz teraz zamknąć dzień i przejrzeć zysk oraz koszty.';
$('main-action').textContent=packed?'Wyślij '+packed+' paczek →':waiting?'Trwa automatyczne pakowanie…':pending?'Czekamy na zamówienie…':'Podsumuj dzień →';
$('main-action').disabled=!packed&&(waiting>0||pending);window.refreshMobileControls?.();$('action-note').textContent='Automatyczne pakowanie: '+(game.worker?'9':'16')+' s / paczkę · wysyłka na Twoje polecenie';
};
setInterval(()=>{
const now=performance.now(),dt=Math.min(1000,Math.max(0,now-last));last=now;
if(observedGame!==game){observedGame=game;paused=false;sinceSave=0;notice.classList.remove('show');}
const active=(game.phase==='fulfill'||game.deliveries.length>0)&&!paused&&!document.hidden&&!$('dialog').open;
if(active){const events=E.advance(game,dt);sinceSave+=dt;if(events.length){if(events.some(e=>e.type!=='traffic')||(tab==='analytics'&&!document.activeElement?.matches('input,select')))render();for(const event of events){if(event.type==='order')arrivalNotice(event.order);else if(event.type!=='traffic'){Warehouse.pulse();if(event.type==='delivery')toast('Dostawa dotarła: '+event.delivery.qty+' × '+E.PRODUCTS[event.delivery.index].name+'.');}}save();sinceSave=0;}else if(sinceSave>=2000){save();sinceSave=0;}}
refreshLiveUI();
},100);
document.addEventListener('visibilitychange',()=>{last=performance.now();save();refreshLiveUI();});
window.addEventListener('pagehide',()=>{save();});
soundLabel();refreshLiveUI();
})();

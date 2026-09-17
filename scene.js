/* Animated game scene. Artwork is a backdrop; people, parcels and stock indicators read live state. */
(function(){const canvas=document.getElementById('scene'),c=canvas.getContext('2d');canvas.width=1680;canvas.height=940;let state=null,paused=false,last=0,time=0,packUntil=0,flashUntil=0;const bg=new Image();bg.src='assets/command-warehouse.jpg';
function rect(x,y,w,h,r,color){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
function parcel(x,y,k=1){c.save();c.translate(x,y);c.scale(k,k);c.fillStyle='#0005';c.beginPath();c.ellipse(0,9,29,10,0,0,Math.PI*2);c.fill();c.fillStyle='#bb8958';c.beginPath();c.moveTo(-24,-29);c.lineTo(2,-39);c.lineTo(28,-27);c.lineTo(2,-16);c.closePath();c.fill();c.fillStyle='#906340';c.beginPath();c.moveTo(-24,-29);c.lineTo(2,-16);c.lineTo(2,13);c.lineTo(-24,0);c.closePath();c.fill();c.fillStyle='#b47e4e';c.beginPath();c.moveTo(2,-16);c.lineTo(28,-27);c.lineTo(28,2);c.lineTo(2,13);c.closePath();c.fill();c.strokeStyle='#dec7a4';c.lineWidth=5;c.beginPath();c.moveTo(-10,-34);c.lineTo(16,-22);c.lineTo(16,7);c.stroke();rect(5,-11,10,8,1,'#eee3d2');c.restore();}
// Foot coordinates in the fixed 1680 x 940 scene. The desk and packing table
// are deliberately outside these floor corridors; never interpolate diagonally across them.
const route=[[505,405],[505,675],[1165,675],[1280,525],[1280,365],[1280,525],[1165,675],[505,675]];
const obstacles=[{x:610,y:335,w:525,h:295},{x:90,y:310,w:345,h:290},{x:1440,y:300,w:240,h:340}];
// Eight distinct contact/down/passing/up poses for both legs, paced by travelled distance.
const SPEED=126,RAMP=.35,DWELL=2.2;
const legs=route.map((a,i)=>{const b=route[(i+1)%route.length],distance=Math.hypot(b[0]-a[0],b[1]-a[1]);return{a,b,distance,duration:distance/SPEED+RAMP,cycles:Math.max(1,Math.round(distance/176))};});
const loopDuration=legs.reduce((n,l)=>n+l.duration+DWELL,0);
function routeAt(seconds,index=0){let clock=(seconds+index*5.13)%loopDuration;for(const l of legs){const {a,b,distance,duration}=l,dx=b[0]-a[0],dy=b[1]-a[1];if(clock<DWELL)return{x:a[0],y:a[1],dx,dy,moving:false,stride:0,phase:0};clock-=DWELL;if(clock<=duration){const elapsed=clock,remaining=duration-elapsed,d=elapsed<RAMP?SPEED*elapsed*elapsed/(2*RAMP):remaining<RAMP?distance-SPEED*remaining*remaining/(2*RAMP):SPEED*(elapsed-RAMP/2),f=Math.max(0,Math.min(1,d/distance));return{x:a[0]+dx*f,y:a[1]+dy*f,dx,dy,moving:true,stride:d,phase:f*l.cycles};}clock-=duration+0;}return{x:505,y:405,dx:0,dy:1,moving:false,phase:0};}
const atlas=new Image(),frames=[];atlas.src='assets/worker-walk-cycle.png';atlas.onload=()=>{const cw=atlas.width/4,ch=atlas.height/2;for(let i=0;i<8;i++)frames.push({x:(i%4)*cw,y:Math.floor(i/4)*ch,w:Math.min(cw+20,atlas.width-(i%4)*cw),h:ch});};
// Align the pelvis, not changing silhouette bounds: feet and body no longer jump horizontally.
const anchors=[203,216,214,205,201,214,210,205],ground=[478,478,478,478,478,478,478,478];
function worker(p,t){if(!frames.length)return;const walking=p.moving,pose=walking?Math.floor((p.phase%1)*8):6,frame=frames[pose],scale=(170+(p.y-405)*.045)/512;c.save();c.translate(p.x,p.y);c.fillStyle='#08090955';c.beginPath();c.ellipse(0,-1,23,7,0,0,Math.PI*2);c.fill();const mirror=p.dx<0||(Math.abs(p.dx)<1&&p.dy<0);c.scale(mirror?-1:1,1);c.drawImage(atlas,frame.x,frame.y,frame.w,frame.h,-anchors[pose]*scale,-ground[pose]*scale,frame.w*scale,frame.h*scale);c.restore();}
function draw(){const s=state;if(!s)return;c.clearRect(0,0,1680,940);if(bg.complete&&bg.naturalWidth)c.drawImage(bg,0,0,1680,940);else{c.fillStyle='#25252b';c.fillRect(0,0,1680,940);}
// Physical stock markers are proportional to available units, not a fabricated sale animation.
for(let rack=0;rack<3;rack++){const units=s.stock.filter((_,i)=>i%3===rack).reduce((n,x)=>n+x.qty,0),x=380+rack*330;rect(x,245,100,26,4,'#10141dde');c.fillStyle='#d7dbe2';c.font='12px Segoe UI';c.fillText('STAN: '+units+' szt.',x+8,263);}
const count=Shopshift.staffCount(s),t=time/1000,people=[];for(let i=0;i<count;i++){const p=routeAt(t,i);people.push(p);}people.sort((a,b)=>a.y-b.y).forEach((p,i)=>worker(p,t+i*.19));
const packed=s.orders.filter(o=>o.status==='packed').length;for(let i=0;i<Math.min(packed,18);i++)parcel(1220+(i%6)*38,620+Math.floor(i/6)*28, .85);if(packed){rect(1195,659,178,30,5,'#14171ee8');c.fillStyle='#e0bea1';c.font='bold 14px Segoe UI';c.fillText(packed+' PACZEK DO ODBIORU',1205,679);}
if(time<flashUntil){const alpha=Math.min(1,(flashUntil-time)/500);c.save();c.globalAlpha=alpha;rect(715,430-(1200-(flashUntil-time))*.025,166,39,7,'#192126ed');c.fillStyle='#edd9bc';c.font='bold 17px Segoe UI';c.fillText('✓ Paczka gotowa',730,456-(1200-(flashUntil-time))*.025);c.restore();}
// Warm light and a subtle vignette tie the illustrated scene to the HUD.
const shade=c.createLinearGradient(0,700,0,940);shade.addColorStop(0,'#080b1000');shade.addColorStop(1,'#080b10b0');c.fillStyle=shade;c.fillRect(0,700,1680,240);
}
function frame(now){if(now-last>33){if(!paused)time+=Math.min(100,now-last);last=now;draw();}requestAnimationFrame(frame);}requestAnimationFrame(frame);window.Warehouse={navigation:{routeAt,obstacles,route},update(s){state=s;},pulse(){},packPulse(){packUntil=time+900;flashUntil=time+1200;},setPaused(value){paused=value;}};
})();


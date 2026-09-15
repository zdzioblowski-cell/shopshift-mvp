/* Canvas renderer: original vector artwork, no external assets. */
(function(){
const canvas=document.getElementById('scene'),c=canvas.getContext('2d');let state=null,flash=0,last=0,visualTime=0,pausedVisual=false;
const P=(x,y,z=0)=>[480+(x-y)*.94,143+(x+y)*.44-z];
function poly(points,color,stroke){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.8;c.stroke();}}
function line(a,b,color,width=1){c.beginPath();c.moveTo(...a);c.lineTo(...b);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
function cube(x,y,z,w,d,h,top='#cacaca',left='#a5a5a5',right='#bababa'){
poly([P(x,y,z+h),P(x+w,y,z+h),P(x+w,y+d,z+h),P(x,y+d,z+h)],top);
poly([P(x,y+d,z),P(x,y+d,z+h),P(x+w,y+d,z+h),P(x+w,y+d,z)],left);
poly([P(x+w,y,z),P(x+w,y,z+h),P(x+w,y+d,z+h),P(x+w,y+d,z)],right);
}
function ellipse(x,y,z,rx,ry,col){const p=P(x,y,z);c.beginPath();c.ellipse(p[0],p[1],rx,ry,0,0,Math.PI*2);c.fillStyle=col;c.fill();}
function box(x,y,z=0,size=23){cube(x,y,z,size,size*.8,size*.75,'#cecece','#a4a4a4','#b5b5b5');poly([P(x+size*.4,y,z+size*.75+.3),P(x+size*.57,y,z+size*.75+.3),P(x+size*.57,y+size*.8,z+size*.75+.3),P(x+size*.4,y+size*.8,z+size*.75+.3)],'#e2e2e2');cube(x+size*.72,y+size*.81,z+size*.3,6,0,7,'#f5f5f5','#f5f5f5','#f5f5f5');}
function bottle(x,y,z,color,h=21){cube(x,y,z,9,9,h,color,color,color);cube(x+1,y+1,z+h,7,7,4,'#fdfdfd','#cacaca','#e2e2e2');cube(x+1,y+9.1,z+5,7,0,7,'#ededed','#ededed','#ededed');}
function plant(x,y){ellipse(x+12,y+12,0,23,9,'#6c6c6c1c');cube(x,y,0,22,22,23,'#e5e5e5','#bdbdbd','#cfcfcf');for(let i=0;i<6;i++){let p=P(x+11,y+11,25);c.save();c.translate(p[0],p[1]);c.rotate((i-2.5)*.42);c.beginPath();c.ellipse(0,-14-i%2*6,7,25,0,0,Math.PI*2);c.fillStyle=['#737373','#848484','#999999'][i%3];c.fill();c.restore();}}
function mix(a,b,f){return a+(b-a)*Math.max(0,Math.min(1,f));}
function route(points,t){const part=Math.min(points.length-2,Math.floor(t*(points.length-1))),f=t*(points.length-1)-part;return {x:mix(points[part][0],points[part+1][0],f),y:mix(points[part][1],points[part+1][1],f)};}
function actorPose(s,time){
const live=s.live,job=s.phase==='fulfill'&&live?.job&&s.orders.find(o=>o.id===live.job.id&&o.status==='new');
if(job){const f=Math.min(1,live.job.elapsed/(s.worker?9000:16000));
if(f<.25)return {...route([[282,268],[365,268],[365,90]],f/.25),mode:'walk'};
if(f<.32)return {x:365,y:90,mode:'pick'};
if(f<.52)return {...route([[365,90],[365,268],[282,268]],(f-.32)/.20),mode:'carryProduct'};
if(f<.86)return {x:282,y:268,mode:'pack'};
return {...route([[282,268],[395,268]],(f-.86)/.14),mode:'carryBox'};
}
const f=(time%18)/18;
if(f<.2)return {...route([[395,268],[282,268]],f/.2),mode:'walk'};
if(f<.65)return {x:282,y:268,mode:'prepare'};
if(f<.85)return {...route([[282,268],[395,268]],(f-.65)/.2),mode:'walk'};
return {x:395,y:268,mode:'prepare'};
}
function person(x,y,t,col='#8c8c8c',mode='walk'){
const walking=['walk','carryProduct','carryBox'].includes(mode),busy=['pack','prepare','pick'].includes(mode);
ellipse(x,y,0,18,7,'#55555525');const p=P(x,y,0),walk=walking?Math.sin(t)*6:Math.sin(t*.5)*.6,bob=walking?Math.abs(Math.sin(t))*.9:0;
c.save();c.translate(p[0],p[1]);c.scale(1.15,1.15);c.translate(-p[0],-p[1]);
c.fillStyle='#39393f';c.fillRect(p[0]-8,p[1]-24,6,23+walk);c.fillRect(p[0]+2,p[1]-24,6,23-walk);
c.fillStyle=col;c.beginPath();c.roundRect(p[0]-12,p[1]-50-bob,24,31,6);c.fill();c.fillStyle='#c1c1c1';c.beginPath();c.arc(p[0],p[1]-59-bob,11,0,Math.PI*2);c.fill();c.fillStyle='#39393f';c.beginPath();c.ellipse(p[0]-1,p[1]-65-bob,11,7,-.2,0,Math.PI*2);c.fill();
c.strokeStyle='#c1c1c1';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(p[0]-11,p[1]-43);c.lineTo(p[0]-(busy?7:17),p[1]-(busy?40+Math.sin(t*1.4)*7:mode==='carryBox'?35:27-walk));c.moveTo(p[0]+11,p[1]-43);c.lineTo(p[0]+(busy?7:16),p[1]-(busy?40-Math.sin(t*1.4)*7:mode==='carryBox'?35:28+walk));c.stroke();c.restore();
if(mode==='carryProduct')bottle(x+3,y+8,28,'#d9576b',15);
if(mode==='carryBox')box(x-7,y+5,22,22);
if(mode==='pack'){const q=P(284,223,64);c.strokeStyle='#e44a61';c.lineWidth=3;c.beginPath();c.moveTo(q[0]-9,q[1]);c.lineTo(q[0]+9*Math.sin(t),q[1]-4);c.stroke();}
}
function shelf(x,y,stock,color){for(const dx of [0,95])for(const dy of [0,31])cube(x+dx,y+dy,0,5,5,114,'#7d7d7d','#767676','#939393');for(const z of [7,43,79,111]){cube(x-2,y-2,z,106,42,5,'#c6c6c6','#9c9c9c','#afafaf');if(z<100){for(let j=0;j<Math.min(7,Math.ceil(stock/3));j++)bottle(x+6+j*12,y+12,z+5,color,14+(j%2)*3);}}}
function desk(x,y){for(const dx of [5,98])for(const dy of [5,46])cube(x+dx,y+dy,0,5,5,42,'#b3b3b3','#9d9d9d','#a8a8a8');cube(x,y,42,111,61,7,'#dcdcdc','#bdbdbd','#cccccc');cube(x+15,y+9,49,40,6,31,'#676767','#5e5e5e','#4f4f4f');cube(x+19,y+15.2,54,32,0,21,'#c5c5c5','#c5c5c5','#c5c5c5');cube(x+21,y+25,50,34,14,2,'#d0d0d0','#bfbfbf','#c9c9c9');cube(x+76,y+27,49,19,26,1,'#fbfbfb','#fbfbfb','#fbfbfb');bottle(x+91,y+8,49,'#c0c0c0',10);}
function draw(t){if(!state)return;const s=state;const time=t/1000;c.clearRect(0,0,1200,610);const roomWidth=480+s.level*55,roomDepth=320+s.level*22;c.save();if(s.level)c.transform(1-s.level*.06,0,0,1-s.level*.06,s.level*14,s.level*15);
// Soft floor shadow and raised foundation.
poly([P(-13,-4,-17),P(493,-4,-17),P(493,334,-17),P(-13,334,-17)],'#6a6a6a1b');
cube(0,0,-12,roomWidth,roomDepth,12,'#dfdfdf','#c5c5c5','#d0d0d0');
for(let x=0;x<roomWidth;x+=48)for(let y=0;y<roomDepth;y+=40)poly([P(x,y),P(Math.min(x+48,roomWidth),y),P(Math.min(x+48,roomWidth),Math.min(y+40,roomDepth)),P(x,Math.min(y+40,roomDepth))],((x/48+y/40)%2===0?'#e4e4e4':'#e1e1e1'),'#d5d5d5');
// Cutaway walls.
cube(-7,-7,0,roomWidth+7,7,128,'#f0f0f0','#dedede','#d3d3d3');
cube(-7,0,0,7,roomDepth,128,'#f0f0f0','#d5d5d5','#e4e4e4');
line(P(0,0,7),P(roomWidth,0,7),'#c1c1c1',4);line(P(0,0,7),P(0,roomDepth,7),'#c1c1c1',4);
// Window on office wall.
poly([P(0,65,105),P(0,170,105),P(0,170,45),P(0,65,45)],'#fcfcfc');poly([P(.5,71,100),P(.5,164,100),P(.5,164,50),P(.5,71,50)],'#d0d0d0');line(P(1,118,100),P(1,118,50),'#fefefe',4);line(P(1,71,76),P(1,164,76),'#fefefe',3);
// Brand sign.
const sign=P(180,0,88);c.save();c.translate(...sign);c.transform(1,.47,0,1,0,0);c.fillStyle='#eeeeee';c.fillRect(-7,-22,113,35);c.fillStyle='#6f6f6f';c.font='bold 14px Segoe UI';c.fillText('SHOPSHIFT',0,0);c.restore();
plant(25,22);shelf(255,13,s.stock.filter((_,i)=>i%2===0).reduce((n,x)=>n+x.qty,0),'#a4a4a4');shelf(365,13,s.stock.filter((_,i)=>i%2===1).reduce((n,x)=>n+x.qty,0),'#9d9d9d');
if(s.level>0)shelf(420,87,s.stock[4].qty+s.stock[5].qty,'#b8b8b8');
// Office rug, desk, swivel chair.
poly([P(27,168,.3),P(172,168,.3),P(172,279,.3),P(27,279,.3)],'#bebebe');
desk(27,175);cube(70,256,24,29,28,6,'#959595','#7c7c7c','#898989');cube(70,280,28,29,5,27,'#a3a3a3','#8a8a8a','#9b9b9b');cube(81,265,0,6,5,25,'#727272','#727272','#727272');
plant(25,294);
// Packing station, tape and label printer.
for(const dx of [0,110])for(const dy of [0,52])cube(230+dx,182+dy,0,6,6,40,'#b0b0b0','#9e9e9e','#a7a7a7');cube(226,180,40,122,65,9,'#d9d9d9','#afafaf','#c5c5c5');cube(237,186,49,26,23,12,'#efefef','#d4d4d4','#e2e2e2');cube(242,209,51,15,14,1,'#fdfdfd','#fdfdfd','#fdfdfd');box(280,197,49,28);ellipse(320,213,50,7,4,'#888888');
const queue=s.orders.filter(o=>o.status==='packed').length;for(let i=0;i<Math.min(queue,9);i++)box(380+(i%3)*28,223+Math.floor(i/3)*23,0,24);
const units=s.stock.reduce((a,b)=>a+b.qty,0);if(units>20)box(195,55,0,28);if(units>50)box(199,88,0,28);if(units>90)box(195,55,21,26);
const pose=actorPose(s,time);person(pose.x,pose.y,time*7,'#d45e6a',pose.mode);if(s.worker){const helper=route([[130,145],[215,140],[215,280],[130,285],[130,145]],(time%26)/26);person(helper.x,helper.y,time*6,'#707079','carryBox');}
// Delivery van on the front apron.
poly([P(roomWidth+15,150,-10),P(roomWidth+180,150,-10),P(roomWidth+180,283,-10),P(roomWidth+15,283,-10)],'#dddddd');const vx=roomWidth+40+(flash>0?Math.sin(time*7)*2:0);cube(vx,192,15,90,57,48,'#e05d6b','#af3445','#cb4254');cube(vx+90,192,15,38,57,32,'#f1f1f1','#d6d6d6','#e6e6e6');cube(vx+90,193,47,25,54,18,'#efefef','#d9d9d9','#e5e5e5');poly([P(vx+115,194,62),P(vx+128,194,47),P(vx+128,244,47),P(vx+115,244,62)],'#9a9a9a');for(const dx of [18,107]){const p=P(vx+dx,251,14);c.fillStyle='#5a5a5a';c.beginPath();c.ellipse(p[0],p[1],10,13,-.35,0,Math.PI*2);c.fill();c.fillStyle='#a8a8a8';c.beginPath();c.ellipse(p[0],p[1],4,6,-.35,0,Math.PI*2);c.fill();}const logo=P(vx+23,250,39);c.save();c.translate(...logo);c.transform(1,.47,0,1,0,0);c.fillStyle='#f1f1f1';c.font='bold 11px Segoe UI';c.fillText('SHIFT →',0,0);c.restore();
if(s.level===2){shelf(470,170,s.stock[0].qty+s.stock[2].qty,'#b6b6b6');box(425,285,0,25);box(455,285,0,25);cube(170,106,0,45,23,35,'#b4b4b4','#8d8d8d','#a3a3a3');}
if(flash>0){flash--;c.save();c.globalAlpha=Math.min(1,flash/25);c.fillStyle='#5b5b5b';c.font='bold 17px Segoe UI';const q=P(325,235,115+(80-flash)*.3);c.fillText('✓ Gotowe!',...q);c.restore();}
c.restore();
}
function frame(t){if(t-last>30){if(!pausedVisual)visualTime+=Math.min(100,t-last);draw(visualTime);last=t;}requestAnimationFrame(frame);}requestAnimationFrame(frame);
window.Warehouse={update(s){state=s;},pulse(){flash=70;},setPaused(value){pausedVisual=value;}};
})();



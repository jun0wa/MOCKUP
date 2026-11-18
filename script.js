/* cintas 3D */
document.querySelectorAll(".scene").forEach(function(sc){
  var fs=parseFloat(getComputedStyle(sc).fontSize),n=8;
  [[-28,-22,16,"normal","#fff",0,1],[24,18,24,"reverse","transparent",1,1.14],[72,-8,34,"normal","#4a4a4a",0,1.28]].forEach(function(c){
    var t=document.createElement("div");t.className="tilt";t.style.transform="rotateX("+c[0]+"deg) rotateZ("+c[1]+"deg)";
    var y=document.createElement("div");y.className="cyl";y.style.animationDuration=c[2]+"s";y.style.animationDirection=c[3];
    var r=c[6]*n*7.6*fs/(2*Math.PI);
    for(var i=0;i<n;i++){var s=document.createElement("span");s.textContent="COMING SOON";s.style.color=c[4];
      if(c[5]){s.style.webkitTextStroke="1px #8b8b8b"}
      s.style.transform="rotateY("+(i*360/n)+"deg) translateZ("+r+"px)";y.appendChild(s)}
    t.appendChild(y);sc.appendChild(t)});
});
/* ticker */
var w=["novedad","género","estado de ánimo","popularidad","zona de confort","descubrir"],h="";
for(var k=0;k<4;k++)w.forEach(function(x,i){h+=(i%2?"<b>"+x+"</b>":"<em>"+x+"</em>")});
document.getElementById("tk").innerHTML=h+h;
/* demo */
var G=["Indie","Hip hop","Electrónica","Salsa","Rock","Jazz"],AR={"Luna Cobre":0,"Mc Alba":1,"Kira Volt":2,"Los Mareados":3,"Cuervos del Sur":4,"Trío Marea":5};
var sel={Indie:1,"Hip hop":1},art={},gf=-1,lv=3,saved={},step=0,TT=["Gustos","Parámetros","Descubrimientos","Guardadas"];
var S="Neón en la lluvia~Luna Cobre~0~.1|Cartas sin sello~Ágata Verde~0~.18|Sombra de barrio~Dos Veces Rey~1~.12|Rima de balcón~Mc Alba~1~.2|Pulso 128~Nube Eléctrica~2~.55|Vidrio líquido~Kira Volt~2~.7|Sábado de pregón~Los Mareados~3~.62|Cobre y clave~Orquesta Lila~3~.78|Ruta 40~Cuervos del Sur~4~.5|Tormenta lenta~Hierro Dulce~4~.68|Humo azul a las tres~Trío Marea~5~.75|Escala menor~Elena Oro~5~.88|Aurora de neón~Pez Radio~0~.38|Verso a medianoche~Oso Lírico~1~.42|Latido de sala~Fase Cero~2~.9|Son de la tarde~Casa Canela~3~.95|Cuerdas de polvo~Los Faroles~4~.85|Trompeta de lluvia~Quinteto Sal~5~.58|Mapa de ecos~Lámpara~0~.48|Calle y cadencia~Sirena Norte~1~.8";
var D=S.split("|").map(function(r){r=r.split("~");return{t:r[0],a:r[1],g:+r[2],d:+r[3]}});
var C=[.15,.35,.5,.65,.85],L=["muy cercana","cercana","intermedia","lejana","muy lejana"];
function conf(g){return sel[G[g]]||Object.keys(art).some(function(a){return AR[a]===g})}
function dist(s){return conf(s.g)?s.d*.5:s.d}
function tag(d){return d<.3?"cercana":d<.6?"intermedia":"lejana"}
function chip(t,on,fn){var b=document.createElement("button");b.className="chip"+(on?" on":"");b.textContent=t;b.onclick=fn;return b}
function row(l,k){var d=document.createElement("div"),c=document.createElement("div");d.innerHTML='<span class="lbl">'+l+"</span>";c.className="chips";c.style.margin="10px 0 18px";k.forEach(function(x){c.appendChild(x)});d.appendChild(c);return d}
function song(o,i){var s=o.s,e=document.createElement("div");e.className="song";e.style.animationDelay=i*50+"ms";
  e.innerHTML='<div class="cov" style="background:linear-gradient(135deg,hsl('+(s.g*55+20)+',8%,'+(30+i*4)+'%),#111)"></div><div><b>'+s.t+"</b><small>"+s.a+", "+G[s.g]+'</small></div><span class="tag">'+tag(o.d)+" "+o.d.toFixed(2).replace(".",",")+"</span>";
  var b=document.createElement("button");b.className="sv"+(saved[s.t]?" on":"");b.textContent=saved[s.t]?"Guardada":"Guardar";
  b.onclick=function(){saved[s.t]=!saved[s.t];if(step===3){render()}else{b.classList.toggle("on",saved[s.t]);b.textContent=saved[s.t]?"Guardada":"Guardar"}};
  e.appendChild(b);return e}
function ranked(){var c=C[lv-1];return D.filter(function(s){return gf<0||s.g===gf}).map(function(s){return{s:s,d:dist(s)}}).sort(function(a,b){return Math.abs(a.d-c)-Math.abs(b.d-c)}).slice(0,10)}
function render(){
  st.innerHTML="";TT.forEach(function(t,i){var b=document.createElement("button");b.className="tab"+(i===step?" on":"");b.textContent=(i+1)+" "+t;b.onclick=function(){step=i;render()};st.appendChild(b)});
  scr.innerHTML="";scr.scrollTop=0;
  if(step===0){scr.append(row("Géneros que escuchas",G.map(function(g){return chip(g,sel[g],function(){sel[g]?delete sel[g]:sel[g]=1;render()})})),
    row("Artistas que te gustan",Object.keys(AR).map(function(a){return chip(a,art[a],function(){art[a]?delete art[a]:art[a]=1;render()})})));
    var h=document.createElement("small");h.textContent="Sin registro ni cuenta: eliges y sigues.";scr.appendChild(h)}
  if(step===1){var w=document.createElement("div");w.innerHTML='<span class="lbl">Nivel de novedad</span><div class="lv"><strong>'+lv+"</strong><span>"+L[lv-1]+'</span></div><input type="range" min="1" max="5" value="'+lv+'" aria-label="Nivel de novedad">';
    w.querySelector("input").oninput=function(e){lv=+e.target.value;w.querySelector("strong").textContent=lv;w.querySelector(".lv span").textContent=L[lv-1]};
    w.style.marginBottom="22px";scr.append(w,row("Género a explorar",["Todos"].concat(G).map(function(g,i){return chip(g,gf===i-1,function(){gf=i-1;render()})})))}
  if(step===2){var l=ranked(),h2=document.createElement("small");h2.textContent=l.length+" descubrimientos, nivel de novedad "+lv;scr.appendChild(h2);l.forEach(function(o,i){scr.appendChild(song(o,i))})}
  if(step===3){var v=D.filter(function(s){return saved[s.t]}).map(function(s){return{s:s,d:dist(s)}}),h3=document.createElement("small");
    h3.textContent=v.length?"Guardadas en tu navegador: "+v.length:"Aún no guardas nada. Ve a Descubrimientos y toca Guardar.";scr.appendChild(h3);v.forEach(function(o,i){scr.appendChild(song(o,i))})}
  bk.disabled=step===0;nx.style.visibility=step===3?"hidden":"visible";
}
bk.onclick=function(){step--;render()};nx.onclick=function(){step++;render()};render();
/* slides: contador, revelado y teclado */
var S2=[].slice.call(document.querySelectorAll("section")),cur=0;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");cur=S2.indexOf(e.target);pg.textContent=(cur+1)+" / "+S2.length}})},{threshold:.45});
S2.forEach(function(s){io.observe(s)});
document.addEventListener("keydown",function(e){var d={ArrowDown:1,PageDown:1,ArrowRight:1,ArrowUp:-1,PageUp:-1,ArrowLeft:-1}[e.key];
  if(!d||document.activeElement.tagName==="INPUT")return;
  var n=Math.max(0,Math.min(S2.length-1,cur+d));S2[n].scrollIntoView({behavior:"smooth"});e.preventDefault()});

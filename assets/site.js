
(()=>{
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nt=n=>'NT$'+Math.round(n).toLocaleString('en-US');

/* ---------- dial / nav ---------- */
const needle=$('#needle'), links=$$('#dialList a');
function tune(){
  if(!needle)return;
  const dial=needle.parentElement.getBoundingClientRect();
  let i=links.findIndex(a=>a.getAttribute('aria-current')==='page'); if(i<0)i=0;
  if(getComputedStyle($('#dialList')).display!=='none'){const r=links[i].getBoundingClientRect();needle.style.left=(r.left+r.width/2-dial.left)+'px'}
  else needle.style.left=(i/(links.length-1)*(dial.width-2))+'px';
}
addEventListener('resize',tune);
const drawer=$('#drawer'),menuBtn=$('#menuBtn');
menuBtn.onclick=()=>{drawer.hidden=false;menuBtn.setAttribute('aria-expanded','true')};
const closeDrawer=()=>{drawer.hidden=true;menuBtn.setAttribute('aria-expanded','false')};
$('#drawerClose').onclick=closeDrawer; drawer.querySelectorAll('a').forEach(a=>a.onclick=closeDrawer);

/* ---------- dialogs ---------- */
$$('dialog').forEach(d=>{
  d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-close]'))d.close()});
});

/* ---------- YouTube: embed when reachable, else link out ---------- */
let canEmbed=false;
const vids=[];
function mountVid(a){
  const id=a.dataset.yt, poster=a.dataset.poster;
  a.innerHTML=`<img src="${poster}" alt="" loading="lazy"><span class="play"><span></span></span><span class="out">在 YouTube 開啟 ↗</span>`;
  vids.push(a);
  a.addEventListener('click',e=>{
    if(!canEmbed)return; // real link opens YouTube
    e.preventDefault();
    a.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="YouTube 影片" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  });
}
function enableEmbeds(){
  canEmbed=true;
  vids.forEach(a=>{
    const img=a.querySelector('img'); if(img){img.src=`https://i.ytimg.com/vi/${a.dataset.yt}/hqdefault.jpg`}
    const o=a.querySelector('.out'); if(o)o.hidden=true;
  });
  const hv=$('#heroVideo');
  if(hv&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    hv.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/VDBO9sTBm-Y?autoplay=1&mute=1&loop=1&playlist=VDBO9sTBm-Y&controls=0&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1" title="臺中放送局空拍" allow="autoplay; encrypted-media" tabindex="-1"></iframe>';
    hv.querySelector('iframe').addEventListener('load',()=>setTimeout(()=>hv.classList.add('ready'),1500));
  }
}

/* ---------- SPOTS ---------- */
const spots=[
 ['電台街壹號','初遇電波處','全台灣唯一以「電台街」命名的街道，且整條街只有「1號」這一個門牌號碼。這是 1935 年台灣中部廣播文明啟蒙的起點，在此打卡象徵拿到穿越百年時空的電波通行證，具備不可替代的文史坐標意義。'],
 ['昭和之扉','莊園鐵花門','融合和洋折衷風格的古典鑄鐵雕花大門，繁複對稱的鐵花線條自帶昭和摩登的歐洲莊園儀式感。這裡是昔日放送官員與文化名流進出的門戶，在此拍照能捕捉推開時空之門、步入歷史迴廊的起點意象。'],
 ['水波鏡影','日池倒映樓','放送局庭園前方的圓形日池，是園區內拍攝建築倒影的絕佳秘境。平靜的水面能完整鏡射出折衷主義洋樓的圓弧塔樓、羅馬拱圈與天空雲彩，捕捉建築虛實相映的靈動之美。'],
 ['暖陽斜憩','菱紋洋樓壁','此處集中了台中放送局最精華的建築語彙：二樓陽台洗石子女兒牆上的幾何裝飾、一樓對稱的圓拱木窗，以及粗獷質感的鵝黃色洗石子外牆。在此打卡能拍出宛如身處 1930 年代古典洋館的精緻立面全貌。'],
 ['歲月刻痕','大正石燈籠','靜矗於庭園綠蔭中的古樸日式石燈籠，柱身銘刻著「大正七年」與「昭和五年」相差 12 年的神秘紀年，是放送局內保存最完整、最耐人尋味的日治時期文史彩蛋。在此取景能呈現和風古意與歷史沉積感。'],
 ['時光哨所','老派衛哨亭','全台歷史建築中極為少見的洗石子單人衛哨亭，見證了早年廣播電台作為重要國家設施的管制歷史。小巧方正的建築構造與高台階梯，是全區拍出「老派職人感」與「私房秘密基地感」的最佳取景點。'],
 ['森徑微光','隱蔽防空洞','二戰時期留存至今的水泥圓拱防空洞，外覆土丘並長滿茂密樹根與綠植。這是園區內最具神秘感與時空張力的遺構，打卡能展現穿梭於戰爭歲月與自然共生之間的荒野秘境感。'],
 ['窗景如琴','雙聯木拱櫺','台中放送局擁有傲視全台歷史建築的「94 扇窗」，其中這組雙聯大圓拱木窗更是室內精華。深褐色木質拱櫺如畫框般將窗外翠綠樹冠完整收攬入室，是感受老建築呼吸感與靜態採光的必訪點。'],
 ['迴廊光影','轉角螺旋階','通往二樓的梯間擁有磨石子弧形階梯、溫潤木扶手以及挑高立面上的圓拱採光長窗。窗外光線灑落時會在樓梯間形成流動的幾何陰影，是展現老建築立體空間感與動態透視的核心拍照點。'],
 ['遠眺浮雲','城垛望樓台','二樓戶外陽台結合了圓塔造型、宛如歐式城堡的頂部城垛，以及洗石子雕花圍欄。站在這裡可以俯瞰電台街與水源地的綠林景致，是全館視野最開闊、最能感受藍天與歷史建築頂部細節的制高打卡點。']
];
const spotImg=(i,s)=>`<img src="assets/img/spot-${String(i+1).padStart(2,'0')}.jpg" alt="${esc(s[0]+'：'+s[1])}示範打卡照" loading="lazy">`;
if($('#spotGrid')){
$('#spotGrid').innerHTML=spots.map((s,i)=>`<button class="spot" data-i="${i}" aria-haspopup="dialog"><div class="ph">${spotImg(i,s)}<span class="no">${String(i+1).padStart(2,'0')}</span></div><h3>${esc(s[0])}：${esc(s[1])}</h3></button>`).join('');
$('#spotGrid').addEventListener('click',e=>{const b=e.target.closest('.spot');if(!b)return;openSpot(+b.dataset.i)});
function openSpot(i){
  const s=spots[i];
  $('#spotBody').innerHTML=`<div class="ph">${spotImg(i,s)}<div class="thirds off" id="thirds"></div></div>
  <div class="txt"><p class="eyebrow"><span class="lamp"></span>打卡點 ${String(i+1).padStart(2,'0')} / 10</p>
  <h3 id="spotTitle">${esc(s[0])}：<br>${esc(s[1])}</h3>
  <div class="guide"><div><span class="k">特色與<br>必拍價值</span><p>${esc(s[2])}</p></div></div>
  <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn small" type="button" id="thirdsBtn" aria-pressed="false">顯示三分構圖線</button>
  <button class="btn small" type="button" id="nextSpot">下一個打卡點 →</button></div></div>`;
  $('#thirdsBtn').onclick=e=>{const on=$('#thirds').classList.toggle('off');e.target.setAttribute('aria-pressed',String(!on));e.target.textContent=on?'顯示三分構圖線':'隱藏構圖線'};
  $('#nextSpot').onclick=()=>openSpot((i+1)%spots.length);
  const d=$('#spotDlg'); if(!d.open)d.showModal(); d.scrollTop=0;
}
}
/* ---------- HISTORY ---------- */
const tl=[
 ['日治時期',[['1935','5 月 11 日 台中放送局正式啟用',1],['1940','推出多語系播音'],['1942','10 月開始實施「二重放送」']]],
 ['戰後・中廣時期',[['1945','更名為臺灣廣播電台臺中台'],['1946','改組為中國廣播股份有限公司'],['1947','移交臺灣郵電管理局'],['1948','辦理廣播無線電收音機登記'],['1949','移交中國廣播公司'],['1950','辦理廣播無線電收聽執照'],['1965','開辦廣告託播業務'],['1968','更名中廣臺灣台'],['1987','調幅立體廣播']]],
 ['歷史建築時期',[['1998','改為公務局拆除大隊工作室'],['1999','九二一地震，建築受損'],['2002','公告登錄為歷史建築',1],['2003','委託陳柏年建築師整建'],['2005','大千廣播電台取得委託營運'],['2010','永進木器廠取得委託營運'],['2015','@STUDIO 文創中心取得委託營運']]]
];
if($('#timeline')){
$('#timeline').innerHTML=tl.map(([era,rows])=>`<div><p class="era">${era}</p>`+rows.map(([y,t,k])=>`<div class="tl${k?' key':''}"><time>${y}</time><p>${t}</p></div>`).join('')+'</div>').join('');
$('#timeline').insertAdjacentHTML('afterend',`<div class="tl-now"><time>2026</time><p><b>愛維藝文有限公司接手營運</b><br>以「臺中市音樂文化中心」與「音樂文化樞紐」為願景，用歷史建築＋廣播歷史＋流行音樂，打造兼具文化公共性、商業永續性與跨界影響力的城市音樂文化地標。</p></div>`);
const eras=[
 [['二重放送制度','以日語為主（第一放送），特定時段設台灣語放送，播報農業技術與衛生常識。'],['教育與體育同調','每日清晨的廣播體操琴音，配上童謠與家庭講座。'],['戰時體制宣傳','二戰爆發後，節目轉為愛國進行曲、軍歌與大本營戰況發表。']],
 [['晨間農村曲','破曉時分為中部農民播報農事、肥料與氣象，是下田前的背景音。'],['講古與廣播劇','廖添丁傳奇、布袋戲口白改編、家庭倫理劇，聲動台中大街小巷。'],['群星會與校園民歌','晶體管收音機普及，學生戴著耳機聽中廣流行網、西洋熱門排行與校園民歌。']]
];
function showEra(k){$$('#eraTabs .tab').forEach(b=>b.setAttribute('aria-selected',String(+b.dataset.era===k)));$('#eraPanel').innerHTML='<ul>'+eras[k].map(([a,b])=>`<li><b>${a}</b><span>${b}</span></li>`).join('')+'</ul>'}
$('#eraTabs').onclick=e=>{const b=e.target.closest('.tab');if(b)showEra(+b.dataset.era)};showEra(0);

}
/* ---------- SPACES ---------- */
const legends={
 site:{label:'全區配置 · 主建築＋東側庭園',items:[['#A8C6B3','主建築一樓','展演、展覽、餐飲與工作室','1F'],['#C9D7A8','廣播綠意庭園','圓形廣場、日池月池、老榕與石燈籠，可容納 300–500 人','B 區'],['#D9D0BF','二戰防空洞與後院','園區後方的圓拱防空洞秘境','—']]},
 '1F':{label:'一樓 · 展演・展覽・餐飲',items:[['#C8DACB','多功能展演空間 105','80–120 席，四季音樂會與週六講唱會主場','A 區'],['#7ABDB6','展演舞台 106','長邊舞台，近距離聆聽','A 區'],['#A6DCEB','文創商品陳列 103','圓拱窗下的選品展間','參觀'],['#D3B9E2','藝術家工作室 104','駐館創作與工作坊','參觀'],['#F7C6D0','義式餐廳 115','流行音樂實驗餐廳，含包廂 116、117','餐飲'],['#EFD394','廚房 120・撤餐區 121','後場','—']]},
 '2F':{label:'二樓 · Café・展廳',items:[['#F2D2B4','咖啡館 202','放送局文創 Café，會員飲品券在此使用','餐飲'],['#F2D2B4','陽台 207','菱格紋女兒牆後的戶外座位','餐飲'],['#D3E3B9','多功能展廳 203','常設與特展、黑膠與收音機展示','展覽'],['#C7CBEA','辦公室 201','營運團隊','—']]}
};
if($('#planTabs')){
function showPlan(k){
  $$('#planTabs .tab').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.plan===k)));
  const img=$('#planImg'); img.src=`assets/plan/plan-${k}.png`; img.alt=`臺中放送局 ${k==='site'?'全區':k} 平面圖`;
  $('#planLabel').textContent=legends[k].label;
  $('#legend').innerHTML=legends[k].items.map(([c,n,d,z])=>`<li><i style="background:${c}"></i><div><b>${n}</b><small>${d}</small></div><span class="mono">${z}</span></li>`).join('');
}
$('#planTabs').onclick=e=>{const b=e.target.closest('.tab');if(b)showPlan(b.dataset.plan)};showPlan('site');
$('#planImg').onclick=()=>{$('#planZoom').src=$('#planImg').src;$('#planZoom').alt=$('#planImg').alt;$('#planDlg').showModal()};

}
const spaces=[
 {w:1,img:'multi-hall',n:'多功能展演空間',f:'1F · 105＋106',d:'挑高的原木屋架、軌道燈與整排木框長窗，平台鋼琴就位，可排成展覽或 80–120 席演出。四季音樂會與週六講唱會都在這裡。',m:['80–120 席','可租借 A 區','講唱・室內樂']},
 {img:'hall-arched-windows',n:'圓拱窗展間',f:'1F · 103',d:'整面圓拱木窗與赭色天花，午後光線最美。陳列在地品牌選品與文創商品。',m:['文創選品','免費參觀']},
 {img:'garden-b',n:'廣播綠意庭園',f:'戶外 · B 區',d:'圓形廣場、日池月池與石燈籠，夏季戶外音樂會與市集的舞台。',m:['300–500 人','可租借 B 區']},
 {img:'cypress-path',n:'柏樹拱廊步道',f:'戶外 · 側院',d:'傾斜的老柏樹搭成綠色隧道，盡頭就是洋樓的拱門。',m:['散步路線','打卡']},
 {img:'cafe-balcony',n:'二樓 Café 與陽台',f:'2F · 202＋207',d:'坐在菱格紋女兒牆後，看老榕與前庭。會員飲品券與生日禮在這裡使用。',m:['Café','陽台座位']}
];
if($('#spaceCards')){
$('#spaceCards').innerHTML=spaces.map(s=>`<article class="space${s.w?' wide':''}"><div class="ph"><img src="assets/img/${s.img}.jpg" alt="${s.n}" loading="lazy"></div><div class="bd"><span class="mono" style="color:var(--onair)">${s.f}</span><h3>${s.n}</h3><p>${s.d}</p><div class="meta">${s.m.map(x=>`<span class="chip">${x}</span>`).join('')}</div></div></article>`).join('');

}
/* ---------- ARCHIVE ---------- */
const videos=[
 {id:'oLMU0I9JNyE',t:'台中放送局光雕展',a:'小人物餓號',k:['光雕','戶外演出'],p:'facade-side',f:1},
 {id:'705IfxTudWQ',t:'青蛙放送局爵士樂：台中爵序大樂團 2023/10/01',a:'frogariel',k:['爵士大樂團','現場音樂'],p:'performance-hall'},
 {id:'ogdF4m6QOb4',t:'2017 年 10 月 8 日〔台中放送局〕森與花的市',a:'悟狄裴克',k:['市集'],p:'banyan-path'},
 {id:'s1DdXY5nY94',t:'【市集】京都野餐會＠台中放送局',a:'威霖TV',k:['市集','野餐'],p:'courtyard-pond'},
 {id:'xMBARB4PDPk',t:'2015.10.04 台中放送局的裝置藝術〈發聲〉',a:'廖翊辰',k:['裝置藝術'],p:'hall-arched-windows'},
 {id:'3nhBKUarWqk',t:'2013 雙十流域 3D 建模新風貌聯展：臺中放送局（日文配音）',a:'閱讀多媒體',k:['日文介紹','數位建模'],p:'iron-gate'},
 {id:'5aEAJHg150c',t:'臺中四大網美景點推薦：臺中放送局等',a:'小資女楊雯雯Heygirl',k:['旅遊推薦','打卡'],p:'cypress-path'}
];
if($('#vidGrid')){
$('#vidGrid').innerHTML=videos.map(v=>`<div class="vcard${v.f?' feature':''}"><a class="vid" data-yt="${v.id}" data-poster="assets/img/${v.p}.jpg" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener" aria-label="播放：${esc(v.t)}"></a><div class="k">${v.k.map(x=>`<span class="chip">${x}</span>`).join('')}</div><p class="t">${esc(v.t)}</p><p class="src">影片來源：YouTube／${esc(v.a)}</p></div>`).join('');
}
$$('.vid').forEach(mountVid);

/* ---------- EVENTS ---------- */
if($('#seriesTabs')){
const pickSeries=b=>{if(!b)return;$$('#seriesTabs .tab').forEach(x=>{x.setAttribute('aria-selected',String(x===b));const p=$('#series-'+x.dataset.series);if(p)p.hidden=x!==b})};
$('#seriesTabs').onclick=e=>{const b=e.target.closest('.tab');if(b)pickSeries(b)};
const hashSeries=()=>{const k=location.hash.slice(1);if(k)pickSeries($('#seriesTabs [data-series="'+k+'"]'))};
addEventListener('hashchange',hashSeries);hashSeries();
}
const domains=['文史旗艦','族群母語與土地','唱片工業幕後','廣播傳奇與聲音美學','社群頂流與情緒療癒'];
const hosts=[
 ['我是江老師','古典鋼琴 × 網路人氣講師','視奏人生：琴鍵上的失控與完美和解','學會對自己的失誤大笑，才能彈出屬於自己的自由旋律。',4,'學琴學子、家長、都會白領；親子／閨蜜雙人席'],
 ['那那大師','華語女歌手頭號知己','大歌廳的眼淚：那些天后教我的逆境生存學','每個人心中都住著一個受過傷、卻依然想盛裝出席的天后。',4,'25–45 歲都會男女；當晚有復古 Dress Code'],
 ['吉米哥 Jimi Bro','流行專輯樂評人','金曲顯微鏡：一張唱片如何拯救破碎的世界？','在演算法碎片化的年代，重拾專注聽完一張專輯的儀式感。',2,'樂評讀者、唱片收藏家、音樂企劃人'],
 ['小樹','StreetVoice 音樂總監','邊緣人的共鳴箱：當獨立聲浪走進大眾心臟','不用急著成為主流，邊緣也有自己的頻率。',3,'20–35 歲文青、獨立樂迷、樂團樂手'],
 ['吳建恆','中廣《娛樂e世代》主持人','深夜空中點歌簿：那個借走你半生眼淚的卡帶','有些歌不是好聽，而是唱歌的人陪你度過了最難熬的夜晚。',3,'30–55 歲廣播老粉；購票可留下「未寄出的信」'],
 ['賈文青（德仔）','三金典禮御用司儀・配音大師','聲音的蒙太奇：金曲廣告、配音口白與大眾心理學','在雜訊充斥的時代，找到屬於自己聲音的堅定力量。',3,'配音／廣播迷、公關行銷人、思辨辯論圈'],
 ['馬克 & 瑪麗','《馬克信箱》《上班可以聽 LWW》','廢青的靈魂垃圾桶：荒謬生活裡的流行歌曲','生活很爛沒關係，我們一起在爛泥裡唱著歌開出花來。',4,'20–35 歲上班族、死忠「點友」'],
 ['馬世芳','廣播人・作家','電波裡的島嶼回聲：戒嚴、審查與自由的歌聲','前人如何用一首歌點亮黑夜，我們今天就該如何守護心中的微光。',0,'文史學界、熟齡深度樂迷、文化創作者'],
 ['徐睿凱','原住民族黑膠與聲音史研究者','山海電波的起點：從 78 轉蟲膠唱片看見原住民現代流行樂史','流浪是為了記得回家的路。',1,'黑膠發燒友、世界音樂樂迷；現場展示罕見黑膠'],
 ['林鈺婷 Rita','金曲客語唱作人・金鐘廣播主持人','行過桐花路的生活詩：都會客語的爵士呢喃與人生轉身','硬頸不只是堅毅，更是懂得在生活中從容轉身的溫柔。',1,'客家鄉親、爵士與 Bossa Nova 愛好者；桐花微光套票'],
 ['蘇明淵','執業律師・兩度金曲最佳台語男歌手','善良的盤纏：法庭上的罪與罰，歌聲裡的人性微光','人生有時候不是是非題，而是一道道帶著傷痕的選擇題。',1,'三明治世代、法律與助人工作者、台語歌迷'],
 ['王希文','瘋戲樂劇場藝術總監・影視配樂家','幕落之後的耳語：電影配樂與音樂劇裡的城市情書','每個人都是自己生命電影的主角，只是常忘了配樂的節奏。',2,'音樂劇迷、配樂發燒友；劇場沙龍套票'],
 ['陳子鴻','金牌音樂製作人・喜歡音樂創辦人','金牌製作人淬鍊的百萬金曲心法','製作一首好歌靠的不是炫技，而是把多餘的雜質剪掉；人生也是。',2,'江蕙歌迷、音樂創作者、創業青年'],
 ['舒米恩 Suming','金曲金馬創作音樂人・阿米斯音樂節創辦人','海風吹進電台街：都蘭少年的吉他、母語與返鄉生活哲學','回到自己的土地與文化裡，你就是自己的海浪。',1,'獨立音樂與戶外文創青年；海風沉浸席'],
 ['鄭楨慶','台師大流行音樂史講師・愛維藝文創辦人','電波裡的島嶼身世：台灣流行音樂百年造音史與時代集體記憶','音樂是歷史最溫柔的傷痕，也是止痛藥。',0,'音樂從業者、大專師生；會員早鳥優先登記']
];
const PRICE=800;
function thirdSat(y,m){const d=new Date(y,m,1);const off=(6-d.getDay()+7)%7;return new Date(y,m,1+off+14)}
hosts.forEach((h,i)=>{const m=10+i;h.date=thirdSat(2026+Math.floor(m/12),m%12)});
const fmtD=d=>`${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
let dom=-1;
if($('#filters')){
$('#filters').innerHTML=`<button class="tab" aria-selected="true" data-d="-1">全部 15 場</button>`+domains.map((d,i)=>`<button class="tab" aria-selected="false" data-d="${i}">${d}</button>`).join('');
$('#filters').onclick=e=>{const b=e.target.closest('.tab');if(!b)return;dom=+b.dataset.d;$$('#filters .tab').forEach(x=>x.setAttribute('aria-selected',String(x===b)));renderHosts()};
function renderHosts(){
  $('#hostGrid').innerHTML=hosts.map((h,i)=>({h,i})).filter(({h})=>dom<0||h[4]===dom).map(({h,i})=>`<article class="host">
   <div class="top"><span class="date">每月第三個星期六 · 檔期公布中</span><span class="ep">No.${String(i+1).padStart(2,'0')}</span></div>
   <div><h4>${esc(h[0])}</h4><p class="role">${esc(h[1])}</p></div>
   <p class="theme">〈${esc(h[2])}〉</p>
   <blockquote>${esc(h[3])}</blockquote>
   <div class="foot"><span class="price">${nt(PRICE)} 起</span><button class="btn small solid" data-buy="${i}">選擇場次</button></div></article>`).join('');
}
renderHosts();
$('#hostGrid').addEventListener('click',e=>{const b=e.target.closest('[data-buy]');if(b)openTicket(+b.dataset.buy)});

}
const seasons=[
 {s:'Spring',c:'#E6B8C2',n:'春季篇．萌芽與覺醒',t:'窗邊的爵士留聲機：1935 摩登摩登',d:'JFCK 開播那年，留聲機唱針落下，摩登時代開始。早期 Swing 爵士與台語老歌在 94 扇窗的午後陽光裡重新響起。',style:'Vintage Swing Jazz × 古典弦樂四重奏 × 台語歌謠新編',cast:'說書人：馬世芳或沈冬教授　音樂總監：許郁瑛　主唱：李欣玲',moment:'骨董留聲機現場落針，無縫切換到爵士樂團；手持春季冷萃花茶聆聽。',where:'室內 · 80–120 席'},
 {s:'Summer',c:'#9CC59A',n:'夏季篇．青春與烈火',t:'水源地的單車少年：熱血搖滾與民歌綠浪',d:'1970–90 年代，台中一中、新民、台體大環繞的水源地，是全台中最青春騷動的街區。',style:'Acoustic Folk-Rock × Neo-Soul／獨立搖滾',cast:'上半場民歌傳奇（如陳明章）；下半場台中獨立樂團；擬邀台中一中校友黃舒駿、阿沁、阿福、段鍾潭',moment:'戶外「廣播天線舞台」、黑膠市集，以及錄下想對當年自己說的話的「青春留言錄音亭」。',where:'戶外庭園 · 400–600 人'},
 {s:'Autumn',c:'#E2A95E',n:'秋季篇．流轉與鄉愁',t:'傍晚六點的收音機：台語老歌的人間煙火與療癒',d:'黃昏市場、機車行、工廠線旁，人人守著收音機聽講古、聽點歌。台語歌承載出外人與媽媽們的寂寞與堅韌。',style:'大提琴 × 班多鈕手風琴 × 木吉他 × 講古口白',cast:'講古：台中廣播前輩　演唱：謝銘祐或曹雅雯',moment:'真空管黃光營造復古客廳，麵茶與古早味糕點，終場「全場電波大合唱」。',where:'室內 · 80–120 席'},
 {s:'Winter',c:'#9DB3CF',n:'冬季篇．沉靜與新生',t:'消音室裡的私語：環境聲景、古典極簡與身心歸零',d:'廣播電台的核心是消音錄音室：阻絕喧囂，只留下呼吸與心跳。冬天的放送局，是鬧區裡的心靈庇護所。',style:'台中田野聲景 × 氛圍後搖 × 極簡鋼琴與弦樂',cast:'聲景錄音師採集水源地鳥鳴、台中車站鐘聲；鋼琴林耿農或李欣芸作品編制；人聲徹摩',moment:'「無燈聆聽會」：特定樂章全場熄燈，終場點亮微光蠟燭完成跨年祈願。',where:'室內 · 80–120 席'}
];
if($('#seasons')){
$('#seasons').innerHTML=seasons.map((s,i)=>`<article class="season" style="--sc:${s.c}"><span class="s">${s.s} 2027</span><h4>${s.n}<br>〈${s.t}〉</h4><p>${s.d}</p><dl><dt>編制</dt><dd>${s.style}</dd><dt>擬邀卡司</dt><dd>${s.cast}</dd><dt>現場亮點</dt><dd>${s.moment}</dd><dt>場地</dt><dd>${s.where}</dd></dl><button class="btn small" data-notify="${i}">開賣通知我</button></article>`).join('');
$('#seasons').addEventListener('click',e=>{const b=e.target.closest('[data-notify]');if(b)openNotify(+b.dataset.notify)});

}
/* ticket flow */
const tk={};
if($('#tkDlg')){
const tkDlg=$('#tkDlg'), tkForm=$('#tkForm');
const MEMBER={none:[1,'非會員'],friend:[.95,'留聲之友 95 折'],gold:[.85,'金咪會員 85 折']};
function openTicket(i){Object.assign(tk,{i,step:1,slot:'day',qty:2,mem:'none',name:'',email:'',phone:''});drawTk();tkDlg.showModal()}
function stepsBar(){return `<div class="steps">${['場次','票種','聯絡資訊','完成'].map((s,k)=>`<span class="${k+1===tk.step?'on':''}">${k+1} ${s}</span>`).join('')}</div>`}
function priceSum(){const r=MEMBER[tk.mem][0];const sub=PRICE*tk.qty;const tot=Math.round(sub*r);return {sub,tot,off:sub-tot}}
function drawTk(){
  const h=hosts[tk.i];
  const head=`<p class="eyebrow"><span class="lamp"></span>放送開咪 No.${String(tk.i+1).padStart(2,'0')} · 檔期公布中</p><h3 id="tkTitle">${esc(h[0])}〈${esc(h[2])}〉</h3>${stepsBar()}`;
  let body='';
  if(tk.step===1){
    body=`<div class="opt-row">${[['day','15:00–16:30','日光茶敘講唱'],['night','19:30–21:00','微光夜話講唱']].map(([v,t,n])=>`<div class="opt"><input type="radio" name="slot" id="slot-${v}" value="${v}" ${tk.slot===v?'checked':''}><label for="slot-${v}"><b>${t}</b><small>${n} · 一般席 ${nt(PRICE)}（暫定）</small></label></div>`).join('')}</div>
    <p class="note">適合對象：${esc(h[5])}</p>
    <div class="tk-actions"><span></span><button class="btn solid" type="button" data-go="2">下一步</button></div>`;
  }else if(tk.step===2){
    const p=priceSum();
    body=`<div class="field"><label>會員身分</label><div class="opt-row">${Object.entries(MEMBER).map(([k,[r,n]])=>`<div class="opt"><input type="radio" name="mem" id="mem-${k}" value="${k}" ${tk.mem===k?'checked':''}><label for="mem-${k}"><b>${n}</b><small>${k==='gold'?'每場限購 4 張':k==='friend'?'LINE 免費加入':'可於下方加入會員'}</small></label></div>`).join('')}</div></div>
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap"><span class="field" style="display:inline"><label>張數</label></span><div class="qty"><button type="button" data-q="-1" aria-label="減少">−</button><output id="qtyOut">${tk.qty}</output><button type="button" data-q="1" aria-label="增加">＋</button></div><span class="note">每筆最多 4 張</span></div>
    <div class="sum"><div><span>一般席 ${nt(PRICE)} × ${tk.qty}</span><span>${nt(p.sub)}</span></div><div><span>${MEMBER[tk.mem][1]}</span><span>−${nt(p.off)}</span></div><div class="total"><span>合計</span><span>${nt(p.tot)}</span></div><div><span>聽歌存摺</span><span>＋${tk.qty} 點</span></div></div>
    <div class="tk-actions"><button class="btn" type="button" data-go="1">上一步</button><button class="btn solid" type="button" data-go="3">下一步</button></div>`;
  }else if(tk.step===3){
    body=`<div class="fields"><div class="field"><label for="tkName">姓名</label><input id="tkName" required value="${esc(tk.name)}" autocomplete="name"></div><div class="field"><label for="tkEmail">Email</label><input id="tkEmail" type="email" required value="${esc(tk.email)}" autocomplete="email"></div><div class="field"><label for="tkPhone">手機</label><input id="tkPhone" required value="${esc(tk.phone)}" inputmode="tel" autocomplete="tel"></div></div>
    ${tk.i===4?'<div class="field"><label for="tkLetter">未寄出的信（選填，建恆哥可能在現場唸出）</label><textarea id="tkLetter" rows="3"></textarea></div>':''}
    <p class="note" id="tkErr" role="alert"></p>
    <div class="sum"><div class="total"><span>${tk.slot==='day'?'15:00 日光場':'19:30 夜話場'} · ${tk.qty} 張</span><span>${nt(priceSum().tot)}</span></div></div>
    <div class="tk-actions"><button class="btn" type="button" data-go="2">上一步</button><button class="btn solid" type="submit">確認訂票（示範）</button></div>`;
  }else{
    const code='JFCK-'+String(tk.i+1).padStart(2,'0')+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
    body=`<div class="ticket-stub"><span class="mono" style="color:var(--onair)">示範訂單 · 未實際扣款</span><span class="code">${code}</span><p><b>${esc(tk.name)}</b>，你的 ${tk.qty} 張〈${esc(h[0])}〉${tk.slot==='day'?'15:00 日光茶敘場':'19:30 微光夜話場'}已保留。</p><p class="note">正式上線後，電子票券將寄至 ${esc(tk.email)}，並同步存入 LINE 會員中心。聽歌存摺＋${tk.qty} 點。</p></div>
    <div class="tk-actions"><a class="btn" href="#club" data-closelink>了解 Radio One Club</a><button class="btn solid" type="button" data-close>完成</button></div>`;
  }
  tkForm.innerHTML=head+body;
}
tkForm.addEventListener('change',e=>{if(e.target.name==='slot')tk.slot=e.target.value;if(e.target.name==='mem'){tk.mem=e.target.value;drawTk()}});
tkForm.addEventListener('input',e=>{if(e.target.id==='tkName')tk.name=e.target.value;if(e.target.id==='tkEmail')tk.email=e.target.value;if(e.target.id==='tkPhone')tk.phone=e.target.value});
tkForm.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');if(g){tk.step=+g.dataset.go;drawTk();return}
  const q=e.target.closest('[data-q]');if(q){tk.qty=Math.min(4,Math.max(1,tk.qty+ +q.dataset.q));drawTk();return}
  if(e.target.closest('[data-closelink]'))tkDlg.close();
});
tkForm.addEventListener('submit',e=>{e.preventDefault();
  if(tk.step!==3)return;
  const bad=!tk.name.trim()?'請填寫姓名。':!/^\S+@\S+\.\S+$/.test(tk.email)?'請填寫正確的 Email，電子票券會寄到這裡。':!/^[\d\-+\s]{8,}$/.test(tk.phone)?'請填寫手機號碼。':'';
  if(bad){$('#tkErr').textContent=bad;return}
  tk.step=4;drawTk();
});
function openNotify(i){
  const s=seasons[i];
  tkForm.innerHTML=`<p class="eyebrow"><span class="lamp"></span>${s.s} 2027 · 早鳥登記</p><h3 id="tkTitle">${s.n}〈${s.t}〉</h3><p class="note">${s.where}。開賣前，我們會用 Email 通知你；金咪會員另享 48 小時優先購票。</p>
  <div class="fields"><div class="field"><label for="nName">姓名</label><input id="nName" required autocomplete="name"></div><div class="field"><label for="nEmail">Email</label><input id="nEmail" type="email" required autocomplete="email"></div></div><p class="note" id="nErr" role="alert"></p>
  <div class="tk-actions"><span></span><button class="btn solid" type="submit">登記開賣通知（示範）</button></div>`;
  tk.step=0; tkDlg.showModal();
  tkForm.onsubmit=e=>{if(tk.step!==0)return;e.preventDefault();e.stopImmediatePropagation();const em=$('#nEmail').value;if(!/^\S+@\S+\.\S+$/.test(em)){$('#nErr').textContent='請填寫正確的 Email。';return}
    tkForm.innerHTML=`<p class="eyebrow"><span class="lamp"></span>已登記</p><h3>開賣時會通知 ${esc(em)}</h3><p class="note">示範表單，正式上線將串接會員系統。</p><div class="tk-actions"><span></span><button class="btn solid" type="button" data-close>好</button></div>`;tkForm.onsubmit=null};
}
tkDlg.addEventListener('close',()=>{tkForm.onsubmit=null});

}
/* ---------- CLUB ---------- */
if($('#stamps')){
const months=$('#jBirth');for(let m=1;m<=12;m++)months.insertAdjacentHTML('beforeend',`<option>${m} 月</option>`);
let stamped=3;try{const v=localStorage.getItem('r1-stamps');if(v!==null)stamped=+v}catch(e){}
function drawStamps(){
  $('#stamps').innerHTML=Array.from({length:10},(_,k)=>`<button type="button" class="stamp${k<stamped?' on':''}${k===9?' free':''}" data-k="${k}" aria-label="第 ${k+1} 格${k<stamped?'，已蓋章':''}">${k===9?(k<stamped?'兌換':'FREE'):(k<stamped?'聽過':k+1)}</button>`).join('');
  $('#stampMsg').textContent=stamped>=10?'集滿 10 點！可兌換任一場講唱音樂會一般席門票 1 張。':`已累積 ${stamped} 點，再 ${10-stamped} 張就能換一張免費門票。`;
  try{localStorage.setItem('r1-stamps',stamped)}catch(e){}
}
$('#stamps').onclick=e=>{const b=e.target.closest('.stamp');if(!b)return;stamped=+b.dataset.k+1;drawStamps()};
$('#stampReset').onclick=()=>{stamped=0;drawStamps()};drawStamps();
}
function simpleForm(form,msg,req,ok){
  form.addEventListener('submit',e=>{e.preventDefault();const m=$(msg);
    const miss=req.find(([id,test])=>!test($(id).value.trim()));
    m.hidden=false;
    if(miss){m.textContent=miss[2];m.style.borderColor='var(--onair)';return}
    m.style.borderColor='';m.textContent=ok();form.querySelectorAll('input,textarea').forEach(x=>{if(x.type!=='checkbox')x.value=''});
  });
}
const isMail=v=>/^\S+@\S+\.\S+$/.test(v);
if($('#joinForm')){
simpleForm($('#joinForm'),'#joinMsg',[['#jName',v=>v,'請填寫姓名。'],['#jPhone',v=>/^[\d\-+\s]{8,}$/.test(v),'請填寫手機號碼，會員資格會綁定在這支手機。'],['#jEmail',isMail,'請填寫正確的 Email。']],()=>$('#jTier').value==='gold'?'已收到金咪會員申請（示範）。正式上線後將導向年費付款，並發送迎新禮到 LINE。':'歡迎成為留聲之友（示範）！正式上線後，迎新禮會發送到你的 LINE。');
}
if($('#rentForm')){
simpleForm($('#rentForm'),'#rentMsg',[['#rName',v=>v,'請填寫聯絡人。'],['#rEmail',isMail,'請填寫正確的 Email，方便我們回覆報價。']],()=>'已收到場地諮詢（示範）。正式上線後，營運團隊會在三個工作天內回覆。');

}
/* ---------- RENTAL CALC ---------- */
const RATE={A:{wd:8000,we:12000,dep:5000},B:{wd:12000,we:18000,dep:10000},AB:{wd:18000,we:26000,dep:15000}};
if($('#calc')){
function calc(){
  const z=$('#cZone').value,d=$('#cDay').value,n=+$('#cSlots').value,ser=+$('#cSeries').value,plan=$('#cPlan').value,clean=$('#cClean').checked;
  const base=RATE[z][d];
  let pr=1,pn='';
  if(plan==='youth'){pr=d==='wd'?.5:.65;pn=d==='wd'?'青年扶植 5 折（平日日間）':'青年扶植 65 折（假日上午場）'}
  else if(plan==='mother'){pr=.7;pn='母語原創 7 折'}
  const best=Math.min(pr,ser), name=best===1?'無':(best===pr&&pr<1?pn:(ser===.85?'系列 85 折':'年度 75 折'));
  const rent=base*best*n, cf=clean?0:1500*n;
  $('#calcSum').innerHTML=`<div><span>原價 ${nt(base)} × ${n} 時段</span><span>${nt(base*n)}</span></div><div><span>優惠：${name}</span><span>−${nt(base*n-rent)}</span></div><div><span>清潔費</span><span>${clean?'免收（需查驗）':nt(cf)}</span></div><div class="total"><span>場租合計（每場）</span><span>${nt(rent+cf)}</span></div><div><span>保證金（活動後退還）</span><span>${nt(RATE[z].dep)}</span></div>`;
  $('#calcNote').textContent=(plan==='youth'&&d==='we'?'假日 65 折僅限上午時段。':'')+'優惠不併用，系統自動套用最優惠的一項。'+(plan!=='none'?'專案資格需經審核。':'');
}
$('#calc').addEventListener('input',calc);$('#calc').addEventListener('change',calc);calc();
function split(){
  const p=Math.max(0,+$('#sPrice').value||0),s=Math.max(0,+$('#sSold').value||0),rent=parseInt($('#sZone').value);
  const box=p*s, venue=box*.25, floor=rent*.5, vFinal=Math.max(venue,floor), host=box-vFinal;
  $('#barHost').style.width=box?(Math.max(0,host)/box*100)+'%':'75%';$('#barVenue').style.width=box?(vFinal/box*100)+'%':'25%';
  $('#splitSum').innerHTML=`<div><span>票房總收入</span><span>${nt(box)}</span></div><div><span>主辦團隊</span><span>${nt(host)}</span></div><div><span>放送局分潤 25%</span><span>${nt(venue)}</span></div>${venue<floor?`<div><span>未達保底，以常規場租 50% 計</span><span>${nt(floor)}</span></div>`:''}<div><span>水電清潔耗損費</span><span>${nt(2000)}</span></div><div class="total"><span>主辦實拿（扣耗損費）</span><span>${nt(host-2000)}</span></div>`;
}
$('#split').addEventListener('input',split);$('#split').addEventListener('change',split);split();

}
/* ---------- home: up next ---------- */
if($('#upNext')){
  const now=new Date();
  $('#upNext').innerHTML=hosts.map((h,i)=>({h,i})).slice(0,3).map(({h,i})=>`<a href="events.html#sat"><span class="d">No.${String(i+1).padStart(2,'0')}</span><b>${esc(h[0])}</b><span>〈${esc(h[2])}〉</span></a>`).join('');
}
/* ---------- probe YouTube reachability, then start ---------- */
if($$('.vid').length||$('#heroVideo')){
const probe=new Image();
probe.onload=()=>{if(probe.naturalWidth>120)enableEmbeds()};
probe.src='https://i.ytimg.com/vi/VDBO9sTBm-Y/mqdefault.jpg';
}
setTimeout(tune,80);
})();

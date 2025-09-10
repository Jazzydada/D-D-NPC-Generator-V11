"use client";
import React,{useMemo,useState} from "react";

const t={en:{appTitle:"D&D NPC Generator",subtitle:"Weighted races • Midjourney prompt • EN/DA",fields:{name:"Name",gender:"Gender",race:"Race",profession:"Profession",appearance:"Appearance",speech:"Speech",movement:"Movement",demeanor:"Demeanor"},buttons:{roll:"Roll!",lockAll:"Lock All",unlockAll:"Unlock All",copyText:"Copy (text)",copyJson:"Copy (JSON)"},outputTitle:"Output",genderUnrevealed:"Unrevealed"},da:{appTitle:"D&D NPC Generator",subtitle:"Vægtede racer • Midjourney • EN/DA",fields:{name:"Navn",gender:"Køn",race:"Race",profession:"Profession",appearance:"Udseende",speech:"Tale",movement:"Bevægelse",demeanor:"Væsen"},buttons:{roll:"Rul!",lockAll:"Lås alle",unlockAll:"Lås alle op",copyText:"Kopiér (tekst)",copyJson:"Kopiér (JSON)"},outputTitle:"Output",genderUnrevealed:"Uoplyst"}};
function useLang(){const[lang,setLang]=useState("da");return{lang,setLang,tr:t[lang]}}

const genderHiddenRaces=new Set(["Dragonborn","Lizardfolk","Kobold"]);
function displayGenderFor(race,gender,tr){return genderHiddenRaces.has(race)?tr.genderUnrevealed:gender}

const races=["Human","Half-Elf","High Elf","Wood Elf","Dark Elf (Drow)","Mountain Dwarf","Hill Dwarf","Lightfoot Halfling","Stout Halfling","Forest Gnome","Rock Gnome","Half-Orc","Orc","Tiefling","Dragonborn","Aasimar","Tabaxi","Tortle","Kenku","Kobold","Goliath","Firbolg","Genasi (Air)","Genasi (Earth)","Genasi (Fire)","Genasi (Water)","Loxodon","Leonin","Minotaur","Changeling","Shifter","Warforged","Vedalken","Owlin","Harengon","Satyr","Triton","Yuan-ti Pureblood","Lizardfolk","Bugbear","Goblin","Hobgoblin","Kalashtar"];
const raceWeights={"Human":40,"Half-Elf":6,"High Elf":6,"Wood Elf":6,"Dark Elf (Drow)":4,"Mountain Dwarf":6,"Hill Dwarf":6,"Lightfoot Halfling":4,"Stout Halfling":4,"Forest Gnome":4,"Rock Gnome":4,"Half-Orc":4,"Orc":3,"Tiefling":3,"Dragonborn":3,"Aasimar":3};
const raceMap={"Human":"human","Half-Elf":"elf","High Elf":"elf","Wood Elf":"elf","Dark Elf (Drow)":"drow","Mountain Dwarf":"dwarf","Hill Dwarf":"dwarf","Lightfoot Halfling":"halfling","Stout Halfling":"halfling","Forest Gnome":"gnome","Rock Gnome":"gnome","Half-Orc":"halforc","Orc":"halforc","Tiefling":"tiefling","Dragonborn":"dragonborn","Aasimar":"human","Tabaxi":"tabaxi","Tortle":"tortle","Kenku":"kenku","Kobold":"kobold","Goliath":"goliath","Firbolg":"firbolg","Genasi (Air)":"genasi","Genasi (Earth)":"genasi","Genasi (Fire)":"genasi","Genasi (Water)":"genasi","Loxodon":"loxodon","Leonin":"leonin","Minotaur":"minotaur","Changeling":"changeling","Shifter":"shifter","Warforged":"warforged","Vedalken":"vedalken","Owlin":"owlin","Harengon":"harengon","Satyr":"satyr","Triton":"triton","Yuan-ti Pureblood":"yuanti","Lizardfolk":"lizardfolk","Bugbear":"bugbear","Goblin":"goblin","Hobgoblin":"hobgoblin","Kalashtar":"kalashtar"};

const names={
  human:{male:["Alric","Tomas","Cedric","Willem","Marcus","Robert","Victor","Joran","Edric","Jonas"],female:["Elira","Selene","Mara","Fiona","Katarina","Sophia","Isolde","Lydia","Rowena","Annette"],surname:["Blackwood","Fairweather","Strongarm","Ravenshadow","Holloway","Rivers","Marsh","Faraday","Kestrel","Dunwich"]},
  dwarf:{male:["Thrain","Dain","Borin","Rurik","Kargrom","Eberk","Baern","Adrik","Bruenor","Harbek"],female:["Helja","Vistra","Brynja","Hlin","Sigrun","Audhild","Eldeth","Gunnloda","Finellen","Ilde"],surname:["Ironfist","Stonehelm","Coppervein","Goldbeard","Frostaxe","Battlehammer","Fireforge","Dankil","Holderhek","Loderr"]},
  elf:{male:["Aelar","Thamior","Carric","Eldrin","Loric","Soveliss","Varis","Theren","Rolen","Imar"],female:["Arwen","Sylvara","Naivara","Shalana","Thia","Keyleth","Lia","Miala","Shava","Enna"],surname:["Moonwhisper","Silverfrond","Windwalker","Dawnsinger","Evenwood","Starbloom","Nightbreeze","Willowshade","Sunweaver","Wavesong"]},
  drow:{male:["Ryld","Jarlaxle","Pharaun","Nalfein","Solaufein","Belwar","Zeknar","Verrak","Ilzt","Tazraen"],female:["Quenthel","Vierna","Liriel","Zesstra","Triel","Halisstra","Zarra","Belira","Szinrae","Shi'nayne"],surname:["Do'Urden","Baenre","Mizzrym","Xorlarrin","DeVir","Frey'lar","Despana","Kenafin","Faen'za","Teken'ghym"]},
  halfling:{male:["Alton","Milo","Corrin","Perrin","Finnan","Merric","Roscoe","Colby","Tobin","Doolan"],female:["Andry","Cora","Jillian","Seraphina","Shaena","Lavinia","Tegan","Verna","Bree","Marigold"],surname:["Tealeaf","Brushgather","Goodbarrel","Underbough","Greenbottle","High-hill","Thistlefoot","Honeypot","Hilltopple","Hearthhome"]},
  gnome:{male:["Boddynock","Fonkin","Warryn","Zook","Alston","Jebeddo","Pilwicken","Foddex","Duvamil","Wizzle"],female:["Bimpnottin","Carlin","Loopmottin","Nissa","Roywyn","Ellyjobell","Lorilla","Mardnab","Nyx","Tana"],surname:["Nackle","Murnig","Daergel","Ningel","Beren","Timbers","Fiddlefen","Sparkspindle","Cobblelob","Turen"]},
  halforc:{male:["Grom","Ugar","Thok","Brug","Karash","Dorn","Rogar","Ulf","Karguk","Mogar"],female:["Shauka","Urtha","Mogha","Krula","Sutha","Baggi","Engong","Myev","Ovina","Yevelda"],surname:["Bonebreaker","Skullcrusher","Red Fang","Grimscar","Bloodtusk","Ironmaw","Skullcleaver","Rotfang","Stonehide","Ashskull"]},
  tiefling:{male:["Malachai","Zephyr","Damakos","Therai","Akmenos","Lucian","Mordai","Zeth","Erebus","Caelum"],female:["Nyx","Seraphine","Leucis","Kallista","Azariah","Belladonna","Lilith","Rieta","Zaida","Vesper"],surname:["Shadowrend","Emberborn","Hellbrand","Darkflame","Nightbloom","Ashenveil","Cindervale","Grimlight","Umbrage","Doomwhisper"]},
  dragonborn:{male:["Arjhan","Balasar","Rhogar","Torinn","Kriv","Medrash","Nadarr","Pandjed","Patrin","Tarhun"],female:["Akra","Sora","Thava","Vyra","Jheri","Kava","Mishann","Nala","Perra","Uadjit"],surname:["Myastan","Clethtinthiallor","Nemmonis","Drachedandion","Kepeshkmolik","Fenkenkabradon","Verthisathurgiesh","Yrjixtileth","Shestendeliath","Zekkar"]},
  goliath:{male:["Aukan","Kavak","Thalai","Jorrun","Eglath","Gauthak","Iligit","Manneo","Othek","Thotham"],female:["Vaunea","Imra","Orila","Anaq","Hulda","Keothi","Maveith","Nola","Thalai","Rava"],surname:["Stoneshield","Thunderstep","Boulderborn","Skywatcher","Rockrunner","Peakstrider","Stonevigor","Snowguard","Highcliff","Graniteheart"]},
  tabaxi:{male:["Bright Claw","Silent Reed","Copper Pounce","Quick Brook","Whispering Gale","Silver Thread","Ember Prowl","Black Ember","Clever Ash","Quiet Thorn"],female:["Humming Quill","Soft Feather","Swift Lily","Amber Song","Shining Brook","Saffron Breeze","Velvet Step","Silent Jasmine","Hidden Dew","Flickering Ember"],surname:["of the Tall Grasses","of the Sun Dunes","of the Moon Isles","of Whispering Reeds","of Jade Canopies","of Painted Stones","of Saffron Markets","of Wandering Paths","of the Coral Coves","of Starlit Sands"]},
  firbolg:{male:["Brom","Fenn","Tolan","Ronan","Hale","Rowan","Cael","Doran","Eamon","Leif"],female:["Aine","Bree","Kira","Maeve","Orla","Riona","Saoirse","Tara","Una","Niamh"],surname:["Oakfriend","Mossmantle","Riverguard","Stonebloom","Thornwarden","Hearthgrove","Moonmeadow","Greenbark","Fogvale","Deepglen"]},
  tortle:{male:["Kopo","Mako","Rasho","Tamu","Boru","Kavan","Talo","Moro","Garu","Sava"],female:["Kela","Mira","Suri","Tila","Bana","Kovi","Taya","Sora","Gila","Nuri"],surname:["Shellward","Tidewalker","Seagrass","Wavecarver","Sandburrow","Coralback","Reedferry","Saltshore","Driftlog","Pebblehide"]},
  kenku:{male:["Karr","Rook","Kaak","Vek","Kek","Rik","Varr","Kirr","Kekko","Kraa"],female:["Ree","Kia","Rika","Vea","Kee","Rii","Kiri","Viri","Kaya","Risa"],surname:["Featherfall","Blackwing","Tinvoice","Hollowcall","Quickbeak","Echopeak","Nightcaw","Skylilt","Sharpquill","Dustplume"]},
  kobold:{male:["Skrix","Vekket","Razik","Drak","Krix","Ruk","Zekk","Tirx","Varrik","Kazz"],female:["Skaai","Kizzi","Riza","Vikki","Tazzi","Kukka","Rikka","Drazi","Sizzi","Tirra"],surname:["Emberchip","Stonebite","Tunnelgleam","Scrapclaw","Redscale","Cindersnap","Rustsnout","Sparkclaw","Dustscale","Flintspark"]},
  loxodon:{male:["Boram","Tovan","Ramak","Daman","Hareth","Jorvun","Kelram","Loman","Maruk","Neram"],female:["Amara","Devi","Hema","Isha","Kala","Mira","Nala","Rani","Sana","Veda"],surname:["Trunkbearer","Stonebinder","Oathcarver","Granitepath","Sagestep","Marbleguard","Sandtreader","Sunvein","Ivorybrow","Templeward"]},
  leonin:{male:["Akar","Barun","Ceros","Dakar","Harun","Javin","Koros","Marun","Rakor","Tavus"],female:["Amara","Besra","Caela","Dasha","Hera","Kira","Lareen","Nessa","Sera","Tala"],surname:["Proudclaw","Dawnmane","Sunpride","Swiftstep","Stonepride","Windstalker","Goldmane","Nightstalk","Grassrunner","Brightfang"]},
  minotaur:{male:["Aster","Brax","Corvos","Damar","Gorth","Hadar","Korvan","Marek","Roth","Turog"],female:["Astra","Brena","Coria","Dessa","Gora","Hessa","Kara","Mara","Risa","Tura"],surname:["Ironhorn","Stormhoof","Labyrn","Boulderhoof","Redhorn","Maizewalker","Stonemaze","Stronghorn","Longhorn","Deepmaze"]},
  changeling:{male:["Aven","Corin","Darel","Evan","Ilan","Jas","Korin","Lem","Nivek","Sorin"],female:["Asha","Cali","Dara","Elin","Ira","Jae","Kari","Lena","Mira","Sera"],surname:["Manyfaces","Softstep","Mistguise","Quickmask","Shiftwhisper","Greyveil","Palegleam","Whiteshape","Veilwalk","Nameless"]},
  shifter:{male:["Ash","Badger","Bran","Fang","Holt","Kade","Moss","Rook","Thorn","Warr"],female:["Briar","Dawn","Ember","Fawn","Kaia","Lark","Reed","Sable","Thistle","Wren"],surname:["Wildroot","Moonscent","Swiftpelt","Briarhide","Stonefur","Fernstride","Nightmane","Riverpad","Ashclaw","Greytrack"]},
  warforged:{male:["Anchor","Bastion","Cipher","Drill","Forge","Gasket","Harbor","Iron","Jolt","Keystone"],female:["Aegis","Beacon","Ciphera","Ember","Geara","Halo","Ivory","Javelin","Kindle","Lumen"],surname:["Unit-3","Model-7","Pattern-12","Series-IX","Mark-V","Batch-22","Node-5","Frame-4","Shell-8","Array-10"]},
  vedalken:{male:["Arix","Bener","Cerul","Dovin","Evar","Feron","Ivus","Neral","Sarin","Varek"],female:["Ari","Cera","Devi","Enna","Ila","Lira","Nera","Sela","Tala","Vena"],surname:["Bluehaze","Tideglass","Mindscroll","Aetherloom","Coldcurrent","Stillwater","Glassmind","Logicweir","Deepthought","Inkweave"]},
  owlin:{male:["Arro","Bubo","Caro","Drin","Eyo","Faro","Gryx","Hoot","Iro","Jaro"],female:["Ara","Bina","Ciri","Dari","Evi","Fia","Gala","Hina","Ivi","Jina"],surname:["Nightplume","Moonfeather","Hollowgaze","Starwing","Duskbeak","Glidewind","Softhoot","Skylumen","Whisperflight","Cloudplume"]},
  harengon:{male:["Brisk","Clover","Dandel","Fennel","Harro","Jasper","Knot","Pip","Quill","Thim"],female:["Bun","Clovera","Daisy","Fritta","Honey","Junie","Pippa","Rosie","Tansy","Willa"],surname:["Quickfoot","Warrenhop","Burrowtail","Dewclover","Harebell","Skyleap","Greenmeadow","Thump","Nibble","Springleaf"]},
  satyr:{male:["Aeson","Brix","Calius","Doros","Eryx","Faunus","Kyros","Lykos","Neron","Thespis"],female:["Aella","Brisa","Calla","Dione","Eris","Fauna","Lyra","Nysa","Rhea","Tessa"],surname:["Winewhistle","Greenglade","Piperidge","Thornsong","Merrifenn","Hilldance","Ramblebrook","Oakpipe","Goldthicket","Leafpipe"]},
  triton:{male:["Aqual","Boreas","Coral","Delfin","Eryon","Galor","Hydor","Nereus","Pelag","Thal"],female:["Aphra","Coralia","Delphi","Eldra","Gaia","Maris","Nerida","Pelena","Sirra","Thassa"],surname:["Seamarch","Wavecrest","Brineguard","Pearlcurrent","Tidebinder","Foamrider","Kelpcloak","Deepwatch","Sprayharp","Reeftide"]},
  yuanti:{male:["Azhiss","Bashar","Chazek","Drazzi","Ezhar","Hassik","Izzar","Sszek","Tazir","Zehss"],female:["Azira","Beshka","Chassra","Drezza","Ezira","Hassra","Isska","Sszira","Tazra","Zehra"],surname:["of the Coil","of the Venom","of the Silent Pit","Serpentcrest","Viperscale","Shadowcoil","Nightfang","Whispershed","Fangveil","Coilward"]},
  lizardfolk:{male:["Arak","Brask","Chak","Drass","Ghak","Hassk","Izzik","Krass","Shakk","Vrask"],female:["Arasa","Braska","Chassa","Drassa","Hassa","Issa","Krassa","Shassa","Vrassa","Zassa"],surname:["Mudscale","Marshgaze","Reedfins","Bogclaw","Stoneswim","Sunscale","Stillwater","Bonefin","Shadegill","Dreampool"]},
  bugbear:{male:["Brukk","Darg","Gash","Krull","Marr","Rukk","Sharg","Thokk","Ugg","Varr"],female:["Brukka","Darga","Gasha","Krulla","Marra","Rukka","Sharga","Thokka","Ugga","Varra"],surname:["Blackmaw","Longarm","Nightpelt","Skulltusk","Redhide","Darksnarl","Grimfur","Boneback","Ironpelt","Miresnout"]},
  goblin:{male:["Bikk","Drik","Grax","Hik","Jik","Klik","Nok","Rik","Snik","Vik"],female:["Bikka","Drika","Graxa","Hikka","Jikka","Klia","Nokka","Rikka","Snika","Vikka"],surname:["Ratbit","Rustnail","Sootsmudge","Fleagrin","Tinsnatch","Wiretwist","Grubpocket","Moldnose","Sparkskip","Brickstain"]},
  hobgoblin:{male:["Arkh","Barok","Dargan","Grish","Horak","Kargan","Loruk","Mardak","Rhaz","Torak"],female:["Arka","Barra","Darga","Grisha","Hora","Karra","Lora","Marda","Rhaza","Tora"],surname:["Steelbanner","Bloodmarch","Ironfile","Warbrand","Skirmcrest","Drillscar","Shieldlash","Campwarden","Redrank","Warscribe"]},
  kalashtar:{male:["Anat","Beren","Doran","Eshan","Ilan","Joran","Kiran","Lashan","Rayan","Talen"],female:["Asha","Bira","Devi","Eila","Ira","Kala","Lira","Mira","Sera","Tira"],surname:["Dreamborne","Lightweave","Mindweft","Soulbridge","Tranceward","Calmriver","Nightwatch","Starweft","Thoughtsinger","Dawnmind"]},
  genasi:{male:["Aeris","Boros","Ignan","Neris","Pyros","Terran","Zephos","Korran","Lazur","Tharos"],female:["Aella","Caeli","Ilyra","Nirra","Pyra","Sola","Talia","Veyra","Zyra","Thessa"],surname:["Stormborn","Flameheart","Earthshaper","Wavebound","Skywhisper","Stoneveil","Seaflame","Windcaller","Ashwalker","Deepcurrent"]}
};

function pad(arr,label){return arr.length>=100?arr:arr.concat(Array.from({length:100-arr.length},(_,i)=>`${label} ${i+1}`))}
const traits={
  appearances:{en:pad([], "Distinct feature"),da:pad([], "Særkende")},
  speech:{en:pad([], "Speech quirk"),da:pad([], "Sprog-særhed")},
  movement:{en:pad([], "Movement quirk"),da:pad([], "Bevægelse")},
  demeanor:{en:pad([], "Demeanor"),da:pad([], "Væsen")},
  professions:{en:pad(["Farmer","Fisher"],"Profession"),da:pad(["Bonde","Fisker"],"Profession")}
};

const genders=["Male","Female","Non-binary","Hermaphrodite"];
function weightedGender(){const r=Math.random()*100; if(r<48)return"Male"; if(r<96)return"Female"; if(r<98)return"Non-binary"; return"Hermaphrodite"}
const roll=(arr)=>arr[Math.floor(Math.random()*arr.length)];
const weightedRoll=(items,weightMap)=>{const w=items.map(it=>weightMap[it]??1);const tot=w.reduce((a,b)=>a+b,0);let r=Math.random()*tot;for(let i=0;i<items.length;i++){if(r<w[i])return items[i];r-=w[i]}return items[items.length-1]};

function generateName(race,gender){
  const key=(raceMap[race]||race||"").toLowerCase().replace(/\s+|[()]/g,"");
  const entry=names[key]||names.human;
  let pool=(gender==="Male"&&entry.male)?entry.male:(gender==="Female"&&entry.female)?entry.female:[...(entry.male||[]),...(entry.female||[])];
  if(!pool.length) pool=["Alex","Morgan","Rin","Kael","Rowan"];
  const first=roll(pool);
  const last=(entry.surname&&entry.surname.length)?roll(entry.surname):(names.human.surname?roll(names.human.surname):"");
  return `${first} ${last}`.trim();
}

function seedFromString(s=""){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return (h%99999)+1}
function buildMidjourneyPrompt(npc){
  const genderOut=displayGenderFor(npc.race,npc.gender,t.en);
  const parts=[
    "fantasy character portrait, head & shoulders",
    `${npc.race} ${genderOut} ${npc.profession}`,
    `demeanor: ${npc.demeanor}`,
    `appearance details: ${npc.appearance}`,
    `speaking style: ${npc.speech}`,
    `movement vibe: ${npc.movement}`,
    "rich lighting, painterly detail, sharp focus, neutral background, subtle costume matching the role, color harmony, (no modern items), (no text)"
  ];
  const body=parts.join(", ");
  const seed=seedFromString(npc.name||`${npc.race}-${npc.profession}`);
  return `/imagine prompt: ${body} --ar 2:3 --v 6 --style raw --s 250 --seed ${seed}`;
}

export default function DnDNpcGenerator({embed=false}){
  const {lang,setLang,tr}=useLang();
  const [locks,setLocks]=useState({name:false,gender:false,race:false,profession:false,appearance:false,speech:false,movement:false,demeanor:false});
  const tables=(l)=>({professions:traits.professions[l],appearances:traits.appearances[l],speech:traits.speech[l],movement:traits.movement[l],demeanor:traits.demeanor[l]});
  const tbl=tables(lang);
  const [npc,setNpc]=useState(()=>{
    const gender=weightedGender(); const race=weightedRoll(races,raceWeights);
    return {gender,race,profession:roll(tbl.professions),appearance:roll(tbl.appearances),speech:roll(tbl.speech),movement:roll(tbl.movement),demeanor:roll(tbl.demeanor),name:generateName(race,gender)};
  });
  const textOut=useMemo(()=>`${tr.fields.name}: ${npc.name}
${tr.fields.gender}: ${displayGenderFor(npc.race,npc.gender,tr)}
${tr.fields.race}: ${npc.race}
${tr.fields.profession}: ${npc.profession}
${tr.fields.appearance}: ${npc.appearance}
${tr.fields.speech}: ${npc.speech}
${tr.fields.movement}: ${npc.movement}
${tr.fields.demeanor}: ${npc.demeanor}`,[npc,tr]);
  const jsonOut=useMemo(()=>JSON.stringify({...npc,displayGender:displayGenderFor(npc.race,npc.gender,tr),lang},null,2),[npc,tr,lang]);
  const copy=async (s)=>{try{await navigator.clipboard.writeText(s)}catch{}};
  const reroll=()=>{
    setNpc(prev=>{
      const gender=locks.gender?prev.gender:weightedGender();
      const race=locks.race?prev.race:weightedRoll(races,raceWeights);
      return {
        name:locks.name?prev.name:generateName(race,gender),
        gender,race,
        profession:locks.profession?prev.profession:roll(tbl.professions),
        appearance:locks.appearance?prev.appearance:roll(tbl.appearances),
        speech:locks.speech?prev.speech:roll(tbl.speech),
        movement:locks.movement?prev.movement:roll(tbl.movement),
        demeanor:locks.demeanor?prev.demeanor:roll(tbl.demeanor),
      };
    });
  };
  return(<div className="max-w-3xl mx-auto space-y-6">
    {!embed&&(<header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button className={`px-2 py-1 text-xs rounded-full border ${lang==="en"?"bg-slate-700 border-slate-600":"bg-slate-900 border-slate-800"}`} onClick={()=>setLang("en")}>EN</button>
        <button className={`px-2 py-1 text-xs rounded-full border ${lang==="da"?"bg-slate-700 border-slate-600":"bg-slate-900 border-slate-800"}`} onClick={()=>setLang("da")}>DA</button>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{tr.appTitle}</h1>
      <div className="text-xs opacity-70">{tr.subtitle}</div>
    </header>)}

    <div className="grid gap-4 sm:grid-cols-2">
      <FieldCard label={tr.fields.name} value={npc.name} locked={locks.name} onLock={()=>setLocks(s=>({...s,name:!s.name}))}/>
      <FieldCard label={tr.fields.gender} value={displayGenderFor(npc.race,npc.gender,tr)} locked={locks.gender} onLock={()=>setLocks(s=>({...s,gender:!s.gender}))}/>
      <FieldCard label={tr.fields.race} value={npc.race} locked={locks.race} onLock={()=>setLocks(s=>({...s,race:!s.race}))}/>
      <FieldCard label={tr.fields.profession} value={npc.profession} locked={locks.profession} onLock={()=>setLocks(s=>({...s,profession:!s.profession}))}/>
      <FieldCard label={tr.fields.appearance} value={npc.appearance} locked={locks.appearance} onLock={()=>setLocks(s=>({...s,appearance:!s.appearance}))}/>
      <FieldCard label={tr.fields.speech} value={npc.speech} locked={locks.speech} onLock={()=>setLocks(s=>({...s,speech:!s.speech}))}/>
      <FieldCard label={tr.fields.movement} value={npc.movement} locked={locks.movement} onLock={()=>setLocks(s=>({...s,movement:!s.movement}))}/>
      <FieldCard label={tr.fields.demeanor} value={npc.demeanor} locked={locks.demeanor} onLock={()=>setLocks(s=>({...s,demeanor:!s.demeanor}))}/>
    </div>

    <div className="flex flex-col gap-4">
      <div><button className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-900/30 active:scale-[.98]" onClick={reroll}>{tr.buttons.roll}</button></div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-slate-400">Locks:</span>
        <button className="px-3 py-2 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium shadow" onClick={()=>setLocks({name:true,gender:true,race:true,profession:true,appearance:true,speech:true,movement:true,demeanor:true})}>{tr.buttons.lockAll}</button>
        <button className="px-3 py-2 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-medium shadow" onClick={()=>setLocks({name:false,gender:false,race:false,profession:false,appearance:false,speech:false,movement:false,demeanor:false})}>{tr.buttons.unlockAll}</button>
      </div>
      <div className="h-1"/>
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700" onClick={()=>copy(textOut)}>{tr.buttons.copyText}</button>
        <button className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700" onClick={()=>copy(jsonOut)}>{tr.buttons.copyJson}</button>
        <button className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white" onClick={()=>copy(buildMidjourneyPrompt(npc))}>Copy (Midjourney)</button>
      </div>
    </div>

    {!embed&&(<section className="bg-slate-900/60 rounded-2xl p-4 space-y-4">
      <h2 className="text-lg font-semibold">{tr.outputTitle}</h2>
      <pre className="whitespace-pre-wrap text-sm bg-slate-950/60 rounded-xl p-3 border border-slate-800">{textOut}</pre>
    </section>)}
  </div>)
}

function FieldCard({label,value,locked,onLock}){
  return(<div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 flex flex-col gap-2">
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm uppercase tracking-wide text-slate-400">{label}</div>
      <button className={`text-xs px-2 py-1 rounded-full border ${locked?'bg-emerald-600 border-emerald-500':'bg-slate-800 border-slate-700'} hover:opacity-90`} onClick={onLock} aria-pressed={locked}>{locked?'Locked':'Lock'}</button>
    </div>
    <div className="text-base sm:text-lg leading-relaxed">{value}</div>
  </div>)
}

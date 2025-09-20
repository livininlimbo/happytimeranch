import React, { useState, useEffect } from '
import {
  View,
t,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
t,
} from 'react-native';
import {
  prmary,

  startAnalyticsMonring,
  clearDebugLogs,
} from './analytics-debug';

// Access
ny = {};

// Monkey patch the analytics module to expose internal state
try {
  co
  
  // Create a debugables
  (global as
    getEventQueue: () =>
    getSessionId: () => debugAnalyti
    getVisitorId: () => debugAnalyticsStatitorId,
    get
    getIsActive: () => debugAnalyticsState.isActive,
    getBatchTimer: () => ,
    genfig,
  }
) {
  console.
}

const AnalyticsDebugPanel: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isMonitoring, setIsMonitoring] = useState(;
  const [logs, setLogs] = u

  cons
    try {
      const report = await printAnalyticsDebugSummary()
      
      // Try to access internal state if available
      const deb
      const internalState = debugInterfce ? {
        eventQueue: debugInterface.getEventQueue(),
        session
        visitorId: debugInterface.getVid(),
        isInitialized: debugInterface.getIsInitialize),
        isActiv),
        ),
        config: debugInterface.getConfig(),
      } : {};

      setDebugI({
        ...report,
        internalState,
        timesta),
      })
    } catch (error) {
      console.error('Error refreshing d);
    }
  };

  const testAnalytics = async () => {
    try {
      const result = await forceSendAnalyticsTest();
      Alert.alert(
        
        result.success 
          ? `✅ Success! Status: ${result.status}`
          : `❌ Failed: ${rerror}`,
        
      );
    } catch (error) {
      Alert.alert('Test Err;
    }
  };

  > {
 {
      setIsMonitoring(false);
      // Stop mon
    } else {
      setIsMoue);
      startAna
    }
  };

  const clearLogs = () => {
    clearDebugLogs();
    setLogs([]);
    Alert.alert('
  };

  useEffect(() => {
    refreshDebugInf
    
    return () val);
  }, []);

  const getSta';
  const getStat

  return (
    <ScrollView style>
      <Text stylext>
     
      {/* S*/}
      <View style={styleson}>
        <Text style={styles.sectionT
        <View style={styl}>
          <View tem}>
            <Text style={ge</Text>
            <Text style={[styl>
    
          
          </View>
          <View sm}>
            <Text style>
    
              {g
            </Text>
          </View>
    sItem}>
            xt>
            <Tex
    able)}
            </Text>
          </View>
          <View ssItem}>
            <Text styleText>
            <Text y) }]}>
              {getStvity)}
    
          </View>
        </View>
      </View>

      {/* Internal State */}
    
        <Vi
          <Text style={styles.se</Text>
          <Text ugText}>
            Session 
          </Text>
    xt}>
            Visset'}
          </Text>
          <Text style={st}>
            Initized)}
    ext>
   

          </Text>        <Text stylugPanel;lyticsDebault Anart def);

expo,
}
  } 16,inTop:,
    margnter'cegn: '
    textAliSize: 12,
    font66', color: '#6: {
   
  timestamp
  },t: 'bold',   fontWeigh
 : 'center',Align,
    textolor: '#fff'
    ct: {ttonTex
  },
  buttom: 8,    marginBo8%',
width: '4s: 8,
    diu borderRa12,
   g: din,
    pad0'lor: '#4CAF5kgroundCo bac  n: {
 
  butto,
  },ottom: 16
    marginBen',-betwetent: 'spacestifyConp',
    jurap: 'wra,
    flexWrow' 'Direction:
    flexainer: {  buttonCont},
tom: 4,
  nBot
    margi4,: 1fontSize    
FF9800',   color: '#
 {endation: 
  recomme: 10,
  },   fontSizc',
 : '#cc   colortTime: {
 
  evene: 12,
  },ntSiz
    fo#fff',    color: 'sage: {

  eventMes
  },e: 12,fontSiz',
    ight: 'bold   fontWe00',
 C5 color: '#FF
   e: {Typevent },
  
  4,nBottom:   margi 4,
 adius:    borderR,
dding: 82e',
    paolor: '#2c2cckgroundC  batItem: {
  
  even
  },e',acosp 'mon fontFamily:m: 4,
   ttorginBo14,
    ma fontSize: ,
   olor: '#fff'
    c{ebugText: ,
  d  }: 'bold',
ntWeightfo 16,
    e:
    fontSizalue: {usVstat,
  e: 14,
  }
    fontSizc',: '#cc  color: {
  atusLabel,
  st: 8,
  }arginBottom8%',
    mwidth: '4tem: {
    tatusI
  s},,
  een'ce-betwntent: 'spa  justifyCo
  : 'wrap',   flexWrap 'row',
 ection: flexDir{
   atusGrid: 
  st
  },2,Bottom: 1margin0',
    '#FFC50or:   colold',
  ht: 'btWeig  fon: 18,
      fontSize: {
Titleoncti  },
  se,
ottom: 16 marginB,
    16ng: paddi  ius: 8,
 rRad   borde1c1e',
  '#1cr:oloackgroundC
    bsection: {
   20,
  },ttom:arginBo,
    mer'ign: 'cent  textAl
  '#FFC500',olor: 
    cld',eight: 'bo,
    fontW 24 fontSize:
   title: {,
  },
   16    padding: '#000',
oundColor:ckgr ba   flex: 1,
er: {
    ontaine({
  ceatet.crleShetyles = Sty

const s};  );
ew>
crollVi
    </S     </Text>}
 ) : 'Never'leString().toLoca.timestamp(debugInfoatemp ? new DimestaebugInfo.td: {dast update     L}>
   es.timestampyl={stylext st<Tew>

        </Vieext>
           </Ture
  captl-time eventhows rea. Monitor s   5    
   \n'}ectivity{'network conn" to verify Sendst "Te Use      4.}
     gs{'\n'nalytics lo for aconsole. Check     3
      '}\n send{'e batchrcto fop und apund/foregroBackgro 2. 
         nts{'\n'} eveto triggerns en screee betwe Navigat  1.   }>
     bugText.deestyle={st styl     <Tex  t>
 Tips</Tex>💡 Debug tionTitle}les.secstytyle={t s<Tex      
  tion}>ecstyles.sView style={
      <ctions */} Instru{/* Debugw>

      </Vie     acity>
 TouchableOp    </xt>
    /Tes<ear Log️ ClonText}>🗑es.buttyltyle={st<Text s    
      gs}>ss={clearLoutton} onPrele={styles.bOpacity sty <Touchable            
 
  ity>ableOpac     </Touch
    </Text>        }
 itor'Montart or' : '▶️ S Monit '⏹️ Stopring ?Monito{is          nText}>
  styles.buttole={   <Text sty         >
      g}
torinMonigglePress={to  on} 
        2196F3' }]: '#? '#F44336' sMonitoring ndColor: irou { backgbutton,yles. style={[st   
      ty bleOpacicha<Tou 
               acity>
chableOp     </Tout>
   </Texst Send}>🧪 TetonText.buttylesyle={sext st  <T    }>
    estAnalytics{tss=Preons.button} {styleyle=ty stchableOpaciTou
        <
        eOpacity></Touchabl      
  /Text> Refresh<ttonText}>🔄{styles.butyle=   <Text s
       >nfo}ebugIs={refreshDreson} onPttstyles.butyle={ity sableOpacch   <Touner}>
     nContais.butto{style<View style=/}
      uttons *on B  {/* Acti
     )}
     w>
    </Vie ))}
       
      </Text>         • {rec}
          n}>
       endatios.recomm{stylestyle={index} ext key=  <T
          (ber) =>  index: num: string,p((rections.maecommenda.rbugInfo      {de
    </Text>ommendationsec>⚠️ RionTitle}styles.sectstyle={     <Text }>
     .sectionyle={stylesew st  <Vi
      0 && (h > gtdations?.lenmennfo.recombugI    {de/}
  mendations *  {/* Recom  iew>

      </V  ))}
  
      w> </Vie         )}</Text>
String(me.toLocaleTip)timestamate(event.w Dime}>{netTes.evenle={styl<Text sty          Text>
  e}</.messag>{eventage}ntMess={styles.eve style<Text          
  ext>pe}</T{event.tyntType}>yles.evetyle={stt s    <Tex
        eventItem}>e={styles.{index} stylew key=<Vi
          > (umber) =ny, index: nnt: a3).map((evelice(-Queue?.sgInfo.event     {debu/Text>
   
        <0}length || uests?.workReqo.netbugInfequests: {detwork R      Ne>
    s.debugText}styleText style={ <>
       </Text        0}
length || eue?.Info.eventQudebug Events: { Captured
         ugText}>yles.debe={stt styl     <Tex
   vents</Text>ent Ele}>📝 RecnTitectio{styles.sxt style=        <Tection}>
e={styles.setylView s}
      <e */ Queu   {/* Event

   
      )}</View>      >
   </Text  g'}
       ot runninng' : 'Nniimer ? 'RunchTState.batfo.internal{debugIntch Timer:        Bat}>
     exbugTstyles.dele={ext sty     <Tt>
       </Tex        0} events
?.length || tQueueventate.einternalS{debugInfo.ueue:    Event Q
         bugText}>e={styles.de
  
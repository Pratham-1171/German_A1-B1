/* ============================================================
   SPACHTREPPE OFFLINE CONTENT + GENERATION UPGRADE
   Self-contained: no network, CDN, API or external dictionary.
   ============================================================ */
(function(){
  const EXTRA_VOCAB = `
A1|der|Alltag|everyday life|daily life
A1|die|Adresse|address|personal
A1|der|Anruf|call|communication
A1|die|Antwort|answer|communication
A1|der|Ausflug|trip|free time
A1|die|Bäckerei|bakery|shopping
A1|der|Bahnhof|train station|travel
A1|das|Badezimmer|bathroom|home
A1|die|Bank|bank|city
A1|der|Beruf|job, profession|work
A1|das|Bett|bed|home
A1|die|Bibliothek|library|city
A1|das|Brot|bread|food
A1|die|Brücke|bridge|city
A1|der|Bus|bus|transport
A1|der|Chef|boss|work
A1|die|Chefin|female boss|work
A1|der|Durst|thirst|health
A1|das|Essen|food, meal|food
A1|die|Familie|family|people
A1|der|Feierabend|end of workday|work
A1|das|Fenster|window|home
A1|der|Fehler|mistake|study
A1|die|Ferien|holidays|travel
A1|das|Fahrrad|bicycle|transport
A1|die|Freizeit|free time|daily life
A1|der|Freund|friend|people
A1|die|Freundin|female friend|people
A1|das|Frühstück|breakfast|food
A1|der|Garten|garden|home
A1|das|Geld|money|shopping
A1|das|Geschenk|gift|shopping
A1|die|Gesundheit|health|health
A1|das|Getränk|drink|food
A1|der|Geschmack|taste|food
A1|das|Geschäft|shop, business|shopping
A1|das|Glas|glass|home
A1|das|Glück|luck, happiness|feelings
A1|der|Hunger|hunger|food
A1|die|Jacke|jacket|clothing
A1|der|Koffer|suitcase|travel
A1|der|Kühlschrank|fridge|home
A1|die|Küche|kitchen|home
A1|der|Laden|shop|shopping
A1|das|Leben|life|people
A1|die|Liebe|love|feelings
A1|der|Markt|market|shopping
A1|das|Meer|sea|travel
A1|die|Nachricht|message, news|communication
A1|die|Nachbarschaft|neighborhood|city
A1|der|Name|name|personal
A1|die|Pause|break|work
A1|der|Preis|price|shopping
A1|das|Problem|problem|daily life
A1|der|Regen|rain|weather
A1|die|Reise|trip, journey|travel
A1|der|Schlüssel|key|home
A1|die|Schule|school|education
A1|der|Schüler|school student|education
A1|die|Schülerin|school student|education
A1|der|Schrank|cupboard|home
A1|der|Schuh|shoe|clothing
A1|die|Straße|street|city
A1|der|Tisch|table|home
A1|die|Tür|door|home
A1|die|Uhr|clock, time|daily life
A1|der|Urlaub|holiday|travel
A1|die|Woche|week|time
A1|das|Wetter|weather|weather
A1|die|Wohnung|apartment|home
A1|das|Zimmer|room|home
A1|-|allein|alone|people
A1|-|bekannt|known, familiar|people
A1|-|billig|cheap|shopping
A1|-|breit|wide|description
A1|-|dick|thick, fat|description
A1|-|dünn|thin|description
A1|-|fertig|finished, ready|daily life
A1|-|freundlich|friendly|people
A1|-|gesund|healthy|health
A1|-|kaputt|broken|daily life
A1|-|klar|clear|description
A1|-|krank|ill|health
A1|-|leer|empty|description
A1|-|müde|tired|feelings
A1|-|nervös|nervous|feelings
A1|-|pünktlich|punctual|time
A1|-|sauber|clean|home
A1|-|sicher|safe, sure|daily life
A1|-|stark|strong|description
A1|-|teuer|expensive|shopping
A1|-|wichtig|important|description
A1|-|wirklich|really|conversation
A1|-|zusammen|together|people
A1|-|zuerst|first|time
A1|-|danach|afterwards|time
A1|-|endlich|finally|time
A1|-|gern|gladly|conversation
A1|-|manchmal|sometimes|time
A1|-|oft|often|time
A1|-|selten|rarely|time
A1|-|sofort|immediately|time
A1|-|später|later|time
A1|-|schon|already|time
A1|-|noch|still, yet|time
A1|-|wieder|again|time
A1|die|Frage|question|communication
A1|das|Wort|word|language
A1|der|Satz|sentence|language
A1|die|Sprache|language|language
A1|das|Beispiel|example|study
A1|die|Antwort|answer|study
A1|die|Aufgabe|task, exercise|study
A1|das|Heft|notebook|study
A1|der|Stift|pen|study
A1|das|Papier|paper|study
A1|die|Prüfung|exam|study
A1|der|Kurs|course|study
A1|der|Unterricht|lesson, instruction|study
A1|das|Büro|office|work
A1|die|Arbeit|work|work
A1|der|Kollege|colleague|work
A1|die|Kollegin|female colleague|work
A1|die|Firma|company|work
A1|der|Termin|appointment|work
A1|die|E-Mail|email|communication
A1|das|Telefon|telephone|communication
A1|der|Computer|computer|technology
A1|das|Handy|mobile phone|technology
A1|das|Internet|internet|technology
A1|die|Webseite|website|technology
A2|die|Erfahrung|experience|work
A2|die|Entscheidung|decision|daily life
A2|die|Möglichkeit|possibility|daily life
A2|der|Grund|reason|communication
A2|das|Ziel|goal|study
A2|der|Plan|plan|daily life
A2|die|Idee|idea|communication
A2|der|Wunsch|wish|feelings
A2|die|Hoffnung|hope|feelings
A2|die|Meinung|opinion|communication
A2|der|Vorschlag|suggestion|communication
A2|der|Unterschied|difference|language
A2|die|Ähnlichkeit|similarity|language
A2|die|Gewohnheit|habit|daily life
A2|die|Veränderung|change|daily life
A2|die|Entwicklung|development|work
A2|die|Beziehung|relationship|people
A2|das|Verhältnis|relationship, ratio|people
A2|die|Gesellschaft|society|people
A2|die|Umgebung|surroundings|city
A2|die|Umwelt|environment|nature
A2|der|Verkehr|traffic|transport
A2|die|Haltestelle|stop|transport
A2|die|Fahrkarte|ticket|transport
A2|die|Verspätung|delay|transport
A2|der|Flughafen|airport|travel
A2|die|Unterkunft|accommodation|travel
A2|die|Buchung|booking|travel
A2|die|Rezeption|reception|travel
A2|der|Reisepass|passport|travel
A2|der|Ausweis|ID card|personal
A2|die|Polizei|police|city
A2|das|Krankenhaus|hospital|health
A2|die|Apotheke|pharmacy|health
A2|der|Arzt|doctor|health
A2|die|Ärztin|female doctor|health
A2|das|Medikament|medicine|health
A2|die|Schmerzen|pain|health
A2|die|Krankheit|illness|health
A2|die|Behandlung|treatment|health
A2|das|Rezept|prescription, recipe|health
A2|die|Ernährung|nutrition|health
A2|die|Bewegung|movement, exercise|health
A2|der|Sport|sport|health
A2|die|Miete|rent|home
A2|der|Nachbar|neighbor|home
A2|die|Nachbarin|female neighbor|home
A2|der|Lärm|noise|home
A2|die|Reparatur|repair|home
A2|die|Wohnungssuche|apartment search|home
A2|der|Vertrag|contract|work
A2|die|Rechnung|bill, invoice|shopping
A2|die|Kasse|checkout, cash desk|shopping
A2|der|Rabatt|discount|shopping
A2|das|Angebot|offer|shopping
A2|die|Qualität|quality|shopping
A2|die|Größe|size|shopping
A2|die|Farbe|colour|shopping
A2|der|Kunde|customer|shopping
A2|die|Kundin|female customer|shopping
A2|die|Lieferung|delivery|shopping
A2|die|Bestellung|order|shopping
A2|die|Auswahl|selection|shopping
A2|das|Gerät|device|technology
A2|die|Datei|file|technology
A2|der|Bildschirm|screen|technology
A2|die|Verbindung|connection|technology
A2|das|Passwort|password|technology
A2|der|Fehler|error, mistake|technology
A2|die|Sicherheit|security|technology
A2|der|Verein|club, association|people
A2|die|Veranstaltung|event|free time
A2|das|Konzert|concert|free time
A2|die|Ausstellung|exhibition|free time
A2|das|Museum|museum|free time
A2|die|Nachricht|message|communication
A2|der|Bericht|report|communication
A2|die|Zeitung|newspaper|communication
A2|der|Artikel|article|communication
A2|die|Sendung|programme, broadcast|media
A2|der|Film|film|media
A2|die|Serie|series|media
A2|das|Buch|book|media
A2|der|Roman|novel|media
A2|-|allerdings|however|connectors
A2|-|außerdem|besides|connectors
A2|-|deshalb|therefore|connectors
A2|-|deswegen|therefore|connectors
A2|-|trotzdem|nevertheless|connectors
A2|-|wahrscheinlich|probably|adverbs
A2|-|besonders|especially|adverbs
A2|-|ungefähr|approximately|adverbs
A2|-|ziemlich|quite|adverbs
A2|-|eigentlich|actually|adverbs
A2|-|leider|unfortunately|adverbs
A2|-|zumindest|at least|adverbs
A2|-|genug|enough|adverbs
B1|die|Verantwortung|responsibility|work
B1|die|Voraussetzung|requirement|work
B1|die|Bewerbung|application|work
B1|der|Lebenslauf|CV, résumé|work
B1|das|Vorstellungsgespräch|job interview|work
B1|die|Fähigkeit|ability|work
B1|die|Kenntnis|knowledge|study
B1|die|Ausbildung|vocational training|education
B1|der|Abschluss|qualification, degree|education
B1|das|Studium|university studies|education
B1|die|Forschung|research|education
B1|das|Ergebnis|result|study
B1|die|Lösung|solution|study
B1|die|Ursache|cause|communication
B1|die|Folge|consequence|communication
B1|der|Vorteil|advantage|communication
B1|der|Nachteil|disadvantage|communication
B1|die|Chance|opportunity|work
B1|das|Risiko|risk|work
B1|die|Kritik|criticism|communication
B1|der|Beweis|proof|communication
B1|die|Behauptung|claim|communication
B1|die|Bedeutung|meaning, significance|language
B1|der|Zusammenhang|connection, context|language
B1|die|Aussage|statement|communication
B1|die|Vermutung|assumption|communication
B1|der|Standpunkt|point of view|communication
B1|die|Absicht|intention|communication
B1|der|Einfluss|influence|communication
B1|die|Entscheidung|decision|communication
B1|die|Maßnahme|measure, action|work
B1|die|Lösung|solution|work
B1|die|Aufgabe|task|work
B1|die|Leistung|performance|work
B1|der|Fortschritt|progress|study
B1|die|Verbesserung|improvement|study
B1|die|Kenntnisse|knowledge, skills|study
B1|die|Vereinbarung|agreement|work
B1|die|Bedingung|condition|communication
B1|die|Erwartung|expectation|feelings
B1|die|Begeisterung|enthusiasm|feelings
B1|die|Enttäuschung|disappointment|feelings
B1|die|Geduld|patience|feelings
B1|die|Entscheidung|decision|daily life
B1|die|Möglichkeit|possibility|daily life
B1|die|Wirklichkeit|reality|communication
B1|die|Wahrheit|truth|communication
B1|die|Freiheit|freedom|society
B1|die|Gerechtigkeit|justice|society
B1|die|Verantwortung|responsibility|society
B1|die|Nachhaltigkeit|sustainability|environment
B1|der|Klimawandel|climate change|environment
B1|die|Verschmutzung|pollution|environment
B1|der|Verbrauch|consumption|environment
B1|die|Energie|energy|environment
B1|die|Ressource|resource|environment
B1|die|Technologie|technology|technology
B1|die|Anwendung|application, use|technology
B1|die|Funktion|function|technology
B1|die|Einstellung|setting, attitude|technology
B1|der|Datenschutz|data protection|technology
B1|die|Information|information|communication
B1|die|Meldung|report, notification|media
B1|der|Inhalt|content|media
B1|die|Quelle|source|media
B1|die|Werbung|advertising|media
B1|der|Eintritt|entrance, admission|free time
B1|die|Unterhaltung|entertainment|free time
B1|die|Freundschaft|friendship|people
B1|die|Einsamkeit|loneliness|feelings
B1|die|Entspannung|relaxation|health
B1|die|Belastung|strain|health
B1|die|Gewohnheit|habit|health
B1|die|Erholung|recovery, recreation|health
B1|-|ähnlich|similar|description
B1|-|unterschiedlich|different|description
B1|-|zuverlässig|reliable|description
B1|-|selbstständig|independent|people
B1|-|verantwortlich|responsible|people
B1|-|erfolgreich|successful|work
B1|-|notwendig|necessary|description
B1|-|möglich|possible|description
B1|-|unmöglich|impossible|description
B1|-|wahrscheinlich|probable|description
B1|-|unwahrscheinlich|unlikely|description
B1|-|deutlich|clear, significant|description
B1|-|wesentlich|essential|description
B1|-|verfügbar|available|description
B1|-|öffentlich|public|society
B1|-|privat|private|society
B1|-|gemeinsam|shared, jointly|people
B1|-|verschieden|different|description
B1|-|allgemein|general|description
B1|-|persönlich|personal|people
B1|-|ursprünglich|originally|time
B1|-|schließlich|finally, after all|connectors
B1|-|dennoch|nevertheless|connectors
B1|-|zudem|moreover|connectors
B1|-|währenddessen|meanwhile|connectors
B1|-|inzwischen|in the meantime|connectors
B1|-|einerseits|on the one hand|connectors
B1|-|andererseits|on the other hand|connectors
B1|-|dadurch|through this|connectors
B1|-|dadurch|as a result|connectors
`.trim();

  const extras = [];
  const seen = new Set(VOCAB.map(w => `${w.art}|${w.de}`.toLowerCase()));
  EXTRA_VOCAB.split(/\n+/).forEach(line => {
    const [level, art, de, en, topic] = line.split('|');
    const key = `${art}|${de}`.toLowerCase();
    if (!de || seen.has(key)) return;
    seen.add(key);
    extras.push({ n: 0, art, de, en, topic: topic || 'general', level });
  });
  let next = Math.max(0, ...VOCAB.map(w => Number(w.n) || 0)) + 1;
  extras.forEach(w => { w.n = next++; VOCAB.push(w); });

  const SYN_EXTRA = [
    ['schnell','fast','rasch','rapid','zügig','brisk'],['langsam','slow','gemächlich','leisurely','bedächtig','unhurried'],
    ['wichtig','important','bedeutend','significant','wesentlich','essential'],['richtig','correct','korrekt','correct','stimmig','sound'],
    ['falsch','wrong','inkorrekt','incorrect','irrtümlich','mistaken'],['beginnen','to begin','anfangen','start','starten','start'],
    ['enden','to end','aufhören','stop','beenden','finish'],['bekommen','to get','erhalten','receive','kriegen','get'],
    ['sagen','to say','äußern','express','mitteilen','communicate'],['erklären','to explain','beschreiben','describe','verdeutlichen','clarify'],
    ['fragen','to ask','sich erkundigen','inquire','nachfragen','ask again'],['antworten','to answer','erwidern','reply','reagieren','respond'],
    ['kaufen','to buy','erwerben','purchase','besorgen','get'],['verkaufen','to sell','anbieten','offer','veräußern','sell'],
    ['finden','to find','entdecken','discover','auffinden','locate'],['suchen','to search','nachforschen','investigate','stöbern','browse'],
    ['arbeiten','to work','tätig sein','be employed','schaffen','work/create'],['wohnen','to live','leben','live','ansässig sein','reside'],
    ['reisen','to travel','fahren','travel','unterwegs sein','be on the road'],['helfen','to help','unterstützen','support','beistehen','assist'],
    ['beginnen','to begin','anfangen','start','loslegen','get started'],['sicher','safe/sure','geschützt','protected','gewiss','certain'],
    ['ruhig','calm','gelassen','composed','still','quiet'],['laut','loud','geräuschvoll','noisy','lautstark','loud'],
    ['glücklich','happy','froh','glad','zufrieden','content'],['traurig','sad','unglücklich','unhappy','niedergeschlagen','downcast'],
    ['schön','beautiful','hübsch','pretty','wunderschön','gorgeous'],['hässlich','ugly','unschön','unattractive','unansehnlich','unsightly'],
    ['groß','big','riesig','huge','gewaltig','enormous'],['klein','small','winzig','tiny','gering','minor'],
    ['schwierig','difficult','kompliziert','complicated','anspruchsvoll','challenging'],['einfach','simple','leicht','easy','unkompliziert','straightforward'],
    ['möglich','possible','machbar','feasible','realisierbar','realizable'],['notwendig','necessary','erforderlich','required','nötig','needed'],
    ['oft','often','häufig','frequently','regelmäßig','regularly'],['selten','rarely','kaum','hardly','gelegentlich','occasionally'],
    ['vielleicht','maybe','eventuell','possibly','möglicherweise','perhaps'],['wirklich','really','tatsächlich','actually','wahrhaftig','truly']
  ];
  SYN_EXTRA.forEach(x => {
    const [word,en,a,ae,b,be] = x;
    if (!SYNONYMS.some(s => s.word === word)) SYNONYMS.push({word,en,syn:[[a,ae],[b,be]]});
    else { const s=SYNONYMS.find(s=>s.word===word); [[a,ae],[b,be]].forEach(v=>{if(!s.syn.some(z=>z[0]===v[0]))s.syn.push(v);}); }
  });

  const OPP_EXTRA = [
    ['arm','poor','reich','rich'],['trocken','dry','nass','wet'],['gesund','healthy','krank','ill'],
    ['freundlich','friendly','unfreundlich','unfriendly'],['höflich','polite','unhöflich','rude'],
    ['geduldig','patient','ungeduldig','impatient'],['mutig','brave','ängstlich','afraid'],
    ['aktiv','active','passiv','passive'],['öffentlich','public','privat','private'],
    ['gemeinsam','shared','getrennt','separate'],['möglich','possible','unmöglich','impossible'],
    ['wahrscheinlich','probable','unwahrscheinlich','unlikely'],['notwendig','necessary','unnötig','unnecessary'],
    ['erfolgreich','successful','erfolglos','unsuccessful'],['bekannt','known','unbekannt','unknown'],
    ['ähnlich','similar','unterschiedlich','different'],['modern','modern','altmodisch','old-fashioned'],
    ['aktiv','active','inaktiv','inactive'],['privat','private','öffentlich','public'],
    ['Anfang','beginning','Ende','end'],['Gewinn','profit','Verlust','loss'],['Erfolg','success','Misserfolg','failure'],
    ['Vorteil','advantage','Nachteil','disadvantage'],['Lösung','solution','Problem','problem'],
    ['Ursache','cause','Folge','consequence'],['Liebe','love','Hass','hate'],['Freiheit','freedom','Gefangenschaft','captivity']
  ];
  OPP_EXTRA.forEach(x => { if(!OPPOSITES.some(o=>o[0]===x[0]&&o[2]===x[2])) OPPOSITES.push(x); });

  const EXTRA_COLLOCATIONS = [
    ['einen Termin absagen','to cancel an appointment','absagen','Ich muss den Termin leider absagen.'],
    ['einen Termin verschieben','to postpone an appointment','verschieben','Können wir den Termin verschieben?'],
    ['eine Entscheidung treffen','to make a decision','treffen','Wir müssen eine Entscheidung treffen.'],
    ['eine Meinung äußern','to express an opinion','äußern','Sie äußert ihre Meinung ruhig.'],
    ['eine Frage beantworten','to answer a question','beantworten','Kannst du die Frage beantworten?'],
    ['eine Prüfung bestehen','to pass an exam','bestehen','Er hat die Prüfung bestanden.'],
    ['eine Prüfung ablegen','to take an exam','ablegen','Nächste Woche legt sie die Prüfung ab.'],
    ['Fortschritte machen','to make progress','machen','Du machst große Fortschritte.'],
    ['eine Rolle spielen','to play a role','spielen','Geld spielt hier keine Rolle.'],
    ['eine Lösung finden','to find a solution','finden','Wir müssen eine Lösung finden.'],
    ['Verantwortung übernehmen','to take responsibility','übernehmen','Sie übernimmt Verantwortung für das Projekt.'],
    ['Erfahrung sammeln','to gain experience','sammeln','Im Praktikum sammelt er Erfahrung.'],
    ['Interesse haben an','to be interested in','haben','Ich habe Interesse an dem Kurs.'],
    ['sich Sorgen machen','to worry','machen','Mach dir keine Sorgen.'],
    ['sich Mühe geben','to make an effort','geben','Ich gebe mir Mühe.'],
    ['in Kontakt bleiben','to stay in contact','bleiben','Wir bleiben in Kontakt.'],
    ['Kontakt aufnehmen','to get in contact','aufnehmen','Ich nehme morgen Kontakt mit ihr auf.'],
    ['eine Nachricht hinterlassen','to leave a message','hinterlassen','Bitte hinterlassen Sie eine Nachricht.'],
    ['einen Antrag ausfüllen','to fill out an application','ausfüllen','Bitte füllen Sie den Antrag aus.'],
    ['einen Vertrag unterschreiben','to sign a contract','unterschreiben','Er unterschreibt den Vertrag heute.'],
    ['eine Beschwerde einreichen','to submit a complaint','einreichen','Sie reicht eine Beschwerde ein.'],
    ['Kosten sparen','to save costs','sparen','Wir wollen Kosten sparen.'],
    ['Geld ausgeben','to spend money','ausgeben','Ich gebe nicht viel Geld aus.'],
    ['Zeit sparen','to save time','sparen','So sparen wir Zeit.'],
    ['Zeit verbringen','to spend time','verbringen','Wir verbringen den Abend zusammen.'],
    ['eine Pause machen','to take a break','machen','Wir machen eine kurze Pause.'],
    ['sich vorbereiten auf','to prepare for','vorbereiten','Ich bereite mich auf die Prüfung vor.'],
    ['sich entscheiden für','to decide in favor of','entscheiden','Ich entscheide mich für den Kurs.'],
    ['Bescheid sagen','to let someone know','sagen','Sag mir bitte Bescheid.'],
    ['Recht haben','to be right','haben','Du hast Recht.'],
    ['Unrecht haben','to be wrong','haben','Da hast du Unrecht.']
  ];
  EXTRA_COLLOCATIONS.forEach(x=>{ if(!COLLOCATIONS.some(c=>c.phrase===x[0])) COLLOCATIONS.push({phrase:x[0],en:x[1],verb:x[2],ex:x[3],exEn:''}); });

  // Relations for the exercise engine. Only use relations we explicitly know.
  const REL = {
    groß:['klein'],klein:['groß'],schnell:['langsam'],langsam:['schnell'],gut:['schlecht'],schlecht:['gut'],neu:['alt'],alt:['neu'],
    heiß:['kalt'],kalt:['heiß'],hell:['dunkel'],dunkel:['hell'],leicht:['schwer'],schwer:['leicht'],lang:['kurz'],kurz:['lang'],
    reich:['arm'],arm:['reich'],früh:['spät'],spät:['früh'],laut:['leise'],leise:['laut'],voll:['leer'],leer:['voll'],
    offen:['geschlossen'],geschlossen:['offen'],richtig:['falsch'],falsch:['richtig'],stark:['schwach'],schwach:['stark'],
    glücklich:['traurig'],traurig:['glücklich'],sauber:['schmutzig'],schmutzig:['sauber'],teuer:['billig'],billig:['teuer'],
    möglich:['unmöglich'],unmöglich:['möglich'],ähnlich:['unterschiedlich'],unterschiedlich:['ähnlich'],öffentlich:['privat'],privat:['öffentlich'],
    erfolgreich:['erfolglos'],erfolglos:['erfolgreich'],bekannt:['unbekannt'],unbekannt:['bekannt'],notwendig:['unnötig'],unnötig:['notwendig']
  };
  window.__SP_REL = REL;
})();

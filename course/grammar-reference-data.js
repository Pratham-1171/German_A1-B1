/* Source module: grammar-reference-data.js
 * Grammar reference lessons and examples.
 * Build: scripts/build-course.py concatenates modules in its declared order.
 */
const GRAMMAR_DATA = [
  {level:'A1', title:'Foundation', items:[
    {title:'sein & haben', explanation:'Irregular; used in almost every sentence.',
     rule:`sein             haben
ich bin          ich habe
du bist          du hast
er/sie/es ist    er/sie/es hat
wir sind         wir haben
ihr seid         ihr habt
sie/Sie sind     sie/Sie haben`,
     examples:[['Ich bin müde.','I am tired.'],['Wir sind aus Indien.','We are from India.'],['Er hat einen Hund.','He has a dog.']],
     mistakes:[['❌ Ich bin 25 Jahre.','✅ Ich bin 25 Jahre alt.'],['❌ Ich bin Hunger.','✅ Ich habe Hunger.']],
     exercise:{q:'Complete: "Wir ___ aus Deutschland."',options:['seid','sind','bin','ist'],correct:1,why:'wir → sind'}},
    {title:'Präsens (regular)', explanation:'Stem + endings.',
     rule:`machen → mach-
ich mache   du machst   er macht
wir machen  ihr macht   sie machen`,
     examples:[['Ich mache Hausaufgaben.','I do homework.'],['Du spielst Fußball.','You play soccer.'],['Wir lernen Deutsch.','We learn German.']],
     mistakes:[['❌ Ich machen Hausaufgaben.','✅ Ich mache Hausaufgaben.']],
     exercise:{q:'Complete: "Du ___ gern Musik." (hören)',options:['höre','hörst','hört','hören'],correct:1,why:'du → hörst'}},
    {title:'Articles — der/die/das', explanation:'Every noun has a gender.',
     rule:`der → masculine
die → feminine
das → neuter
die → plural`,
     examples:[['Der Mann liest.','The man reads.'],['Die Frau trinkt Kaffee.','The woman drinks coffee.'],['Das Kind spielt.','The child plays.']],
     mistakes:[['❌ Der Frau ist müde.','✅ Die Frau ist müde.']],
     exercise:{q:'Which article with "Mädchen"?',options:['der','die','das'],correct:2,why:'-chen → neuter'}},
    {title:'Akkusativ', explanation:'Direct object; only masculine changes.',
     rule:`der → den    ein → einen
die → die    eine → eine
das → das    ein  → ein`,
     examples:[['Ich sehe den Mann.','I see the man.'],['Ich kaufe einen Apfel.','I buy an apple.']],
     mistakes:[['❌ Ich sehe der Mann.','✅ Ich sehe den Mann.']],
     exercise:{q:'Complete: "Er kauft ___ Computer."',options:['der','den','dem','des'],correct:1,why:'Akk. masc → den'}},
    {title:'Dativ', explanation:'Indirect object + certain verbs.',
     rule:`der → dem   die → der
das → dem   die(pl) → den +n

Dativ verbs: helfen, danken, gefallen`,
     examples:[['Ich gebe dem Mann das Buch.','I give the man the book.'],['Ich helfe meiner Mutter.','I help my mother.']],
     mistakes:[['❌ Ich helfe mein Freund.','✅ Ich helfe meinem Freund.']],
     exercise:{q:'Complete: "Ich helfe ___ Frau."',options:['die','der','den','das'],correct:1,why:'helfen + Dativ'}},
    {title:'Modal verbs', explanation:'Ability, necessity, permission.',
     rule:`können, müssen, wollen, sollen, dürfen, mögen
Ich muss heute arbeiten.`,
     examples:[['Ich muss heute arbeiten.','I have to work today.'],['Kannst du mir helfen?','Can you help me?']],
     mistakes:[['❌ Ich muss arbeiten heute.','✅ Ich muss heute arbeiten.']],
     exercise:{q:'Which is correct?',options:['Ich muss gehen nach Hause.','Ich muss nach Hause gehen.'],correct:1,why:'Modal pos 2, inf at end'}},
    {title:'Perfekt', explanation:'Spoken past: haben/sein + Partizip II.',
     rule:`Regular: ge- + stem + -t
machen → gemacht

Irregular: ge- + (changed) + -en
sprechen → gesprochen

Separable: prefix + ge- + stem
anrufen → angerufen`,
     examples:[['Ich habe gestern gearbeitet.','I worked yesterday.'],['Er ist nach Berlin gefahren.','He went to Berlin.']],
     mistakes:[['❌ Ich habe nach Berlin gefahren.','✅ Ich bin nach Berlin gefahren.']],
     exercise:{q:'"Wir ___ gestern ins Kino ___."',options:['haben / gegangen','sind / gegangen','sind / gegeht'],correct:1,why:'gehen → sein'}},
    {title:'Word order — position 2', explanation:'Verb is always in position 2 in a main clause.',
     rule:`Position:  1     2      3       4
Standard:  Ich   fahre  heute   nach Berlin.
Inverted:  Heute fahre  ich     nach Berlin.`,
     examples:[['Ich fahre heute mit dem Bus.','I go by bus today.'],['Heute fahre ich mit dem Bus.','Today I go by bus.']],
     mistakes:[['❌ Heute ich fahre mit dem Bus.','✅ Heute fahre ich mit dem Bus.']],
     exercise:{q:'Which is correct?',options:['Morgen ich gehe ins Kino.','Morgen gehe ich ins Kino.'],correct:1,why:'Verb position 2'}}
  ]},
  {level:'A2', title:'Intermediate', items:[
    {title:'Possessives in Dativ', explanation:'mein/dein/sein… change like "ein".',
     rule:`masc/neut → -em
fem → -er
plural → -en`,
     examples:[['Ich fahre mit meinem Bruder.','With my brother.'],['Ich spreche mit meiner Schwester.','With my sister.'],['Ich fahre mit meinen Freunden.','With my friends.']],
     mistakes:[['❌ mit mein Bruder','✅ mit meinem Bruder']],
     exercise:{q:'"Ich spreche mit ___ Lehrerin."',options:['mein','meine','meiner','meinen'],correct:2,why:'fem → meiner'}},
    {title:'weil — reason', explanation:'Verb goes to the end.',
     rule:`Main + , + weil + Subj + ... + Verb (end)`,
     examples:[['Ich bleibe zu Hause, weil ich krank bin.','I stay home because I am ill.'],['Er kommt nicht, weil er arbeiten muss.','He is not coming because he has to work.']],
     mistakes:[['❌ weil ich bin krank.','✅ weil ich krank bin.']],
     exercise:{q:'"Ich lerne Deutsch, weil ich in Berlin ___."',options:['wohne','ich wohne','wohnen'],correct:0,why:'Verb at end'}},
    {title:'dass — reported info', explanation:'Verb at end.',
     rule:`Main + , + dass + Subj + ... + Verb (end)`,
     examples:[['Ich weiß, dass er heute arbeitet.','I know that he works today.'],['Sie sagt, dass sie morgen kommt.','She says she is coming tomorrow.']],
     mistakes:[['❌ dass er kommt heute.','✅ dass er heute kommt.']],
     exercise:{q:'"Sie sagt, ___ sie morgen kommt."',options:['das','dass','wenn'],correct:1,why:'dass = conjunction'}},
    {title:'wenn — condition', explanation:'if / whenever.',
     rule:`Wenn ich Zeit habe, gehe ich ins Kino.`,
     examples:[['Wenn ich Zeit habe, gehe ich ins Kino.','If I have time, I go to the cinema.'],['Wenn ich müde bin, trinke ich Kaffee.','Whenever I am tired, I drink coffee.']],
     mistakes:[['❌ Wenn ich ein Kind war, ...','✅ Als ich ein Kind war, ...']],
     exercise:{q:'"___ ich Zeit habe, komme ich."',options:['Als','Wenn','Dass'],correct:1,why:'Present condition → wenn'}},
    {title:'als vs. wenn', explanation:'One past situation → als. Otherwise → wenn.',
     rule:`als → one past situation
wenn → present, future, conditions, repeated`,
     examples:[['Als ich ein Kind war, spielte ich Fußball.','When I was a child...'],['Wenn ich in Ahmedabad bin, treffe ich Freunde.','When I am in Ahmedabad...']],
     mistakes:[['❌ Wenn ich ein Kind war, ...','✅ Als ich ein Kind war, ...']],
     exercise:{q:'"___ ich 18 war, wohnte ich in Delhi."',options:['Wenn','Als','Ob'],correct:1,why:'past-specific → als'}},
    {title:'Indirect W-questions', explanation:'W-word stays; verb to end.',
     rule:`Main + , + W-word + Subj + ... + Verb (end)`,
     examples:[['Ich weiß nicht, wo er wohnt.','I don\'t know where he lives.'],['Weißt du, wann der Kurs beginnt?','Do you know when the course starts?']],
     mistakes:[['❌ wann kommt er.','✅ wann er kommt.']],
     exercise:{q:'"Ich weiß nicht, ___ er wohnt."',options:['wo','wohnt','wo er'],correct:0,why:'W-word stays'}},
    {title:'ob — indirect yes/no', explanation:'Yes/no → ob.',
     rule:`Main + , + ob + Subj + ... + Verb (end)`,
     examples:[['Ich weiß nicht, ob er heute kommt.','I don\'t know whether he is coming today.'],['Sie fragt, ob ich Deutsch spreche.','She asks whether I speak German.']],
     mistakes:[['❌ ob kommt er.','✅ ob er kommt.']],
     exercise:{q:'"Ich weiß nicht, ___ das richtig ist."',options:['ob','wenn','dass'],correct:0,why:'yes/no → ob'}},
    {title:'deshalb — therefore', explanation:'Adverb, not subordinating.',
     rule:`Deshalb + Verb + Subjekt + ...`,
     examples:[['Ich habe viel gearbeitet. Deshalb bin ich müde.','I worked a lot. That\'s why I\'m tired.'],['Deshalb gehe ich nach Hause.','That\'s why I\'m going home.']],
     mistakes:[['❌ Deshalb ich bin müde.','✅ Deshalb bin ich müde.']],
     exercise:{q:'Which is correct?',options:['Deshalb ich gehe nach Hause.','Deshalb gehe ich nach Hause.'],correct:1,why:'Verb pos 2'}},
    {title:'trotzdem — nevertheless', explanation:'Like deshalb.',
     rule:`Trotzdem + Verb + Subjekt + ...`,
     examples:[['Es regnet. Trotzdem gehe ich spazieren.','It rains. Nevertheless I go for a walk.']],
     mistakes:[['❌ Trotzdem ich gehe zur Arbeit.','✅ Trotzdem gehe ich zur Arbeit.']],
     exercise:{q:'Which is correct?',options:['Trotzdem ich bin müde, arbeite ich.','Ich bin müde, trotzdem arbeite ich.'],correct:1,why:'Verb pos 2'}},
    {title:'Modal verbs in Präteritum', explanation:'Simple past for modals.',
     rule:`können → konnte   müssen → musste
wollen → wollte   sollen → sollte
dürfen → durfte   mögen → mochte`,
     examples:[['Ich konnte Deutsch sprechen.','I was able to speak German.'],['Ich musste gestern arbeiten.','I had to work yesterday.']],
     mistakes:[['❌ Ich habe gemusst arbeiten.','✅ Ich musste arbeiten.']],
     exercise:{q:'Präteritum of "müssen" (ich)?',options:['musste','müsste','gemusst'],correct:0,why:'Drop umlaut + -te'}},
    {title:'könnte — polite', explanation:'Konjunktiv II of können.',
     rule:`ich könnte — du könntest — er könnte`,
     examples:[['Ich könnte morgen kommen.','I could come tomorrow.'],['Könnten Sie mir helfen?','Could you help me?']],
     mistakes:[['❌ Kannst du mir helfen?','✅ Könntest du mir helfen?']],
     exercise:{q:'"___ Sie mir bitte helfen?"',options:['Können','Könnten','Konnten'],correct:1,why:'Konj II polite'}},
    {title:'sollte — advice', explanation:'Should.',
     rule:`Subjekt + sollte + ... + Infinitiv (end)`,
     examples:[['Du solltest mehr lernen.','You should study more.'],['Du solltest mehr Wasser trinken.','You should drink more water.']],
     mistakes:[['❌ Du sollst mehr lernen.','✅ Du solltest mehr lernen.']],
     exercise:{q:'"Du ___ mehr schlafen."',options:['sollst','solltest','willst'],correct:1,why:'advice → solltest'}},
    {title:'Konjunktiv II general', explanation:'Wishes, hypotheticals.',
     rule:`wäre (sein)      hätte (haben)
ich wäre         ich hätte
du wärst         du hättest
würde + Infinitiv for other verbs`,
     examples:[['Ich wäre gern in Berlin.','I would like to be in Berlin.'],['Ich hätte gern einen Kaffee.','I would like a coffee.'],['Wenn ich Zeit hätte, würde ich kommen.','If I had time, I would come.']],
     mistakes:[['❌ Wenn ich wäre reich...','✅ Wenn ich reich wäre...']],
     exercise:{q:'"Wenn ich Zeit ___, würde ich kommen."',options:['habe','hatte','hätte'],correct:2,why:'Unreal → hätte'}},
    {title:'Adjective endings (def article)', explanation:'-e in a few spots; -en elsewhere.',
     rule:`-e in: Nom sing (all), Akk fem, Akk neut
-en in: everything else`,
     examples:[['der kleine Hund → den kleinen Hund','the small dog'],['die schöne Stadt → in der schönen Stadt','the beautiful city']],
     mistakes:[['❌ der neu Film','✅ der neue Film']],
     exercise:{q:'"Ich sehe den ___ Mann." (jung)',options:['junge','jungen','junger'],correct:1,why:'Akk masc after den → -en'}},
    {title:'Adjective endings (ein-words)', explanation:'Adj carries missing info.',
     rule:`Nom m → ein guter Mann
Akk m → einen guten Mann
Nom n → ein gutes Kind`,
     examples:[['mein guter Freund','my good friend'],['meinen guten Freund','my good friend (Akk)'],['kein gutes Auto','no good car']],
     mistakes:[['❌ ein gute Mann','✅ ein guter Mann']],
     exercise:{q:'"Ich habe ___ Auto." (neu)',options:['ein neu','ein neues','eine neue'],correct:1,why:'neuter → -es'}},
    {title:'ohne + Akkusativ', explanation:'without → accusative.',
     rule:`ohne + Akkusativ`,
     examples:[['Ich gehe ohne meinen Bruder.','I go without my brother.'],['Kaffee ohne Zucker.','Coffee without sugar.']],
     mistakes:[['❌ ohne meinem Bruder','✅ ohne meinen Bruder']],
     exercise:{q:'"Ich komme ohne ___ Freund."',options:['mein','meinen','meinem'],correct:1,why:'ohne → Akk.'}},
    {title:'mit + Dativ', explanation:'with → dative.',
     rule:`mit + Dativ`,
     examples:[['Ich fahre mit meinem Freund.','I travel with my friend.'],['Ich komme mit dem Zug.','I come by train.']],
     mistakes:[['❌ mit meinen Freund','✅ mit meinem Freund']],
     exercise:{q:'"mit ___ Freund"',options:['meinen','meinem'],correct:1,why:'mit → Dat.'}},
    {title:'Wo / Wohin / Woher', explanation:'Three questions, three rules.',
     rule:`Wo?  → Dativ
Wohin? → Akkusativ
Woher? → aus/von`,
     examples:[['Ich bin in der Schule.','I am at school.'],['Ich gehe in die Schule.','I go to school.'],['Ich lege das Buch auf den Tisch.','I put the book on the table.']],
     mistakes:[['❌ Ich gehe in der Schule.','✅ Ich gehe in die Schule.']],
     exercise:{q:'"Ich gehe ___ Kino."',options:['in dem','im','ins'],correct:2,why:'in das → ins'}},
    {title:'Position vs placement verbs', explanation:'Position (Wo?) vs placement (Wohin?).',
     rule:`stehen/stellen  liegen/legen
sitzen/setzen    hängen/hängen`,
     examples:[['Die Flasche steht auf dem Tisch. / Ich stelle die Flasche auf den Tisch.','Position / Placement'],['Das Buch liegt auf dem Tisch. / Ich lege das Buch auf den Tisch.','Position / Placement']],
     mistakes:[['❌ Die Flasche stellt auf dem Tisch.','✅ Die Flasche steht auf dem Tisch.']],
     exercise:{q:'"Ich ___ das Buch auf den Tisch."',options:['liege','lege'],correct:1,why:'placement → legen'}},
    {title:'Dativ + Akkusativ verbs', explanation:'Person → Dativ; thing → Akkusativ.',
     rule:`Two nouns: Dativ before Akkusativ
Two pronouns: Akkusativ before Dativ`,
     examples:[['Ich gebe dem Mann das Buch.','I give the man the book.'],['Ich gebe es ihm.','I give it to him.']],
     mistakes:[['❌ Ich gebe ihm es.','✅ Ich gebe es ihm.']],
     exercise:{q:'Which is correct?',options:['Ich gebe ihm es.','Ich gebe es ihm.'],correct:1,why:'Akk before Dat'}},
    {title:'Relative clauses', explanation:'Adds info; verb to end.',
     rule:`Nom: der/die/das/die
Akk: den/die/das/die
Dat: dem/der/dem/denen`,
     examples:[['Der Mann, der dort steht, ist mein Lehrer.','The man standing there is my teacher.'],['Die Frau, die mir hilft, ist nett.','The woman who helps me is nice.']],
     mistakes:[['❌ Das Buch, der ich lese...','✅ Das Buch, das ich lese...']],
     exercise:{q:'"Die Frau, ___ ich gesehen habe, ist nett."',options:['der','die','das','den'],correct:1,why:'fem acc → die'}},
    {title:'werden — full verb', explanation:'To become / get.',
     rule:`Präsens: ich werde, du wirst, er wird
Prät.: wurde     Perf.: bin geworden`,
     examples:[['Ich werde müde.','I am getting tired.'],['Er wird Arzt.','He is becoming a doctor.'],['Es wird kalt.','It is getting cold.']],
     mistakes:[['❌ Er wird ein Arzt.','✅ Er wird Arzt.']],
     exercise:{q:'"Es ___ kalt."',options:['wird','werde','geworden'],correct:0,why:'3sg → wird'}}
  ]},
  {level:'B1', title:'Advanced', items:[
    {title:'Konjunktiv II hypothetical', explanation:'Wishes, hypotheticals, polite.',
     rule:`würde + Infinitiv
hätte / wäre / könnte / sollte / müsste`,
     examples:[['Ich würde gerne mitkommen.','I would like to come.'],['Wenn ich reich wäre, würde ich reisen.','If I were rich, I would travel.']],
     mistakes:[['❌ Wenn ich wäre reich...','✅ Wenn ich reich wäre...']],
     exercise:{q:'"Wenn ich Zeit ___, ___ ich kommen."',options:['hätte / würde','habe / würde','hatte / werde'],correct:0,why:'Konj II'}},
    {title:'Passive voice', explanation:'Focus on action.',
     rule:`werden + Partizip II
Das Haus wird gebaut.
Das Haus wurde gebaut.
Das Haus ist gebaut worden.`,
     examples:[['Das Haus wird gebaut.','The house is being built.'],['Der Brief wurde gestern geschrieben.','The letter was written yesterday.']],
     mistakes:[['❌ ist gebaut geworden','✅ ist gebaut worden']],
     exercise:{q:'"Die Rechnung ___ gestern ___."',options:['wurde / bezahlt','wurde / bezahlen','ist / bezahlt'],correct:0,why:'Passive Prät.'}}
  ]}
];

/* ============================================================
   VERB / CONNECTOR / COLLOCATION / COMPARISON DATA
   ============================================================ */

/* Source module: vocabulary-data.js
 * Vocabulary topics and records.
 * Build: scripts/build-course.py concatenates modules in its declared order.
 */
const TOPICS = [
["Pronouns, Question Words & Basics","A1",`1|-|ich|I
2|-|du|you (informal)
3|-|er|he
4|-|sie|she
5|-|es|it
6|-|wir|we
7|-|ihr|you (plural informal)
8|-|sie / Sie|they / you (formal)
9|-|mein|my
10|-|dein|your
11|-|sein|his / its
12|-|unser|our
13|-|euer|your (pl.)
14|-|dieser|this
15|-|jener|that
16|-|man|one / you (general)
17|-|jemand|someone
18|-|niemand|no one
19|-|etwas|something
20|-|nichts|nothing
21|-|alle|all / everyone
22|-|viele|many
23|-|wenige|few
24|-|einige|some
25|-|jeder|every / each
26|-|beide|both
27|-|andere|other(s)
28|-|sich|oneself
29|-|selbst|self / oneself
30|-|wer|who
31|-|was|what
32|-|wo|where
33|-|wann|when
34|-|warum|why
35|-|wie|how
36|-|welcher|which
37|-|wessen|whose
38|-|woher|where from
39|-|wohin|where to
40|-|derselbe|the same one
41|-|jeglicher|any / every
42|-|sämtliche|all / entire
43|-|etliche|several / quite a few
44|-|kein|no / none
45|-|irgendein|any / some
46|-|irgendwer|anyone
47|-|irgendwas|anything
48|-|irgendwo|somewhere
49|-|derjenige|the one (who)
50|-|diejenige|the one (who, fem.)
51|-|wem|to whom
52|-|wen|whom
53|-|weshalb|for what reason
54|-|wieso|why`],
["Numbers & Quantities","A1",`56|-|null|zero
57|-|eins|one
58|-|zwei|two
59|-|drei|three
60|-|vier|four
61|-|fünf|five
62|-|sechs|six
63|-|sieben|seven
64|-|acht|eight
65|-|neun|nine
66|-|zehn|ten
67|-|elf|eleven
68|-|zwölf|twelve
69|-|dreizehn|thirteen
70|-|vierzehn|fourteen
71|-|fünfzehn|fifteen
72|-|sechzehn|sixteen
73|-|siebzehn|seventeen
74|-|achtzehn|eighteen
75|-|neunzehn|nineteen
76|-|zwanzig|twenty
77|-|dreißig|thirty
78|-|vierzig|forty
79|-|fünfzig|fifty
80|-|sechzig|sixty
81|-|siebzig|seventy
82|-|achtzig|eighty
83|-|neunzig|ninety
84|-|hundert|hundred
85|-|tausend|thousand
86|die|Million|million
87|-|erste|first
88|-|zweite|second
89|-|dritte|third
90|-|letzte|last
91|-|halb|half
92|das|Viertel|quarter
93|-|ganz|whole
94|das|Paar|pair / couple
95|das|Prozent|percent
96|das|Dutzend|dozen
97|-|mehr|more
98|-|weniger|less
99|-|genug|enough
100|-|ungefähr|approximately
101|die|Zahl|number
102|die|Menge|amount / quantity
103|-|einundzwanzig|twenty-one
104|-|hundertzwanzig|one hundred twenty
105|-|zweihundert|two hundred
106|die|Milliarde|billion
107|-|unendlich|infinite
108|die|Hälfte|half (noun)
109|das|Drittel|third (fraction)
110|-|doppelt|double
111|-|dreifach|triple
112|-|einzeln|individual / single
113|-|insgesamt|in total
114|-|durchschnittlich|on average
115|der|Durchschnitt|average
116|die|Summe|sum
117|-|addieren|to add
118|-|subtrahieren|to subtract
119|-|multiplizieren|to multiply
120|-|dividieren|to divide
121|die|Gleichung|equation
122|das|Ergebnis|result
123|-|berechnen|to calculate
124|die|Statistik|statistics
125|die|Formel|formula
126|das|Diagramm|diagram / chart
127|die|Kurve|curve
128|die|Achse|axis
129|-|messen|to measure
130|das|Maß|measurement
131|die|Waage|scale
132|-|wiegen|to weigh
133|-|zählen|to count
134|die|Ziffer|digit
135|die|Reihenfolge|order / sequence`],
["Time & Calendar","A1",`136|der|Montag|Monday
137|der|Dienstag|Tuesday
138|der|Mittwoch|Wednesday
139|der|Donnerstag|Thursday
140|der|Freitag|Friday
141|der|Samstag|Saturday
142|der|Sonntag|Sunday
143|der|Januar|January
144|der|Februar|February
145|der|März|March
146|der|April|April
147|der|Mai|May
148|der|Juni|June
149|der|Juli|July
150|der|August|August
151|der|September|September
152|der|Oktober|October
153|der|November|November
154|der|Dezember|December
155|der|Frühling|spring
156|der|Sommer|summer
157|der|Herbst|autumn
158|der|Winter|winter
159|die|Uhr|clock / o'clock
160|die|Minute|minute
161|die|Sekunde|second
162|die|Stunde|hour
163|die|Woche|week
164|der|Monat|month
165|das|Jahr|year
166|der|Tag|day
167|die|Nacht|night
168|der|Morgen|morning
169|der|Mittag|midday
170|der|Abend|evening
171|-|heute|today
172|-|morgen|tomorrow
173|-|gestern|yesterday
174|-|übermorgen|day after tomorrow
175|-|vorgestern|day before yesterday
176|-|jetzt|now
177|-|bald|soon
178|-|später|later
179|-|früh|early
180|-|spät|late
181|-|immer|always
182|-|manchmal|sometimes
183|-|oft|often
184|-|selten|rarely
185|-|nie|never
186|-|schon|already
187|-|noch|still / yet
188|das|Wochenende|weekend
189|der|Feiertag|holiday
190|der|Urlaub|vacation
191|die|Zukunft|future
192|die|Vergangenheit|past
193|der|Augenblick|moment
194|der|Moment|moment
195|die|Frist|deadline
196|die|Dauer|duration
197|-|dauern|to last
198|-|verspätet|delayed
199|-|pünktlich|punctual / on time
200|-|rechtzeitig|in time
201|-|vorher|beforehand
202|-|nachher|afterward
203|-|gleichzeitig|simultaneously
204|-|inzwischen|meanwhile
205|-|damals|back then
206|-|heutzutage|nowadays
207|-|künftig|upcoming / future
208|-|vergangen|past (adj.)
209|die|Epoche|era
210|das|Jahrhundert|century
211|das|Jahrzehnt|decade
212|die|Uhrzeit|time of day
213|die|Zeitzone|time zone
214|die|Sommerzeit|daylight saving time
215|die|Mitternacht|midnight
216|der|Sonnenaufgang|sunrise
217|der|Sonnenuntergang|sunset
218|die|Dämmerung|dusk / twilight`],
["Family & People","A1",`219|die|Familie|family
220|die|Mutter|mother
221|der|Vater|father
222|die|Eltern|parents
223|das|Kind|child
224|der|Sohn|son
225|die|Tochter|daughter
226|der|Bruder|brother
227|die|Schwester|sister
228|die|Großmutter|grandmother
229|der|Großvater|grandfather
230|die|Großeltern|grandparents
231|der|Onkel|uncle
232|die|Tante|aunt
233|der|Cousin|cousin (m)
234|die|Cousine|cousin (f)
235|der|Neffe|nephew
236|die|Nichte|niece
237|der|Mann|man / husband
238|die|Frau|woman / wife
239|das|Baby|baby
240|der|Freund|friend / boyfriend
241|die|Freundin|friend / girlfriend
242|der|Nachbar|neighbor (m)
243|die|Nachbarin|neighbor (f)
244|der|Mensch|person / human
245|die|Person|person
246|das|Mädchen|girl
247|der|Junge|boy
248|der|Erwachsene|adult
249|der|Ehemann|husband
250|die|Ehefrau|wife
251|die|Verwandten|relatives
252|der|Enkel|grandson
253|die|Enkelin|granddaughter
254|der|Partner|partner (m)
255|die|Partnerin|partner (f)
256|der|Chef|boss (m)
257|die|Chefin|boss (f)
258|der|Kollege|colleague
259|die|Schwiegermutter|mother-in-law
260|der|Schwiegervater|father-in-law
261|die|Schwägerin|sister-in-law
262|der|Schwager|brother-in-law
263|der|Stiefvater|stepfather
264|die|Stiefmutter|stepmother
265|das|Stiefkind|stepchild
266|die|Zwillinge|twins
267|der|Zwilling|twin
268|die|Verlobte|fiancée
269|der|Verlobte|fiancé
270|die|Generation|generation
271|die|Jugend|youth
272|das|Alter|age / old age
273|die|Kindheit|childhood
274|die|Pubertät|puberty
275|der|Teenager|teenager
276|der|Single|single person
277|die|Bekanntschaft|acquaintance
278|der|Bekannte|acquaintance (m.)
279|die|Gesellschaft|society / company
280|die|Gemeinschaft|community
281|das|Individuum|individual`],
["Body & Health","A1",`282|der|Körper|body
283|der|Kopf|head
284|das|Haar|hair
285|das|Gesicht|face
286|das|Auge|eye
287|die|Nase|nose
288|der|Mund|mouth
289|das|Ohr|ear
290|der|Zahn|tooth
291|der|Hals|neck / throat
292|die|Schulter|shoulder
293|der|Arm|arm
294|die|Hand|hand
295|der|Finger|finger
296|der|Bauch|stomach
297|der|Rücken|back
298|das|Bein|leg
299|der|Fuß|foot
300|das|Knie|knee
301|die|Haut|skin
302|das|Herz|heart
303|die|Gesundheit|health
304|die|Krankheit|illness
305|der|Schmerz|pain
306|das|Fieber|fever
307|die|Erkältung|cold (illness)
308|der|Husten|cough
309|die|Medizin|medicine
310|der|Arzt|doctor (m)
311|die|Ärztin|doctor (f)
312|das|Krankenhaus|hospital
313|die|Apotheke|pharmacy
314|die|Tablette|pill
315|die|Behandlung|treatment
316|der|Unfall|accident
317|die|Verletzung|injury
318|das|Rezept|prescription
319|-|müde|tired
320|-|krank|sick
321|-|gesund|healthy
322|-|stark|strong
323|-|schwach|weak
324|-|atmen|to breathe
325|-|husten|to cough
326|-|schlafen|to sleep
327|-|aufwachen|to wake up
328|-|sich fühlen|to feel
329|-|weh tun|to hurt
330|-|verletzt|injured
331|die|Diät|diet
332|die|Impfung|vaccination
333|die|Lunge|lung
334|die|Leber|liver
335|die|Niere|kidney
336|der|Magen|stomach (organ)
337|das|Gehirn|brain
338|der|Muskel|muscle
339|der|Knochen|bone
340|das|Blut|blood
341|die|Ader|vein
342|der|Puls|pulse
343|der|Blutdruck|blood pressure
344|die|Narbe|scar
345|die|Wunde|wound
346|-|bluten|to bleed
347|die|Allergie|allergy
348|die|Diagnose|diagnosis
349|die|Therapie|therapy
350|die|Operation|surgery
351|-|operieren|to operate
352|die|Spritze|injection / syringe
353|der|Verband|bandage
354|die|Krücke|crutch
355|der|Rollstuhl|wheelchair
356|die|Behinderung|disability
357|-|schwanger|pregnant
358|die|Schwangerschaft|pregnancy
359|die|Geburt|birth
360|-|gebären|to give birth
361|der|Tod|death
362|die|Ernährung|nutrition
363|die|Bewegung|movement / exercise
364|die|Übung|exercise / practice
365|die|Massage|massage
366|die|Zahnbürste|toothbrush
367|die|Zahnpasta|toothpaste
368|die|Seife|soap
369|das|Shampoo|shampoo
370|die|Creme|cream / lotion
371|die|Wimper|eyelash
372|die|Augenbraue|eyebrow
373|die|Stirn|forehead
374|das|Kinn|chin
375|die|Wange|cheek
376|die|Lippe|lip`],
["Food & Drink","A1",`377|das|Essen|food / meal
378|das|Brot|bread
379|die|Butter|butter
380|der|Käse|cheese
381|die|Milch|milk
382|das|Ei|egg
383|der|Zucker|sugar
384|das|Salz|salt
385|der|Pfeffer|pepper
386|das|Öl|oil
387|das|Fleisch|meat
388|das|Huhn|chicken
389|der|Fisch|fish
390|das|Gemüse|vegetables
391|das|Obst|fruit
392|der|Apfel|apple
393|die|Banane|banana
394|die|Orange|orange
395|die|Traube|grape
396|die|Kartoffel|potato
397|die|Tomate|tomato
398|die|Karotte|carrot
399|die|Zwiebel|onion
400|der|Salat|salad / lettuce
401|die|Suppe|soup
402|die|Nudeln|noodles / pasta
403|der|Reis|rice
404|das|Mehl|flour
405|der|Kuchen|cake
406|das|Gebäck|pastry
407|die|Schokolade|chocolate
408|der|Honig|honey
409|die|Marmelade|jam
410|das|Wasser|water
411|der|Kaffee|coffee
412|der|Tee|tea
413|der|Saft|juice
414|das|Bier|beer
415|der|Wein|wine
416|die|Limonade|lemonade / soda
417|das|Frühstück|breakfast
418|das|Mittagessen|lunch
419|das|Abendessen|dinner
420|der|Nachtisch|dessert
421|der|Hunger|hunger
422|der|Durst|thirst
423|-|lecker|tasty
424|-|süß|sweet
425|-|sauer|sour
426|-|bitter|bitter
427|-|salzig|salty
428|-|scharf|spicy
429|-|frisch|fresh
430|die|Speisekarte|menu
431|die|Rechnung|bill / check
432|der|Kellner|waiter
433|die|Kellnerin|waitress
434|-|bestellen|to order
435|-|kochen|to cook
436|-|essen|to eat
437|-|trinken|to drink
438|-|probieren|to try / taste
439|-|schmecken|to taste (good)
440|-|backen|to bake
441|-|braten|to fry / roast
442|-|schneiden|to cut
443|der|Teller|plate
444|die|Tasse|cup
445|das|Glas|glass
446|die|Gabel|fork
447|das|Messer|knife
448|der|Löffel|spoon
449|die|Serviette|napkin
450|der|Supermarkt|supermarket
451|die|Bäckerei|bakery
452|die|Metzgerei|butcher shop
453|-|einkaufen|to shop
454|die|Zitrone|lemon
455|die|Kirsche|cherry
456|die|Erdbeere|strawberry
457|die|Himbeere|raspberry
458|die|Ananas|pineapple
459|die|Melone|melon
460|die|Birne|pear
461|die|Aubergine|eggplant
462|die|Gurke|cucumber
463|der|Pilz|mushroom
464|der|Knoblauch|garlic
465|der|Spinat|spinach
466|die|Paprika|bell pepper
467|der|Kohl|cabbage
468|die|Bohne|bean
469|die|Erbse|pea
470|der|Mais|corn
471|die|Nuss|nut
472|die|Mandel|almond
473|das|Steak|steak
474|die|Wurst|sausage
475|der|Schinken|ham
476|das|Rindfleisch|beef
477|das|Schweinefleisch|pork
478|das|Lammfleisch|lamb
479|die|Garnele|shrimp
480|der|Lachs|salmon
481|der|Thunfisch|tuna
482|die|Sahne|cream (dairy)
483|der|Joghurt|yogurt
484|das|Müsli|muesli / cereal
485|der|Senf|mustard
486|die|Sauce|sauce
487|die|Mayonnaise|mayonnaise
488|das|Ketchup|ketchup
489|der|Eintopf|stew
490|die|Pizza|pizza
491|der|Hamburger|hamburger
492|das|Sandwich|sandwich
493|das|Speiseeis|ice cream
494|die|Waffel|waffle
495|der|Alkohol|alcohol
496|der|Sekt|sparkling wine
497|der|Whisky|whisky
498|der|Cocktail|cocktail
499|das|Mineralwasser|mineral water
500|die|Kalorie|calorie
501|-|vegetarisch|vegetarian
502|-|vegan|vegan
503|die|Zutat|ingredient
504|die|Beilage|side dish
505|die|Portion|portion
506|-|übrig|leftover (adj.)
507|der|Rest|rest / leftover
508|-|einfrieren|to freeze
509|-|auftauen|to thaw
510|-|verderben|to spoil / go bad
511|-|haltbar|non-perishable / durable
512|der|Mixer|blender
513|die|Pfanne|frying pan
514|der|Topf|pot
515|der|Deckel|lid
516|das|Sieb|strainer / sieve
517|die|Reibe|grater
518|das|Schneidebrett|cutting board
519|der|Dosenöffner|can opener
520|der|Korkenzieher|corkscrew
521|der|Geschirrspüler|dishwasher`],
["Home & Household","A1",`522|das|Haus|house
523|die|Wohnung|apartment
524|das|Zimmer|room
525|das|Wohnzimmer|living room
526|das|Schlafzimmer|bedroom
527|das|Badezimmer|bathroom
528|die|Küche|kitchen
529|der|Flur|hallway
530|der|Balkon|balcony
531|der|Garten|garden
532|die|Tür|door
533|das|Fenster|window
534|die|Wand|wall
535|der|Boden|floor
536|die|Decke|ceiling / blanket
537|das|Dach|roof
538|der|Tisch|table
539|der|Stuhl|chair
540|das|Sofa|sofa
541|das|Bett|bed
542|der|Schrank|cabinet / closet
543|das|Regal|shelf
544|die|Lampe|lamp
545|der|Spiegel|mirror
546|der|Teppich|carpet
547|der|Vorhang|curtain
548|das|Kissen|pillow
549|der|Herd|stove
550|der|Ofen|oven
551|der|Kühlschrank|refrigerator
552|die|Waschmaschine|washing machine
553|der|Fernseher|television
554|die|Heizung|heating
555|der|Schlüssel|key
556|die|Treppe|stairs
557|der|Aufzug|elevator
558|die|Garage|garage
559|der|Keller|basement
560|der|Dachboden|attic
561|die|Miete|rent
562|der|Vermieter|landlord
563|-|putzen|to clean
564|-|aufräumen|to tidy up
565|-|wohnen|to live / reside
566|-|umziehen|to move (house)
567|-|renovieren|to renovate
568|-|sauber|clean
569|-|schmutzig|dirty
570|-|gemütlich|cozy
571|der|Nachttisch|nightstand
572|die|Steckdose|electrical outlet
573|der|Müll|trash
574|die|Klingel|doorbell
575|das|Werkzeug|tool
576|-|reparieren|to repair
577|-|bauen|to build
578|die|Adresse|address
579|die|Vermieterin|landlady
580|-|mieten|to rent
581|die|Möbel|furniture
582|die|Vase|vase
583|der|Wecker|alarm clock
584|die|Kerze|candle
585|der|Kamin|fireplace
586|die|Tapete|wallpaper
587|die|Fliese|tile
588|die|Gardine|sheer curtain
589|das|Bücherregal|bookshelf
590|die|Kommode|dresser
591|der|Schreibtisch|desk
592|der|Sessel|armchair
593|die|Matratze|mattress
594|das|Laken|bedsheet
595|die|Bettdecke|duvet
596|der|Staubsauger|vacuum cleaner
597|der|Besen|broom
598|der|Eimer|bucket
599|der|Schwamm|sponge
600|das|Reinigungsmittel|cleaning product
601|die|Mülltonne|trash bin
602|der|Rasenmäher|lawnmower
603|die|Terrasse|terrace / patio
604|der|Zaun|fence
605|das|Tor|gate
606|die|Mauer|wall (exterior)
607|der|Briefkasten|mailbox
608|das|Erdgeschoss|ground floor
609|das|Stockwerk|floor / story
610|die|Etage|floor / level
611|die|Nebenkosten|utility costs
612|der|Hausmeister|caretaker / janitor
613|die|Hausordnung|house rules
614|-|möbliert|furnished
615|der|Anschluss|connection / hookup`],
["Clothing","A1",`616|die|Kleidung|clothing
617|das|Hemd|shirt
618|die|Hose|pants
619|das|T-Shirt|T-shirt
620|der|Rock|skirt
621|das|Kleid|dress
622|die|Jacke|jacket
623|der|Mantel|coat
624|der|Pullover|sweater
625|die|Schuhe|shoes
626|die|Stiefel|boots
627|die|Socken|socks
628|der|Hut|hat
629|die|Mütze|cap / beanie
630|der|Schal|scarf
631|die|Handschuhe|gloves
632|der|Gürtel|belt
633|die|Krawatte|tie
634|die|Unterwäsche|underwear
635|der|Anzug|suit
636|die|Brille|glasses
637|die|Tasche|bag
638|der|Regenschirm|umbrella
639|der|Ring|ring
640|die|Kette|necklace
641|-|anziehen|to put on
642|-|ausziehen|to take off
643|-|tragen|to wear / carry
644|-|passen|to fit
645|die|Größe|size
646|die|Mode|fashion
647|-|bequem|comfortable
648|-|eng|tight
649|-|weit|loose / wide
650|-|waschen|to wash
651|die|Sportschuhe|sneakers
652|die|Sandalen|sandals
653|der|Badeanzug|swimsuit
654|die|Badehose|swim trunks
655|der|Bikini|bikini
656|der|Schlafanzug|pajamas
657|die|Weste|vest
658|die|Jeans|jeans
659|der|Overall|jumpsuit / overalls
660|der|Reißverschluss|zipper
661|der|Knopf|button
662|die|Naht|seam
663|der|Stoff|fabric
664|die|Wolle|wool
665|die|Baumwolle|cotton
666|das|Leder|leather
667|die|Seide|silk
668|-|modisch|fashionable
669|-|altmodisch|old-fashioned`],
["Colors & Shapes","A1",`670|die|Farbe|color
671|-|rot|red
672|-|blau|blue
673|-|grün|green
674|-|gelb|yellow
675|-|schwarz|black
676|-|weiß|white
677|-|grau|gray
678|-|braun|brown
679|-|orange|orange (color)
680|-|rosa|pink
681|-|lila|purple
682|-|bunt|colorful
683|-|hell|light / bright
684|-|dunkel|dark
685|die|Form|shape
686|der|Kreis|circle
687|das|Quadrat|square
688|das|Dreieck|triangle
689|das|Rechteck|rectangle
690|-|rund|round
691|-|eckig|angular
692|-|groß|big
693|-|klein|small
694|-|türkis|turquoise
695|-|beige|beige
696|-|golden|golden
697|-|silbern|silver (adj.)
698|-|einfarbig|solid-colored
699|-|gestreift|striped
700|-|gepunktet|polka-dotted
701|-|kariert|checkered / plaid
702|der|Zylinder|cylinder
703|die|Kugel|sphere / ball
704|der|Würfel|cube
705|die|Pyramide|pyramid
706|der|Winkel|angle
707|die|Linie|line
708|der|Punkt|point / dot
709|-|symmetrisch|symmetrical`],
["Weather & Nature","A2",`710|das|Wetter|weather
711|die|Sonne|sun
712|der|Regen|rain
713|der|Schnee|snow
714|der|Wind|wind
715|die|Wolke|cloud
716|der|Himmel|sky
717|das|Gewitter|thunderstorm
718|der|Nebel|fog
719|das|Eis|ice
720|die|Temperatur|temperature
721|-|heiß|hot
722|-|kalt|cold
723|-|warm|warm
724|-|kühl|cool
725|-|trocken|dry
726|-|nass|wet
727|-|windig|windy
728|-|sonnig|sunny
729|-|wolkig|cloudy
730|der|Baum|tree
731|die|Blume|flower
732|das|Gras|grass
733|der|Wald|forest
734|der|Berg|mountain
735|der|Fluss|river
736|der|See|lake
737|das|Meer|sea
738|der|Strand|beach
739|die|Insel|island
740|die|Landschaft|landscape
741|die|Erde|earth / soil
742|die|Luft|air
743|das|Feuer|fire
744|der|Stein|stone
745|die|Pflanze|plant
746|der|Stern|star
747|der|Mond|moon
748|die|Natur|nature
749|die|Umwelt|environment
750|der|Sturm|storm
751|der|Hurrikan|hurricane
752|das|Erdbeben|earthquake
753|die|Überschwemmung|flood
754|die|Dürre|drought
755|der|Blitz|lightning
756|der|Donner|thunder
757|der|Hagel|hail
758|der|Frost|frost
759|das|Tauwetter|thaw
760|die|Feuchtigkeit|humidity
761|der|Luftdruck|air pressure
762|die|Vorhersage|forecast
763|der|Klimawandel|climate change
764|die|Erderwärmung|global warming
765|der|Ozean|ocean
766|die|Küste|coast
767|die|Wüste|desert
768|der|Dschungel|jungle
769|die|Höhle|cave
770|der|Vulkan|volcano
771|der|Felsen|rock / cliff
772|der|Sand|sand
773|der|Kies|gravel
774|der|Ast|branch
775|das|Blatt|leaf
776|die|Wurzel|root
777|der|Samen|seed
778|die|Ernte|harvest
779|die|Ressource|resource
780|-|recyceln|to recycle`],
["Animals","A2",`782|das|Tier|animal
783|der|Hund|dog
784|die|Katze|cat
785|die|Maus|mouse
786|das|Pferd|horse
787|die|Kuh|cow
788|das|Schwein|pig
789|das|Schaf|sheep
790|der|Vogel|bird
791|die|Ente|duck
792|der|Löwe|lion
793|der|Tiger|tiger
794|der|Bär|bear
795|der|Elefant|elephant
796|der|Affe|monkey
797|der|Wolf|wolf
798|der|Fuchs|fox
799|das|Kaninchen|rabbit
800|die|Schlange|snake
801|die|Spinne|spider
802|die|Biene|bee
803|die|Fliege|fly
804|der|Schmetterling|butterfly
805|die|Ameise|ant
806|das|Insekt|insect
807|der|Schwanz|tail
808|das|Fell|fur
809|der|Käfig|cage
810|das|Haustier|pet
811|die|Fütterung|feeding
812|-|bellen|to bark
813|-|füttern|to feed
814|das|Nest|nest
815|der|Frosch|frog
816|die|Kröte|toad
817|die|Eidechse|lizard
818|das|Krokodil|crocodile
819|die|Schildkröte|turtle
820|der|Delfin|dolphin
821|der|Wal|whale
822|der|Hai|shark
823|die|Krabbe|crab
824|die|Muschel|shell / clam
825|der|Oktopus|octopus
826|die|Qualle|jellyfish
827|die|Eule|owl
828|der|Adler|eagle
829|der|Papagei|parrot
830|der|Storch|stork
831|die|Möwe|seagull
832|die|Taube|pigeon
833|der|Hahn|rooster
834|die|Gans|goose
835|der|Truthahn|turkey
836|die|Ziege|goat
837|der|Esel|donkey
838|das|Reh|deer
839|der|Hirsch|stag
840|das|Kamel|camel
841|die|Giraffe|giraffe
842|das|Nilpferd|hippopotamus
843|das|Nashorn|rhinoceros
844|der|Panda|panda
845|das|Känguru|kangaroo
846|die|Robbe|seal`],
["City & Places","A1",`847|die|Stadt|city
848|das|Dorf|village
849|die|Straße|street
850|der|Platz|square / place
851|die|Ecke|corner
852|die|Brücke|bridge
853|der|Park|park
854|die|Kirche|church
855|das|Rathaus|city hall
856|die|Schule|school
857|die|Universität|university
858|die|Bibliothek|library
859|das|Museum|museum
860|das|Kino|cinema
861|das|Theater|theater
862|die|Polizei|police
863|die|Feuerwehr|fire department
864|das|Postamt|post office
865|die|Bank|bank
866|der|Flughafen|airport
867|der|Bahnhof|train station
868|die|Haltestelle|bus / tram stop
869|das|Hotel|hotel
870|das|Restaurant|restaurant
871|das|Café|café
872|der|Markt|market
873|das|Geschäft|shop
874|das|Einkaufszentrum|shopping mall
875|der|Friedhof|cemetery
876|der|Spielplatz|playground
877|das|Gebäude|building
878|das|Zentrum|center
879|der|Vorort|suburb
880|die|Gegend|area / neighborhood
881|-|rechts|right (direction)
882|-|links|left (direction)
883|-|geradeaus|straight ahead
884|-|in der Nähe|nearby
885|-|weit weg|far away
886|die|Richtung|direction
887|die|Karte|map
888|die|Kreuzung|intersection
889|der|Weg|way / path
890|die|Grenze|border
891|das|Land|country
892|die|Hauptstadt|capital city
893|der|Kontinent|continent
894|die|Welt|world
895|die|Fußgängerzone|pedestrian zone
896|der|Bürgersteig|sidewalk
897|die|Allee|avenue
898|die|Gasse|alley
899|der|Turm|tower
900|das|Denkmal|monument
901|die|Statue|statue
902|der|Brunnen|fountain
903|der|Zoo|zoo
904|das|Stadion|stadium
905|die|Galerie|gallery
906|das|Opernhaus|opera house
907|die|Synagoge|synagogue
908|die|Moschee|mosque
909|der|Tempel|temple
910|das|Kloster|monastery
911|die|Botschaft|embassy
912|das|Konsulat|consulate
913|das|Gericht|court (of law)
914|das|Gefängnis|prison
915|das|Gymnasium|secondary school
916|der|Kindergarten|kindergarten
917|die|Kita|daycare
918|die|Innenstadt|city center / downtown
919|die|Wohngegend|residential area
920|der|Stadtteil|city district
921|die|Sehenswürdigkeit|tourist attraction
922|der|Tourist|tourist`],
["Travel & Transportation","A1",`923|das|Auto|car
924|der|Bus|bus
925|der|Zug|train
926|die|U-Bahn|subway
927|die|Straßenbahn|tram
928|das|Fahrrad|bicycle
929|das|Motorrad|motorcycle
930|das|Flugzeug|airplane
931|das|Schiff|ship
932|das|Taxi|taxi
933|der|Führerschein|driver's license
934|das|Ticket|ticket
935|die|Fahrkarte|ticket (transport)
936|der|Koffer|suitcase
937|das|Gepäck|luggage
938|der|Reisepass|passport
939|die|Reise|trip / journey
940|das|Ziel|destination
941|die|Ankunft|arrival
942|die|Abfahrt|departure
943|die|Verspätung|delay
944|-|umsteigen|to transfer / change
945|-|einsteigen|to board / get in
946|-|aussteigen|to get off / out
947|-|fahren|to drive / go (vehicle)
948|-|fliegen|to fly
949|-|reisen|to travel
950|-|ankommen|to arrive
951|-|abfahren|to depart
952|-|parken|to park
953|-|tanken|to refuel
954|-|buchen|to book
955|-|reservieren|to reserve
956|der|Bahnsteig|platform
957|das|Gleis|track
958|die|Autobahn|highway
959|der|Stau|traffic jam
960|der|Verkehr|traffic
961|die|Ampel|traffic light
962|der|Parkplatz|parking lot
963|die|Tankstelle|gas station
964|das|Benzin|gasoline
965|-|zu Fuß gehen|to walk / go on foot
966|der|Fahrplan|schedule / timetable
967|das|Abteil|compartment
968|der|Schaffner|conductor
969|der|Sitzplatz|seat
970|der|Fensterplatz|window seat
971|die|Sicherheitskontrolle|security check
972|das|Handgepäck|hand luggage
973|der|Zoll|customs
974|die|Grenzkontrolle|border control
975|der|Campingplatz|campsite
976|das|Zelt|tent
977|die|Kreuzfahrt|cruise
978|der|Anhalter|hitchhiker
979|-|trampen|to hitchhike
980|die|Fähre|ferry
981|der|Anker|anchor
982|die|Route|route
983|die|Umleitung|detour
984|die|Panne|breakdown (car)
985|-|abschleppen|to tow
986|die|Werkstatt|repair shop
987|der|Mechaniker|mechanic`],
["Work & Professions","A1",`988|die|Arbeit|work
989|der|Beruf|profession
990|die|Firma|company
991|das|Büro|office
992|der|Job|job
993|die|Kollegin|colleague (f)
994|der|Mitarbeiter|employee (m)
995|die|Mitarbeiterin|employee (f)
996|das|Gehalt|salary
997|die|Karriere|career
998|die|Bewerbung|application
999|das|Vorstellungsgespräch|job interview
1000|der|Lebenslauf|résumé / CV
1001|die|Ausbildung|training / apprenticeship
1002|die|Erfahrung|experience
1003|der|Termin|appointment
1004|die|Besprechung|meeting
1005|das|Projekt|project
1006|die|Aufgabe|task
1007|die|Verantwortung|responsibility
1008|der|Vertrag|contract
1009|-|kündigen|to quit / give notice
1010|-|einstellen|to hire
1011|-|arbeiten|to work
1012|-|verdienen|to earn
1013|der|Lehrer|teacher (m)
1014|die|Lehrerin|teacher (f)
1015|der|Ingenieur|engineer
1016|die|Krankenschwester|nurse
1017|der|Verkäufer|salesperson
1018|der|Koch|cook / chef
1019|der|Anwalt|lawyer
1020|der|Bauer|farmer
1021|der|Polizist|police officer
1022|der|Elektriker|electrician
1023|der|Fahrer|driver
1024|der|Manager|manager
1025|der|Rentner|retiree
1026|die|Rente|pension / retirement
1027|der|Klempner|plumber
1028|der|Tischler|carpenter
1029|der|Maler|painter
1030|der|Friseur|hairdresser
1031|der|Bäcker|baker
1032|der|Metzger|butcher
1033|der|Zahnarzt|dentist
1034|der|Apotheker|pharmacist
1035|der|Buchhalter|accountant
1036|der|Sekretär|secretary
1037|der|Übersetzer|translator
1038|der|Dolmetscher|interpreter
1039|der|Journalist|journalist
1040|der|Schauspieler|actor
1041|der|Musiker|musician
1042|der|Künstler|artist
1043|der|Architekt|architect
1044|der|Wissenschaftler|scientist
1045|der|Forscher|researcher
1046|der|Soldat|soldier
1047|der|Feuerwehrmann|firefighter
1048|der|Pilot|pilot
1049|der|Flugbegleiter|flight attendant
1050|der|Handwerker|craftsman
1051|die|Gewerkschaft|labor union
1052|die|Kündigung|notice of termination
1053|der|Streik|strike
1054|die|Überstunden|overtime
1055|die|Teilzeit|part-time
1056|die|Vollzeit|full-time
1057|das|Praktikum|internship
1058|-|arbeitslos|unemployed
1059|die|Arbeitslosigkeit|unemployment`],
["School & Education","A1",`1060|der|Unterricht|lesson / class
1061|die|Klasse|class / grade
1062|der|Schüler|student (m)
1063|die|Schülerin|student (f)
1064|der|Student|university student (m)
1065|die|Studentin|university student (f)
1066|das|Studium|studies
1067|die|Prüfung|exam
1068|die|Note|grade
1069|die|Hausaufgabe|homework
1070|das|Fach|subject
1071|die|Tafel|blackboard
1072|das|Heft|notebook
1073|der|Stift|pen
1074|der|Bleistift|pencil
1075|das|Buch|book
1076|der|Text|text
1077|die|Frage|question
1078|die|Antwort|answer
1079|die|Übung|exercise
1080|das|Wissen|knowledge
1081|-|lernen|to learn
1082|-|lehren|to teach
1083|-|studieren|to study
1084|-|verstehen|to understand
1085|-|erklären|to explain
1086|-|wiederholen|to repeat
1087|-|üben|to practice
1088|-|lesen|to read
1089|-|schreiben|to write
1090|-|rechnen|to calculate
1091|die|Pause|break
1092|der|Stundenplan|timetable
1093|das|Zeugnis|certificate / report
1094|der|Abschluss|degree / graduation
1095|die|Vorlesung|lecture
1096|das|Seminar|seminar
1097|das|Semester|semester
1098|der|Professor|professor
1099|das|Wörterbuch|dictionary
1100|der|Kurs|course
1101|die|Anmeldung|registration
1102|die|Teilnahme|participation
1103|das|Zertifikat|certificate
1104|die|Leistung|performance
1105|die|Begabung|talent
1106|das|Gedächtnis|memory
1107|die|Konzentration|concentration
1108|die|Motivation|motivation
1109|das|Niveau|level`],
["Shopping & Money","A2",`1117|das|Geld|money
1118|der|Euro|euro
1119|der|Preis|price
1120|die|Kasse|checkout / cash register
1121|die|Kreditkarte|credit card
1122|das|Bargeld|cash
1123|die|Quittung|receipt
1124|der|Rabatt|discount
1125|das|Angebot|offer / deal
1126|-|billig|cheap
1127|-|teuer|expensive
1128|-|kaufen|to buy
1129|-|verkaufen|to sell
1130|-|bezahlen|to pay
1131|-|kosten|to cost
1132|-|sparen|to save (money)
1133|-|ausgeben|to spend
1134|das|Konto|bank account
1135|der|Geldautomat|ATM
1136|die|Steuer|tax
1137|das|Einkommen|income
1138|die|Schulden|debt
1139|das|Budget|budget
1140|-|umtauschen|to exchange (goods)
1141|-|zurückgeben|to return (an item)
1142|die|Garantie|warranty
1143|der|Kunde|customer (m)
1144|die|Kundin|customer (f)
1145|die|Verkäuferin|salesperson (f)
1146|das|Sonderangebot|special offer
1147|-|kostenlos|free of charge
1148|die|Filiale|branch (store / bank)
1149|die|Öffnungszeiten|opening hours
1150|die|Umkleidekabine|fitting room
1151|die|Reklamation|complaint
1152|-|reklamieren|to file a complaint
1153|der|Einkaufswagen|shopping cart
1154|der|Einkaufskorb|shopping basket
1155|die|Tüte|bag
1156|das|Etikett|label / tag
1157|der|Ausverkauf|clearance sale
1158|-|reduziert|discounted / reduced
1159|das|Wechselgeld|change (money)
1160|-|wechseln|to exchange / change
1161|die|Überweisung|bank transfer
1162|-|überweisen|to transfer money
1163|die|Investition|investment
1164|-|investieren|to invest
1165|der|Kredit|loan / credit
1166|die|Hypothek|mortgage
1167|die|Versicherung|insurance
1168|-|versichern|to insure
1169|die|Zinsen|interest (finance)
1170|das|Sparkonto|savings account
1171|die|Immobilie|real estate / property
1172|der|Makler|real estate agent
1173|die|Kaution|deposit`],
["Technology & Communication","A2",`1174|das|Telefon|telephone
1175|das|Handy|cellphone
1176|der|Computer|computer
1177|das|Internet|internet
1178|die|E-Mail|email
1179|die|Nachricht|message
1180|die|App|app
1181|die|Website|website
1182|das|Passwort|password
1183|die|Taste|key / button
1184|der|Bildschirm|screen
1185|das|Foto|photo
1186|das|Video|video
1187|die|Musik|music
1188|-|anrufen|to call
1189|-|schreiben|to write
1190|-|senden|to send
1191|-|empfangen|to receive
1192|-|herunterladen|to download
1193|-|hochladen|to upload
1194|-|speichern|to save
1195|-|löschen|to delete
1196|-|drucken|to print
1197|-|klicken|to click
1198|-|suchen|to search
1199|-|teilen|to share
1200|die|Kamera|camera
1201|der|Akku|battery
1202|-|aufladen|to charge (battery)
1203|das|Netzwerk|network
1204|die|Verbindung|connection
1205|-|online|online
1206|die|Software|software
1207|das|Gerät|device
1208|der|Laptop|laptop
1209|der|Drucker|printer
1210|die|Tastatur|keyboard
1211|der|Lautsprecher|speaker
1212|die|Kopfhörer|headphones
1213|das|Mikrofon|microphone
1214|die|Datei|file (digital)
1215|der|Ordner|folder
1216|der|Server|server
1217|die|Cloud|cloud storage
1218|das|WLAN|WiFi
1219|der|Router|router
1220|das|Update|update
1221|-|aktualisieren|to update
1222|-|installieren|to install
1223|der|Virus|virus (computer)
1224|-|hacken|to hack
1225|die|Sicherheit|security
1226|der|Chat|chat
1227|-|chatten|to chat
1228|das|soziale Netzwerk|social network
1229|-|posten|to post
1230|der|Kommentar|comment
1231|-|kommentieren|to comment
1232|das|Profil|profile
1233|der|Link|link`],
["Emotions & Feelings","A2",`1234|-|glücklich|happy
1235|-|traurig|sad
1236|-|wütend|angry
1237|-|ängstlich|afraid
1238|-|nervös|nervous
1239|-|aufgeregt|excited
1240|-|gelangweilt|bored
1241|-|überrascht|surprised
1242|-|zufrieden|satisfied
1243|-|enttäuscht|disappointed
1244|-|stolz|proud
1245|-|eifersüchtig|jealous
1246|-|einsam|lonely
1247|-|verliebt|in love
1248|-|dankbar|grateful
1249|-|besorgt|worried
1250|-|entspannt|relaxed
1251|-|gestresst|stressed
1252|-|mutig|brave
1253|-|schüchtern|shy
1254|die|Freude|joy
1255|die|Angst|fear
1256|die|Liebe|love
1257|der|Hass|hate
1258|die|Hoffnung|hope
1259|die|Wut|anger
1260|die|Trauer|sadness
1261|-|lieben|to love
1262|-|hassen|to hate
1263|-|sich freuen|to be happy
1264|-|sich ärgern|to be annoyed
1265|-|sich sorgen|to worry
1266|-|lachen|to laugh
1267|-|weinen|to cry
1268|-|lächeln|to smile
1269|-|neidisch|envious
1270|-|verwirrt|confused
1271|-|erleichtert|relieved
1272|-|schockiert|shocked
1273|-|peinlich|embarrassing
1274|-|sich schämen|to be ashamed
1275|die|Eifersucht|jealousy
1276|die|Verwirrung|confusion
1277|die|Erleichterung|relief
1278|die|Zuneigung|affection
1279|das|Mitgefühl|compassion
1280|die|Sehnsucht|longing
1281|-|sich sehnen|to long for
1282|die|Gelassenheit|calmness
1283|-|gelassen|calm
1284|-|empfindlich|sensitive
1285|-|gleichgültig|indifferent
1286|die|Gleichgültigkeit|indifference`],
["Common Verbs","A1",`1287|-|haben|to have
1288|-|werden|to become
1289|-|können|can / to be able to
1290|-|müssen|must / to have to
1291|-|wollen|to want
1292|-|sollen|should
1293|-|dürfen|may / to be allowed to
1294|-|mögen|to like
1295|-|machen|to make / do
1296|-|gehen|to go
1297|-|kommen|to come
1298|-|sehen|to see
1299|-|wissen|to know (facts)
1300|-|kennen|to know (people / places)
1301|-|denken|to think
1302|-|glauben|to believe
1303|-|sagen|to say
1304|-|sprechen|to speak
1305|-|fragen|to ask
1306|-|antworten|to answer
1307|-|geben|to give
1308|-|nehmen|to take
1309|-|finden|to find
1310|-|brauchen|to need
1311|-|nutzen / benutzen|to use
1312|-|bringen|to bring
1313|-|holen|to fetch / get
1314|-|bekommen|to receive / get
1315|-|legen|to lay / put
1316|-|stellen|to place / stand something
1317|-|stehen|to stand
1318|-|sitzen|to sit
1319|-|liegen|to lie (position)
1320|-|bleiben|to stay
1321|-|laufen|to run / walk
1322|-|springen|to jump
1323|-|fallen|to fall
1324|-|helfen|to help
1325|-|zeigen|to show
1326|-|hören|to hear
1327|-|fühlen|to feel
1328|-|riechen|to smell
1329|-|beginnen / anfangen|to begin / start
1330|-|beenden / aufhören|to end / stop
1331|-|öffnen|to open
1332|-|schließen|to close
1333|-|aufstehen|to get up
1334|-|sich anziehen|to get dressed
1335|-|studieren|to study (at university)
1336|-|lesen|to read
1337|-|rechnen|to calculate
1338|-|spielen|to play
1339|-|singen|to sing
1340|-|tanzen|to dance
1341|-|besuchen|to visit
1342|-|treffen|to meet
1343|-|einladen|to invite
1344|-|warten|to wait
1345|-|versuchen|to try
1346|-|vergessen|to forget
1347|-|erinnern|to remember / remind
1348|-|planen|to plan
1349|-|entscheiden|to decide
1350|-|wählen|to choose
1351|-|ändern|to change
1352|-|verlieren|to lose
1353|-|gewinnen|to win
1354|-|kämpfen|to fight
1355|-|schützen|to protect
1356|-|verbinden|to connect
1357|-|trennen|to separate
1358|-|zerstören|to destroy
1359|-|wachsen|to grow
1360|-|sterben|to die
1361|-|leben|to live
1362|-|existieren|to exist
1363|-|passieren|to happen
1364|-|erlauben|to allow
1365|-|verbieten|to forbid
1366|-|bedeuten|to mean
1367|-|scheinen|to seem / shine
1368|-|klingen|to sound
1369|-|aussehen|to look / appear
1370|-|gefallen|to please / like
1371|-|funktionieren|to work / function
1372|-|beeinflussen|to influence
1373|-|empfehlen|to recommend
1374|-|versprechen|to promise
1375|-|lügen|to lie
1376|-|die Wahrheit sagen|to tell the truth
1377|-|entschuldigen|to apologize
1378|-|danken|to thank
1379|-|gratulieren|to congratulate
1380|-|feiern|to celebrate
1381|-|bemerken|to notice
1382|-|beobachten|to observe
1383|-|entdecken|to discover
1384|-|erfinden|to invent
1385|-|entwickeln|to develop
1386|-|vorbereiten|to prepare
1387|-|organisieren|to organize
1388|-|sammeln|to collect
1389|-|sortieren|to sort
1390|-|vergleichen|to compare
1391|-|prüfen|to check / test
1392|-|kontrollieren|to control / check
1393|-|beweisen|to prove
1394|-|bestätigen|to confirm
1395|-|ablehnen|to reject / decline
1396|-|akzeptieren|to accept
1397|-|zustimmen|to agree
1398|-|widersprechen|to contradict
1399|-|diskutieren|to discuss
1400|-|streiten|to argue / fight
1401|-|sich versöhnen|to reconcile
1402|-|vermeiden|to avoid
1403|-|riskieren|to risk
1404|-|wagen|to dare
1405|-|zögern|to hesitate
1406|-|sich beeilen|to hurry
1407|-|sich entspannen|to relax
1408|-|sich ausruhen|to rest
1409|-|sich verabschieden|to say goodbye
1410|-|sich vorstellen|to imagine / introduce
1411|-|sich verlieben|to fall in love
1412|-|sich verloben|to get engaged
1413|-|heiraten|to marry
1414|-|sich scheiden lassen|to get divorced
1415|-|sich beschweren|to complain
1416|-|sich bewerben|to apply (for a job)
1417|-|sich anmelden|to register / sign up
1418|-|sich abmelden|to unregister / log off
1419|-|sich einloggen|to log in
1420|-|ausloggen|to log out
1421|-|übersetzen|to translate
1422|-|interpretieren|to interpret
1423|-|analysieren|to analyze
1424|-|zusammenfassen|to summarize
1425|-|beschreiben|to describe
1426|-|definieren|to define
1427|-|unterscheiden|to distinguish
1428|-|verwechseln|to confuse / mix up
1429|-|erwarten|to expect
1430|-|hoffen|to hope
1431|-|befürchten|to fear (that)
1432|-|bezweifeln|to doubt
1433|-|vermitteln|to suspect / assume
1434|-|annehmen|to assume / accept
1435|-|verzichten|to give up / forgo
1436|-|sich konzentrieren|to concentrate
1437|-|sich anpassen|to adapt
1438|-|sich verändern|to change (oneself)
1439|-|verschwinden|to disappear
1440|-|erscheinen|to appear
1441|-|auftauchen|to show up / emerge
1442|-|sich verstecken|to hide
1443|-|flüchten|to flee
1444|-|retten|to save / rescue
1445|-|überleben|to survive`],
["Common Adjectives","A1",`1446|-|lang|long
1447|-|kurz|short
1448|-|hoch|high / tall
1449|-|niedrig|low
1450|-|breit|wide
1451|-|schmal|narrow
1452|-|dick|thick / fat
1453|-|dünn|thin
1454|-|schwer|heavy / difficult
1455|-|leicht|light / easy
1456|-|neu|new
1457|-|alt|old
1458|-|jung|young
1459|-|gut|good
1460|-|schlecht|bad
1461|-|schön|beautiful
1462|-|hässlich|ugly
1463|-|schnell|fast
1464|-|langsam|slow
1465|-|wichtig|important
1466|-|einfach|simple
1467|-|schwierig|difficult
1468|-|richtig|correct / right
1469|-|falsch|wrong
1470|-|wahr|true
1471|-|interessant|interesting
1472|-|langweilig|boring
1473|-|laut|loud
1474|-|leise|quiet
1475|-|reich|rich
1476|-|arm|poor
1477|-|voll|full
1478|-|leer|empty
1479|-|offen|open
1480|-|geschlossen|closed
1481|-|frei|free
1482|-|beschäftigt|busy
1483|-|fertig|finished / ready
1484|-|kaputt|broken
1485|-|sicher|safe / certain
1486|-|gefährlich|dangerous
1487|-|möglich|possible
1488|-|unmöglich|impossible
1489|-|nötig|necessary
1490|-|nützlich|useful
1491|-|gleich|same / equal
1492|-|anders|different
1493|-|ähnlich|similar
1494|-|normal|normal
1495|-|besonders|special / especially
1496|-|perfekt|perfect
1497|-|modern|modern
1498|-|traditionell|traditional
1499|-|bekannt|known / famous
1500|-|fremd|foreign / strange
1501|-|eigen|own
1502|-|privat|private
1503|-|öffentlich|public
1504|-|günstig|favorable / cheap
1505|-|praktisch|practical
1506|-|höflich|polite
1507|-|freundlich|friendly
1508|-|ehrlich|honest
1509|-|klug|smart / clever
1510|-|dumm|stupid
1511|-|faul|lazy
1512|-|fleißig|hardworking
1513|-|feige|cowardly
1514|-|geduldig|patient
1515|-|ungeduldig|impatient
1516|-|großzügig|generous
1517|-|geizig|stingy
1518|-|neugierig|curious
1519|-|vorsichtig|careful
1520|-|leichtsinnig|careless / reckless
1521|-|zuverlässig|reliable
1522|-|unzuverlässig|unreliable
1523|-|kreativ|creative
1524|-|logisch|logical
1525|-|vernünftig|reasonable / sensible
1526|-|verrückt|crazy
1527|-|seltsam|strange
1528|-|komisch|funny / strange
1529|-|lustig|funny
1530|-|ernst|serious
1531|-|ruhig|calm / quiet
1532|-|aktiv|active
1533|-|passiv|passive
1534|-|flexibel|flexible
1535|-|streng|strict
1536|-|locker|relaxed / loose
1537|-|typisch|typical
1538|-|einzigartig|unique
1539|-|originell|original
1540|-|kompliziert|complicated
1541|-|unabhängig|independent
1542|-|abhängig|dependent
1543|-|erfolgreich|successful
1544|-|gescheitert|failed
1545|-|beliebt|popular
1546|-|unbeliebt|unpopular
1547|-|berühmt|famous
1548|-|gewöhnlich|ordinary
1549|-|ungewöhnlich|unusual`],
["Adverbs, Prepositions & Conjunctions","A2",`1550|-|und|and
1551|-|oder|or
1552|-|aber|but
1553|-|denn|because / for
1554|-|weil|because
1555|-|dass|that (conj.)
1556|-|wenn|if / when
1557|-|obwohl|although
1558|-|damit|so that
1559|-|also|so / therefore
1560|-|deshalb|therefore
1561|-|trotzdem|nevertheless
1562|-|sondern|but rather
1563|-|sowohl … als auch|both … and
1564|-|entweder … oder|either … or
1565|-|in|in
1566|-|auf|on
1567|-|unter|under
1568|-|über|over / above
1569|-|neben|next to
1570|-|zwischen|between
1571|-|vor|in front of / before
1572|-|hinter|behind
1573|-|bei|at / near
1574|-|mit|with
1575|-|ohne|without
1576|-|für|for
1577|-|gegen|against
1578|-|durch|through
1579|-|um|around / at (time)
1580|-|nach|after / to
1581|-|von|from / of
1582|-|zu|to
1583|-|seit|since
1584|-|bis|until
1585|-|während|during
1586|-|außer|except
1587|-|trotz|despite
1588|-|wegen|because of
1589|-|hier|here
1590|-|da / dort|there
1591|-|oben|above / upstairs
1592|-|unten|below / downstairs
1593|-|drinnen|inside
1594|-|draußen|outside
1595|-|überall|everywhere
1596|-|nirgendwo|nowhere
1597|-|vielleicht|maybe
1598|-|wahrscheinlich|probably
1599|-|natürlich|of course
1600|-|leider|unfortunately
1601|-|hoffentlich|hopefully
1602|-|ziemlich|quite / rather
1603|-|sehr|very
1604|-|zu (zu viel)|too (too much)
1605|-|nur|only
1606|-|auch|also
1607|-|sogar|even
1608|-|gerade|just / currently
1609|-|wieder|again
1610|-|zusammen|together
1611|-|allein|alone
1612|-|gemeinsam|jointly / together
1613|-|plötzlich|suddenly
1614|-|innerhalb|within
1615|-|außerhalb|outside of
1616|-|oberhalb|above
1617|-|unterhalb|below
1618|-|entlang|along
1619|-|gegenüber|opposite / across from
1620|-|anstatt|instead of
1621|-|aufgrund|due to
1622|-|abgesehen von|apart from
1623|-|je nach|depending on
1624|-|sobald|as soon as
1625|-|solange|as long as
1626|-|bevor|before
1627|-|nachdem|after
1628|-|seitdem|since then
1629|-|falls|in case
1630|-|andernfalls|otherwise
1631|-|immerhin|at least / after all
1632|-|jedenfalls|in any case
1633|-|übrigens|by the way
1634|-|sozusagen|so to speak
1635|-|beziehungsweise|respectively / or rather
1636|-|insbesondere|in particular`],
["Everyday Expressions & Small Talk","A1",`1637|-|Hallo|Hello
1638|-|Guten Morgen|Good morning
1639|-|Guten Tag|Good day
1640|-|Guten Abend|Good evening
1641|-|Gute Nacht|Good night
1642|-|Auf Wiedersehen|Goodbye
1643|-|Tschüss|Bye
1644|-|Bis später|See you later
1645|-|Bitte|Please / You're welcome
1646|-|Danke|Thank you
1647|-|Entschuldigung|Excuse me / Sorry
1648|-|Es tut mir leid|I'm sorry
1649|-|Wie geht's?|How are you?
1650|-|Mir geht es gut|I'm doing well
1651|-|Freut mich|Nice to meet you
1652|-|Willkommen|Welcome
1653|-|Herzlichen Glückwunsch|Congratulations
1654|-|Alles Gute|All the best
1655|-|Viel Glück|Good luck
1656|-|Prost|Cheers
1657|-|Guten Appetit|Enjoy your meal
1658|-|Kein Problem|No problem
1659|-|Genau|Exactly
1660|-|Ich verstehe nicht|I don't understand
1661|-|Wie bitte?|Pardon?
1662|-|Macht nichts|Never mind
1663|-|Schade|What a shame
1664|-|Toll!|Great!
1665|-|Super!|Super!
1666|-|Stimmt|That's right
1667|-|Meiner Meinung nach|In my opinion
1668|-|Ich stimme zu|I agree
1669|-|Ich stimme nicht zu|I disagree
1670|-|Auf jeden Fall|Definitely
1671|-|Auf keinen Fall|No way
1672|-|Gesundheit!|Bless you!
1673|-|Es kommt darauf an|It depends
1674|-|Das ist mir egal|I don't care
1675|-|Kein Wunder|No wonder
1676|-|Es reicht!|That's enough!
1677|-|Mach dir keine Sorgen|Don't worry
1678|-|Alles klar|Got it / All clear
1679|-|Was ist los?|What's going on?
1680|-|Sei vorsichtig|Be careful
1681|-|Pass auf!|Watch out!
1682|-|Viel Spaß!|Have fun!
1683|-|Gute Besserung|Get well soon`],
["Sports & Fitness","A2",`1684|der|Sport|sport
1685|das|Spiel|game
1686|die|Mannschaft|team
1687|der|Spieler|player
1688|der|Trainer|coach
1689|das|Training|training
1690|-|trainieren|to train
1691|der|Wettkampf|competition
1692|das|Turnier|tournament
1693|das|Unentschieden|tie / draw
1694|der|Ball|ball
1695|das|Fußballfeld|soccer field
1696|der|Fußball|soccer / football
1697|der|Basketball|basketball
1698|das|Tennis|tennis
1699|der|Tennisschläger|tennis racket
1700|das|Schwimmen|swimming
1701|-|schwimmen|to swim
1702|das|Schwimmbad|swimming pool
1703|-|joggen|to jog
1704|-|radfahren|to cycle
1705|die|Gymnastik|gymnastics
1706|das|Fitnessstudio|gym
1707|das|Gewicht|weight
1708|-|heben|to lift
1709|das|Yoga|yoga
1710|-|dehnen|to stretch
1711|-|aufwärmen|to warm up
1712|der|Schiedsrichter|referee
1713|die|Punktzahl|score
1714|der|Sieg|victory
1715|die|Niederlage|defeat
1716|die|Meisterschaft|championship
1717|die|Olympiade|the Olympics
1718|die|Medaille|medal
1719|der|Rekord|record
1720|die|Kondition|fitness / stamina
1721|die|Ausdauer|endurance
1722|die|Kraft|strength / power
1723|das|Skifahren|skiing
1724|das|Reiten|horseback riding
1725|das|Klettern|climbing
1726|-|wandern|to hike
1727|die|Wanderung|hike`],
["Music, Art & Culture","A2",`1728|das|Lied|song
1729|die|Band|band
1730|das|Konzert|concert
1731|das|Instrument|instrument
1732|das|Klavier|piano
1733|die|Gitarre|guitar
1734|die|Geige|violin
1735|die|Trommel|drum
1736|die|Flöte|flute
1737|der|Sänger|singer
1738|die|Melodie|melody
1739|der|Rhythmus|rhythm
1740|der|Text|lyrics / text
1741|der|Komponist|composer
1742|das|Orchester|orchestra
1743|die|Oper|opera
1744|das|Ballett|ballet
1745|der|Tanz|dance
1746|die|Kunst|art
1747|das|Gemälde|painting
1748|die|Zeichnung|drawing
1749|-|zeichnen|to draw
1750|-|malen|to paint
1751|die|Skulptur|sculpture
1752|die|Ausstellung|exhibition
1753|die|Literatur|literature
1754|das|Gedicht|poem
1755|der|Roman|novel
1756|die|Erzählung|story / narrative
1757|der|Autor|author
1758|der|Schriftsteller|writer
1759|die|Kultur|culture
1760|die|Tradition|tradition
1761|das|Erbe|heritage
1762|der|Film|film
1763|die|Regie|direction (film)
1764|der|Regisseur|director
1765|die|Szene|scene`],
["Hobbies & Leisure","A2",`1766|das|Hobby|hobby
1767|die|Freizeit|free time
1768|das|Interesse|interest
1769|-|sich interessieren für|to be interested in
1770|das|Fotografieren|photography
1771|-|fotografieren|to photograph
1772|die|Sammlung|collection
1773|-|basteln|to do crafts
1774|-|nähen|to sew
1775|-|stricken|to knit
1776|das|Puzzle|puzzle
1777|das|Brettspiel|board game
1778|die|Karten|cards
1779|das|Schach|chess
1780|-|würfeln|to roll dice
1781|-|angeln|to fish
1782|das|Angeln|fishing
1783|-|campen|to camp
1784|das|Camping|camping
1785|-|gärtnern|to garden
1786|das|Rätsel|puzzle / riddle
1787|das|Videospiel|video game
1788|das|Sudoku|sudoku
1789|die|Handarbeit|handicraft
1790|-|töpfern|to do pottery
1791|die|Töpferei|pottery
1792|-|schnitzen|to carve
1793|der|Ausflug|outing / excursion
1794|der|Spaziergang|walk / stroll
1795|-|spazieren gehen|to go for a walk
1796|-|picknicken|to picnic
1797|das|Picknick|picnic
1798|-|grillen|to grill / barbecue
1799|der|Grill|grill / barbecue
1800|das|Lagerfeuer|campfire
1801|die|Vogelbeobachtung|birdwatching
1802|das|Segeln|sailing
1803|-|segeln|to sail
1804|das|Surfen|surfing
1805|-|surfen|to surf
1806|das|Tauchen|diving
1807|-|tauchen|to dive
1808|-|rudern|to row`],
["Science","B1",`1845|die|Wissenschaft|science
1846|die|Forschung|research
1847|die|Chemie|chemistry
1848|die|Physik|physics
1849|die|Biologie|biology
1850|das|Atom|atom
1851|das|Molekül|molecule
1852|die|Zelle|cell (biology)
1853|das|Gen|gene
1854|die|Evolution|evolution
1855|die|Schwerkraft|gravity
1856|die|Elektrizität|electricity
1857|das|Magnetfeld|magnetic field
1858|die|Reaktion|reaction
1859|das|Element|element
1860|das|Mikroskop|microscope
1861|das|Teleskop|telescope
1862|die|Hypothese|hypothesis
1863|die|Beobachtung|observation
1864|der|Beweis|proof / evidence
1865|die|Substanz|substance
1866|die|Mischung|mixture
1867|-|mischen|to mix
1868|die|Flüssigkeit|liquid (noun)
1869|das|Gas|gas
1870|der|Sauerstoff|oxygen
1871|der|Wasserstoff|hydrogen
1872|das|Kohlendioxid|carbon dioxide
1873|die|Genetik|genetics
1874|der|Organismus|organism
1875|das|Bakterium|bacterium`],
["Politics & Government","B1",`1876|die|Politik|politics
1877|der|Staat|state
1878|die|Regierung|government
1879|der|Präsident|president
1880|der|Kanzler|chancellor
1881|der|Minister|minister
1882|das|Parlament|parliament
1883|der|Abgeordnete|member of parliament
1884|die|Partei|political party
1885|die|Wahl|election
1886|der|Wähler|voter
1887|die|Demokratie|democracy
1888|die|Diktatur|dictatorship
1889|das|Gesetz|law
1890|die|Verfassung|constitution
1891|die|Freiheit|freedom
1892|das|Recht|right / law
1893|die|Pflicht|duty / obligation
1894|der|Bürger|citizen
1895|die|Staatsangehörigkeit|nationality / citizenship
1896|die|Nation|nation
1897|die|Diplomatie|diplomacy
1898|die|Verhandlung|negotiation
1899|die|Krise|crisis
1900|der|Krieg|war
1901|der|Frieden|peace
1902|die|Armee|army
1903|die|Opposition|opposition
1904|die|Koalition|coalition
1905|der|Kandidat|candidate
1906|die|Abstimmung|vote / ballot
1907|-|abstimmen|to vote on something
1908|die|Mehrheit|majority
1909|die|Minderheit|minority
1910|die|Reform|reform
1911|-|reformieren|to reform
1912|die|Korruption|corruption
1913|die|Bürokratie|bureaucracy
1914|die|Souveränität|sovereignty
1915|die|Autonomie|autonomy
1916|der|Botschafter|ambassador
1917|die|Delegation|delegation
1918|das|Bündnis|alliance
1919|die|Sanktion|sanction
1920|die|Neutralität|neutrality
1921|die|Menschenrechte|human rights`],
["Law & Crime","B1",`1922|das|Verbrechen|crime
1923|der|Verbrecher|criminal
1924|der|Dieb|thief
1925|-|stehlen|to steal
1926|der|Diebstahl|theft
1927|der|Mord|murder
1928|der|Mörder|murderer
1929|die|Gewalt|violence
1930|der|Angriff|attack
1931|-|angreifen|to attack
1932|die|Waffe|weapon
1933|-|verhaften|to arrest
1934|die|Verhaftung|arrest
1935|die|Strafe|punishment
1936|-|bestrafen|to punish
1937|-|schuldig|guilty
1938|-|unschuldig|innocent
1939|das|Urteil|verdict / judgment
1940|der|Richter|judge
1941|die|Klage|lawsuit
1942|-|verklagen|to sue
1943|das|Opfer|victim
1944|der|Zeuge|witness
1945|die|Aussage|statement / testimony
1946|die|Bewährung|probation
1947|die|Verurteilung|conviction
1948|-|verurteilen|to convict / sentence
1949|-|freisprechen|to acquit
1950|der|Freispruch|acquittal
1951|die|Berufung|appeal (legal)
1952|der|Betrug|fraud
1953|-|betrügen|to defraud / cheat
1954|die|Fälschung|forgery`],
["Media & News","B1",`1955|die|Nachrichten|the news
1956|die|Zeitung|newspaper
1957|die|Zeitschrift|magazine
1958|der|Artikel|article
1959|die|Schlagzeile|headline
1960|der|Reporter|reporter
1961|-|berichten|to report
1962|-|veröffentlichen|to publish
1963|die|Sendung|broadcast / show
1964|der|Rundfunk|radio broadcasting
1965|die|Werbung|advertising
1966|die|Anzeige|advertisement / ad
1967|die|Öffentlichkeit|the public
1968|die|Meinung|opinion
1969|die|Umfrage|survey / poll
1970|die|Zensur|censorship
1971|die|Pressefreiheit|freedom of the press
1972|die|Auflage|circulation (publication)
1973|der|Verlag|publishing house
1974|die|Redaktion|editorial team
1975|das|Interview|interview
1976|-|interviewen|to interview
1977|die|Quelle|source
1978|die|Berichterstattung|news coverage
1979|die|Falschmeldung|fake news
1980|die|Objektivität|objectivity
1981|der|Skandal|scandal
1982|die|Enthüllung|revelation / expose`],
["Religion & Holidays","B1",`1983|die|Religion|religion
1984|der|Glaube|faith / belief
1985|der|Gott|god
1986|das|Gebet|prayer
1987|-|beten|to pray
1988|die|Bibel|the Bible
1989|der|Koran|the Quran
1990|-|heilig|holy
1991|die|Seele|soul
1992|die|Hölle|hell
1993|-|Weihnachten|Christmas
1994|-|Ostern|Easter
1995|das|Neujahr|New Year
1996|das|Fest|festival / celebration
1997|der|Karneval|carnival
1998|das|Erntedankfest|harvest festival / Thanksgiving
1999|der|Buddhismus|Buddhism
2000|der|Hinduismus|Hinduism
2001|der|Islam|Islam
2002|das|Christentum|Christianity
2003|das|Judentum|Judaism
2004|der|Priester|priest
2005|der|Pfarrer|pastor
2006|der|Rabbiner|rabbi
2007|der|Imam|imam
2008|der|Mönch|monk
2009|die|Nonne|nun
2010|die|Pilgerfahrt|pilgrimage
2011|-|pilgern|to make a pilgrimage
2012|die|Zeremonie|ceremony
2013|das|Ritual|ritual`],
["Countries, Nationalities & Languages","A1",`2014|-|Deutschland|Germany
2015|-|Österreich|Austria
2016|die|Schweiz|Switzerland
2017|-|Frankreich|France
2018|-|Italien|Italy
2019|-|Spanien|Spain
2020|-|England|England
2021|die|USA|the USA
2022|-|China|China
2023|-|Japan|Japan
2024|-|Indien|India
2025|-|Russland|Russia
2026|-|Deutsch|German (language)
2027|-|Englisch|English (language)
2028|-|Französisch|French (language)
2029|-|Spanisch|Spanish (language)
2030|-|Italienisch|Italian (language)
2031|-|Chinesisch|Chinese (language)
2032|-|amerikanisch|American (adj.)
2033|-|britisch|British (adj.)
2034|-|europäisch|European (adj.)
2035|-|asiatisch|Asian (adj.)
2036|-|afrikanisch|African (adj.)
2037|der|Ausländer|foreigner
2038|-|Europa|Europe
2039|-|Asien|Asia
2040|-|Afrika|Africa
2041|-|Australien|Australia
2042|die|Nationalität|nationality
2043|-|Portugal|Portugal
2044|-|Griechenland|Greece
2045|die|Niederlande|the Netherlands
2046|-|Belgien|Belgium
2047|-|Polen|Poland
2048|die|Türkei|Turkey
2049|-|Ägypten|Egypt
2050|-|Brasilien|Brazil
2051|-|Mexiko|Mexico
2052|-|Kanada|Canada
2053|-|Südkorea|South Korea
2054|-|Schweden|Sweden
2055|-|Norwegen|Norway
2056|-|Dänemark|Denmark
2057|-|Finnland|Finland
2058|-|Irland|Ireland
2059|-|Portugiesisch|Portuguese (language)
2060|-|Arabisch|Arabic (language)
2061|-|Koreanisch|Korean (language)
2062|-|Russisch|Russian (language)
2063|-|Niederländisch|Dutch (language)`],
["Geography & Directions","B1",`2067|der|Norden|north
2068|der|Süden|south
2069|der|Osten|east
2070|der|Westen|west
2071|-|nördlich|northern
2072|-|südlich|southern
2073|-|östlich|eastern
2074|-|westlich|western
2075|die|Ebene|plain
2076|das|Tal|valley
2077|das|Gebirge|mountain range
2078|die|Halbinsel|peninsula
2079|der|Äquator|equator
2080|der|Pol|pole (geographic)
2081|die|Hemisphäre|hemisphere
2082|der|Kompass|compass
2083|die|Koordinaten|coordinates
2084|der|Breitengrad|latitude
2085|der|Längengrad|longitude
2086|die|Region|region
2087|das|Gebiet|area / territory
2088|die|Fläche|area / surface
2089|die|Provinz|province
2090|das|Bundesland|federal state
2091|die|Metropole|metropolis`],
["Materials & Substances","A2",`2092|das|Holz|wood
2093|das|Metall|metal
2094|das|Plastik|plastic
2095|der|Stahl|steel
2096|das|Eisen|iron
2097|das|Gold|gold
2098|das|Silber|silver (noun)
2099|der|Beton|concrete
2100|der|Ziegel|brick
2101|der|Gummi|rubber
2102|die|Pappe|cardboard
2103|die|Keramik|ceramic
2104|der|Kunststoff|synthetic material / plastic
2105|-|fest|solid (adj.)
2106|-|flüssig|liquid (adj.)
2107|-|gasförmig|gaseous
2108|der|Ton|clay
2109|der|Marmor|marble
2110|der|Diamant|diamond
2111|das|Wachs|wax
2112|der|Zement|cement
2113|-|synthetisch|synthetic`],
["Tools & Construction","A2",`2114|der|Hammer|hammer
2115|die|Zange|pliers
2116|der|Schraubenzieher|screwdriver
2117|die|Schraube|screw
2118|der|Nagel|nail
2119|die|Säge|saw
2120|die|Bohrmaschine|drill
2121|die|Leiter|ladder
2122|-|streichen|to paint (a wall)
2123|der|Pinsel|paintbrush
2124|die|Baustelle|construction site
2125|der|Bauarbeiter|construction worker
2126|der|Kran|crane
2127|der|Bagger|excavator
2128|das|Gerüst|scaffolding
2129|das|Fundament|foundation
2130|die|Werkzeugkiste|toolbox
2131|der|Meißel|chisel
2132|die|Feile|file (tool)
2133|die|Wasserwaage|spirit level
2134|das|Maßband|measuring tape
2135|das|Klebeband|adhesive tape
2136|-|schleifen|to sand / grind`],
["Life Events & Relationships","B1",`2137|der|Geburtstag|birthday
2138|die|Verlobung|engagement
2139|die|Beerdigung|funeral
2140|der|Umzug|move / relocation
2141|der|Ruhestand|retirement
2142|die|Beziehung|relationship
2143|der|Kontakt|contact
2144|-|sich kennenlernen|to get to know each other
2145|-|sich trennen|to break up / separate
2146|die|Trennung|separation / breakup
2147|das|Vertrauen|trust
2148|-|vertrauen|to trust
2149|die|Freundschaft|friendship
2150|die|Ehe|marriage
2151|die|Taufe|baptism
2152|der|Abschied|farewell / departure
2153|-|sich verabreden|to arrange to meet
2154|die|Verabredung|date / appointment
2155|-|flirten|to flirt
2156|der|Flirt|flirting
2157|die|Anziehung|attraction
2158|die|Fernbeziehung|long-distance relationship
2159|-|zusammenziehen|to move in together
2160|der|Mitbewohner|roommate
2161|die|Verpflichtung|commitment`],
["Emergency & Safety","B1",`2162|der|Notfall|emergency
2163|der|Krankenwagen|ambulance
2164|die|Rettung|rescue
2165|der|Notausgang|emergency exit
2166|der|Alarm|alarm
2167|die|Gefahr|danger
2168|der|Helm|helmet
2169|der|Gurt|seatbelt
2170|die|Erste Hilfe|first aid
2171|der|Verbandskasten|first aid kit
2172|-|evakuieren|to evacuate
2173|die|Katastrophe|disaster
2174|der|Brand|fire (blaze)
2175|die|Sirene|siren
2176|der|Rauchmelder|smoke detector
2177|der|Feuerlöscher|fire extinguisher
2178|die|Absperrung|barricade / cordon
2179|-|absperren|to cordon off
2180|die|Evakuierung|evacuation
2181|die|Schutzweste|safety vest
2182|der|Notruf|emergency call
2183|die|Notrufnummer|emergency number`],
["Space & Astronomy","B1",`2184|das|Universum|universe
2185|die|Galaxie|galaxy
2186|der|Planet|planet
2187|der|Mars|Mars
2188|die|Venus|Venus
2189|der|Saturn|Saturn
2190|die|Rakete|rocket
2191|der|Astronaut|astronaut
2192|die|Umlaufbahn|orbit
2193|die|Schwerelosigkeit|weightlessness
2194|das|Sonnensystem|solar system
2195|die|Sonnenfinsternis|solar eclipse
2196|der|Komet|comet
2197|der|Meteor|meteor
2198|der|Asteroid|asteroid
2199|das|Schwarze Loch|black hole
2200|die|Sternschnuppe|shooting star
2201|das|Sternbild|constellation
2202|die|Milchstraße|the Milky Way
2203|die|Mondlandung|moon landing
2204|der|Satellit|satellite`],
["Office & Stationery","A2",`2205|die|Akte|file / document
2206|das|Dokument|document
2207|der|Umschlag|envelope
2208|die|Briefmarke|stamp
2209|der|Klebstoff|glue
2210|die|Schere|scissors
2211|der|Locher|hole punch
2212|der|Tacker|stapler
2213|die|Büroklammer|paper clip
2214|das|Formular|form (document)
2215|-|unterschreiben|to sign
2216|die|Unterschrift|signature
2217|der|Stempel|stamp / seal
2218|der|Radiergummi|eraser
2219|das|Lineal|ruler
2220|der|Spitzer|pencil sharpener
2221|die|Heftklammer|staple
2222|der|Textmarker|highlighter
2223|die|Pinnwand|pinboard
2224|die|Visitenkarte|business card
2225|die|Konferenz|conference`],
["Business & Economy","B1",`2226|das|Unternehmen|company / enterprise
2227|der|Unternehmer|entrepreneur
2228|der|Umsatz|revenue
2229|der|Gewinn|profit
2230|der|Verlust|loss
2231|die|Bilanz|balance sheet
2232|die|Strategie|strategy
2233|die|Konkurrenz|competition (business)
2234|der|Lieferant|supplier
2235|die|Lieferung|delivery
2236|die|Bestellung|order
2237|der|Auftrag|order / contract
2238|die|Nachfrage|demand
2239|das|Marketing|marketing
2240|der|Vertrieb|sales / distribution
2241|die|Produktion|production
2242|die|Fabrik|factory
2243|die|Branche|industry / sector
2244|die|Aktie|stock / share
2245|die|Börse|stock exchange
2246|die|Wirtschaft|economy
2247|die|Inflation|inflation
2248|die|Rezession|recession
2249|das|Wachstum|growth
2250|der|Export|export
2251|der|Import|import
2252|die|Handelsbilanz|trade balance
2253|-|verhandeln|to negotiate
2254|die|Fusion|merger
2255|die|Übernahme|takeover / acquisition
2256|das|Start-up|startup
2257|der|Investor|investor
2258|das|Kapital|capital
2259|die|Rendite|return on investment
2260|der|Vorstand|board of directors
2261|der|Aktionär|shareholder
2262|die|Zentrale|headquarters
2263|die|Abteilung|department`],
["History","B1",`2264|die|Antike|antiquity
2265|das|Mittelalter|the Middle Ages
2266|die|Renaissance|the Renaissance
2267|die|Revolution|revolution
2268|die|Kolonie|colony
2269|das|Imperium|empire
2270|der|Kaiser|emperor
2271|der|König|king
2272|die|Königin|queen
2273|der|Adel|nobility
2274|die|Monarchie|monarchy
2275|die|Republik|republic
2276|der|Weltkrieg|world war
2277|die|Unabhängigkeit|independence
2278|die|Sklaverei|slavery
2279|die|Entdeckung|discovery
2280|der|Entdecker|explorer / discoverer
2281|die|Zivilisation|civilization
2282|das|Reich|empire / realm
2283|die|Dynastie|dynasty
2284|der|Historiker|historian
2285|die|Ruine|ruin
2286|die|Ausgrabung|excavation
2287|der|Fund|find / discovery
2288|die|Legende|legend
2289|der|Mythos|myth
2290|die|Überlieferung|tradition / lore`],
["Grammar & Language Learning","A2",`2291|die|Grammatik|grammar
2292|das|Substantiv|noun
2293|das|Verb|verb
2294|das|Adjektiv|adjective
2295|das|Adverb|adverb
2296|die|Präposition|preposition
2297|das|Pronomen|pronoun
2298|die|Konjunktion|conjunction
2299|der|Satz|sentence
2300|das|Wort|word
2301|der|Buchstabe|letter
2302|die|Silbe|syllable
2303|die|Aussprache|pronunciation
2304|der|Akzent|accent
2305|die|Übersetzung|translation
2306|der|Dialekt|dialect
2307|die|Rechtschreibung|spelling
2308|das|Komma|comma
2309|das|Fragezeichen|question mark
2310|das|Ausrufezeichen|exclamation mark
2311|die|Vokabel|vocabulary word
2312|der|Wortschatz|vocabulary
2313|die|Bedeutung|meaning
2314|die|Zeitform|tense (grammar)
2315|der|Fall|case (grammar)
2316|der|Nominativ|nominative case
2317|der|Akkusativ|accusative case
2318|der|Dativ|dative case
2319|der|Genitiv|genitive case
2320|die|Deklination|declension
2321|die|Konjugation|conjugation
2322|der|Plural|plural
2323|der|Singular|singular
2324|das|Geschlecht|gender (grammar)
2325|-|männlich|masculine
2326|-|weiblich|feminine
2327|-|sächlich|neuter`],
["Vehicles & Car Parts","A2",`2328|der|Motor|engine
2329|die|Bremse|brake
2330|das|Lenkrad|steering wheel
2331|der|Reifen|tire
2332|die|Windschutzscheibe|windshield
2333|der|Kofferraum|trunk
2334|die|Motorhaube|hood
2335|der|Scheinwerfer|headlight
2336|die|Hupe|horn
2337|der|Airbag|airbag
2338|das|Nummernschild|license plate
2339|der|Anhänger|trailer
2340|das|Getriebe|transmission / gearbox
2341|die|Kupplung|clutch
2342|der|Auspuff|exhaust pipe
2343|der|Blinker|turn signal
2344|die|Batterie|battery (car)
2345|das|Cabrio|convertible
2346|der|Kombi|station wagon
2347|der|Lastwagen|truck`],
["Farm & Agriculture","A2",`2348|der|Bauernhof|farm
2349|der|Landwirt|farmer
2350|die|Landwirtschaft|agriculture
2351|das|Feld|field
2352|der|Acker|farmland
2353|die|Scheune|barn
2354|der|Stall|stable / barn
2355|der|Traktor|tractor
2356|-|pflügen|to plow
2357|-|säen|to sow
2358|-|pflanzen|to plant
2359|-|ernten|to harvest
2360|-|gießen|to water
2361|-|düngen|to fertilize
2362|der|Dünger|fertilizer
2363|die|Bewässerung|irrigation
2364|das|Getreide|grain
2365|der|Weizen|wheat
2366|die|Gerste|barley
2367|der|Hafer|oats`],
["Beauty & Personal Care","A2",`2368|das|Make-up|makeup
2369|der|Lippenstift|lipstick
2370|der|Nagellack|nail polish
2371|das|Parfüm|perfume
2372|die|Bürste|brush
2373|der|Kamm|comb
2374|der|Rasierer|razor
2375|-|sich rasieren|to shave
2376|das|Deodorant|deodorant
2377|die|Maniküre|manicure
2378|die|Pediküre|pedicure
2379|der|Friseursalon|hair salon
2380|die|Frisur|hairstyle
2381|-|sich schminken|to put on makeup
2382|-|sich kämmen|to comb one's hair
2383|die|Sonnencreme|sunscreen
2384|die|Tätowierung|tattoo
2385|das|Piercing|piercing`],
["Social Media & Internet Culture","A2",`2386|der|Influencer|influencer
2387|der|Follower|follower
2388|-|folgen|to follow (online)
2389|-|liken|to like (online)
2390|der|Hashtag|hashtag
2391|der|Beitrag|post
2392|-|streamen|to stream
2393|der|Livestream|livestream
2394|die|Story|story (social media)
2395|-|viral|viral (adj.)
2396|der|Algorithmus|algorithm
2397|das|Meme|meme`],
["Measurement Units","A2",`2398|der|Meter|meter
2399|der|Zentimeter|centimeter
2400|der|Kilometer|kilometer
2401|das|Kilogramm|kilogram
2402|das|Gramm|gram
2403|der|Liter|liter
2404|der|Milliliter|milliliter
2405|die|Tonne|ton
2406|der|Quadratmeter|square meter
2407|der|Grad|degree
2408|das|Volumen|volume
2409|die|Länge|length
2410|die|Breite|width
2411|die|Höhe|height
2412|die|Tiefe|depth
2413|die|Geschwindigkeit|speed
2414|die|Entfernung|distance
2415|der|Umfang|circumference
2416|der|Durchmesser|diameter`],
["Herbs, Spices, Trees & Flowers","A2",`2417|die|Rose|rose
2418|die|Tulpe|tulip
2419|die|Sonnenblume|sunflower
2420|die|Lilie|lily
2421|die|Orchidee|orchid
2422|der|Kaktus|cactus
2423|die|Eiche|oak tree
2424|die|Birke|birch tree
2425|die|Kiefer|pine tree
2426|die|Tanne|fir tree
2427|die|Palme|palm tree
2428|der|Rasen|lawn
2429|das|Unkraut|weed
2430|die|Petersilie|parsley
2431|das|Basilikum|basil
2432|der|Rosmarin|rosemary
2433|der|Thymian|thyme
2434|der|Ingwer|ginger
2435|die|Minze|mint
2436|der|Zimt|cinnamon
2437|die|Vanille|vanilla
2438|die|Muskatnuss|nutmeg
2439|der|Kümmel|caraway / cumin
2440|das|Kurkuma|turmeric`],
["Senses & Sounds","B1",`2441|der|Geruch|smell
2442|der|Geschmack|taste
2443|das|Gefühl|feeling / touch
2444|das|Gehör|hearing
2445|die|Wahrnehmung|perception
2446|der|Klang|sound
2447|das|Geräusch|noise
2448|-|still|silent
2449|-|flüstern|to whisper
2450|-|schreien|to scream / shout
2451|-|knallen|to bang / pop
2452|-|klingeln|to ring
2453|-|summen|to hum / buzz`],
["Textures & Physical Properties","B1",`2454|-|weich|soft
2455|-|hart|hard
2456|-|glatt|smooth
2457|-|rau|rough
2458|-|klebrig|sticky
2459|-|elastisch|elastic
2460|-|steif|stiff
2461|-|biegsam|flexible / pliable
2462|-|spitz|pointy / sharp
2463|-|stumpf|blunt / dull
2464|-|durchsichtig|transparent
2465|-|undurchsichtig|opaque
2466|-|matt|matte
2467|-|glänzend|shiny
2468|-|stabil|stable / sturdy`],
["Mythology & Folklore","B1",`2469|die|Sage|legend / saga
2470|das|Märchen|fairy tale
2471|der|Drache|dragon
2472|der|Zauberer|wizard
2473|die|Hexe|witch
2474|der|Riese|giant
2475|der|Zwerg|dwarf
2476|die|Fee|fairy
2477|das|Monster|monster
2478|der|Geist|ghost / spirit
2479|der|Vampir|vampire
2480|das|Einhorn|unicorn`],
["Restaurant, Hotel & Tourism","A2",`2495|die|Reservierung|reservation
2496|der|Zimmerservice|room service
2497|das|Einzelzimmer|single room
2498|das|Doppelzimmer|double room
2499|die|Rezeption|reception (hotel)
2500|der|Portier|concierge / porter
2501|das|Trinkgeld|tip
2502|die|Bedienung|service (restaurant)
2503|die|Vorspeise|appetizer
2504|die|Hauptspeise|main course
2505|das|Buffet|buffet
2506|der|Aufenthalt|stay
2507|-|übernachten|to stay overnight
2508|die|Übernachtung|overnight stay
2509|die|Halbpension|half board
2510|die|Vollpension|full board
2511|das|Zimmermädchen|housekeeper / maid
2512|die|Stadtführung|city tour
2513|der|Reiseführer|tour guide / guidebook
2514|die|Broschüre|brochure
2515|das|Souvenir|souvenir
2516|die|Jugendherberge|youth hostel
2517|der|Ausblick|view
2518|die|Aussicht|view / prospect`],
["Communication & Social Verbs","B1",`2519|-|andeuten|to hint / imply
2520|-|betonen|to emphasize
2521|-|erwähnen|to mention
2522|-|behaupten|to claim / assert
2523|-|zugeben|to admit
2524|-|leugnen|to deny
2525|-|überzeugen|to convince
2526|-|überreden|to persuade
2527|-|warnen|to warn
2528|-|ermutigen|to encourage
2529|-|entmutigen|to discourage
2530|-|trösten|to comfort / console
2531|-|beruhigen|to calm / soothe
2532|-|aufregen|to upset / excite
2533|-|provozieren|to provoke
2534|-|beleidigen|to insult
2535|-|loben|to praise
2536|-|kritisieren|to criticize
2537|-|verteidigen|to defend
2538|-|rechtfertigen|to justify
2539|-|beschuldigen|to accuse
2540|-|verzeihen|to forgive
2541|-|manipulieren|to manipulate
2542|-|beeindrucken|to impress
2543|-|enttäuschen|to disappoint`],
["Weather Detail & Climate","B1",`2544|der|Nieselregen|drizzle
2545|der|Schauer|shower (rain)
2546|der|Sonnenschein|sunshine
2547|die|Brise|breeze
2548|das|Tief|low-pressure system
2549|das|Hoch|high-pressure system
2550|der|Meteorologe|meteorologist
2551|das|Klima|climate
2552|-|gemäßigt|temperate (climate)
2553|-|tropisch|tropical
2554|-|arktisch|arctic
2555|die|Kälte|the cold (noun)
2556|die|Hitze|the heat (noun)
2557|die|Wärme|warmth`],
["School Subjects & Academic Fields","B1",`2558|die|Geografie|geography (subject)
2559|die|Ethik|ethics
2560|die|Philosophie|philosophy
2561|die|Informatik|computer science
2562|die|Sozialkunde|social studies
2563|der|Lehrplan|curriculum
2564|das|Fachgebiet|field of study
2565|die|Disziplin|discipline`],
["Cooking Techniques","B1",`2566|-|dünsten|to steam / braise
2567|-|schmoren|to braise
2568|-|rösten|to roast
2569|-|pürieren|to purée
2570|-|marinieren|to marinate
2571|-|würzen|to season
2572|-|garnieren|to garnish
2573|-|servieren|to serve
2574|-|abschmecken|to taste / season to taste
2575|-|anbraten|to sear
2576|-|kneten|to knead
2577|-|rühren|to stir
2578|-|abkühlen|to cool down
2579|-|erhitzen|to heat up`],
["Bathroom & Daily Routine","A2",`2580|die|Dusche|shower
2581|die|Badewanne|bathtub
2582|das|Waschbecken|sink (bathroom)
2583|die|Toilette|toilet
2584|der|Duschvorhang|shower curtain
2585|das|Handtuch|towel
2586|der|Bademantel|bathrobe
2587|die|Zahnseide|dental floss
2588|-|sich duschen|to shower
2589|-|frühstücken|to have breakfast
2590|-|einschlafen|to fall asleep
2591|-|ausschlafen|to sleep in
2592|der|Alltag|daily life / routine
2593|die|Gewohnheit|habit
2594|die|Routine|routine
2595|-|verschlafen|to oversleep
2596|das|Toilettenpapier|toilet paper
2597|der|Föhn|hair dryer
2598|-|sich föhnen|to blow-dry one's hair
2599|das|Rasierwasser|aftershave
2600|die|Klobürste|toilet brush
2601|die|Ablage|shelf / storage (bathroom)
2602|die|Hygiene|hygiene
2603|-|sauber machen|to clean`],
["Baby & Children's Items","A2",`2604|die|Windel|diaper
2605|der|Kinderwagen|stroller
2606|die|Wiege|cradle
2607|der|Schnuller|pacifier
2608|das|Spielzeug|toy
2609|die|Puppe|doll
2610|der|Teddybär|teddy bear
2611|das|Fläschchen|baby bottle
2612|-|krabbeln|to crawl
2613|-|großziehen|to raise (children)
2614|der|Hochstuhl|high chair
2615|das|Lätzchen|bib
2616|der|Laufstall|playpen
2617|-|babysitten|to babysit
2618|der|Babysitter|babysitter`],
["Sports Equipment & Individual Sports","A2",`2619|die|Schutzausrüstung|protective gear
2620|das|Trikot|jersey
2621|der|schläger|racket / bat / club
2622|das|Netz|net
2623|die|Torwand|goal frame
2624|die|Laufbahn|running track
2625|das|Skateboard|skateboard
2626|die|Rollschuhe|roller skates
2627|der|Boxkampf|boxing match
2628|-|boxen|to box
2629|das|Gewichtheben|weightlifting
2630|die|Kampfsportarten|martial arts
2631|das|Bogenschießen|archery
2632|das|Golf|golf
2633|der|Golfschläger|golf club
2634|das|Volleyball|volleyball`],
["Public Transport & Airport Detail","B1",`2635|der|Ticketschalter|ticket counter
2636|der|Fahrkartenautomat|ticket machine
2637|die|Monatskarte|monthly pass
2638|die|Einzelfahrkarte|single ticket
2639|die|Businessclass|business class
2640|die|Bordkarte|boarding pass
2641|das|Gate|gate (airport)
2642|der|Terminal|terminal
2643|die|Gepäckausgabe|baggage claim
2644|der|Zwischenstopp|layover / stopover
2645|der|Direktflug|direct flight
2646|der|Anschlussflug|connecting flight
2647|der|Kofferkuli|luggage cart
2648|die|Passkontrolle|passport control
2649|die|Landung|landing
2650|der|Start|takeoff
2651|die|Turbulenz|turbulence
2652|die|Crew|flight crew`],
["Weddings, Farewells & Ceremonies","B1",`2653|die|Trauung|wedding ceremony
2654|das|Brautpaar|bride and groom
2655|die|Braut|bride
2656|der|Bräutigam|groom
2657|der|Trauzeuge|best man / witness
2658|die|Hochzeitsfeier|wedding reception
2659|der|Ehering|wedding ring
2660|die|Gedenkfeier|memorial service
2661|das|Beileid|condolences
2662|-|trauern|to mourn
2663|der|Nachruf|obituary
2664|die|Urne|urn
2665|der|Grabstein|gravestone
2666|das|Grab|grave`],
["Pets & Pet Care","A2",`2667|der|Tierarzt|veterinarian
2668|die|Leine|leash
2669|das|Halsband|collar
2670|das|Aquarium|aquarium
2671|das|Katzenklo|litter box
2672|das|Tierfutter|pet food
2673|die|Hundehütte|doghouse
2674|-|stubenrein|house-trained
2675|-|dressieren|to train (an animal)
2676|die|Tierhandlung|pet store
2677|das|Tierheim|animal shelter
2678|-|kastrieren|to neuter / spay`],
["Cinema, Streaming & Entertainment","A2",`2679|der|Kinosaal|cinema screening room
2680|die|Leinwand|movie screen
2681|die|Vorstellung|screening / show
2682|der|Untertitel|subtitle
2683|die|Synchronisation|dubbing
2684|die|Fortsetzung|sequel
2685|die|Hauptrolle|lead role
2686|der|Nebendarsteller|supporting actor
2687|das|Drehbuch|screenplay
2688|der|Trailer|trailer
2689|die|Serie|TV series
2690|die|Episode|episode
2691|die|Staffel|season (TV)
2692|das|Streaming|streaming
2693|-|abonnieren|to subscribe`],
["Jewelry, Accessories & Currency","A2",`2694|der|Schmuck|jewelry
2695|das|Armband|bracelet
2696|der|Ohrring|earring
2697|die|Brosche|brooch
2698|die|Perle|pearl
2699|der|Edelstein|gemstone
2700|die|Münze|coin
2701|der|Schein|bill / banknote
2702|die|Währung|currency
2703|der|Wechselkurs|exchange rate
2704|die|Geldbörse|wallet / purse
2705|das|Portemonnaie|wallet
2706|die|Handtasche|handbag
2707|die|Sonnenbrille|sunglasses
2708|die|Manschettenknöpfe|cufflinks
2709|der|Haarreif|headband
2710|die|Haarspange|hair clip`],
["Sleep & Daily Rhythm","A2",`2711|der|Schlaf|sleep
2712|der|Traum|dream
2713|-|träumen|to dream
2714|der|Albtraum|nightmare
2715|-|schnarchen|to snore
2716|die|Schlaflosigkeit|sleeplessness / insomnia
2717|das|Nickerchen|nap
2718|-|ausgeschlafen|well-rested
2719|-|übermüdet|overtired
2720|der|Biorhythmus|biorhythm`],
["Structure & Abstract Concepts","B1",`2721|der|Anfang|beginning
2722|das|Ende|end
2723|die|Mitte|middle
2724|der|Rand|edge / border
2725|die|Seite|side / page
2726|der|Bereich|area / domain
2727|der|Abschnitt|section
2728|die|Reihe|row / series
2729|die|Liste|list
2730|die|Übersicht|overview
2731|der|Überblick|overview
2732|die|Einleitung|introduction
2733|der|Schluss|conclusion / end
2734|der|Inhalt|content
2735|die|Struktur|structure
2736|das|System|system
2737|die|Methode|method
2738|die|Technik|technique
2739|der|Prozess|process
2740|die|Phase|phase
2741|der|Schritt|step
2742|die|Stufe|stage / level
2743|das|Niveau|level
2744|der|Standard|standard
2745|die|Norm|norm
2746|die|Regel|rule
2747|die|Ausnahme|exception
2748|das|Beispiel|example
2749|die|Situation|situation
2750|der|Zustand|state / condition
2751|die|Lage|situation / location
2752|der|Kontext|context
2753|der|Zusammenhang|connection / context
2754|das|Verhältnis|relationship / ratio
2755|der|Unterschied|difference
2756|die|Ähnlichkeit|similarity (noun)
2757|der|Vergleich|comparison
2758|das|Muster|pattern
2759|das|Modell|model
2760|der|Typ|type
2761|die|Art|kind / type
2762|die|Kategorie|category
2763|die|Gruppe|group`],
["More High-Frequency Verbs","A2",`2764|-|anmachen|to turn on
2765|-|ausmachen|to turn off / arrange
2766|-|einschalten|to switch on
2767|-|ausschalten|to switch off
2768|-|umschalten|to switch over / channel
2769|-|aufpassen|to pay attention / watch out
2770|-|zuhören|to listen
2771|-|zusehen|to watch / observe
2772|-|mitmachen|to join in / participate
2773|-|teilnehmen|to participate
2774|-|vorschlagen|to suggest / propose
2775|-|durchführen|to carry out / conduct
2776|-|stattfinden|to take place
2777|-|geschehen|to happen
2778|-|sich kümmern um|to take care of
2779|-|sorgen für|to provide for
2780|-|aufgeben|to give up
2781|-|durchhalten|to hold out / persevere
2782|-|sich durchsetzen|to prevail / assert oneself
2783|-|sich beteiligen|to take part
2784|-|sich engagieren|to get involved
2785|-|sich einsetzen für|to advocate for
2786|-|abschließen|to conclude / finish
2787|-|fortsetzen|to continue
2788|-|unterbrechen|to interrupt
2789|-|erledigen|to take care of (a task)
2790|-|verschieben|to postpone
2791|-|absagen|to cancel
2792|-|zusagen|to accept / confirm (an invitation)
2793|-|ausrichten|to arrange / convey a message
2794|-|veranstalten|to organize / host`],
["Requests, Agreements & Values","B1",`2795|der|Anlass|occasion
2796|die|Gelegenheit|opportunity
2797|der|Anspruch|claim / entitlement
2798|die|Forderung|demand
2799|die|Bitte|request
2800|der|Wunsch|wish
2801|der|Plan|plan
2802|das|Vorhaben|plan / project
2803|die|Absprache|arrangement
2804|die|Vereinbarung|agreement
2805|der|Kompromiss|compromise
2806|die|Einigung|agreement / settlement
2807|der|Konflikt|conflict
2808|die|Auseinandersetzung|dispute / confrontation
2809|die|Zusammenarbeit|cooperation
2810|die|Unterstützung|support
2811|die|Hilfe|help (noun)
2812|die|Beratung|consultation / advice
2813|der|Rat|advice
2814|der|Vorschlag|suggestion
2815|die|Initiative|initiative
2816|die|Gleichheit|equality
2817|die|Gerechtigkeit|justice
2818|die|Ungerechtigkeit|injustice
2819|die|Toleranz|tolerance
2820|der|Respekt|respect
2821|-|respektieren|to respect
2822|die|Würde|dignity
2823|die|Ehre|honor`],
["More Kitchen & Dining Items","A2",`2824|die|Vorratskammer|pantry
2825|der|Vorrat|supply / stock
2826|-|aufbewahren|to store
2827|-|spülen|to rinse / wash up
2828|das|Geschirr|dishes / crockery
2829|das|Besteck|cutlery
2830|der|Untersetzer|coaster / trivet
2831|die|Tischdecke|tablecloth
2832|die|Kanne|pot / jug
2833|die|Karaffe|carafe
2834|der|Trichter|funnel
2835|das|Nudelholz|rolling pin
2836|die|Küchenwaage|kitchen scale`],
["More Animals & Insects","A2",`2837|der|Wurm|worm
2838|die|Raupe|caterpillar
2839|die|Motte|moth
2840|die|Grille|cricket
2841|die|Heuschrecke|grasshopper
2842|der|Marienkäfer|ladybug
2843|die|Wespe|wasp
2844|die|Zecke|tick
2845|der|Igel|hedgehog
2846|das|Eichhörnchen|squirrel
2847|die|Fledermaus|bat
2848|der|Maulwurf|mole
2849|die|Ratte|rat`],
["Zodiac & Everyday Astrology Terms","B1",`2850|das|Sternzeichen|zodiac sign
2851|der|Widder|Aries
2852|der|Stier|Taurus
2853|der|Krebs|Cancer (zodiac) / crab
2854|die|Jungfrau|Virgo / virgin
2855|der|Skorpion|Scorpio / scorpion
2856|der|Schütze|Sagittarius / marksman
2857|der|Steinbock|Capricorn / ibex
2858|der|Wassermann|Aquarius
2859|die|Fische|Pisces / fish (pl.)
2860|das|Horoskop|horoscope`],
["More Adjectives: Physical & Abstract","A2",`2861|-|munter|lively / awake
2862|-|wach|awake
2863|-|schläfrig|sleepy
2864|-|hungrig|hungry
2865|-|durstig|thirsty
2866|-|satt|full / satiated
2867|-|tief|deep
2868|-|flach|flat / shallow
2869|-|steil|steep
2870|-|eben|level / even
2871|-|krumm|crooked / bent
2872|-|gebogen|bent / curved
2873|-|quadratisch|square (adj.)
2874|-|rechteckig|rectangular
2875|-|dreieckig|triangular
2876|-|kreisförmig|circular
2877|-|oval|oval
2878|-|zerbrechlich|fragile
2879|-|robust|robust / sturdy
2880|-|kompakt|compact
2881|-|geräumig|spacious
2882|-|winzig|tiny
2883|-|riesig|huge
2884|-|enorm|enormous`],
["More Household & Daily Objects","A2",`2885|der|Aschenbecher|ashtray
2886|die|Streichhölzer|matches
2887|das|Feuerzeug|lighter
2888|die|Glühbirne|lightbulb
2889|der|Stecker|plug
2890|das|Verlängerungskabel|extension cord
2891|die|Fernbedienung|remote control
2892|der|Wasserhahn|faucet / tap
2893|die|Spüle|kitchen sink
2894|der|Abfluss|drain
2895|der|Wäschekorb|laundry basket
2896|die|Wäscheleine|clothesline
2897|das|Bügeleisen|iron (for clothes)
2898|-|bügeln|to iron
2899|die|Nähmaschine|sewing machine
2900|der|Putzlappen|cleaning rag`],
["More Time & Frequency Expressions","A2",`2901|-|regelmäßig|regularly
2902|-|unregelmäßig|irregularly
2903|-|gelegentlich|occasionally
2904|-|häufig|frequent / frequently
2905|-|ständig|constantly
2906|-|dauerhaft|permanent
2907|-|vorübergehend|temporary
2908|-|kurzfristig|short-term
2909|-|langfristig|long-term
2910|-|wöchentlich|weekly
2911|-|monatlich|monthly
2912|-|jährlich|yearly / annual
2913|-|täglich|daily
2914|-|stündlich|hourly
2915|-|zeitweise|temporarily / at times`],
["More Professions","A2",`2916|der|Krankenpfleger|male nurse
2917|der|Physiotherapeut|physiotherapist
2918|der|Psychologe|psychologist
2919|der|Berater|consultant
2920|der|Designer|designer
2921|der|Programmierer|programmer
2922|der|Kapitän|captain (ship)
2923|der|Matrose|sailor
2924|der|Gärtner|gardener
2925|der|Fotograf|photographer
2926|der|Politiker|politician
2927|der|Diplomat|diplomat
2928|der|Bibliothekar|librarian`],
["More Food & Cooking","A2",`2929|der|Grillspieß|skewer
2930|-|frittieren|to deep-fry
2931|die|Friteuse|deep fryer
2932|der|Toast|toast
2933|das|Brötchen|bread roll
2934|die|Brezel|pretzel
2935|der|Strudel|strudel
2936|der|Pfannkuchen|pancake
2937|das|Omelett|omelet
2938|die|Rühreier|scrambled eggs`],
["More Nature & Outdoor Terms","B1",`2939|die|Lichtung|clearing (forest)
2940|der|Bach|stream / brook
2941|der|Teich|pond
2942|der|Wasserfall|waterfall
2943|die|Klippe|cliff
2944|die|Düne|dune
2945|der|Sumpf|swamp
2946|das|Moor|moor / bog
2947|die|Wiese|meadow
2948|der|Hügel|hill
2949|die|Schlucht|canyon / gorge
2950|der|Gipfel|summit / peak`],
["Precision, Clarity & Judgment","B1",`2951|-|gründlich|thorough
2952|-|oberflächlich|superficial
2953|-|detailliert|detailed
2954|-|ausführlich|detailed / extensive
2955|-|präzise|precise
2956|-|vage|vague
2957|-|eindeutig|clear / unambiguous
2958|-|zweideutig|ambiguous
2959|-|verständlich|understandable
2960|-|unverständlich|incomprehensible
2961|-|nachvollziehbar|comprehensible / plausible
2962|-|plausibel|plausible
2963|-|fraglich|questionable
2964|-|zweifelhaft|doubtful
2965|-|offensichtlich|obvious`],
["Character Traits as Nouns","B1",`2966|die|Zufriedenheit|satisfaction
2967|die|Unzufriedenheit|dissatisfaction
2968|die|Langeweile|boredom
2969|die|Neugier|curiosity
2970|der|Mut|courage
2971|die|Feigheit|cowardice
2972|die|Geduld|patience
2973|die|Ungeduld|impatience
2974|die|Großzügigkeit|generosity
2975|der|Geiz|stinginess
2976|die|Ehrlichkeit|honesty
2977|die|Unehrlichkeit|dishonesty
2978|die|Bescheidenheit|modesty
2979|die|Arroganz|arrogance`],
["More Weather Phenomena","A2",`2980|die|Windstille|calm (no wind)
2981|die|Schneeflocke|snowflake
2982|der|Schneemann|snowman
2983|der|Eiszapfen|icicle
2984|der|Regenbogen|rainbow
2985|die|Pfütze|puddle
2986|der|Matsch|slush / mud
2987|-|trocknen|to dry`],
["Everyday Essentials","A2",`2988|das|Licht|light (noun)
2989|die|Dunkelheit|darkness
2990|die|Helligkeit|brightness
2991|das|Echo|echo
2992|der|Schatten|shadow
2993|die|Stille|silence (noun)
2994|das|Chaos|chaos
2995|die|Ordnung|order
2996|die|Unordnung|disorder / mess
2997|die|Ruhe|calm / quiet (noun)
2998|der|Lärm|noise
2999|der|Stillstand|standstill
3000|der|Wandel|change / transformation
3001|die|Erneuerung|renewal
3002|die|Wiederholung|repetition (noun)
3003|der|Zyklus|cycle
3004|die|Balance|balance
3005|das|Gleichgewicht|equilibrium / balance
3006|die|Harmonie|harmony
3007|der|Widerspruch|contradiction
3008|die|Übereinstimmung|agreement / match`]
];

const VOCAB = [];
TOPICS.forEach((t) => {
  const [name, level, raw] = t;
  raw.trim().split('\n').forEach(line => {
    const p = line.split('|');
    if(p.length < 4) return;
    VOCAB.push({n: parseInt(p[0], 10), art: p[1].trim(), de: p[2].trim(), en: p[3].trim(), topic: name, level: level});
  });
});
const TOPIC_NAMES = TOPICS.map(t => t[0]);


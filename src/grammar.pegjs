{
  /**
   * Overwrites objectA's values with objectB's and adds objectB's if non
   * existent in objectA
   *
   * @param {object} objectA
   * @param {object} objectB
   *
   * @returns {object} A new object based on objectA and objectB
   */
  function merge(objectA,objectB){
    var objectC = {};
    for (var attrname in objectA) { objectC[attrname] = objectA[attrname]; }
    for (var attrname in objectB) { objectC[attrname] = objectB[attrname]; }
    return objectC;
  }

}

start
= relative:relative ! (SPACE time:timeDeclaration)  {return relative}
/ relative:relative SPACE time:timeDeclaration    {return merge(relative, time)}
/ !(hoursDigits COLON) ad:absoluteDate ! (SPACE timeDeclaration)      {return ad}
/ !(hoursDigits COLON) ad:absoluteDate SPACE t:timeDeclaration        {return merge(ad, t)}
/ t:timeDeclaration                 {return t}

timeDeclaration
= at SPACE t:time SPACE f:fuzzyTime  {return merge({"fuzzytime": f}, t)}
/ at SPACE t:time                    {return t}
/ t:time                             {return t}
/ f:fuzzyTime SPACE at SPACE t:time  {return merge({"fuzzytime": f}, t)}
/ f:fuzzyTime                        {return {"fuzzytime": f}}

relative
= relativeDay
/ relativeFuture
/ relativePast

relativeDay
= day:today                          {return {"days": 0} }
/ day:tomorrow                       {return {"days": 1} }
/ day:dayAfterTomorrow               {return {"days": 2} }
/ day:dayBeforeYesterday             {return {"days": -2} }
/ day:yesterday                      {return {"days": -1} }

relativePast
= ago SPACE n:Integer SPACE yearsLiteral      {return {"years": -n} }
/ ago SPACE n:Integer SPACE monthsLiteral     {return {"months": -n} }
/ ago SPACE n:Integer SPACE weeksLiteral SPACE w:weekdayLiteral {return {"weeks": -n, "weekday": w} }
/ ago SPACE n:Integer SPACE weeksLiteral      {return {"weeks": -n} }
/ ago SPACE n:Integer SPACE daysLiteral       {return {"days": -n} }
/ ago SPACE n:Integer SPACE hoursLiteral      {return {"hours": -n} }
/ ago SPACE n:Integer SPACE minutesLiteral    {return {"minutes": -n} }
/ last SPACE yearsLiteral                     {return {"years": -1} }
/ last SPACE monthsLiteral                    {return {"months": -1} }
/ last SPACE weeksLiteral SPACE w:weekdayLiteral  {return {"weeks": -1, "weekday": w} }
/ last SPACE weeksLiteral                     {return {"weeks": -1} }
/ last SPACE w:weekdayLiteral                 {return {"weekday": -w} }

relativeFuture
= next SPACE yearsLiteral                     {return {"years": 1} }
/ next SPACE monthsLiteral                    {return {"months": 1} }
/ next SPACE weeksLiteral SPACE w:weekdayLiteral  {return {"weeks": 1, "weekday": w} }
/ next SPACE weeksLiteral                     {return {"weeks": 1} }
/ next SPACE w:weekdayLiteral                 {return {"weekday": w} }
/ in SPACE n:Integer SPACE? yearsLiteral      {return {"years": n} }
/ in SPACE n:Integer SPACE? monthsLiteral     {return {"months": n} }
/ in SPACE n:Integer SPACE weeksLiteral SPACE w:weekdayLiteral  {return {"weeks": n, "weekday": w} }
/ in SPACE n:Integer SPACE? weeksLiteral      {return {"weeks": n} }
/ in SPACE n:Integer SPACE? daysLiteral       {return {"days": n} }
/ in SPACE n:Integer SPACE? hoursLiteral      {return {"hours": n} }
/ in SPACE n:Integer SPACE? minutesLiteral    {return {"minutes": n} }

absoluteDate
= onSpace? w:weekdayLiteral                   {return {"weekday": w} }
/ onSpace? day:dayDigits !(SPACE clock) DOT month:monthDigits DOT year:yearDigits DOT?          {return {"day": day, "month": month-1, "year": year} }
/ onSpace? day:dayDigits !(SPACE clock) DOT_SPACE SPACE? month:monthLiteral SPACE year:yearDigits DOT?  {return {"day": day, "month": month, "year": year} }
/ onSpace? day:dayDigits !(SPACE clock) DOT_SPACE SPACE? month:monthLiteral                 {return {"day": day, "month": month} }
/ onSpace? day:dayDigits !(SPACE clock) DOT month:monthDigits DOT?                      {return {"day": day, "month": month-1} }
/ onSpace? day:dayDigits !(SPACE clock) DOT?  {return {"day": day}}

absoluteTime
= time:timeDeclaration                {return time}

time
=  h:hoursDigits COLON m:minutesDigits SPACE? clock?  {return {"hour": h, "minute": m}}
/ !(h:monthDigits DOT) h:hoursDigits SPACE? clock SPACE? m:minutesDigits    {return {"hour": h, "minute": m}}
/ !(h:monthDigits DOT) h:hoursDigits SPACE? clock?  {return {"hour": h}}

weekdayLiteral
= day:monday
/ day:tuesday
/ day:wednesday
/ day:thursday
/ day:friday
/ day:saturday
/ day:sunday

/** guard against morning */
monday
= 'montag'                {return 1;}
/ 'mo'!(mondayGuard)DOT?  {return 1;}

mondayGuard
= 'rgens'
/ 'at'

tuesday
= 'dienstag'  {return 2;}
/ 'di'DOT?    {return 2;}

wednesday
= 'mittwoch'  {return 3;}
/ 'mi'DOT?    {return 3;}

thursday
= 'donnerstag'{return 4;}
/ 'do'DOT?    {return 4;}

friday
= 'freitag'   {return 5;}
/ 'fr'DOT?    {return 5;}

saturday
= 'samstag'   {return 6;}
/ 'sa'DOT?    {return 6;}

sunday
= 'son'[n]?'tag'  {return 0;}
/ 'so'DOT?    {return 0;}

monthLiteral
= month:january
/ month:february
/ month:march
/ month:april
/ month:may
/ month:june
/ month:july
/ month:august
/ month:september
/ month:october
/ month:november
/ month:december

january
= 'januar'    {return 0;}
/ 'jan'DOT?   {return 0;}

february
= 'februar'   {return 1;}
/ 'feb'DOT?   {return 1;}

march
= 'm'[aä][e]?'rz' {return 2;}
/ 'mrz'DOT?   {return 2;}

april
= 'april'     {return 3;}
/ 'apr'DOT?   {return 3;}

may
= 'mai'       {return 4;}

june
= 'juni'      {return 5;}
/ 'jun'DOT?   {return 5;}

july
= 'juli'      {return 6;}
/ 'jul'DOT?   {return 6;}

august
= 'august'    {return 7;}
/ 'aug'DOT?   {return 7;}

september
= 'september'   {return 8;}
/ 'sep'[t]?DOT? {return 8;}

october
= 'oktober'   {return 9;}
/ 'okt'DOT?   {return 9;}

november
= 'november'  {return 10;}
/ 'nov'DOT?   {return 10;}

december
= 'dezemeber' {return 11;}
/ 'dez'DOT?   {return 11;}

yesterday
= 'gestern'

dayBeforeYesterday
= 'vorgestern'

today
= 'heute'

/** guard against morning */
tomorrow
= 'morgen' !('s')

dayAfterTomorrow
= [üu][e]?'bermorgen'

fuzzyTime
= morning
/ noon
/ afternoon
/ evening
/ night

yearDigits
= m:[1-2]c:[0-9]d:[0-9]y:[0-9]  {return parseInt(m+c+d+y, 10)}
/ d:[0-9]y:[0-9]          {return parseInt(d+y, 10)}

dayDigits
= d:[0]m:NonZeroDigit     {return parseInt(d+m, 10)}
/ d:[1-2]m:DecimalDigit?  {return parseInt(d+m, 10)}
/ d:[3]m:[0-1]?           {return parseInt(d+m, 10)}
/ m:[4-9]                 {return parseInt(m, 10)}

monthDigits
= m:[0]o:NonZeroDigit?    {return parseInt(m+o, 10)}
/ m:[1]o:[0-2]            {return parseInt(m+o, 10)}
/ m:[1-9]                 {return parseInt(m, 10)}

hoursDigits
= d:[0-1]h:DecimalDigit?  {return parseInt(d+h, 10)}
/ d:[2]h:[0-4]?           {return parseInt(d+h, 10)}
/ h:[3-9]                 {return parseInt(h, 10)}

minutesDigits
= d:[0-5]m:DecimalDigit?  {return parseInt(d+m, 10)}
/ m:[6-9]                 {return parseInt(m, 10)}

yearsLiteral
= 'jahren'
/ 'jahr'[e]?

monthsLiteral
= 'monat'[e]?[n]?

weeksLiteral
= 'woche'[n]?
/ 'wo'

daysLiteral
= 'tagen'
/ 'tag'[e]?

hoursLiteral
= 'stunde'[n]?
/ 'std'DOT?

minutesLiteral
= 'minuten'
/ 'min'DOT?
/ 'm'DOT?

last
= 'letzte'casusSuffix?

next
= 'nächste'casusSuffix?

casusSuffix
= 'n'
/ 'r'
/ 's'

in
= 'in'

on
= 'am'

onSpace
= on SPACE

at
= 'um'

/** guard against dayBeforeYesterday */
ago
= 'vor' !(yesterday)

morning
= 'morgen'[s]?  {return "morning"}
/ 'früh'        {return "morning"}

afternoon
= 'nachmittags' {return "afternoon"}

noon
= 'mittag'[s]?  {return "noon"}

evening
= 'abend'[s]?   {return "evening"}

night
= 'nacht'[s]?   {return "night"}

clock
= 'uhr'

Integer
= "0"
/ digit:NonZeroDigit digits:DecimalDigits? { return digit + (digits == null ? "" : digits); }

DecimalDigits
= digits:DecimalDigit+ { return digits.join(""); }

DecimalDigit
= [0-9]

NonZeroDigit
= [1-9]

COLON
= ':'

SPACE
= ' '

DOT
= '.'

DOT_SPACE
= DOT
/ SPACE

EOF
= !.

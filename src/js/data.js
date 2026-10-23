// Training messages for the small on-device word model, plus page content.
(function(root){
var CORPUS={
scam:[
"URGENT your account has been suspended verify your password now at the link",
"Final notice unpaid toll balance pay now to avoid a fine click the link",
"You have won a prize claim your free gift card today",
"Hi grandma I am in jail please send bail money with gift cards and dont tell mom",
"Your package is on hold pay the small delivery fee at this link",
"This is the IRS you owe back taxes and a warrant will be issued call now",
"Your computer has a virus call this number for tech support immediately",
"Guaranteed returns double your money with crypto investment opportunity",
"Buy gift cards and send me the codes keep this private I am in a meeting",
"Your bank account is locked confirm your social security number to unlock",
"Congratulations you have been selected for a free iphone claim your reward",
"Wrong number hi I am new in town do you want to chat and invest in crypto",
"Dear customer your payment failed update your billing details immediately",
"Unauthorized login detected verify your identity or your account will be closed",
"Medicare card replacement send your number and bank details to receive new card",
"Act now limited time pay with bitcoin or your files stay locked"
],
ham:[
"Your appointment is tomorrow at 3 pm reply C to confirm or call the office",
"Hey are you still coming to dinner on Friday I made reservations",
"Your verification code is numtoken do not share this code with anyone",
"Thanks for your order it shipped and will arrive on Thursday",
"Reminder the council meeting moved to 7 pm in the main room",
"Can you pick up milk on the way home thanks",
"Your prescription is ready for pickup at the pharmacy",
"Happy birthday hope you have a great day see you this weekend",
"The game starts at 6 bring a jacket it might get cold",
"Your monthly statement is available log in to the app to view it",
"Class is cancelled today because of the storm see you next week",
"Meeting notes are attached let me know if you have questions",
"Thanks for dinner last night we had a great time",
"Your ride is arriving in 3 minutes meet the driver outside",
"Library books are due Monday you can renew them online",
"Practice is at 5 today please bring your water bottle"
]};
var EXAMPLES=[
{label:"Bank text",text:"Chase Alert: Your account has been locked due to unauthorized activity. Verify your identity within 24 hours: http://chase-secure-login.top/verify"},
{label:"Boss gift cards",text:"Hi, it's Dana. I'm in a meeting and can't talk. I need 5 Google Play gift cards for a client today. Send me the codes and keep this between us."},
{label:"Package fee",text:"USPS: Your package is on hold. Pay a $1.99 redelivery fee at bit.ly/3xYzPkg to avoid return."},
{label:"Real reminder",text:"Reminder: your dentist appointment is tomorrow at 3:00 PM. Reply C to confirm."}
];
var SCAMS=[
{name:"A grandchild in trouble",looks:"“Grandma, it’s me. I’m in jail and need bail. Please don’t tell Mom.”",tell:"A frightening emergency, a request for secrecy, and payment by gift card or wire.",todo:"Hang up. Call your grandchild or a relative on a number you already have."},
{name:"Government impersonators",looks:"“This is the IRS. A warrant will be issued unless you pay today.”",tell:"Real agencies don’t threaten arrest by text or demand gift cards.",todo:"Look up the agency’s official number yourself and call it."},
{name:"Fake package or toll notices",looks:"“Your package is on hold. Pay a small fee to release it.”",tell:"A small fee, a link, and a package you weren’t expecting.",todo:"Open the carrier’s real app or website by typing the address yourself."},
{name:"Bank fraud alerts",looks:"“Your account is locked. Verify now.”",tell:"A link that asks you to log in, with a lookalike web address.",todo:"Call the number on the back of your card."},
{name:"The boss who needs gift cards",looks:"“I’m in a meeting. Buy 5 gift cards and send me the codes.”",tell:"Someone senior, unreachable, asking for gift-card codes.",todo:"Contact your boss on a known number before doing anything."},
{name:"Tech support alarms",looks:"“Your computer has a virus. Call this number now.”",tell:"Pop-ups and messages can’t really detect viruses and then ask you to call.",todo:"Close the page. Never give a stranger remote access."},
{name:"Prizes and inheritances",looks:"“You’ve won! Pay a small fee to claim your prize.”",tell:"You must pay or share details before you can collect.",todo:"Real prizes never charge you. Ignore it."},
{name:"Romance and investment",looks:"“I’ve made a fortune with crypto. Guaranteed returns.”",tell:"A new online friend, guaranteed profits, and pressure to move fast.",todo:"Talk to someone you trust before sending any money."}
];
var api={CORPUS:CORPUS,EXAMPLES:EXAMPLES,SCAMS:SCAMS};
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.AppData=api;
})(this);

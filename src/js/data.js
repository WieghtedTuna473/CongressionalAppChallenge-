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

CORPUS.scam.push("Your Netflix account is on hold update your payment details to continue watching","Social Security alert your number has been linked to illegal activity call this number","Claim your inheritance fund transfer needs a small processing fee","Your Apple ID has been locked confirm your identity to restore access","I need you to buy gift cards for a client and send me the codes today","Pay your overdue toll now to avoid additional fees and legal action","You qualify for a government grant pay a small fee to receive your money","Security warning your device is infected install this app to remove the virus");
CORPUS.ham.push("Your table for four is confirmed for 7 pm tonight see you there","Your order is ready for pickup at the front counter","Can you send me the photos from the trip when you get a chance","Your bill is ready you can view it in your account whenever you like","Doctor Smith will see you on Tuesday at 10 please arrive 15 minutes early","School pickup is at 3 today do not forget the permission slip","Your flight is on time boarding begins at 5 45 at gate B12","Thanks for the update I will review the document and reply tomorrow");

// Held-out test messages: never used for training. Written by the developer, so treat results as a rough guide.
var S=function(t){return {text:t,scam:true}},R=function(t){return {text:t,scam:false}};
var TESTSET=[
S("Wells Fargo: We noticed suspicious activity on your debit card. Confirm your PIN at wellsfargo-verify.top/pin now."),
S("Your Social Security benefits have been suspended due to fraud. Call 1-888-555-0142 immediately to reactivate."),
S("Hey Grandpa, it's me. I got in a car accident and need $800 for the repair, please send it by Zelle and don't tell Dad."),
S("Netflix: Your payment was declined. Update your billing information within 24 hours or your account will be cancelled: netflix-billing.click/update"),
S("FedEx: We couldn't deliver your package. Confirm your address and pay a $2.40 fee: fedex-redelivery.info/pay"),
S("Congratulations! You've been selected to receive a $1000 Walmart gift card. Claim your reward here: bit.ly/walmrt1000"),
S("This is Officer Brown from the sheriff's office. There is a warrant for your arrest. Pay the fine with gift cards to avoid jail."),
S("Microsoft Support: Your PC is infected with a virus. Call now so our technician can connect with remote access."),
S("Make passive income with our crypto trading program. Guaranteed returns of 40% weekly. Limited spots!"),
S("Dear customer, your Apple ID has been locked. Verify your identity at appleid-support.xyz to unlock."),
S("Hi, this is your CEO. I need you to buy 10 Apple gift cards for clients. Scratch off the codes and send me photos. Keep this confidential."),
S("E-ZPass: You have an unpaid toll balance of $12.80. Pay now to avoid a late fee: ezpass-tolls-pay.top"),
S("Your Amazon account has been compromised. Call us at 1-800-555-0199 so we can secure it."),
S("Hello, I am a widow with an inheritance of $4 million and need your help to move it. You will receive 30%."),
S("I've been following your profile and I think we'd be great together. I trade crypto and made a fortune. Let me show you how."),
S("IRS: You owe $3,200 in back taxes. Failure to pay today will result in legal action. Call 888-555-0111."),
S("Your mailbox storage is full. Click here to confirm your password to avoid losing emails."),
S("USPS: Your package is waiting. Update delivery preferences: usps-parcel-hold.com/confirm"),
S("Medicare: Your new card is ready. Reply with your Medicare number and bank details to receive it."),
S("Final warning: Your car warranty is about to expire. Call now to renew."),
S("Hi Mom, I lost my phone, this is my new number. Can you send me money for a bill? It's urgent."),
S("Security alert: Someone tried to sign in to your Google account. Verify it was you: g00gle-security.com/check"),
S("You have a refund of $420 waiting. Provide your account number to receive the payment."),
S("Tech Support: We detected malware. Allow TeamViewer access to fix it."),
R("Chase: A $52.10 purchase at Kroger was made on your card ending 1234. Reply STOP to opt out."),
R("Your Amazon order has shipped. Track it in the Amazon app. Arriving Thursday."),
R("Georgia Power: Your bill of $118.42 is ready. View it at georgiapower.com."),
R("Your verification code is 552901. It expires in 10 minutes. Never share this code."),
R("Hi, it's Dana. Running 10 minutes late, start without me."),
R("Reminder: Council meeting Thursday 7 PM at City Hall. Agenda attached."),
R("Your prescription is ready for pickup at CVS. Reply 1 to refill another."),
R("Mom, can you call me when you get a chance? Nothing urgent."),
R("Thanks for your payment of $64.00. Your receipt is attached."),
R("Your Delta flight DL 1234 to Atlanta departs at 6:15 AM. Check in at delta.com."),
R("Your appointment with Dr. Lee is tomorrow at 2 PM. Reply C to confirm or R to reschedule."),
R("Don't forget: parent-teacher conferences are this week. Sign up on the school website."),
R("PayPal: You received $25.00 from Sam. Log in at paypal.com to see details."),
R("Happy anniversary! Dinner at 7 tonight, I booked your favorite place."),
R("Your Spotify subscription renews on Nov 3 for $11.99. Manage it in your account settings."),
R("Hi team, the quarterly report is attached. Please send your comments by Friday."),
R("Bank of America: Your statement is ready. Sign in at bankofamerica.com to view it."),
R("Your Uber is arriving in 2 minutes. Look for a white Toyota Camry."),
R("Library: Your hold is ready for pickup until Saturday."),
R("Walgreens: Your photos are ready for pickup."),
R("Hey, can you send me the address for Saturday? I'll bring snacks."),
R("Your Zoom meeting with Priya starts in 15 minutes: zoom.us/j/123456789"),
R("Costco: Your order is ready for pickup at the Duluth warehouse."),
R("Weather alert: Severe thunderstorm warning for your area until 8 PM. Stay indoors.")
];

var PRACTICE=[
{text:"Hi, this is Sam from Peach State Bank. We noticed a $900 charge. Reply with your full card number so we can cancel it.",scam:true,why:"Banks never ask you to text your full card number. The fear of a charge is the hook."},
{text:"Your dentist reminder: appointment Tuesday at 9:30 AM. Reply C to confirm.",scam:false,why:"A routine reminder with no link, no pressure, and no request for money or private details."},
{text:"Grandma, I’m in trouble and need $500 right now. Please don’t call Mom or Dad. Send it with gift cards.",scam:true,why:"An emergency, secrecy, and gift cards are the classic grandparent scam."},
{text:"Your package from Amazon was delivered to your front door at 2:14 PM.",scam:false,why:"A simple delivery notice. It asks nothing of you and has no link."},
{text:"FINAL NOTICE: You have an unpaid toll. Pay today at tollpay-georgia.top or face a penalty.",scam:true,why:"Urgent threat, an odd .top web address, and a payment link you never asked for."},
{text:"Congratulations! You won a $500 gift card. Pay a $4.95 shipping fee to claim it.",scam:true,why:"You can’t win a contest you didn’t enter, and real prizes don’t charge a fee."},
{text:"Your pharmacy order is ready. Pick it up any time before Friday.",scam:false,why:"Specific, calm, and it asks you to do something ordinary."},
{text:"Social Security Administration: Your number has been suspended. Call 888-555-0123 now to avoid arrest.",scam:true,why:"Government agencies don’t threaten arrest by text or ask you to call a number in a message."},
{text:"Hey, running late. Can you grab me a coffee? I’ll pay you back tonight.",scam:false,why:"Everyday message from someone you know. No pressure, no link, no strange payment."},
{text:"Microsoft Security: Your computer has a virus! Call now and allow remote access to fix it.",scam:true,why:"Real companies don’t cold-call or text about viruses, and never need remote access to your computer."}
];
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
var api={CORPUS:CORPUS,EXAMPLES:EXAMPLES,SCAMS:SCAMS,TESTSET:TESTSET,PRACTICE:PRACTICE};
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.AppData=api;
})(this);

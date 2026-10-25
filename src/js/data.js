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

CORPUS.scam.push("You have been hired work from home and earn a weekly salary no experience needed send your bank details","I sent a code to your phone by mistake please read it to me","Deposit the cashier's check and send back the extra money by Zelle","Your electric service will be disconnected today pay now with a prepaid card","Student loan forgiveness approved pay the processing fee to receive relief","Charge on your account call this number immediately to dispute and get a refund","Send the deposit before you see the apartment the landlord is overseas","Flood relief donate today with gift cards or crypto every dollar helps");
CORPUS.ham.push("Your payment was received thank you","The plumber is coming Thursday between 1 and 3","Volunteers are needed for the food drive on Saturday reply if you can help","Your lease renewal paperwork is ready stop by the office","Scan the code at your table to see the menu","Thanks for applying we received your application and will be in touch","Your electric bill is ready you can pay online or by mail","Reminder the library book sale starts Friday at 9");
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
R("Weather alert: Severe thunderstorm warning for your area until 8 PM. Stay indoors."),
S("Congratulations, you've been hired! Work from home and earn $900 a week. No experience needed. Send your bank details to get started."),
S("I mistakenly sent you a code, please read me the digits so I can get my account back."),
S("We sent you a cashier's check for $2,400. Deposit the check and send back the difference by Zelle."),
S("Your electricity will be disconnected in 30 minutes unless you pay your balance now with a prepaid card."),
S("You qualify for student loan forgiveness. Pay a $99 processing fee today to lock in your relief."),
S("Landlord is out of the country, so send the security deposit by Zelle to hold the apartment before you see it."),
S("You have been charged $499.99 for Norton Antivirus. If you did not authorize this, call 1-800-555-0177 to dispute."),
S("Urgent donation appeal: help the victims of the flood. Send gift cards today, 100% goes to the families."),
S("I'm a soldier stationed overseas and I don't have anyone to talk to. I'd love to get to know you. I need a little help with leave fees."),
S("Scan this QR code to pay your parking fine or your vehicle will be towed."),
R("Your Venmo payment of $18.00 to Alex was completed."),
R("Reminder: your lease renewal paperwork is ready. Stop by the office Tuesday between 9 and 5."),
R("Your electric bill of $96.12 is due on the 28th. Pay online or by mail. Thank you for being a customer."),
R("Scan the QR code at your table to see today's menu."),
R("Thanks for applying. We received your application and will be in touch within 5 business days."),
R("Your Netflix payment of $15.49 was processed. View your receipt in your account settings."),
R("Volunteers needed for Saturday's food drive at the community center. Reply if you can help."),
R("Your car insurance payment of $142.00 was received. Thank you."),
R("Hi, it's your landlord. The plumber will visit Thursday between 1 and 3. Let me know if that works."),
R("Your tax refund status is available on the IRS website. You can check it anytime at irs.gov.")
];

var PRACTICE=[
{kind:"Bank alert",text:"Hi, this is Sam from Peach State Bank. We noticed a $900 charge. Reply with your full card number so we can cancel it.",scam:true,why:"Banks already have your card number. A real fraud team never asks you to text it back, because anyone who read that text could then use your card. The scare of an unexpected $900 charge is meant to make you act before you think.",signs:["Asks for your full card number", "Creates fear with a large, unexpected charge", "The contact came to you instead of you calling the bank"],todo:"Don’t reply. Call the number on the back of your card and ask if there is a problem."},
{kind:"Appointment",text:"Your dentist reminder: appointment Tuesday at 9:30 AM. Reply C to confirm.",scam:false,why:"This message asks for nothing risky. It gives a specific time, you expect it because you booked the visit, and replying with one letter shares no private information.",signs:["Matches an appointment you actually made", "No link and no request for money or personal details", "Calm tone with no deadline or threat"],todo:"If you aren’t sure, call the office using the number on your appointment card."},
{kind:"Family emergency",text:"Grandma, I’m in trouble and need $500 right now. Please don’t call Mom or Dad. Send it with gift cards.",scam:true,why:"This is the classic grandparent scam. The scammer invents an emergency so you will act out of love, asks for secrecy so no one can warn you, and demands gift cards because the money can’t be traced or taken back. Some scammers now copy a grandchild’s voice, so a familiar voice is not proof.",signs:["An emergency that needs money immediately", "A request to keep it secret from family", "Payment by gift card"],todo:"Hang up and call your grandchild, or another relative, on a number you already have. A family code word helps."},
{kind:"Delivery",text:"Your package from Amazon was delivered to your front door at 2:14 PM.",scam:false,why:"This message only informs you. Fake delivery texts try to make you click a link or pay a fee, and this one has neither. It is also specific about what happened and when.",signs:["Tells you something happened instead of asking you to act", "No link and no fee", "Specific details such as the time"],todo:"If you didn’t order anything, check your order history in the official app or by typing the website yourself."},
{kind:"Toll notice",text:"FINAL NOTICE: You have an unpaid toll. Pay today at tollpay-georgia.top or face a penalty.",scam:true,why:"Toll scams text thousands of people at once, hoping some drive on toll roads. The web address ends in .top and isn’t a government site, and the threat of a penalty is there to rush you. Real toll agencies send notices by mail and use their official websites.",signs:["Urgent “final notice” and threat of a penalty", "An unusual web address ending (.top)", "A payment link you never asked for"],todo:"Don’t tap the link. If you think you owe a toll, go to the toll agency’s official website by typing its address yourself."},
{kind:"Prize",text:"Congratulations! You won a $500 gift card. Pay a $4.95 shipping fee to claim it.",scam:true,why:"You can’t win a contest you never entered. The small fee is the trick: it collects your card number, and sometimes more fees follow. A real prize never makes you pay to receive it.",signs:["A prize you didn’t enter for", "A fee to claim it", "Excited, rushed tone"],todo:"Ignore and delete it. Never enter card details to claim a prize."},
{kind:"Pharmacy",text:"Your pharmacy order is ready. Pick it up any time before Friday.",scam:false,why:"The message is specific, calm, and asks you to do something ordinary. It has no link and no request for private information, and the deadline is a normal pickup window, not a threat.",signs:["Ordinary request with no link", "Normal deadline, not a threat", "Matches something you actually ordered"],todo:"If you didn’t order anything, call the pharmacy using the number on your last receipt."},
{kind:"Government",text:"Social Security Administration: Your number has been suspended. Call 888-555-0123 now to avoid arrest.",scam:true,why:"Social Security numbers don’t get “suspended,” and government agencies don’t threaten arrest by text. The goal is to make you call a number where a scammer will ask for your Social Security number or payment.",signs:["Threatens arrest", "Asks you to call a number inside the message", "Claims something impossible, like a suspended number"],todo:"Look up the agency’s official number yourself and call it, or ignore the message."},
{kind:"Friend",text:"Hey, running late. Can you grab me a coffee? I’ll pay you back tonight.",scam:false,why:"This is the kind of casual message friends send. It has no pressure, no link, and no strange payment method, and the request is small and normal.",signs:["Casual, ordinary tone", "No link and no private information requested", "A small favor, not an emergency"],todo:"If it came from an unknown number and you’re unsure, reply with a question only the real person could answer."},
{kind:"Tech support",text:"Microsoft Security: Your computer has a virus! Call now and allow remote access to fix it.",scam:true,why:"Web pages and texts can’t detect a virus on your computer. The goal is to get you to call a fake support line, where the scammer will ask to control your computer, steal your passwords, and charge you for fake repairs.",signs:["Claims your computer has a virus", "Tells you to call a number now", "Asks for remote access"],todo:"Don’t call. Never let a stranger control your computer. If worried, run your device’s own security scan."},
{kind:"Login code",text:"Your verification code is 482913. It expires in 10 minutes. Never share this code with anyone.",scam:false,why:"This is a normal login code. It was sent because someone, probably you, tried to sign in. It asks you to do nothing except use the code yourself, and it warns you not to share it.",signs:["Gives you a code instead of asking for one", "Warns you never to share it", "No link and no request"],todo:"If you didn’t try to sign in, change that account’s password from the official website."},
{kind:"Code request",text:"Hey! I accidentally put my number in the wrong place and a code was sent to your phone. Can you read it to me?",scam:true,why:"That code is a key to YOUR account. The scammer is trying to sign in as you, and the code proves you’re the owner. Once you pass it on, they take over the account and message your contacts. The small, believable mistake is the disguise.",signs:["Asks you to repeat or forward a code", "A harmless-sounding excuse", "Codes are meant for you alone"],todo:"Never share a verification code with anyone. Delete the message and, if the code was for a real account, change the password."},
{kind:"Selling online",text:"Hi, I’m interested in your couch. I’ll send a cashier’s check for $1,200, which is $300 over. Please send the extra $300 back by Zelle once you get it.",scam:true,why:"The check will look real for days, then bounce, but the Zelle money you sent is gone. Banks make funds available before they confirm a check is genuine, which is what this scam depends on. A buyer who pays too much and asks for a refund is a warning sign.",signs:["A payment for more than the price", "Asks you to send back the difference", "Payment through a hard-to-reverse method"],todo:"Only accept the exact price, through a method you trust. Don’t send anything back before the check is fully cleared."},
{kind:"Boss request",text:"Hi, it’s your manager. I’m in a meeting and need 5 Apple gift cards for a client today. Send me the codes and keep this between us.",scam:true,why:"Scammers copy a boss’s name from your company website and message employees. The urgency, the secrecy, and the gift card codes are all signs. A real manager would not need you to keep a business purchase secret.",signs:["A senior person who can’t talk", "Gift cards and codes", "Asks you to keep it private"],todo:"Contact your manager on a phone number or email you already have, before doing anything."},
{kind:"Job offer",text:"You’ve been hired! Work from home and earn $950 a week. No experience needed. Reply with your bank details to set up pay.",scam:true,why:"You can’t be hired for a job you never applied for. Scammers collect bank details or have you cash a check and send money back. Real employers never ask for bank details before a verified offer.",signs:["A job you didn’t apply for", "High pay for no experience", "Asks for bank details right away"],todo:"Ignore it. Look up real job openings yourself on a trusted site."},
{kind:"Utility shut-off",text:"Your electric service will be disconnected today at 5 PM unless you pay $286.40 now. Pay with a prepaid card at the number below.",scam:true,why:"Real utilities send disconnect notices by mail with time to respond, and they don’t demand prepaid cards. The deadline is meant to scare you before you can check your bill.",signs:["Disconnection today", "Payment by prepaid card", "A number inside the message"],todo:"Look up the company’s number on your bill and call that."},
{kind:"Utility bill",text:"Georgia Power: Your bill is ready. View or pay it at georgiapower.com or in the app. Autopay customers do not need to do anything.",scam:false,why:"This message points you to the company’s real website and tells you what to do or not do. There is no threat and no deadline, and it respects people who use autopay.",signs:["Real website named, no odd link", "No threat or rush", "Clear instructions for different situations"],todo:"Even so, type the website yourself instead of tapping a link."},
{kind:"School",text:"Wildcat Elementary: School will start two hours late tomorrow because of fog. Buses will run on a delayed schedule.",scam:false,why:"It shares routine information, asks you for nothing, and has no link. A message that only tells you something useful is very rarely a scam.",signs:["Only informs", "No link and no request", "Specific and local"],todo:"If you want to confirm it, check the school’s official website or call the office."},
{kind:"Donation",text:"URGENT: Flood victims need your help right now. Donate by gift card or crypto today and 100% reaches families. Reply for the wallet address.",scam:true,why:"After disasters, scammers pose as charities. They ask for gift cards or crypto because they can’t be traced. Real charities accept normal payment options, and you can always look them up first.",signs:["Urgency and emotional pressure", "Asks for gift cards or crypto", "Unknown group, no way to verify"],todo:"Give only to charities you looked up yourself, using their official website."},
{kind:"Unknown charge",text:"You have been charged $499.99 for Norton Antivirus. If you did not authorize this, call 1-800-555-0177 to dispute.",scam:true,why:"No charge happened. The goal is to scare you into calling a number, where the scammer will ask for remote access or your bank details “to cancel the charge.” The number in a message like this is the trap.",signs:["A surprising charge for a product you may not own", "A phone number to call", "Urges you to react fast"],todo:"Check your real bank statement. If there’s no charge, there is nothing to dispute. Don’t call the number."},
{kind:"Bank alert",text:"Chase Fraud Alert: Did you attempt a $214.50 purchase at Target? Reply YES or NO. We will never ask for your PIN or password.",scam:false,why:"This follows the pattern of a real fraud alert: a specific purchase, a yes-or-no reply, and a reminder that the bank never asks for your PIN or password. It does not include a link or ask for private information. Still, a bank text can be copied, so never reply with private details.",signs:["Simple yes or no question", "Reminds you the bank won’t ask for your PIN or password", "No link and no request for private information"],todo:"If unsure, open your bank’s app or call the number on your card to check recent activity."},
{kind:"Online friend",text:"I’ve made a fortune with crypto and want to show you how. Guaranteed returns, I’ll guide you. You can start with just $200.",scam:true,why:"A new online friend who mentions guaranteed profits is the heart of a “pig butchering” scam. They build trust for weeks, show fake earnings on a fake app, and then pressure you to invest more until you can’t withdraw. No honest investment can guarantee returns.",signs:["Guaranteed returns", "A new friend steering you toward crypto", "Start small, then bigger"],todo:"Never invest on advice from someone you only know online. Talk to a family member or a trusted bank advisor first."},
{kind:"Apartment rental",text:"Hi! The landlord is out of the country, so send the $1,200 deposit by Zelle to hold the apartment before you can see it.",scam:true,why:"The apartment may not even exist, or may belong to someone else. A landlord who can’t show you the place and wants a deposit in a hard-to-reverse way is a major red flag.",signs:["Can’t show you the place", "Deposit before a visit", "Payment by Zelle"],todo:"Never pay before you have seen the property and checked who owns it."},
{kind:"Medical portal",text:"Northside Clinic: Your lab results are ready. Log in to the patient portal to view them.",scam:false,why:"It is short, names a service you already use, and tells you to use the portal rather than giving you a link or asking for information. Real clinics send reminders like this one.",signs:["No link and no private information requested", "Names a portal you already use", "Doesn’t include test details in the text"],todo:"Open the portal the way you normally do, not through anything in a message."}
];
var EXAMPLES=[
{kind:"scam",label:"Bank text",text:"Chase Alert: Your account has been locked due to unauthorized activity. Verify your identity within 24 hours: http://chase-secure-login.top/verify"},
{kind:"scam",label:"Boss gift cards",text:"Hi, it's Dana. I'm in a meeting and can't talk. I need 5 Google Play gift cards for a client today. Send me the codes and keep this between us."},
{kind:"scam",label:"Package fee",text:"USPS: Your package is on hold. Pay a $1.99 redelivery fee at bit.ly/3xYzPkg to avoid return."},
{kind:"scam",label:"Grandchild",text:"Grandma it's me, I'm in jail and need $800 for bail. Please don't tell Mom. Send it with gift cards."},
{kind:"scam",label:"Government",text:"Social Security Administration: Your number has been suspended due to suspicious activity. Call 888-555-0123 now to avoid arrest."},
{kind:"scam",label:"Tech support",text:"Microsoft Support: Your computer has a virus! Call 1-800-555-0155 now and allow remote access to fix it."},
{kind:"scam",label:"Code request",text:"Hey, sorry, I accidentally sent a code to your phone. Can you read it to me? I'm locked out of my account."},
{kind:"scam",label:"Fake check",text:"Hi, I'll buy your couch. I'm sending a cashier's check for $1,200. That's $300 extra, so please send the difference back by Zelle."},
{kind:"scam",label:"Job offer",text:"You've been hired! Work from home and earn $950 a week. No experience needed. Reply with your bank details to set up pay."},
{kind:"scam",label:"Utility shutoff",text:"Your electricity will be disconnected today at 5 PM. Pay $286.40 now with a prepaid card to avoid shutoff."},
{kind:"scam",label:"Fake email",text:"From: PayPal Support <help@paypa1-security.com>\nSubject: Account limited\n\nDear customer, your account has been limited. Verify your identity within 24 hours: http://paypa1-security.com/login"},
{kind:"scam",label:"Unknown charge",text:"You have been charged $499.99 for Norton Antivirus. If you did not authorize this, call 1-800-555-0177 to dispute."},
{kind:"real",label:"Appointment",text:"Reminder: your dentist appointment is tomorrow at 3:00 PM. Reply C to confirm."},
{kind:"real",label:"Login code",text:"Your verification code is 482913. It expires in 10 minutes. Never share this code with anyone."},
{kind:"real",label:"Bank alert",text:"Chase Fraud Alert: Did you attempt a $214.50 purchase at Target? Reply YES or NO. We will never ask for your PIN or password."}
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
SCAMS.push(
{name:"Fake checks and overpayment",looks:"“I’m sending a check for too much. Please send back the difference.”",tell:"A check for more than the price, followed by a request to return the extra.",todo:"Accept the exact price only. A check can bounce days after it looks real."},
{name:"Fake job offers",looks:"“You’re hired! Earn $900 a week from home. Send your bank details.”",tell:"A job you never applied for, high pay, and requests for bank details or equipment money.",todo:"Look up real openings yourself. Never give bank details before a verified offer."},
{name:"Utility shut-off threats",looks:"“Your power will be cut off in 30 minutes unless you pay now.”",tell:"A very short deadline and payment by prepaid card or gift card.",todo:"Call the number on your bill. Real utilities send notices by mail."},
{name:"The code request",looks:"“I sent a code to your phone by mistake. Can you read it to me?”",tell:"A friendly excuse to get you to share a one-time code.",todo:"Never share a code. It is the key to your account."},
{name:"Rental and deposit scams",looks:"“The landlord is overseas. Send the deposit to hold it.”",tell:"A deposit before you’ve seen the place, often by Zelle or wire.",todo:"See the property in person and confirm who owns it first."},
{name:"Disaster and charity scams",looks:"“Help flood victims today. Donate by gift card.”",tell:"Emotional pressure and payment that can’t be traced.",todo:"Give through charities you looked up yourself."}
);
var LINKSET=[
{u:"https://www.paypal.com/signin",fake:false},{u:"https://secure.chase.com/login",fake:false},{u:"https://www.amazon.com/orders",fake:false},{u:"https://www.irs.gov/refunds",fake:false},
{u:"https://www.usps.com/track",fake:false},{u:"https://accounts.google.com/signin",fake:false},{u:"https://www.apple.com/support",fake:false},{u:"https://www.fedex.com/tracking",fake:false},
{u:"https://www.microsoft.com/account",fake:false},{u:"https://www.netflix.com/browse",fake:false},{u:"https://www.medicare.gov/",fake:false},{u:"https://georgiapower.com/bill",fake:false},
{u:"http://paypa1.com/login",fake:true},{u:"https://chase-secure-login.top/verify",fake:true},{u:"https://amazon-orders-help.xyz",fake:true},{u:"http://192.168.4.9/login",fake:true},
{u:"https://bit.ly/3xYzPkg",fake:true},{u:"https://irs.gov.refund-center.net",fake:true},{u:"https://usps-parcel-hold.com/confirm",fake:true},{u:"https://g00gle-security.com/check",fake:true},
{u:"http://apple.com@evil.example/id",fake:true},{u:"https://xn--pple-43d.com",fake:true},{u:"https://www.netflix-billing.click/update",fake:true},{u:"https://microsoft.support-help-now.top",fake:true}
];
var GLOSSARY=[
["Phishing","A message pretending to be from a company or person you trust, meant to trick you into sharing private information or clicking a harmful link."],
["Smishing","Phishing sent by text message."],
["Vishing","Phishing done by phone call, where a caller pretends to be a bank, agency or company."],
["Spoofing","Faking who a message or call is from. Caller ID and sender names can be faked, so a familiar name or number doesn’t prove who is really contacting you."],
["Lookalike web address","A web address that imitates a real one by swapping or adding letters, like paypa1.com. Always check the part right before .com or .gov."],
["Two-step login (MFA)","A second proof of who you are, such as a code sent to your phone, on top of your password. Even if a scammer learns your password, they can’t easily get in."],
["One-time code","A short number that proves you own an account. It is for you alone. Never read it or forward it to anyone."],
["Remote access","Software that lets someone else see and control your computer. Scammers talk people into installing it. Only allow it for someone you called yourself and trust."],
["Ransomware","Harmful software that locks your files and demands payment to unlock them. It often arrives through attachments or links."],
["Malware","Any harmful software that can steal information or damage your device."],
["QR code scam","A QR code hides a web address you can’t read before you scan it. Fake codes stuck over real ones, or sent in messages, can lead to fake sites."],
["Wire transfer","Sending money directly from one bank to another. It is hard to reverse, which is why scammers like it."],
["Cryptocurrency","Digital money such as Bitcoin. Payments usually can’t be reversed, so scammers ask for it."],
["Credit freeze","A free lock on your credit report that makes it hard for anyone to open new accounts in your name. You can lift it when you need credit."],
["Fraud alert","A free note on your credit report that tells lenders to check your identity before opening new credit."],
["Voice cloning","Using software to copy someone’s voice from a short recording. A scammer might call as your grandchild. A family code word helps."]
];
var HELP=[
{title:"I clicked a link but didn’t enter anything",steps:["Close the page. If it is still open, don’t type anything into it.","Install any pending updates and run your device’s built-in security scan.","If a file downloaded, don’t open it. Delete it.","Watch your accounts over the next few weeks for anything unfamiliar."]},
{title:"I typed in my password",steps:["Change the password right away on the real website, typed in yourself.","Change it anywhere else you used the same password.","Turn on two-step login for the account.","Check recent activity and sign out of other devices.","Watch for password-reset emails you didn’t ask for."]},
{title:"I shared card or bank details",steps:["Call your bank using the number on your card or statement, right away.","Ask them to lock or replace the card and review recent charges.","Dispute any charges you don’t recognize.","Set up account alerts for new transactions.","Report it at reportfraud.ftc.gov."]},
{title:"I sent gift cards",steps:["Call the gift card company using the number on the card, say it was a scam, and ask if the money can be frozen.","Keep the cards and receipts. Tell the store where you bought them.","Report it at reportfraud.ftc.gov.","Recovery is not guaranteed, but acting fast gives the best chance."]},
{title:"I sent money by wire, Zelle or crypto",steps:["Call your bank or the payment app immediately and ask to stop or recall the payment. Speed matters.","Report it at reportfraud.ftc.gov and ic3.gov. Keep screenshots and records.","Be wary of anyone who offers to “recover” your money for a fee. That is often a second scam.","Tell someone you trust."]},
{title:"I let someone control my computer",steps:["Disconnect from the internet by turning off Wi-Fi or unplugging.","Uninstall the remote access program and run a security scan, or take the computer to a repair shop you trust.","From a different, clean device, change your important passwords and call your bank.","Expect a follow-up “refund” call. It is part of the scam."]},
{title:"I shared my Social Security number",steps:["Place a free credit freeze by contacting each of the three credit bureaus: Equifax, Experian and TransUnion.","Review your credit reports at annualcreditreport.com.","Report it and get a personal recovery plan at identitytheft.gov.","Watch for bills, notices or accounts that aren’t yours."]}
];
var api={CORPUS:CORPUS,EXAMPLES:EXAMPLES,SCAMS:SCAMS,TESTSET:TESTSET,PRACTICE:PRACTICE,LINKSET:LINKSET,GLOSSARY:GLOSSARY,HELP:HELP};
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.AppData=api;
})(this);

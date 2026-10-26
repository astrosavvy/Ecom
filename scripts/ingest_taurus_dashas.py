import json
import os

DASHAS_DATA = {
    "Ketu": {
        "combinationId": "TAU-KET-HAMPER-01",
        "setTitle": "The Beauty of Enough Set",
        "collection": "THE BEAUTY OF ENOUGH",
        "tagline": "For a life that feels as beautiful as it looks.",
        "productsSummary": "Golden Seven Running Horses on Rose Quartz with Selenite Border + Pink Scented Candle",
        "story": "There are people who make life feel a little more beautiful simply by being part of it. Through their warmth, the memories they create and the little moments they turn into something special, they remind us that happiness often lives in the simplest things.",
        "whatYouMightBeGoingThrough": "There may be moments when the things you once worked so hard to achieve no longer feel like the only measure of happiness. You may be reconsidering what deserves your energy, finding comfort in simpler experiences or becoming more selective about the people, commitments and ambitions you make room for.",
        "whyChosen": "Golden Seven Running Horses on Rose Quartz celebrate achievement and possibility with affection, while selenite adds clarity. The pink scented candle introduces warmth, tenderness and an intentional quiet moment.",
        "intentionShift": "Appreciation • Inner Peace • Contentment",
        "challenge": "CONSTANT_PURSUIT • OVEREXTENSION • NEGLECTING_SIMPLICITY",
        "desiredShift": "CONTENTMENT • APPRECIATION • INNER_CALM • BALANCE",
        "keepsake": {
            "name": "Golden Seven Running Horses on Rose Quartz with Selenite Border",
            "description": "Seven running horses engraved in gold upon rose quartz, framed by an embellished selenite border, balancing momentum with tranquility.",
            "role": "KEEPSAKE"
        },
        "ritual": {
            "name": "Pink Scented Candle",
            "description": "A delicate pink scented candle designed to introduce warmth and an intentional moment of quiet reflection.",
            "role": "RITUAL"
        },
        "vastuPlacement": {
            "direction": "Northeast",
            "room": "Console, shelf or personal sanctuary desk",
            "instructions": "Display the Seven Running Horses artwork on a stable console, shelf or desk where its golden engraving and natural crystal textures can be appreciated. Light the pink scented candle during an evening of relaxation or quiet reflection on a heat-resistant surface away from crystals and flammables.",
            "contemplationPrompt": "Reflect on one thing you feel grateful for and one thing you no longer need to place unnecessary pressure on yourself to achieve."
        },
        "experiences": {
            "gifting_someone_else": {
                "headline": "For Someone Who Makes the Ordinary Feel Special",
                "subtitle": "Because the most beautiful gifts celebrate not only where someone is going, but everything that makes their journey worth remembering.",
                "chapterTitle": "A Chapter Worth Celebrating",
                "chapterText": "There are people who make life feel a little more beautiful simply by being part of it. Through their warmth, the memories they create and the little moments they turn into something special, they remind us that happiness often lives in the simplest things. This gift is a way of celebrating their presence while wishing them a future filled with beautiful experiences, meaningful achievements and moments they can truly enjoy. Because sometimes, the loveliest thing you can give someone is a reminder to enjoy the life they're creating.",
                "whyChosen": "Golden Seven Running Horses on Rose Quartz traditionally represent movement, perseverance and progress. Their golden engraving celebrates achievement and possibility, while rose quartz introduces associations with affection, compassion and harmony. The embellished selenite border adds clarity and serenity. The pink scented candle introduces warmth, tenderness and an opportunity to enjoy a quiet, intentional moment.",
                "luxuryDescription": "An elegant decorative pairing that brings together crystal craftsmanship and contemporary ritual gifting. The statement keepsake features seven running horses engraved in gold upon rose quartz, framed by an embellished selenite border. The accompanying pink scented candle complements the artwork through its gentle colour and fragrant presence.",
                "whatThisGiftMeans": "A wish for a life filled with meaningful progress and moments worth slowing down for. The horses celebrate movement and achievement. Rose quartz represents affection, while the candle encourages moments of appreciation. Together, they express a simple but beautiful sentiment: that life's greatest joys deserve to be experienced, not merely pursued.",
                "intentionHeading": "The Giver's Intention",
                "intentionStatement": "I chose this for you because I wanted to celebrate the happiness you bring into life. I hope your journey is filled with beautiful opportunities, meaningful achievements and enough little moments to pause, smile and appreciate everything wonderful around you.",
                "howToUse": "Display the Seven Running Horses artwork on a stable console, shelf or desk where its golden engraving and natural crystal textures can be appreciated. Light the pink scented candle during an evening of relaxation, while reading or whenever you wish to create a welcoming atmosphere."
            },
            "buying_for_myself": {
                "headline": "For the Life You're Learning to Appreciate",
                "subtitle": "A reminder that you can keep growing without constantly needing more.",
                "chapterTitle": "The Chapter You're In",
                "chapterText": "There may be moments when the things you once worked so hard to achieve no longer feel like the only measure of happiness. You may be reconsidering what deserves your energy, finding comfort in simpler experiences or becoming more selective about the people, commitments and ambitions you make room for. This doesn't mean you've lost your desire to grow. It may simply mean that you're beginning to understand the difference between what looks fulfilling and what genuinely feels fulfilling. Because moving forward doesn't always require adding something new. Sometimes, it means making more room for what already matters.",
                "whyChosen": "The seven running horses symbolise progress and momentum, becoming a reminder of the achievements that have shaped your journey. Rose quartz introduces compassion and harmony, while selenite symbolises clarity and serenity. The pink scented candle offers a simple sensory ritual, reminding you that making time for yourself doesn't need to be earned through productivity.",
                "luxuryDescription": "A sophisticated pairing of ornamental crystal craftsmanship and a personal fragrance ritual. The statement artwork features seven running horses engraved in golden detailing upon rose quartz with an embellished selenite border. The accompanying pink scented candle adds a complementary sensory element, making the collection an elegant addition to a personal sanctuary.",
                "whatThisGiftMeans": "The freedom to keep moving forward without forgetting to enjoy where you are. The horses represent your continuing journey. Rose quartz symbolises compassion and meaningful connections. The candle introduces an intentional pause. Together, they celebrate a more personal understanding of fulfilment — one where ambition and contentment can exist side by side.",
                "intentionHeading": "Your Personal Intention",
                "intentionStatement": "I give myself permission to appreciate the life I'm creating. I can pursue meaningful goals without measuring my worth through constant achievement. I welcome simplicity, genuine happiness and moments of stillness into my everyday life.",
                "howToUse": "Display the Seven Running Horses artwork in a personal space where you can appreciate its craftsmanship and symbolic meaning. Light the pink scented candle during an evening routine, while journaling, reading or enjoying a quiet moment.",
                "contemplationPrompt": "Reflect on one thing you feel grateful for and one thing you no longer need to place unnecessary pressure on yourself to achieve."
            }
        }
    },
    "Venus": {
        "combinationId": "TAU-VEN-HAMPER-01",
        "setTitle": "The Art of Adoration Set",
        "collection": "THE ART OF ADORATION",
        "tagline": "For the little things that make someone unforgettable.",
        "productsSummary": "Rose Quartz Crystal-Infused Itr + Multicoloured Crystal-Embellished Jewellery Cufflinks",
        "story": "Some people have a way of making even ordinary moments feel special. It's in their warmth, their individuality, the little details they notice and the memories they leave behind. They remind us that beauty isn't always something we see. Sometimes, it's something we experience through the people who make our lives richer.",
        "whatYouMightBeGoingThrough": "There are chapters when life begins to feel less about proving something and more about experiencing it. You may find yourself wanting to invest in the things that genuinely make you happy — meaningful relationships, personal comfort, beautiful surroundings or simply feeling more confident in your own individuality.",
        "whyChosen": "Rose quartz-infused itr introduces an intimate sensory dimension for affection and harmony, while multicoloured crystal cufflinks celebrate individuality and the joy of self-expression.",
        "intentionShift": "Self-Worth • Elegance • Unapologetic Joy",
        "challenge": "SELF_SACRIFICE • CONDITIONAL_WORTH • NEGLECTING_BEAUTY",
        "desiredShift": "CONFIDENCE • ELEGANCE • AFFECTION • AUTHENTICITY",
        "keepsake": {
            "name": "Multicoloured Crystal-Embellished Jewellery Cufflinks",
            "description": "A jewellery-inspired pair featuring multicoloured crystal embellishments that catch light from different angles, bringing personality and visual richness to tailored dressing.",
            "role": "KEEPSAKE"
        },
        "ritual": {
            "name": "Rose Quartz Crystal Chunks-Infused Itr",
            "description": "A refined personal fragrance infused with genuine rose quartz crystal chunks, creating an intimate sensory ritual.",
            "role": "RITUAL"
        },
        "vastuPlacement": {
            "direction": "Dressing sanctuary / Wardrobe",
            "room": "Personal dressing area or vanity",
            "instructions": "Make the rose quartz-infused itr part of your personal fragrance ritual. Wear the multicoloured crystal cufflinks with French-cuff or compatible double-cuff shirts, pairing them with tailored suits, structured blazers or occasion outfits.",
            "contemplationPrompt": "Notice what brings you genuine happiness and allow yourself to enjoy beauty without guilt."
        },
        "experiences": {
            "gifting_someone_else": {
                "headline": "For Someone Who Makes Life Feel Beautiful",
                "subtitle": "A celebration of their presence, personal charm and the joy they bring into the lives around them.",
                "chapterTitle": "A Chapter Worth Celebrating",
                "chapterText": "Some people have a way of making even ordinary moments feel special. It's in their warmth, their individuality, the little details they notice and the memories they leave behind. They remind us that beauty isn't always something we see. Sometimes, it's something we experience through the people who make our lives richer. A gift for someone like that should feel just as thoughtful — something personal, beautiful and worth remembering. Because the people who add beauty to our lives deserve to feel celebrated in return.",
                "whyChosen": "Rose quartz, with its delicate pink appearance, has traditionally symbolised affection, compassion and harmony. Infused with rose quartz crystal chunks, the itr introduces an intimate sensory dimension. The multicoloured crystal-embellished jewellery cufflinks celebrate individuality through colour and craftsmanship, bringing personality and visual richness to tailored dressing.",
                "luxuryDescription": "A sophisticated gifting duo that pairs the intimacy of personal fragrance with the brilliance of statement jewellery. The rose quartz-infused itr introduces a refined fragrance ritual, while the accompanying cufflinks feature multicoloured crystal embellishments that transform a functional accessory into an expressive jewellery statement.",
                "whatThisGiftMeans": "A celebration of the qualities that make someone truly one of a kind. Rose quartz represents affection and appreciation, while the multicoloured cufflinks celebrate individuality and the beauty of self-expression. Together, they convey the pleasure of knowing someone and appreciating everything that makes them who they are.",
                "intentionHeading": "The Giver's Intention",
                "intentionStatement": "I chose this for you because there are so many little things about you that deserve to be celebrated. I hope this gift reminds you how appreciated you are, how much beauty you bring into life and how wonderful it is to be exactly who you are.",
                "howToUse": "Apply the rose quartz-infused itr as a personal fragrance, following application instructions. Wear the multicoloured crystal-embellished cufflinks with French-cuff or compatible double-cuff shirts, pairing them with tailored suits, blazers and occasion outfits."
            },
            "buying_for_myself": {
                "headline": "For the Beauty You're Learning to Recognise in Yourself",
                "subtitle": "A reminder that you deserve to enjoy life, express yourself and appreciate who you're becoming.",
                "chapterTitle": "The Chapter You're In",
                "chapterText": "There are chapters when life begins to feel less about proving something and more about experiencing it. You may find yourself wanting to invest in the things that genuinely make you happy — meaningful relationships, personal comfort, beautiful surroundings or simply feeling more confident in your own individuality. Perhaps you're becoming more aware of what you value in your connections, what makes you feel appreciated and how you want to express yourself. This chapter invites you to enjoy beauty without guilt, nurture meaningful relationships and recognise that your happiness deserves attention too. Because sometimes, personal growth isn't about changing who you are. It's about appreciating yourself enough to enjoy being that person.",
                "whyChosen": "Rose quartz introduces a sense of tenderness and emotional harmony. The itr offers a personal fragrance ritual that can become part of how you express yourself — chosen simply because it makes you feel good. The multicoloured crystal cufflinks celebrate individuality, encouraging you to embrace the details that reflect your own sense of style.",
                "luxuryDescription": "An elegant pairing of crystal-infused fragrance and expressive statement jewellery. Together, the pieces celebrate the pleasure of dressing well, feeling confident and making everyday experiences more personal.",
                "whatThisGiftMeans": "The freedom to appreciate yourself, embrace beauty and express your individuality without hesitation. Together, they encourage a simple understanding of self-worth: that you don't need a special occasion or someone else's approval to celebrate yourself.",
                "intentionHeading": "Your Personal Intention",
                "intentionStatement": "I allow myself to enjoy the things that bring me happiness. I appreciate my individuality, nurture the relationships that matter and choose to express myself with confidence, affection and authenticity.",
                "howToUse": "Make the rose quartz-infused itr part of your personal fragrance ritual. Wear the multicoloured crystal-embellished cufflinks with compatible double-cuff shirts, styling them with tailored suits or occasion outfits to introduce a distinctive expression of personality."
            }
        }
    },
    "Sun": {
        "combinationId": "TAU-SUN-HAMPER-01",
        "setTitle": "The Dignity & Protection Set",
        "collection": "For Someone Who Leads with Heart",
        "tagline": "Strength of character, generous warmth and quiet dignity.",
        "productsSummary": "Rose Quartz Hamsa Hand + Black Walking Lion Brooch",
        "story": "Some people have a special way of making others feel valued while remaining true to themselves. Their kindness, loyalty and quiet confidence leave a lasting impression. This gift celebrates their strength of character and wishes them a life where their kindness is cherished and their individuality is respected.",
        "whatYouMightBeGoingThrough": "You may be entering a phase where your own voice, decisions and sense of worth are becoming more important. While you value harmony and meaningful relationships, you're also learning that keeping everyone happy shouldn't mean overlooking yourself.",
        "whyChosen": "The Rose Quartz Hamsa Hand represents a compassionate heart protected by wisdom with an engraved evil eye. The Walking Lion Brooch symbolises courage, dignity and leadership with measured strength that doesn't need to demand attention.",
        "intentionShift": "Quiet Authority • Healthy Boundaries • Self-Respect",
        "challenge": "PEOPLE_PLEASING • COMPROMISING_BOUNDARIES • UNNOTICED_EFFORTS",
        "desiredShift": "CONFIDENCE • BOUNDARIES • DIGNITY • LEADERSHIP",
        "keepsake": {
            "name": "Rose Quartz Hamsa Hand with Engraved Evil Eye",
            "description": "A crystal-carved open palm featuring an engraved evil eye, combining traditional symbolism of compassion, protection and discernment.",
            "role": "KEEPSAKE"
        },
        "ritual": {
            "name": "Black Walking Lion Brooch",
            "description": "A sculptural black metal lion embellished with dark stones. Its poised walking silhouette expresses quiet authority and individuality.",
            "role": "RITUAL"
        },
        "vastuPlacement": {
            "direction": "East",
            "room": "Living room or study (East of study/living space; Northeast for reflection)",
            "instructions": "Place the Rose Quartz Hamsa in the East of your study or living space, traditionally associated with the rising Sun, confidence and recognition. The Northeast is an alternative for personal reflection. Wear the Walking Lion Brooch on a blazer, jacket or formal shirt as a personal symbol of courage and self-respect.",
            "contemplationPrompt": "Am I making this decision because it reflects my values, or because I am afraid of disappointing someone?"
        },
        "experiences": {
            "gifting_someone_else": {
                "headline": "For Someone Who Leads with Heart",
                "subtitle": "Some people have a special way of making others feel valued while remaining true to themselves. Their kindness, loyalty and quiet confidence leave a lasting impression.",
                "chapterTitle": "A Chapter Worth Celebrating",
                "chapterText": "Some people have a special way of making others feel valued while remaining true to themselves. Their kindness, loyalty and quiet confidence leave a lasting impression. This gift celebrates their strength of character and wishes them a life where their kindness is cherished and their individuality is respected.",
                "whyChosen": "The Rose Quartz Hamsa Hand represents a compassionate heart protected by wisdom. Its engraved evil eye traditionally symbolises protection from envy, while rose quartz represents affection and harmony. The Walking Lion Brooch symbolises courage, dignity and leadership. Its measured stride represents strength that doesn't need to demand attention. Together, they celebrate the beautiful balance between kindness and self-respect.",
                "luxuryDescription": "A crystal-carved open palm featuring an engraved evil eye paired with a sculptural black metal lion embellished with dark stones, expressing quiet authority and individuality.",
                "whatThisGiftMeans": "May your kindness always be protected, and your strength always be respected. The Hamsa honours your generous heart. The Lion celebrates your courage to remain true to yourself. Together, they are a reminder that you never have to choose between being compassionate and being strong.",
                "intentionHeading": "The Giver's Intention",
                "intentionStatement": "I chose this for you because I admire your kindness and the strength behind it. May you always feel appreciated for who you are, surrounded by people who value your heart and confident enough to follow your own path.",
                "howToUse": "Rose Quartz Hamsa: Place it in the East of your living room or study, traditionally associated with the rising Sun, confidence and recognition. The Northeast is an alternative for a quiet reflection space. Walking Lion Brooch: Wear it on a blazer, jacket or formal shirt as a personal symbol of courage and self-respect."
            },
            "buying_for_myself": {
                "headline": "For the Person You're Learning to Stand Up For — Yourself",
                "subtitle": "A reminder that protecting your peace and recognising your worth are acts of self-respect.",
                "chapterTitle": "The Chapter You're In",
                "chapterText": "You may be entering a phase where your own voice, decisions and sense of worth are becoming more important. While you value harmony and meaningful relationships, you're also learning that keeping everyone happy shouldn't mean overlooking yourself. This chapter encourages you to recognise your strengths, trust your judgement and embrace confidence without losing your kindness.",
                "whyChosen": "The Rose Quartz Hamsa Hand symbolises compassion with boundaries. Its open palm represents kindness, while the engraved eye reminds you to be discerning about what you allow into your life. The Walking Lion Brooch represents quiet confidence and self-respect. Its measured stride reminds you that true authority doesn't require aggression or constant approval.",
                "luxuryDescription": "A carved rose quartz palm featuring an engraved evil eye paired with a poised black metallic lion embellished with dark stones, making a distinctive statement for formal and everyday styling.",
                "whatThisGiftMeans": "You can have a soft heart and still stand firmly in your own worth. The Hamsa represents your ability to care without losing yourself. The Lion represents the courage to trust your own voice. Together, they remind you that kindness and confidence are not opposites.",
                "intentionHeading": "Your Personal Intention",
                "intentionStatement": "I honour my kindness, trust my decisions and recognise my worth. I allow myself to be heard, respected and appreciated without needing to prove who I am.",
                "howToUse": "Place the Hamsa in the eastern area of your study, living room or personal space. When you see it, use it as a prompt to consider: 'Am I making this decision because it reflects my values, or because I am afraid of disappointing someone?' Wear the brooch during important meetings or celebrations.",
                "contemplationPrompt": "I deserve to be heard, respected and valued — without needing to prove my worth at every step."
            }
        }
    },
    "Moon": {
        "combinationId": "TAU-MOO-HAMPER-01",
        "setTitle": "The Belonging & Serenity Set",
        "collection": "For Someone Who Feels Like Home",
        "tagline": "Comfort, genuine warmth and the beauty of shared belonging.",
        "productsSummary": "Rose Quartz Hamsa Hand with Pair of Ducks + Selenite Tower Glass Bottle",
        "story": "Some people have a way of making us feel understood, appreciated and completely ourselves. Their warmth turns ordinary moments into lasting memories, and their presence makes even the simplest experiences meaningful.",
        "whatYouMightBeGoingThrough": "You may be feeling a stronger desire for emotional comfort, familiar connections and a sense of belonging. Perhaps you're becoming more aware of the relationships that make you feel secure, the spaces where you can truly relax and the importance of giving yourself the same care you offer others.",
        "whyChosen": "Rose Quartz Hamsa Hand with Ducks represents affection, companionship and loyalty. The Selenite Crystal Tower Bottle introduces clarity, serenity and an everyday ritual of personal self-care.",
        "intentionShift": "Mutual Care • Emotional Security • Personal Serenity",
        "challenge": "EMOTIONAL_OVEREXTENSION • GIVING_WITHOUT_RECEIVING • RESTLESSNESS",
        "desiredShift": "BELONGING • MUTUAL_LOVE • SERENITY • EMOTIONAL_SECURITY",
        "keepsake": {
            "name": "Rose Quartz Hamsa Hand with a Pair of Ducks",
            "description": "A rose quartz crystal keepsake combining the protective symbolism of an open Hamsa hand with two ducks representing companionship and lasting affection.",
            "role": "KEEPSAKE"
        },
        "ritual": {
            "name": "Selenite Tower Glass Bottle",
            "description": "A transparent glass bottle with a silver metallic base featuring a selenite crystal tower, bringing clarity and serenity to a daily hydration ritual.",
            "role": "RITUAL"
        },
        "vastuPlacement": {
            "direction": "Southwest",
            "room": "Bedroom or living room (Southwest for Hamsa & Ducks; Northeast for Bottle)",
            "instructions": "Place the Rose Quartz Hamsa with Ducks in the Southwest of your bedroom or living room, a direction traditionally associated in Vastu with stability and lasting relationships. Keep both ducks together. Store the Selenite Bottle in the Northeast when not in use. Keep selenite dry and isolated from drinking water.",
            "contemplationPrompt": "Remember that emotional security is built through both meaningful relationships and the care you give yourself."
        },
        "experiences": {
            "gifting_someone_else": {
                "headline": "For Someone Who Feels Like Home",
                "subtitle": "Some people have a way of making us feel understood, appreciated and completely ourselves. Their warmth turns ordinary moments into lasting memories.",
                "chapterTitle": "A Chapter Worth Celebrating",
                "chapterText": "Some people have a way of making us feel understood, appreciated and completely ourselves. Their warmth turns ordinary moments into lasting memories, and their presence makes even the simplest experiences meaningful. This gift celebrates the comfort they bring into your life and wishes them the same love, happiness and sense of belonging they so generously share.",
                "whyChosen": "The Rose Quartz Hamsa Hand represents blessings, affection and the wish to protect meaningful relationships. The Pair of Rose Quartz Ducks symbolises companionship, loyalty and the beauty of having someone beside you through life's chapters. The Selenite Crystal Tower Bottle represents clarity and serenity.",
                "luxuryDescription": "A rose quartz crystal keepsake combining an open Hamsa hand with two ducks paired with a transparent glass bottle featuring a silver metallic base and selenite tower.",
                "whatThisGiftMeans": "May you always feel as loved, understood and appreciated as you make others feel. The Hamsa carries a wish for blessings and care. The ducks celebrate companionship. The selenite represents the importance of finding moments of peace for yourself.",
                "intentionHeading": "The Giver's Intention",
                "intentionStatement": "I chose this for you because your presence brings a special kind of comfort into life. I hope you're always surrounded by love that feels genuine, people who make you feel understood and little moments that remind you how deeply you're appreciated.",
                "howToUse": "Rose Quartz Hamsa with Ducks: Place it in the Southwest area of your bedroom or living room, traditionally associated in Vastu with stability and lasting relationships. Selenite Bottle: Use during your daily hydration routine, keeping selenite isolated from drinking water."
            },
            "buying_for_myself": {
                "headline": "For the Comfort and Peace You Deserve",
                "subtitle": "Because feeling at home in your life begins with feeling at home within yourself.",
                "chapterTitle": "The Chapter You're In",
                "chapterText": "You may be feeling a stronger desire for emotional comfort, familiar connections and a sense of belonging. Perhaps you're becoming more aware of the relationships that make you feel secure, the spaces where you can truly relax and the importance of giving yourself the same care you offer others. This chapter encourages you to nurture meaningful bonds while remembering that your own emotional needs deserve attention too.",
                "whyChosen": "The Rose Quartz Hamsa Hand symbolises compassion, emotional harmony and protecting what matters to your heart. The Pair of Rose Quartz Ducks represents companionship and mutual care. The Selenite Tower Glass Bottle symbolises clarity and intentional self-care.",
                "luxuryDescription": "A rose quartz keepsake featuring an open Hamsa hand and two ducks paired with a crystal tower bottle that elevates daily hydration into an intentional ritual of serenity.",
                "whatThisGiftMeans": "You deserve to feel loved without having to earn it, and supported without having to ask for it every time. Together, they remind you that emotional security is built through both meaningful relationships and the care you give yourself.",
                "intentionHeading": "Your Personal Intention",
                "intentionStatement": "I welcome relationships that feel safe, genuine and mutual. I honour my emotional needs, appreciate the people who bring warmth into my life and allow myself to receive the same love and care I so freely give.",
                "howToUse": "Place the Hamsa with ducks in the Southwest of your bedroom or living space. Use the Selenite Bottle as part of your daily routine, storing it in the Northeast when at rest."
            }
        }
    },
    "Mars": {
        "combinationId": "TAU-MAR-HAMPER-01",
        "setTitle": "The Courage & Transformation Set",
        "collection": "For Someone Who Inspires You to Grow",
        "tagline": "Courage, determination and the excitement of new beginnings.",
        "productsSummary": "Crescent-Shaped Bismuth Crystal Sculpture + White Perfume-Bottle-Shaped Scented Candle",
        "story": "Some people remind us that life is full of possibilities. Through their courage, determination and willingness to embrace new experiences, they inspire us to see beyond the familiar. This gift celebrates their spirit and carries a heartfelt wish for exciting beginnings, meaningful discoveries and moments of happiness along the way.",
        "whatYouMightBeGoingThrough": "You may be feeling ready to make changes, take independent decisions or explore possibilities beyond what has always felt familiar. While a part of you values comfort and stability, another may be asking for movement, growth and new experiences.",
        "whyChosen": "The Bismuth Crescent Moon symbolises transformation and life's changing phases with shifting iridescent colours. The White Scented Candle symbolises clarity, peace and renewal, offering a simple ritual of slowing down.",
        "intentionShift": "Transformation • Purposeful Action • Grounded Courage",
        "challenge": "FEAR_OF_CHANGE • HESITATION • RUSHING_WITHOUT_CLARITY",
        "desiredShift": "COURAGE • CLARITY • TRANSFORMATION • ADAPTABILITY",
        "keepsake": {
            "name": "Crescent-Shaped Bismuth Crystal Sculpture",
            "description": "A crescent moon made from bismuth, featuring distinctive geometric formations and naturally iridescent colours, representing adaptability and personal evolution.",
            "role": "KEEPSAKE"
        },
        "ritual": {
            "name": "White Perfume-Bottle-Shaped Scented Candle",
            "description": "A sculptural white scented candle inspired by the silhouette of a perfume bottle, bringing fragrance and renewal to moments of reflection.",
            "role": "RITUAL"
        },
        "vastuPlacement": {
            "direction": "South",
            "room": "Study or workspace (South for courage/action; North or East for new beginnings; Northeast for candle)",
            "instructions": "Place the Bismuth Crescent Moon in the South of your study or living room, a traditional Vastu direction associated with courage and purposeful action. The North or East is an alternative symbolic placement for new beginnings. Place the candle in the Northeast.",
            "contemplationPrompt": "You can be brave enough to change and wise enough to move at your own pace."
        },
        "experiences": {
            "gifting_someone_else": {
                "headline": "For Someone Who Inspires You to Grow",
                "subtitle": "Some people remind us that life is full of possibilities. Through their courage, determination and willingness to embrace new experiences, they inspire us to see beyond the familiar.",
                "chapterTitle": "A Chapter Worth Celebrating",
                "chapterText": "Some people remind us that life is full of possibilities. Through their courage, determination and willingness to embrace new experiences, they inspire us to see beyond the familiar. This gift celebrates their spirit and carries a heartfelt wish for exciting beginnings, meaningful discoveries and moments of happiness along the way.",
                "whyChosen": "The Bismuth Crescent Moon symbolises transformation and the beauty of life's changing phases. Its shifting iridescent colours represent how every new experience can reveal another side of who we are. The White Scented Candle symbolises clarity, peace and renewal.",
                "luxuryDescription": "A crescent moon sculpture made from bismuth featuring iridescent geometric formations paired with a sculptural perfume-bottle-shaped white scented candle.",
                "whatThisGiftMeans": "May every new beginning bring you something wonderful to discover. The crescent moon celebrates transformation and fresh possibilities. The white candle represents moments of peace and appreciation. Together, they carry a wish for a journey filled with courage, meaningful experiences and the freedom to grow at your own pace.",
                "intentionHeading": "The Giver's Intention",
                "intentionStatement": "I chose this for you because I admire your strength and the way you embrace life's possibilities. May every new chapter bring you exciting opportunities, beautiful discoveries and enough peaceful moments to enjoy everything you're becoming.",
                "howToUse": "Bismuth Crescent Moon: Place it in the South of your study or living room, a direction associated with courage and purposeful action. White Scented Candle: Place it in the Northeast as a reminder of clarity and calm, lighting it on a heat-resistant surface."
            },
            "buying_for_myself": {
                "headline": "For the Courage to Grow at Your Own Pace",
                "subtitle": "Because you can welcome change without losing the peace you've worked to create.",
                "chapterTitle": "The Chapter You're In",
                "chapterText": "You may be feeling ready to make changes, take independent decisions or explore possibilities beyond what has always felt familiar. While a part of you values comfort and stability, another may be asking for movement, growth and new experiences. This chapter encourages you to trust your courage without rushing your decisions, and to remember that meaningful transformation can happen at your own pace.",
                "whyChosen": "The Bismuth Crescent Moon symbolises transformation and renewal. Its iridescent colours remind you that every change can reveal new perspectives. The White Scented Candle represents calm, clarity and the importance of creating moments of stillness amid new experiences.",
                "luxuryDescription": "A geometric bismuth crescent sculpture paired with a fragrant sculptural candle, celebrating the balance between courage and mindful self-awareness.",
                "whatThisGiftMeans": "You can be brave enough to change and wise enough to move at your own pace. The crescent moon represents new phases of life, while bismuth symbolises transformation. The candle reminds you to make space for calm and reflection.",
                "intentionHeading": "Your Personal Intention",
                "intentionStatement": "I trust myself to embrace meaningful changes. I move forward with courage, make decisions with clarity and allow myself moments of peace along the way. I can grow into new possibilities without losing who I am.",
                "howToUse": "Display the Bismuth Crescent Moon in the South of your workspace. Light the white candle in the Northeast during journaling or quiet reflection."
            }
        }
    },
    "Rahu": {
        "combinationId": "TAU-RAH-HAMPER-01",
        "setTitle": "The Instinct & Tactical Ambition Set",
        "collection": "The Person You're Gifting",
        "tagline": "Tactical intelligence, instinct and the composure to choose opportunities wisely.",
        "productsSummary": "Garnet Crystal-Infused Attar + Crocodile Pocket Brooch",
        "story": "Some people stand out for their sharp instincts, determination and ability to navigate life with remarkable composure. They know how to recognise opportunities, adapt to changing circumstances and remain devoted to what matters. This gift celebrates their individuality and wishes them the confidence to pursue everything they're capable of achieving.",
        "whatYouMightBeGoingThrough": "You may be feeling drawn towards bigger ambitions, new environments or opportunities that challenge what has always felt familiar. Your desire for stability may now be accompanied by a stronger urge to explore, achieve and establish your own direction.",
        "whyChosen": "Garnet crystal-infused attar symbolises vitality, protection and deep devotion to meaningful ambitions. The Crocodile Pocket Brooch represents tactical intelligence, patient observation and decisive action when the moment is right.",
        "intentionShift": "Tactical Patience • Sharp Instincts • Grounded Ambition",
        "challenge": "IMPULSIVE_AMBITION • CHASING_EVERY_OPPORTUNITY • RESTLESSNESS",
        "desiredShift": "TACTICAL_PATIENCE • INSTINCT • FOCUSED_AMBITION • COMPOSURE",
        "keepsake": {
            "name": "Crocodile Pocket Brooch",
            "description": "A distinctive crocodile-inspired pocket accessory, translating the animal's powerful silhouette and tactical intelligence into an unconventional statement of personal style.",
            "role": "KEEPSAKE"
        },
        "ritual": {
            "name": "Garnet Crystal-Infused Attar",
            "description": "A personal fragrance infused with garnet crystals, carrying traditional symbolism of vitality, devotion and protection into an everyday ritual.",
            "role": "RITUAL"
        },
        "vastuPlacement": {
            "direction": "North",
            "room": "Wardrobe or dressing space (North of wardrobe/dressing area)",
            "instructions": "Store the set in the North of your wardrobe or dressing space, traditionally associated in Vastu with professional growth, career opportunities and wealth. Wear the Crocodile Brooch on a blazer or structured jacket during important meetings, decisions or new experiences.",
            "contemplationPrompt": "Not every opportunity needs to be chased. Some deserve to be chosen."
        },
        "experiences": {
            "gifting_someone_else": {
                "headline": "For Someone with Sharp Instincts and Devotion",
                "subtitle": "Some people stand out for their sharp instincts, determination and ability to navigate life with remarkable composure.",
                "chapterTitle": "A Chapter Worth Celebrating",
                "chapterText": "Some people stand out for their sharp instincts, determination and ability to navigate life with remarkable composure. They know how to recognise opportunities, adapt to changing circumstances and remain devoted to what matters. This gift celebrates their individuality and wishes them the confidence to pursue everything they're capable of achieving.",
                "whyChosen": "Garnet traditionally symbolises vitality, protection and deep devotion. It represents the passion to pursue meaningful ambitions while remaining loyal to one's values. Crocodile Pocket Brooch represents tactical intelligence, adaptability and the ability to act decisively when the moment is right.",
                "luxuryDescription": "A personal fragrance infused with garnet crystals paired with a distinctive crocodile-inspired sculptural pocket accessory.",
                "whatThisGiftMeans": "May you always have the courage to pursue what excites you and the wisdom to recognise what truly matters. Garnet represents passion and devotion. The crocodile symbolises patience, instinct and purposeful action. Together, they celebrate a person who knows that strength lies not only in moving forward, but also in choosing the right moment.",
                "intentionHeading": "The Giver's Intention",
                "intentionStatement": "I chose this for you because I admire your determination and the way you approach life with such individuality. May you always recognise the opportunities meant for you, trust your instincts and find fulfilment in everything you choose to pursue.",
                "howToUse": "Garnet Attar: Make it part of your daily fragrance ritual. Crocodile Pocket Brooch: Wear it on a blazer pocket or jacket as a reminder of patience, confidence and thoughtful action. Keep in the North of your dressing area."
            },
            "buying_for_myself": {
                "headline": "For Ambition Guided by Instinct and Purpose",
                "subtitle": "Not every opportunity needs to be chased. Some deserve to be chosen.",
                "chapterTitle": "The Chapter You're In",
                "chapterText": "You may be feeling drawn towards bigger ambitions, new environments or opportunities that challenge what has always felt familiar. Your desire for stability may now be accompanied by a stronger urge to explore, achieve and establish your own direction. This chapter encourages you to trust your instincts, remain patient with your progress and invest your energy in what genuinely matters.",
                "whyChosen": "Garnet crystal-infused attar symbolises remaining passionate about your ambitions without losing your emotional grounding. The Crocodile Pocket Brooch reminds you that progress doesn't always require constant movement; sometimes your greatest advantage is knowing when to act.",
                "luxuryDescription": "An intentional pairing of garnet crystal attar and a sculptural crocodile accessory, honouring ambition guided by composure, instinct and purpose.",
                "whatThisGiftMeans": "You don't have to move faster to move further. You have to move with intention. Garnet represents the passion that drives you. The crocodile symbolises the patience and instinct that guide you.",
                "intentionHeading": "Your Personal Intention",
                "intentionStatement": "I trust my instincts and honour my ambitions. I welcome new possibilities with confidence, choose my opportunities with wisdom and remain devoted to what matters most to me.",
                "howToUse": "Incorporate Garnet Attar into your getting-ready ritual. Wear the Crocodile Brooch during important decisions. Store the set in the North of your wardrobe or dressing space."
            }
        }
    },
    "Jupiter": {
        "combinationId": "TAU-JUP-HAMPER-01",
        "setTitle": "The Wisdom & New Horizons Set",
        "collection": "For Someone Who Brings Hope and Perspective",
        "tagline": "Generosity of spirit, clarity and the courage to welcome new blessings.",
        "productsSummary": "Turquoise Hamsa Hand with Aura Quartz Oyster Shell + White Perfume-Bottle-Shaped Scented Candle",
        "story": "Some people have a beautiful way of bringing hope, warmth and perspective into the lives of others. Their generosity, thoughtful nature and ability to see possibilities make their presence truly meaningful. This gift celebrates their spirit and wishes them a life filled with happiness, fulfilling experiences and wonderful new beginnings.",
        "whatYouMightBeGoingThrough": "You may be entering a chapter where you're looking beyond immediate responsibilities and thinking more deeply about what makes life fulfilling. Perhaps you're becoming more open to learning, meaningful opportunities and experiences that bring a stronger sense of purpose.",
        "whyChosen": "Turquoise Hamsa Hand with Aura Quartz Oyster Shell combines protection, clarity and optimism for hidden potential. The White Scented Candle represents purity, renewal and peaceful beginnings.",
        "intentionShift": "Expanding Wisdom • Optimism • Purposeful Growth",
        "challenge": "NARROW_FOCUS • DOUBTING_EXPANSION • CYNICISM",
        "desiredShift": "WISDOM • OPTIMISM • CLARITY • NEW_HORIZONS",
        "keepsake": {
            "name": "Turquoise Hamsa Hand with Aura Quartz Oyster Shell",
            "description": "A decorative Hamsa hand combining turquoise, an oyster-shell element and luminous aura quartz, symbolising protection, inner clarity and the discovery of new possibilities.",
            "role": "KEEPSAKE"
        },
        "ritual": {
            "name": "White Perfume-Bottle-Shaped Scented Candle",
            "description": "A sculptural white scented candle with a perfume-bottle silhouette, designed to accompany moments of reflection and intentional living.",
            "role": "RITUAL"
        },
        "vastuPlacement": {
            "direction": "Northeast",
            "room": "Study, living room or personal sanctuary space",
            "instructions": "Display the Turquoise Hamsa with Aura Quartz Oyster in the Northeast of your living room, study or personal space, traditionally associated in Vastu with wisdom, reflection, clarity and learning. Light the white candle during journaling or quiet reflection on a heat-resistant holder.",
            "contemplationPrompt": "Consider one thing you're grateful for and one possibility you'd like to explore."
        },
        "experiences": {
            "gifting_someone_else": {
                "headline": "For Someone Who Brings Hope and Perspective",
                "subtitle": "Some people have a beautiful way of bringing hope, warmth and perspective into the lives of others. Their generosity, thoughtful nature and ability to see possibilities make their presence truly meaningful.",
                "chapterTitle": "A Chapter Worth Celebrating",
                "chapterText": "Some people have a beautiful way of bringing hope, warmth and perspective into the lives of others. Their generosity, thoughtful nature and ability to see possibilities make their presence truly meaningful. This gift celebrates their spirit and wishes them a life filled with happiness, fulfilling experiences and wonderful new beginnings.",
                "whyChosen": "The Hamsa traditionally symbolises protection and blessings. Turquoise represents calmness and clarity, while the oyster shell symbolises hidden potential and discovering something precious within. Aura quartz adds the symbolism of optimism. The white candle represents purity and peaceful beginnings.",
                "luxuryDescription": "A decorative Hamsa hand featuring turquoise, an oyster-shell element and luminous aura quartz paired with a sculptural perfume-bottle-shaped white scented candle.",
                "whatThisGiftMeans": "May your life always hold something wonderful waiting to unfold. The Hamsa represents blessings and protection. The oyster symbolises precious possibilities. The candle represents hope and peaceful beginnings. Together, they carry a wish for happiness, clarity and a future filled with meaningful opportunities.",
                "intentionHeading": "The Giver's Intention",
                "intentionStatement": "I chose this for you because I admire the warmth and positivity you bring into the world. May you always find reasons to feel grateful, opportunities that excite you and beautiful moments that remind you how much life has to offer.",
                "howToUse": "Turquoise Hamsa with Aura Quartz Oyster: Display it in the Northeast of your living room or personal space, traditionally associated with wisdom and clarity. Light the candle during a quiet evening on a heat-resistant surface."
            },
            "buying_for_myself": {
                "headline": "For the Wisdom to Welcome New Possibilities",
                "subtitle": "You don't need to have every answer to believe that beautiful possibilities are still unfolding.",
                "chapterTitle": "The Chapter You're In",
                "chapterText": "You may be entering a chapter where you're looking beyond immediate responsibilities and thinking more deeply about what makes life fulfilling. Perhaps you're becoming more open to learning, meaningful opportunities and experiences that bring a stronger sense of purpose. This chapter encourages you to trust your growing wisdom, appreciate how far you've come and remain hopeful about what lies ahead.",
                "whyChosen": "Turquoise represents calmness and clarity, while the oyster reminds you that meaningful growth often begins quietly. Aura quartz adds the symbolism of optimism and manifestation. The white candle offers a small ritual for reflecting on your intentions and appreciating the present.",
                "luxuryDescription": "An ornamental keepsake combining turquoise, oyster shell and aura quartz paired with a sculptural candle, inviting wisdom, learning and purposeful optimism.",
                "whatThisGiftMeans": "You are allowed to appreciate where you are while looking forward to everything you can become. The Hamsa represents reassurance. The oyster symbolises potential. The candle represents hope and clarity. Together, they remind you that growth can begin with gratitude, curiosity and a willingness to welcome new experiences.",
                "intentionHeading": "Your Personal Intention",
                "intentionStatement": "I welcome new possibilities with an open heart. I trust the wisdom I'm gaining, appreciate the blessings already present in my life and make space for experiences that bring meaning, happiness and growth.",
                "howToUse": "Place the Hamsa in the Northeast of your study or personal space. Light the candle during journaling or quiet reflection, considering one thing you are grateful for and one possibility you want to explore."
            }
        }
    },
    "Saturn": {
        "combinationId": "TAU-SAT-HAMPER-01",
        "setTitle": "The Endurance & Abundance Set",
        "collection": "For Someone Dedicated to Building Something Lasting",
        "tagline": "Patience, steady progress and the abundance that makes the journey worthwhile.",
        "productsSummary": "Amethyst Crystal Brass Cup + Blue Perfume-Bottle-Shaped Scented Candle",
        "story": "Some people inspire us through their patience, reliability and the quiet determination with which they build their lives. Their ability to remain committed to what matters makes every achievement more meaningful. This gift celebrates their dedication and carries a wish for lasting happiness, well-deserved recognition and beautiful rewards for everything they continue to create.",
        "whatYouMightBeGoingThrough": "You may be entering a phase where patience, responsibility and long-term decisions are becoming more important. Perhaps you're investing more energy into building financial security, strengthening your foundations or working towards goals that require consistency.",
        "whyChosen": "Amethyst crystal brass cup symbolises calmness, clarity and a vessel ready to receive abundance and prosperity. The blue candle represents composure, emotional steadiness and patience.",
        "intentionShift": "Endurance • Financial Security • Patient Abundance",
        "challenge": "BURNOUT • ANXIETY_OVER_DELAYS • RIGIDITY",
        "desiredShift": "PATIENCE • ENDURANCE • RECOGNITION • PROSPERITY",
        "keepsake": {
            "name": "Amethyst Crystal Brass Cup",
            "description": "A decorative brass vessel holding natural amethyst crystals, bringing together the symbolism of mental clarity and welcoming wealth, prosperity and treasured opportunities.",
            "role": "KEEPSAKE"
        },
        "ritual": {
            "name": "Blue Perfume-Bottle-Shaped Scented Candle",
            "description": "A sculptural blue scented candle with a perfume-bottle silhouette, offering a fragrant ritual associated with patience, calm and composure.",
            "role": "RITUAL"
        },
        "vastuPlacement": {
            "direction": "North",
            "room": "Study or workspace (North of study/workspace)",
            "instructions": "Place the Amethyst Brass Cup in the North of your study or workspace, traditionally associated in Vastu with career opportunities, wealth and prosperity. Keep the cup clean and dry as a symbol of welcoming abundance. Light the blue candle during journaling or quiet reflection.",
            "contemplationPrompt": "Consider one achievement you're grateful for and one meaningful step you can take next."
        },
        "experiences": {
            "gifting_someone_else": {
                "headline": "For Someone Who Builds with Patience and Care",
                "subtitle": "Some people inspire us through their patience, reliability and the quiet determination with which they build their lives.",
                "chapterTitle": "A Chapter Worth Celebrating",
                "chapterText": "Some people inspire us through their patience, reliability and the quiet determination with which they build their lives. Their ability to remain committed to what matters makes every achievement more meaningful. This gift celebrates their dedication and carries a wish for lasting happiness, well-deserved recognition and beautiful rewards for everything they continue to create.",
                "whyChosen": "Amethyst traditionally symbolises calmness, clarity, protection and focus. The brass cup represents a vessel of abundance, associated symbolically with receiving prosperity, wealth and life's treasured opportunities. Blue represents composure, trust and emotional steadiness. Together, they celebrate the beauty of steady progress.",
                "luxuryDescription": "A decorative brass cup holding amethyst crystals paired with a sculptural blue scented candle inspired by a perfume bottle, offering a fragrant moment of reflection.",
                "whatThisGiftMeans": "May your patience be rewarded, your efforts be recognised and your life be filled with abundance worth celebrating. The amethyst represents clarity and focus. The brass cup symbolises welcoming prosperity and treasured opportunities. The blue candle represents peace along the way.",
                "intentionHeading": "The Giver's Intention",
                "intentionStatement": "I chose this for you because I admire your dedication and the care you put into everything you do. May your efforts open doors to wonderful opportunities, your achievements bring lasting fulfilment and your life always have room for peace, happiness and prosperity.",
                "howToUse": "Amethyst Brass Cup: Place it in the North of your study or workspace, traditionally associated in Vastu with opportunities and prosperity. Blue Scented Candle: Light it during a quiet evening or moment of reflection on a heat-resistant surface."
            },
            "buying_for_myself": {
                "headline": "For the Foundations You're Patiently Building",
                "subtitle": "You don't have to rush what you're building to believe in its potential.",
                "chapterTitle": "The Chapter You're In",
                "chapterText": "You may be entering a phase where patience, responsibility and long-term decisions are becoming more important. Perhaps you're investing more energy into building financial security, strengthening your foundations or working towards goals that require consistency. This chapter encourages you to recognise the value of your progress, remain focused on what matters and remember that meaningful success deserves moments of peace along the way.",
                "whyChosen": "Amethyst symbolises clarity, focus, calmness and protection. The brass cup represents a vessel for prosperity and incoming treasures — a reminder to remain open to opportunities while building a secure future. Blue represents emotional steadiness and patience.",
                "luxuryDescription": "A decorative brass vessel holding amethyst crystals paired with a sculptural blue candle, bringing together mental focus, patience and the quiet pursuit of abundance.",
                "whatThisGiftMeans": "Everything meaningful takes time, and every step forward deserves appreciation. The amethyst represents focus and clarity. The brass cup symbolises abundance. The candle represents the peace you deserve while pursuing your goals.",
                "intentionHeading": "Your Personal Intention",
                "intentionStatement": "I trust the progress I'm making. I welcome prosperity and meaningful opportunities, remain focused on my goals and allow myself moments of peace and gratitude along the way.",
                "howToUse": "Display the Amethyst Brass Cup in the North of your workspace or study. Light the blue candle during journaling or quiet reflection, considering one achievement you are grateful for and one step to take next."
            }
        }
    },
    "Mercury": {
        "combinationId": "TAU-MER-HAMPER-01",
        "setTitle": "The Focus & Time Wisdom Set",
        "collection": "For Someone Who Turns Ideas into Reality",
        "tagline": "Clarity of thought, purposeful growth and the value of time.",
        "productsSummary": "Rare Sun-Moonstone Crystal-Infused Attar + Seven-Chakra Crystal Clock",
        "story": "Some people have a remarkable ability to turn ideas into possibilities. Their curiosity, thoughtful decisions and willingness to keep learning make their journey inspiring. This gift celebrates their potential and wishes them clarity in their choices, confidence in their abilities and opportunities to make the most of their talents.",
        "whatYouMightBeGoingThrough": "You may be entering a phase where your ideas, abilities and the way you use your time are becoming increasingly important. Perhaps you're learning new skills, considering fresh opportunities or looking for greater clarity in your personal and professional decisions.",
        "whyChosen": "Sun-moonstone brings together the Sun's confidence and the Moon's intuition for clear thinking. The Seven-Chakra Crystal Clock symbolises the importance of using time wisely, developing skills and intentional living.",
        "intentionShift": "Time Discipline • Intuitive Clarity • Mindful Productivity",
        "challenge": "PROCRASTINATION • OVERTHINKING • SCATTERED_FOCUS",
        "desiredShift": "FOCUS • INTUITIVE_CLARITY • TIME_MASTERY • INTENTIONAL_ACTION",
        "keepsake": {
            "name": "Seven-Chakra Crystal Clock",
            "description": "A decorative timepiece featuring seven chakra-associated crystals, combining spiritual harmony with the practical value of timekeeping, focus and intentional living.",
            "role": "KEEPSAKE"
        },
        "ritual": {
            "name": "Rare Sun-Moonstone Crystal-Infused Attar",
            "description": "A personal fragrance infused with rare sun-moonstone crystal chunks, bringing together the Sun's confidence and the Moon's intuition.",
            "role": "RITUAL"
        },
        "vastuPlacement": {
            "direction": "North or Northeast",
            "room": "Study, office or personal workspace",
            "instructions": "Place the Seven-Chakra Crystal Clock in the North or Northeast of your study or workspace, traditionally associated in Vastu with learning, opportunities and clarity. Use it to organise priorities. Make Sun-moonstone Attar part of your morning fragrance ritual.",
            "contemplationPrompt": "Each morning, identify your three most important priorities and dedicate a focused period to improving one skill."
        },
        "experiences": {
            "gifting_someone_else": {
                "headline": "For Someone with a Thoughtful Mind and Big Ideas",
                "subtitle": "Some people have a remarkable ability to turn ideas into possibilities. Their curiosity, thoughtful decisions and willingness to keep learning make their journey inspiring.",
                "chapterTitle": "A Chapter Worth Celebrating",
                "chapterText": "Some people have a remarkable ability to turn ideas into possibilities. Their curiosity, thoughtful decisions and willingness to keep learning make their journey inspiring. This gift celebrates their potential and wishes them clarity in their choices, confidence in their abilities and opportunities to make the most of their talents.",
                "whyChosen": "Rare Sun-moonstone symbolically brings together the Sun's confidence and the Moon's intuition, representing a balance between clear thinking and emotional understanding. The seven-chakra clock symbolises the importance of using time wisely, developing skills and bringing intention to everyday decisions.",
                "luxuryDescription": "A personal fragrance infused with rare sun-moonstone crystal chunks paired with a decorative timepiece featuring seven chakra-associated crystals.",
                "whatThisGiftMeans": "May your time be filled with purpose, your ideas with possibility and your talents with opportunities to shine. The sun-moonstone represents confidence and intuition. The seven-chakra clock celebrates balance, personal growth and the value of time.",
                "intentionHeading": "The Giver's Intention",
                "intentionStatement": "I chose this for you because I believe in your ideas, your abilities and everything you're capable of becoming. May you always find the clarity to make good decisions, the confidence to express yourself and the time to pursue what truly excites you.",
                "howToUse": "Sun-moonstone Attar: Make it part of your daily getting-ready ritual to approach the day with confidence and clarity. Seven-Chakra Crystal Clock: Place it in the North or Northeast of your study or workspace to track time and priorities."
            },
            "buying_for_myself": {
                "headline": "For the Potential You're Ready to Nurture",
                "subtitle": "Your potential grows when you give your ideas the time and attention they deserve.",
                "chapterTitle": "The Chapter You're In",
                "chapterText": "You may be entering a phase where your ideas, abilities and the way you use your time are becoming increasingly important. Perhaps you're learning new skills, considering fresh opportunities or looking for greater clarity in your personal and professional decisions. This chapter encourages you to trust your intelligence, express yourself confidently and create routines that support your ambitions without overlooking your wellbeing.",
                "whyChosen": "Sun-moonstone represents the balance between rational decisions and emotional awareness. The seven-chakra clock introduces the practical importance of time management, consistency and investing in personal development.",
                "luxuryDescription": "A rare sun-moonstone crystal fragrance paired with a seven-chakra timepiece, representing the clarity to understand your potential and the discipline to develop it.",
                "whatThisGiftMeans": "Your time is valuable, your abilities are worth developing and your ideas deserve to be explored. The sun-moonstone represents confidence guided by intuition. The seven-chakra clock represents balance, consistency and purposeful growth.",
                "intentionHeading": "Your Personal Intention",
                "intentionStatement": "I value my time, trust my ideas and commit to developing my abilities. I make decisions with clarity, express myself with confidence and create space for both meaningful progress and personal balance.",
                "howToUse": "Use Sun-moonstone Attar as part of your morning fragrance ritual. Display the Seven-Chakra Crystal Clock in the North or Northeast of your workspace. Each morning, identify your three most important priorities."
            }
        }
    }
}

INTENTIONS = [
    "love-connection",
    "confidence-power",
    "vitality-balance",
    "wealth-prosperity"
]

def update_file(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    added_count = 0
    for dasha_name, record in DASHAS_DATA.items():
        base_record = {
            "combinationId": record["combinationId"],
            "profile": f"MOON_TAURUS • DASHA_{dasha_name.upper()}",
            "sign": "Taurus",
            "signCode": "TAU",
            "signSymbol": "♉",
            "dasha": dasha_name,
            "collection": record["collection"],
            "setTitle": record["setTitle"],
            "productsSummary": record["productsSummary"],
            "tagline": record["tagline"],
            "story": record["story"],
            "whatYouMightBeGoingThrough": record["whatYouMightBeGoingThrough"],
            "whyChosen": record["whyChosen"],
            "intentionShift": record["intentionShift"],
            "challenge": record["challenge"],
            "desiredShift": record["desiredShift"],
            "keepsake": record["keepsake"],
            "ritual": record["ritual"],
            "vastuPlacement": record["vastuPlacement"],
            "experiences": record["experiences"],
            "disclaimer": "YOUNOYA products are curated for their craftsmanship, traditional symbolism and ability to encourage personal expression and meaningful everyday rituals. Crystal associations are symbolic and do not guarantee emotional, relationship, health or other outcomes."
        }

        # 1. Base key: TAURUS-<Dasha>
        key_base = f"TAURUS-{dasha_name}"
        data[key_base] = {
            **base_record,
            "matrixKey": key_base,
            "category": "all",
            "categoryName": "Curated Alignment"
        }
        added_count += 1

        # 2. 4 Intention keys: TAURUS-<Dasha>-<Intention>
        for int_slug in INTENTIONS:
            key_int = f"TAURUS-{dasha_name}-{int_slug}"
            data[key_int] = {
                **base_record,
                "matrixKey": key_int,
                "category": int_slug,
                "categoryName": int_slug.replace("-", " ").title()
            }
            added_count += 1

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Successfully updated {path} with {added_count} Taurus entries. Total records now: {len(data)}")

if __name__ == "__main__":
    update_file("younoya-web/src/data/combinations.json")
    update_file("backend/src/modules/younoya-astro/data/combinations.json")

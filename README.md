Company name: inVaal [016]
Catergory: Media House
Sever: Github
Author: Pule Mathikha
-----

---
inVaal Website Structure
Release Date: ##-##-####
│
├── index.html                 # Homepage with latest news and featured stories
├── deploy_.sh                 # Bash to deploy and push to github and check for errors(using colors)
├── gitignore.git                 # Ignore the setup-file(deploy_.sp)
│
├── css/
│   ├── root.css               # Primary stylesheet
│   ├── responsive.css         # Mobile responsiveness styles
│   └── typography.css         # Font and text styling
│
├── js/
│   ├── navigation.js          # Dynamic navigation handling
│   ├── news-loader.js         # JSON news data loading script
│   ├── media-handler.js       # Image and video embedding logic
|   ├── null-handler.js        # makes sure if null has been recieved then it shouldn't be displayed
│   └── nscn_ld.js             # new Screen loading Annimation/Logo script
|   
│
├── data/
│   ├── news.json              # News items data
│   ├── locations.json         # Location-specific news categories
│   └── changelog.json         # Version history data
│
├── pages/
│   ├── sasolburg.html         # Sasolburg local news page
│   ├── vereeniging.html       # Vereeniging local news page
│   ├── vanderbijlpark.html    # Vanderbijlpark local news page
│   ├── changelog.html         # Project changelog page
│   ├── careers.html           # inVaal's Job offers & Partners Job offers
│   ├── Business.html          # Based on Local Businesses
│   └── about.html             # About inVaal platform
│
├── media/
│   ├── images/                # Visuals
│   │   ├── thumbnails/
│   │   └── full-size/
│   └── videos/                # Embedded video content
│
├── components/
│   ├── header.html            # Site header template
│   ├── footer.html            # Site footer template
│   ├── careers-card.html     # Reusable careers template
│   └── news-card.html         # Reusable news item template
│
└── assets/
    ├── icons/                 # Site icons and favicons
    └── logos/                 # inVaal branding assets
---

```
<!-- Css -->
<!-- root.css -->
<!-- Fonts -->
<!--  Default Font  -->
@import url('https://fonts.googleapis.com/css2?family=Tiny5&display=swap');
<!-- Alternative Fonts -->
@import url('https://fonts.googleapis.com/css2?family=Kolker+Brush&family=Rock+Salt&display=swap');
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Festive&family=Fruktur:ital@0;1&family=Oleo+Script:wght@400;700&family=Stalemate&display=swap');

<!-- Defaults set up -->
:root:
    /* Main Colors */
    --color-main: hsl(282, 98%, 36%);
    --color-primary: hsl(282, 92%, 57%);
    --color-secondary: rgb(0, 204, 255);

    /* Basic clr */
    --color-black: black;
    --color-white: white;

    /* Debugging clrs */
    --test: lime;
    --error: red;

    <!-- Default Font size -->
    --font-XS: 0.7rem;
    <!-- Alternative Font sizes -->
    --font-XXS: 0.5rem;
    --font-S: 1rem;
    --font-M: 1.5rem;
    --font-L: 2.5rem;
    --font-XL: 4rem;

    <!-- Default Font setup -->
    /* Fonts */
    --basic-font: 'EB Garamond', serif;
    --logo-font: 'tiny5';

<!-- company_inf.json -->

"company":
      "name": "InVaal",
      "moto" : "[016]",
      "moto_txt": null,
      "website": "https://invaal.github.io/inVaal",
      "contact_us": {
        "cntct_email": "invaaltriangle@gmail.com",
        "phone": null,
        "telephone": null,
        "Fax": null,
        "social_links":
        {
            "Youtube": "https://youtu.be/a3NYnBlj1Vk?si=kjYF_wTKFqiRLRAa",
            "TikTok": null,
            "Facebook": null,
            "X": null,
            "Whatsapp": null,
            "Instagram": null,
        },
      },
      "location": {
        "address": null,
        "city": "Sasolburg, Vereeniging, Vanderbijlpark",
        "state": "Free State, Gauteng",
        "zipCode": null,
        "country": "South Africa"
        }

```


---

[Web_Demo](https://theekingza.github.io/inVaal_v2_Mar2025)

---

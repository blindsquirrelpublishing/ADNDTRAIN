/* Module 01 - Faerûn Address Localizations
   Source: ADNDDOCS/docs_parts/guide-01.5-configuring-localizations/module-01-faerun-address-localizations
   Inline markup supported in strings: **bold**, `code`. */
(function () {
  "use strict";

  var NAV_PATH = "☰ > Organization administration > Global address book > Addresses > Address setup";
  var NAV_STEP = {
    a: "Navigate to the **Address setup** form",
    d: "Open the form from the navigation menu, or search for it.",
    path: NAV_PATH,
    search: "Address setup"
  };

  ADND.register({
    id: "module-01",
    number: 1,
    title: "Faerûn Address Localizations",
    tagline: "Build a realm-aware address framework in Dynamics 365 Finance, from country code to ward-level postal code.",
    guide: "Guide 1.5 - Configuring Localizations",
    duration: "About 90 minutes",
    totalXp: 2120,

    intro: {
      paragraphs: [
        "In most implementations of **Dynamics 365 Finance and Supply Chain Management**, address data is configured using real-world geopolitical entities. For an organization operating in a custom realm like **Faerûn**, the default address structures fall short. To support the geography of the Realms, from the enchanted districts of **Waterdeep** to extraplanar hubs like the City of Brass, a localized, immersive address framework must be established.",
        "This module walks you through building that framework from the ground up for the **Waterdeep Trading Company**. You will create a new country/region code, define its provinces, cities and districts (wards), and implement a structured postal code format that combines regional identifiers with city and ward abbreviations (for example `01-WDEP-CW` for Castle Ward in Waterdeep, region 01)."
      ],
      learn: [
        { title: "Address Formats", text: "Create a custom **Faerûn** address format that supports a ward-based and region-based structure." },
        { title: "Country Codes", text: "Create and activate the **FAE** country/region code and assign it the custom address format." },
        { title: "States and Provinces", text: "Add the provinces of Faerûn manually, then bulk-load the rest with Excel integration." },
        { title: "Cities", text: "Add city records within the **Sword Coast** province to support order entry and shipping." },
        { title: "Districts", text: "Configure ward-level address segmentation for the city of **Waterdeep**." },
        { title: "Postal Codes", text: "Configure structured postal codes that tie region, city and ward together." }
      ],
      outro: "By the end of this module, Dynamics 365 will mirror Faerûn's political and cultural layout, so everything from invoicing a noble in North Ward to shipping goods to Suzail or Sigil carries a complete, validated address.",
      prerequisites: [
        "Access to a Dynamics 365 Finance environment with permission to open **Address setup** (a training or sandbox environment is recommended).",
        "Microsoft Excel with the Office Integration add-in, needed for the bulk province import in Lab 3.",
        "The completed labs of this module build on one another, so work through them in order."
      ]
    },

    labs: [
      /* ------------------------------------------------------------------ LAB 1 */
      {
        id: "lab-01",
        number: 1,
        title: "Address Formats",
        short: "Define how Faerûn addresses are structured",
        xp: 288,
        briefing: {
          intro: [
            "In **Dynamics 365 Finance and Supply Chain Management**, **address formats** define how location data is structured and displayed across business documents such as purchase orders, invoices and shipment records. Because the default formats are built around real-world geopolitical conventions, organizations operating within custom regions must create tailored formats.",
            "For the **Waterdeep Trading Company**, the standard layouts do not align with Faerûn's geography of Wards, Cities and Regions. A custom address format ensures every document shows locations the way the Realms intend, from Phalantar's Philters in Castle Ward to a guild hall in the Sea Ward of Waterdeep.",
            "In this lab, we will create a custom **Faerûn** address format that supports the realm's ward-based and region-based address structure, laying the foundation for all downstream address configuration."
          ],
          overview: "We will create a custom address format to support the unique geographical structure of Faerûn. Because standard address formats do not align with the Wards, Cities and Regions found across the Realms, a tailored format is essential. This configuration ensures that purchase orders, invoices and shipment records display addresses the way Faerûn's geography demands.",
          sample: {
            title: "Target outcome: a Faerûn address",
            lines: ["Phalantar's Philters & Components", "Cats Alley", "Castle Ward, **Waterdeep**, 01-WDEP-CW", "**Faerûn**"]
          },
          objective: ["By completing this lab, you will create and apply a custom **Faerûn** address format (code: **FAE**) that reflects its regional and ward-based address structure."]
        },
        reference: {
          intro: "A consolidated reference of the address format configuration data used in this lab. Use it as a quick lookup while you work in Dynamics 365 Finance.",
          tables: [
            {
              title: "Address formats reference data",
              columns: ["Field", "Value", "Description"],
              rows: [
                ["Address format", "FAE", "Unique code for the Faerûn format"],
                ["Description", "Faerûn address format", "Label for clarity"],
                ["Components", "Street, District, City, State/Province, Country/Region", "Displayed from bottom-up"]
              ]
            }
          ]
        },
        tasks: [
          {
            id: "t1",
            title: "Create a Faerûn Address Format",
            intro: [
              "To support the geopolitical and cultural structure of Faerûn, a custom address format must be created. The built-in formats do not reflect the hierarchy found in this realm, where street names fall within wards, which belong to cities, which are nested within regional territories like the **Sword Coast**.",
              "We will create a new address format using the code **FAE**. It defines how addresses are structured and displayed across the system, keeping data entry and document generation consistent."
            ],
            objective: "Create a custom address format (FAE) that reflects Faerûn's geographic hierarchy of street, district, city and state/province, ensuring proper address rendering across the system.",
            fields: {
              title: "Faerûn address format",
              columns: ["Field", "Value", "Description"],
              rows: [
                ["Address format", "FAE", "This will be our unique code for Faerûn"],
                ["Description", "Faerûn address format", "Provide a meaningful label for future reference"]
              ]
            },
            how: "Using the **Address setup** form, we will create a new record and populate its key fields, including **Address format** and **Description**. Once saved, the configuration will be active for the Waterdeep Trading Company.",
            steps: [
              NAV_STEP,
              { a: "Select the **Address format** tab", d: "This shows all currently configured address formats." },
              { a: "Click **Add**", d: "Begin creating a new address format." },
              { a: "Set the **Address format** to `FAE`", d: "This will be our unique code for Faerûn." },
              { a: "Set the **Description** to `Faerûn address format`", d: "Provide a meaningful label for future reference." },
              { a: "Click **Save**", d: "This enables editing of the format components." },
              { a: "Click **Add** under **Address components**", d: "Begin defining how the address will appear." },
              { a: "Select **State or province**, check **New line**", d: "Represents Faerûn's regions like the Sword Coast." },
              { a: "Click **Add**, select **City**", d: "Represents cities such as Waterdeep." },
              { a: "Click **Add**, select **District**, check **New line**", d: "Represents wards like Castle Ward." },
              { a: "Click **Add**, select **Street**, check **New line**", d: "Captures street names such as Cats Alley." },
              { a: "Click **Save**", d: "Finalize and store the format." }
            ],
            review: "We have defined the Faerûn address format, establishing how all Faerûnian addresses are structured and displayed throughout Dynamics 365. This format keeps data entry and document generation consistent for the Waterdeep Trading Company."
          }
        ],
        practice: [
          {
            type: "components",
            title: "Build the FAE address format",
            intro: "Mirror steps 7 to 11. Add the address components in the correct order and set **New line** where the lab calls for it. The tab below behaves like the Address components grid.",
            formCode: "FAE",
            formDescription: "Faerûn address format",
            available: ["Street", "District", "City", "State or province", "Country/region", "ZIP/postal code", "County"],
            expected: [
              { name: "State or province", newLine: true },
              { name: "City", newLine: false },
              { name: "District", newLine: true },
              { name: "Street", newLine: true }
            ],
            success: "The component sequence matches the lab. Remember to **Save** the format in Dynamics 365.",
            hints: {
              order: "Check the order: State or province comes first, then City, District and Street.",
              count: "The lab adds exactly four components.",
              newline: "New line is checked for State or province, District and Street, but not for City."
            }
          }
        ],
        quiz: [
          {
            q: "Which code identifies the custom Faerûn address format?",
            options: ["FAE", "WDEP", "SC", "ADDR"],
            answer: 0,
            why: "FAE is the unique code for the Faerûn address format, and it is reused later as the country/region code."
          },
          {
            q: "You have entered the Address format code and Description. What must you do before you can edit the address components?",
            options: ["Click Save", "Activate the legal entity", "Import an Excel template", "Create a postal code"],
            answer: 0,
            why: "Saving the new record enables editing of the format components (step 6)."
          },
          {
            q: "Which components are set to start on a **New line** in this lab?",
            options: ["State or province, District and Street", "City only", "Street and City", "All four components"],
            answer: 0,
            why: "State or province, District and Street each have New line checked. City follows on the same line."
          },
          {
            q: "Which component represents regions such as the Sword Coast?",
            options: ["State or province", "District", "Street", "City"],
            answer: 0,
            why: "State or province models Faerûn's regions. Districts are the wards inside a city."
          }
        ],
        wrapup: [
          "We have configured a custom address format, **FAE**, tailored to the structure of Faerûn. It captures key location elements in a consistent order and aligns address data with the geopolitical and cultural layout of the realm, so invoices, purchase orders and shipping labels present Faerûnian addresses accurately. **Greta Ironfist** can now rest assured that every crate, contract and courier scroll will find its way.",
          "The format will be used whenever the FAE country/region is selected in the **Global Address Book**. With this step complete, the Waterdeep Trading Company's operations are one step closer to full immersion and operational precision."
        ],
        award: {
          xp: 288,
          story: "We've earned 288 XP for crafting a custom address format tailored to the magical geography of Faerûn. By codifying regions like the Sword Coast and wards such as Castle Ward into a formal structure, we've tamed the chaos of the realm's postal peculiarities. **Greta Ironfist** commends our eye for detail: no invoice shall go misrouted, no scroll misdelivered.",
          rows: [
            ["Base Task XP", "Creating a new custom address format in D365", "100 XP"],
            ["Subtask: Add Format Code", "Defining the FAE address format and description", "15 XP"],
            ["Subtask: Add Components", "Adding Street, District, City, State/Province, Country/Region (with order)", "50 XP"],
            ["Subtask: Use New Line for Proper Formatting", "Ensuring new lines are set for visual clarity in documents", "15 XP"],
            ["Subtask: Save & Validate", "Finalizing the setup within the Address Format tab", "10 XP"],
            ["Complexity Multiplier (30%)", "Custom hierarchy with lore-specific levels, wards, cities, regions", "+57 XP"],
            ["Lore Integration Bonus", "Ties to Waterdeep, Castle Ward, and merchant guild operations", "+41 XP"]
          ],
          closing: "Keep going, Arcane Cartographer of Configuration! With every setup step, the Waterdeep Trading Company moves closer to becoming a truly Faerûnian-powered enterprise."
        }
      },

      /* ------------------------------------------------------------------ LAB 2 */
      {
        id: "lab-02",
        number: 2,
        title: "Country Codes",
        short: "Register Faerûn and the planes as countries/regions",
        xp: 374,
        briefing: {
          intro: [
            "In Dynamics 365 Finance and Supply Chain Management, **country/region codes** are fundamental to address entry, **legal entity** configuration and regional reporting. Every address must be associated with a recognized country or region, and without a formal entry for Faerûn the system cannot support the addresses, tax rules or compliance features required for operations across the Realms.",
            "Because Faerûn does not exist in the default geopolitical list, it must be added manually. This foundational step enables accurate address formatting, supports downstream tax and compliance features, and allows proper classification of transactions across Realms and Planes.",
            "In this lab, we will create and activate the **FAE** country/region code, assign it the custom address format, and prepare the system to recognize our realm in every address, invoice and shipping document."
          ],
          overview: "We will configure a new country/region code for Faerûn. We will also learn how to extend this setup to include other realms and planes, so that all magical and mundane destinations used by the organization are formally recognized within the system.",
          objective: [
            "Create and activate the **FAE** country/region code for Faerûn and assign it the custom address format.",
            "Configure additional country codes for neighboring continents and extraplanar regions, ensuring complete address coverage for all legal entities, customers, vendors and logistics operations."
          ]
        },
        reference: {
          intro: "A consolidated reference of the country code configuration data used in this lab.",
          tables: [
            {
              title: "Country codes reference data",
              columns: ["Field", "Value", "Description"],
              rows: [
                ["Country/region", "FAE", "ISO-style identifier for Faerûn"],
                ["Short name", "Faerûn", "Appears in selection menus"],
                ["Long name", "Faerûn", "Used in full legal documentation"],
                ["Address format", "FAE", "The custom Faerûn format created in Lab 1"]
              ]
            }
          ]
        },
        tasks: [
          {
            id: "t1",
            title: "Add Faerûn to the Country/Region List",
            intro: [
              "Before Faerûn can be used in legal entity addresses, vendor records or shipping destinations, it must be formally added to the Country/Region list. This makes \"Faerûn\" a selectable option in address entry fields and ties it to the custom address format defined for the realm.",
              "By assigning the code \"FAE\" and linking it to the right format, we enable consistent and accurate regional data throughout the platform. With **Greta Ironfist** overseeing operations, precision is non-negotiable."
            ],
            objective: "Add Faerûn (FAE) to the system's country/region list and link it to the custom address format previously configured, enabling its use across all address fields.",
            fields: {
              title: "Faerûn to the country/region list",
              columns: ["Field", "Value", "Description"],
              rows: [
                ["Country/region code", "FAE", "The short identifier used across the system"],
                ["Short name", "Faerûn", "This name appears in dropdowns and references"],
                ["Long name", "Faerûn", "Used for full address rendering"],
                ["Address format", "FAE", "Choose the custom Faerûn address format previously configured"]
              ]
            },
            how: "Using the **Address setup** form, we will create a new record and populate its key fields, including **Country/region code**, **Short name** and **Long name**, plus the **Address format** link.",
            steps: [
              NAV_STEP,
              { a: "Select the **Country/region** tab", d: "This displays all predefined country/region records." },
              { a: "Click **New**", d: "Begin creating a new entry." },
              { a: "Set the **Country/region code** to `FAE`", d: "This is the short identifier used across the system." },
              { a: "Set the **Short name** to `Faerûn`", d: "This name appears in dropdowns and references." },
              { a: "Set the **Long name** to `Faerûn`", d: "Used for full address rendering." },
              { a: "Set the **Address format** to `FAE`", d: "Choose the custom Faerûn address format previously configured." },
              { a: "Click **Save** (🖫)", d: "Save the new country code to activate it for use." }
            ],
            review: "We have registered Faerûn as a recognized country/region, enabling its use in addresses, vendor records and shipping destinations. The FAE code is now available system-wide as a selectable geographic identifier."
          },
          {
            id: "t2",
            title: "Add Other Country/Region Codes (Including Planar Realms)",
            intro: [
              "Faerûn may be the heart of our operations, but trade in a multiversal economy demands broader reach. To support logistics, taxation and regulatory compliance across neighboring continents and extraplanar hubs, additional codes must be configured: the far shores of Kara-Tur, the mystical bazaars of Zakhara, the cosmic machinery of Mechanus.",
              "We use the same method as for Faerûn so the Waterdeep Trading Company can track vendors, customers and shipments whether they originate in Elysium or end up in the City of Brass."
            ],
            objective: "Create additional country/region codes for neighboring continents and extraplanar locations such as Kara-Tur, Zakhara, Sigil and Mechanus, supporting multiversal commerce.",
            fields: {
              title: "Additional country/region codes",
              columns: ["Country/region code", "Short name", "Long name", "Address format"],
              copy: true,
              rows: [
                ["FAE", "Faerûn", "", "FAE"],
                ["KAR", "Kara-Tur", "Kara-Tur (Eastern Realms)", "FAE"],
                ["ZAK", "Zakhara", "Land of Fate (Zakhara)", "FAE"],
                ["SIG", "Sigil", "The City of Doors", "FAE"],
                ["MEC", "Mechanus", "Clockwork Nirvana of Mechanus", "FAE"],
                ["SHD", "Shadowfell", "The Plane of Shadow", "FAE"],
                ["ELY", "Elysium", "Blessed Fields of Elysium", "FAE"],
                ["CBR", "CityBrass", "City of Brass (Elemental Fire)", "FAE"],
                ["ABE", "Abeir", "Abeir (Twin World)", "FAE"],
                ["ARC", "Arcadia", "Arcadia (Lawful Neutral Plane)", "FAE"]
              ]
            },
            how: "We will use the **Address setup** form and its **Country/region** tab again. The process involves adding each record from the table above and saving it.",
            notes: [
              { type: "tip", text: "Create any additional address formats **before** assigning a custom Address format value beyond FAE. Most of these codes share the FAE format for simplicity, and localized formats can be created later." }
            ],
            steps: [
              { a: "Navigate to **Address setup** and open the **Country/region** tab", d: "Open the form from the navigation menu, or search for it.", path: NAV_PATH, search: "Address setup" },
              { a: "Repeat the steps from the primary task", d: "Follow the same flow you used to add FAE." },
              { a: "Click **New**", d: "Begin creating a new country or planar region code." },
              { a: "Fill out the details", d: "Use the data table above for each entry." },
              { a: "Click **Save**", d: "Confirm and save each code. These are now usable across entities and transactions." }
            ],
            review: "We have expanded the system's geopolitical scope to support trade across the planes and continents of the multiverse. Each new country/region code is available for address entry, logistics planning and regulatory compliance."
          }
        ],
        practice: [
          {
            type: "form",
            title: "Create the FAE country/region record",
            intro: "Fill in the New country/region record just as you would in the Country/region tab.",
            tab: "Country/region",
            fields: [
              { id: "code", label: "Country/region code", expected: "FAE" },
              { id: "short", label: "Short name", expected: "Faerûn" },
              { id: "long", label: "Long name", expected: "Faerûn" },
              { id: "fmt", label: "Address format", kind: "select", options: ["", "FAE", "US", "GB", "DE"], expected: "FAE" }
            ],
            success: "Record complete. Click **Save** in Dynamics 365 to activate the code."
          },
          {
            type: "drill",
            title: "Planar code drill",
            intro: "Type the country/region code that belongs to each realm or plane.",
            items: [
              { prompt: "Kara-Tur", answer: "KAR" },
              { prompt: "Zakhara", answer: "ZAK" },
              { prompt: "Sigil", answer: "SIG" },
              { prompt: "Mechanus", answer: "MEC" },
              { prompt: "Shadowfell", answer: "SHD" },
              { prompt: "Elysium", answer: "ELY" },
              { prompt: "CityBrass (City of Brass)", answer: "CBR" },
              { prompt: "Abeir", answer: "ABE" },
              { prompt: "Arcadia", answer: "ARC" }
            ],
            success: "All nine planar and regional codes recalled."
          }
        ],
        quiz: [
          {
            q: "Why must Faerûn be added to the Country/Region list manually?",
            options: ["It is not in Dynamics 365's default geopolitical list", "Dynamics 365 blocks fantasy realms by default", "Address formats cannot exist without it", "It is only needed for Excel imports"],
            answer: 0,
            why: "The default list holds real-world countries. A custom realm must be added so it can be used in addresses, tax and compliance features."
          },
          {
            q: "Which tab of the Address setup form do you use to add country/region codes?",
            options: ["Country/region", "Address format", "City", "District"],
            answer: 0,
            why: "Country/region records live on the Country/region tab of Address setup."
          },
          {
            q: "Which Address format value is assigned to FAE and to the other realm and plane codes in this lab?",
            options: ["FAE", "US", "None", "Planar"],
            answer: 0,
            why: "All codes share the FAE format for simplicity. Localized formats can be created later if needed."
          },
          {
            q: "What must be true before you assign an address format other than FAE to a new country code?",
            options: ["That address format must already exist", "The postal codes must be imported", "The legal entity must be deleted", "Excel integration must be enabled"],
            answer: 0,
            why: "Create any additional address formats first, then assign them to country/region records."
          },
          {
            q: "Which code does the lab assign to Sigil, the City of Doors?",
            options: ["SIG", "SGL", "SIL", "CBR"],
            answer: 0,
            why: "SIG is Sigil. CBR is the City of Brass."
          }
        ],
        wrapup: [
          "We have configured Faerûn (FAE) and its neighboring realms as valid country/region codes. This setup ensures that:",
          "- Faerûn appears in all address-related fields for legal entities, customers and vendors",
          "- Planar and regional codes like Kara-Tur, Sigil and the City of Brass are recognized across the system",
          "- Custom address formats are applied consistently, aligning documentation with the geography of each realm",
          "From scrolls to shipping labels, every document produced by the Waterdeep Trading Company is now prepared to navigate not only the roads of the Sword Coast, but the gates of the multiverse."
        ],
        award: {
          xp: 374,
          story: "We've earned 374 XP for establishing the foundation of multiversal commerce through the creation of the Faerûn country code and its extraplanar companions. The Waterdeep Trading Company can now invoice across Sigil, tax within the City of Brass, and ship goods to Mechanus with regulatory clarity. **Greta Ironfist** nods approvingly: our maps now speak the language of trade.",
          rows: [
            ["Base Task XP", "Core setup of a new country/region code (FAE)", "100 XP"],
            ["Subtask: Create Address Format Link", "Assign custom format to FAE", "20 XP"],
            ["Subtask: Add Country Code Entry", "FAE entry with full details", "20 XP"],
            ["Subtask: Add 9 Additional Codes", "One per region/realm (9 @ 10 XP each)", "90 XP"],
            ["Complexity Multiplier (30%)", "Multiversal application across planes and nations", "+69 XP"],
            ["Lore Integration Bonus", "Deep fantasy lore infusion, realms of Shadowfell to Elysium", "+75 XP"]
          ],
          closing: "We've codified the cosmos into Dynamics 365. The planes shall now bow to our dropdown menus."
        }
      },

      /* ------------------------------------------------------------------ LAB 3 */
      {
        id: "lab-03",
        number: 3,
        title: "States and Provinces",
        short: "Map the regions of Faerûn, by hand and by Excel",
        xp: 344,
        briefing: {
          intro: [
            "In Dynamics 365 Finance and Supply Chain Management, **states and provinces** sit beneath the country/region level in the address hierarchy, providing the regional segmentation needed for address validation, logistics planning and regional reporting. Each province record is linked to its parent country code and becomes available whenever an address is entered.",
            "For the Waterdeep Trading Company, defining provinces such as the **Sword Coast**, The North, the Western Heartlands and the Trackless Sea ensures that every address reflects its true regional context.",
            "In this lab, we will configure the provinces of Faerûn under the FAE country code, beginning with manual creation of key provinces and then streamlining the process with Excel integration for the remaining entries."
          ],
          overview: "We will begin by manually creating key provinces such as The North, Sword Coast, Trackless Sea and Western Heartlands, then import additional provinces using Excel integration. This structured approach keeps our address data aligned with Faerûn's regional boundaries.",
          objective: ["Define the complete set of provinces within Faerûn. This configuration supports precise address management, improved master data quality and consistent regional reporting for customers, vendors and internal documentation."]
        },
        reference: {
          intro: "A consolidated reference of the states and provinces configuration data used in this lab.",
          tables: [
            {
              title: "Additional provinces (manual entry)",
              columns: ["State", "Description"],
              rows: [["SC", "Sword Coast"], ["TS", "Trackless Sea"], ["WH", "Western Heartlands"]]
            },
            {
              title: "Remaining provinces (Excel import)",
              columns: ["Country/region", "State", "Description"],
              copy: true,
              rows: [
                ["FAE", "EH", "Eastern Heartlands"],
                ["FAE", "AM", "Amn"],
                ["FAE", "BG", "Baldur's Gate"],
                ["FAE", "CH", "Chult"],
                ["FAE", "DA", "Dalelands"],
                ["FAE", "DE", "Deepwilds"],
                ["FAE", "DR", "Dragon Coast"],
                ["FAE", "EL", "Elven Woods"],
                ["FAE", "IL", "Icewind Dale"],
                ["FAE", "LA", "Lake of Steam"],
                ["FAE", "LU", "Luskan"],
                ["FAE", "MO", "Moonsea"],
                ["FAE", "NE", "Netheril"],
                ["FAE", "SE", "Sea of Fallen Stars"],
                ["FAE", "TU", "Turmish"]
              ]
            }
          ]
        },
        tasks: [
          {
            id: "t1",
            title: "Add Provinces to Faerûn",
            intro: [
              "We will define the primary provinces of Faerûn under the custom country code (FAE). Configuring these provinces lets the system manage addresses precisely, so that an invoice sent to Baldur's Gate or a shipment to Waterdeep reflects the right regional territory.",
              "With clearly defined provinces like The North, Sword Coast and Western Heartlands, master data stays consistent and aligned with the geography of Faerûn."
            ],
            objective: "Define the primary provinces of Faerûn under the FAE country code, including The North, Sword Coast, Trackless Sea and Western Heartlands.",
            fields: {
              title: "First province: The North",
              columns: ["Field", "Value", "Description"],
              rows: [
                ["Country/region", "FAE (Faerûn)", "Choose \"FAE\" from the dropdown and apply the filter"],
                ["State", "TN", "Enter the code for The North"],
                ["Description", "The North", "Name the province"]
              ]
            },
            how: "Using the **Address setup** form, we will create a new record and populate its key fields, including **Country/region**, **State** and **Description**.",
            steps: [
              NAV_STEP,
              { a: "Select the **State/province** tab", d: "This shows all defined states/provinces." },
              { a: "Set the **Country/region** to `FAE (Faerûn)`", d: "Choose \"FAE\" from the dropdown and apply the filter." },
              { a: "Click **New**", d: "Start a new province record." },
              { a: "Set **State** = `TN`", d: "Enter the code for The North." },
              { a: "Set **Description** = `The North`", d: "Name the province." },
              { a: "Click **Save**", d: "Commit your changes." },
              { a: "Repeat steps 4 to 7 for the provinces in the table below", d: "Add each province below." }
            ],
            extraTable: {
              title: "Additional provinces",
              columns: ["State", "Description"],
              rows: [["SC", "Sword Coast"], ["TS", "Trackless Sea"], ["WH", "Western Heartlands"]]
            },
            review: "We have configured the foundational provinces for Faerûn, enabling accurate regional address management. These provinces are the geographic framework for all city and district records that follow."
          },
          {
            id: "t2",
            title: "Import Remaining Provinces via Excel",
            intro: [
              "When configuring numerous provinces, manual entry is time-consuming and prone to error. By leveraging Excel integration, we can import many provinces into the system at once, significantly streamlining setup.",
              "This task uses the **Office Integration** menu on Address setup to download a template, add the province rows and publish them back into Dynamics 365."
            ],
            objective: "Use Excel integration to bulk-import the remaining Faerûn provinces, including Amn, Baldur's Gate, Chult, Icewind Dale and others.",
            fields: {
              title: "Remaining provinces",
              columns: ["Country/region", "State", "Description"],
              copy: true,
              rows: [
                ["FAE", "EH", "Eastern Heartlands"],
                ["FAE", "AM", "Amn"],
                ["FAE", "BG", "Baldur's Gate"],
                ["FAE", "CH", "Chult"],
                ["FAE", "DA", "Dalelands"],
                ["FAE", "DE", "Deepwilds"],
                ["FAE", "DR", "Dragon Coast"],
                ["FAE", "EL", "Elven Woods"],
                ["FAE", "IL", "Icewind Dale"],
                ["FAE", "LA", "Lake of Steam"],
                ["FAE", "LU", "Luskan"],
                ["FAE", "MO", "Moonsea"],
                ["FAE", "NE", "Netheril"],
                ["FAE", "SE", "Sea of Fallen Stars"],
                ["FAE", "TU", "Turmish"]
              ]
            },
            how: "We will open Address setup, launch the Excel integration, apply the required design change, add the rows and publish them. Each action builds on the previous one.",
            notes: [
              { type: "tip", text: "Use **Copy for Excel** on the table above to copy the rows as tab-separated text, then paste them straight into the worksheet at step 8." }
            ],
            steps: [
              NAV_STEP,
              { a: "Click **Office Integration > States (unfiltered)**", d: "Launches Excel integration." },
              { a: "Click **Download**", d: "Downloads the Excel template." },
              { a: "Open the file and click **Design**", d: "Enables customization of the fields." },
              { a: "Click **Edit**, then add the **Name** field", d: "Adds the province description to the template." },
              { a: "Click **Update** and then **Yes**", d: "Applies design changes." },
              { a: "Click **Done** and refresh (↻)", d: "Updates the worksheet with current data." },
              { a: "Add the **new province rows**", d: "Use the table above for the bulk values." },
              { a: "Click **Publish**", d: "Pushes the new provinces into Dynamics 365." }
            ],
            review: "We have imported the complete set of Faerûnian provinces via Excel, demonstrating how bulk data entry can dramatically streamline system configuration. All provinces are now available in address records and geographic filtering."
          }
        ],
        practice: [
          {
            type: "form",
            title: "Create the first province",
            intro: "Create the record for The North on the State/province tab.",
            tab: "State/province",
            fields: [
              { id: "country", label: "Country/region", kind: "select", options: ["", "FAE (Faerûn)", "KAR (Kara-Tur)", "US (United States)"], expected: "FAE (Faerûn)" },
              { id: "state", label: "State", expected: "TN" },
              { id: "desc", label: "Description", expected: "The North" }
            ],
            success: "Province record complete. Save it, then repeat for SC, TS and WH."
          },
          {
            type: "drill",
            title: "Province code drill",
            intro: "Type the two-letter state code for each province.",
            items: [
              { prompt: "Sword Coast", answer: "SC" },
              { prompt: "Trackless Sea", answer: "TS" },
              { prompt: "Western Heartlands", answer: "WH" },
              { prompt: "Eastern Heartlands", answer: "EH" },
              { prompt: "Amn", answer: "AM" },
              { prompt: "Baldur's Gate", answer: "BG" },
              { prompt: "Chult", answer: "CH" },
              { prompt: "Dalelands", answer: "DA" },
              { prompt: "Icewind Dale", answer: "IL" },
              { prompt: "Luskan", answer: "LU" },
              { prompt: "Moonsea", answer: "MO" },
              { prompt: "Sea of Fallen Stars", answer: "SE" }
            ],
            success: "Province codes mastered."
          }
        ],
        quiz: [
          {
            q: "What state code does the lab use for The North?",
            options: ["TN", "NO", "NT", "NR"],
            answer: 0,
            why: "TN is entered as the State value for The North."
          },
          {
            q: "Which tab holds the province records?",
            options: ["State/province", "Country/region", "Address format", "City"],
            answer: 0,
            why: "Select the State/province tab, then filter by Country/region."
          },
          {
            q: "Which menu command starts the Excel bulk import?",
            options: ["Office Integration > States (unfiltered)", "Export > Faerûn", "Data management > Import", "Advanced filter > Excel"],
            answer: 0,
            why: "Office Integration > States (unfiltered) launches the Excel integration."
          },
          {
            q: "Which field do you add to the Excel template with Design > Edit so the province description can be imported?",
            options: ["Name", "Country", "Currency", "Region ID"],
            answer: 0,
            why: "Adding the Name field puts the province description into the template."
          },
          {
            q: "After adding rows in the worksheet, what pushes them into Dynamics 365?",
            options: ["Publish", "Save As", "Refresh", "Update"],
            answer: 0,
            why: "Publish sends the new rows to Dynamics 365. Refresh only pulls current data into the sheet."
          }
        ],
        wrapup: [
          "Our configuration of Faerûn's provinces is now complete. This structured geographical setup ensures precise and consistent address management for all customer, vendor and employee records within the Waterdeep Trading Company.",
          "By clearly defining provincial boundaries within Dynamics 365, we have established a solid foundation for accurate reporting, streamlined logistics and effective compliance throughout our Faerûnian operations."
        ],
        award: {
          xp: 344,
          story: "We've earned 344 XP for mapping the provinces of Faerûn within the sacred ledgers of Dynamics 365. From the frigid peaks of Icewind Dale to the steam-wreathed shores of Turmish, our cartographic precision ensures that every scroll, invoice and shipment is guided by regional truth. The Lords of the Sword Coast commend our efforts: never again shall a crate go astray in the Trackless Sea.",
          rows: [
            ["Base Task XP", "Core configuration of states/provinces under a custom country code", "100 XP"],
            ["Subtask: Add Manual Provinces", "Entering The North, Sword Coast, Trackless Sea, Western Heartlands", "40 XP"],
            ["Subtask: Excel Integration Setup", "Using Office Integration, template download, and design edit", "30 XP"],
            ["Subtask: Bulk Upload via Excel", "Populating 13 additional provinces with correct codes and names", "65 XP"],
            ["Complexity Multiplier (25%)", "Integration of manual and bulk methods; critical for global address structure", "+59 XP"],
            ["Lore Integration Bonus", "Alignment with Faerûnian geography; naming and regional context", "+50 XP"]
          ],
          closing: "Let it be known in the guild halls and merchant registers: Faerûn is now fully charted within the system, and all who navigate the ledgers shall find their way."
        }
      },

      /* ------------------------------------------------------------------ LAB 4 */
      {
        id: "lab-04",
        number: 4,
        title: "Cities",
        short: "Add the trade hubs of the Sword Coast and beyond",
        xp: 397,
        briefing: {
          intro: [
            "In Dynamics 365 Finance and Supply Chain Management, **city records** are part of the global address setup and are required to support accurate address entry for customers, vendors, warehouses and transportation planning. Each city is associated with a country/region and province, enabling the system to validate and structure addresses consistently.",
            "For the Waterdeep Trading Company, defining the prominent cities of Faerûn ensures that every trade route, customer address and shipping destination is recognized. From **Waterdeep** itself, the crown jewel of the Sword Coast, to **Baldur's Gate** and **Neverwinter**, each city record enables efficient logistics, accurate tax application and reliable freight estimation.",
            "In this lab, we will add city records for key Faerûnian locations within the Sword Coast province."
          ],
          overview: "We will begin by adding three of the most prominent cities, Waterdeep, Baldur's Gate and Neverwinter, all within the Sword Coast province. Additional cities, including those from distant provinces and even planar realms, can be configured using the same method.",
          objective: [
            "Add new city records for the FAE country code.",
            "Associate each city with the appropriate province.",
            "Support downstream processes such as order entry, shipping, address validation and regional taxation.",
            "Extend city configuration to include optional Faerûnian and extraplanar trade hubs as needed."
          ]
        },
        reference: {
          intro: "As the Waterdeep Trading Company expands beyond the Sword Coast, it becomes essential to register additional cities to support new trade routes, customer locations and warehouse destinations. The process mirrors the initial entries: repeat the configuration and assign the appropriate province.",
          tables: [
            {
              title: "Additional cities",
              columns: ["City", "Description", "Province (State)"],
              copy: true,
              rows: [
                ["Waterdeep", "", "SC"],
                ["Baldur's Gate", "", "SC"],
                ["Neverwinter", "", "SC"],
                ["Silverymoon", "The Gem of the North, city of magic", "The North"],
                ["Luskan", "Pirate port and former stronghold", "The North"],
                ["Daggerford", "Small but strategic caravan stop", "Sword Coast"],
                ["Elturel", "Twin-sunned capital, recently reclaimed", "Western Heartlands"],
                ["Berdusk", "Hub of Harpers and southern merchant lines", "Western Heartlands"],
                ["Scornubel", "River port and trade crossroad", "Western Heartlands"],
                ["Hillsfar", "Xenophobic city near the Moonsea", "Dalelands"],
                ["Suzail", "Capital of Cormyr, heart of the kingdom", "Cormyr"],
                ["Arabel", "Fortress-city in northern Cormyr", "Cormyr"],
                ["Tantras", "Religious city dedicated to Torm", "Vast"],
                ["Calaunt", "Trade city ruled by merchant lords", "Vast"],
                ["Sembia", "Wealthy trade nation's capital", "Sembia"],
                ["Yhaunn", "Eastern port with ties to Thay", "Sembia"],
                ["Myth Drannor", "Ruined elven capital being restored", "Dalelands"],
                ["Evereska", "Hidden mountain haven of the elves", "Western Heartlands"],
                ["Sigil", "Planar hub at the center of the multiverse", "Outlands (Planar)"],
                ["City of Brass", "Fire-plane trade capital of geniekind", "Elemental Plane of Fire"]
              ]
            }
          ],
          notes: [
            { type: "warn", text: "Some optional cities point to provinces that were not created in Lab 3, such as Cormyr, Vast, Sembia, Outlands (Planar) and Elemental Plane of Fire. Add those provinces first, using the same method as Lab 3, before you create the cities that reference them." }
          ]
        },
        tasks: [
          {
            id: "t1",
            title: "Add Cities to Faerûn",
            intro: [
              "To support accurate address management and logistics, cities must be explicitly configured. Each city record links to a province and country, enabling consistent selection during customer and vendor setup, warehouse creation and freight planning.",
              "Starting with **Waterdeep**, the beating heart of commerce, we will define each city's name, description and province association, so that Faerûnian trade routes, from the Sword Coast to the elemental planes, are fully represented in the system's address logic."
            ],
            objective: "Create city records for key Faerûn locations starting with Waterdeep, linking each city to its province and country code for proper address validation.",
            fields: {
              title: "First city: Waterdeep",
              columns: ["Field", "Value", "Description"],
              rows: [
                ["Country/Region", "FAE (Faerûn)", "Select from the dropdown and filter the city list for Faerûn"],
                ["City", "Waterdeep", "The main trade hub and headquarters of Waterdeep Trading Company"],
                ["Description", "Waterdeep", "Optional, but improves readability and reporting"],
                ["State/Province", "SC (Sword Coast)", "Associates the city with its regional authority"]
              ]
            },
            how: "Using the **Address setup** form, we will create a new record and populate its key fields, including **Country/Region**, **City**, **Description** and **State/Province**.",
            notes: [
              { type: "tip", text: "Repeat steps 5 to 9 for **Baldur's Gate** and **Neverwinter** (both SC), then for any optional cities in the reference table." }
            ],
            steps: [
              NAV_STEP,
              { a: "Select the **City** tab", d: "This view lets us configure valid cities used in the system." },
              { a: "Set the **Country/Region** to `FAE (Faerûn)`", d: "Select from the dropdown and filter the city list for Faerûn." },
              { a: "Click **Apply filter**", d: "This ensures we are only viewing or modifying cities for Faerûn." },
              { a: "Click **New** to add a city", d: "Begin creating a new city record." },
              { a: "Set the **City** to `Waterdeep`", d: "This is the main trade hub and headquarters of Waterdeep Trading Company." },
              { a: "Set the **Description** to `Waterdeep`", d: "Optional, but improves readability and reporting." },
              { a: "Set the **State/Province** to `SC (Sword Coast)`", d: "Associates the city with its regional authority." },
              { a: "Click **Save**", d: "Commits the city record to the system." }
            ],
            review: "We have added the first Faerûnian city records, enabling regionally aware address management. The city of Waterdeep is now a selectable value in all address fields linked to the Sword Coast."
          }
        ],
        practice: [
          {
            type: "form",
            title: "Create the city of Waterdeep",
            intro: "Create the first city record on the City tab.",
            tab: "City",
            fields: [
              { id: "country", label: "Country/Region", kind: "select", options: ["", "FAE (Faerûn)", "KAR (Kara-Tur)", "SIG (Sigil)"], expected: "FAE (Faerûn)" },
              { id: "city", label: "City", expected: "Waterdeep" },
              { id: "desc", label: "Description", expected: "Waterdeep" },
              { id: "state", label: "State/Province", kind: "select", options: ["", "SC (Sword Coast)", "TN (The North)", "TS (Trackless Sea)", "WH (Western Heartlands)"], expected: "SC (Sword Coast)" }
            ],
            success: "City record complete. Save it, then repeat for Baldur's Gate and Neverwinter."
          },
          {
            type: "drill",
            title: "City-to-province matching",
            intro: "Choose the province each city belongs to, using the optional cities reference table.",
            items: [
              { prompt: "Baldur's Gate", kind: "select", options: ["The North", "Sword Coast", "Western Heartlands", "Dalelands", "Cormyr", "Sembia"], answer: "Sword Coast", alt: ["SC"] },
              { prompt: "Silverymoon", kind: "select", options: ["The North", "Sword Coast", "Western Heartlands", "Dalelands", "Cormyr", "Sembia"], answer: "The North" },
              { prompt: "Elturel", kind: "select", options: ["The North", "Sword Coast", "Western Heartlands", "Dalelands", "Cormyr", "Sembia"], answer: "Western Heartlands" },
              { prompt: "Hillsfar", kind: "select", options: ["The North", "Sword Coast", "Western Heartlands", "Dalelands", "Cormyr", "Sembia"], answer: "Dalelands" },
              { prompt: "Suzail", kind: "select", options: ["The North", "Sword Coast", "Western Heartlands", "Dalelands", "Cormyr", "Sembia"], answer: "Cormyr" },
              { prompt: "Yhaunn", kind: "select", options: ["The North", "Sword Coast", "Western Heartlands", "Dalelands", "Cormyr", "Sembia"], answer: "Sembia" }
            ],
            success: "Every city is placed in its province."
          }
        ],
        quiz: [
          {
            q: "Which province is the city of Waterdeep associated with in this lab?",
            options: ["SC (Sword Coast)", "TN (The North)", "WH (Western Heartlands)", "TS (Trackless Sea)"], answer: 0,
            why: "Waterdeep, Baldur's Gate and Neverwinter are all configured under SC (Sword Coast)."
          },
          {
            q: "What is the purpose of setting the Country/Region and clicking Apply filter before adding cities?",
            options: ["To make sure you only view and modify cities for Faerûn", "To import cities from Excel", "To activate the country code", "To copy cities between legal entities"],
            answer: 0,
            why: "Filtering to FAE keeps your work scoped to Faerûn's cities."
          },
          {
            q: "Silverymoon appears in the optional cities table. Which province does it belong to?",
            options: ["The North", "Sword Coast", "Dalelands", "Vast"], answer: 0,
            why: "Silverymoon, the Gem of the North, is listed under The North."
          },
          {
            q: "An optional city references a province you have not created yet. What should you do first?",
            options: ["Create the province, then add the city", "Skip the province and leave it blank", "Delete the country code", "Use a different country"],
            answer: 0,
            why: "A city must be associated with an existing province, so add the missing province first."
          }
        ],
        wrapup: [
          "We have configured key city records for the FAE country code, starting with Waterdeep, Baldur's Gate and Neverwinter under the Sword Coast province. These entries support accurate address selection across customer, vendor and warehouse records, and serve as anchor points for freight estimation, tax jurisdiction assignment and future geo-routing.",
          "By extending the setup to additional cities such as Silverymoon, Suzail and even planar hubs like Sigil, we have laid the groundwork for a scalable and immersive address framework. City configuration is complete, establishing a vital layer of geographic structure within our Dynamics 365 environment."
        ],
        award: {
          xp: 397,
          story: "We've earned 397 XP for configuring the cities of Faerûn within the Global Address Book of Dynamics 365, an undertaking that charts the way for enchanted caravans, planar freight barges and blessed inventory scrolls. The roads are mapped, the portals are aligned, and the Waterdeep Trading Company may now deliver to every corner of the Realms and beyond.",
          rows: [
            ["Base Task XP", "Creating city records tied to country/province in Global Address Book", "100 XP"],
            ["Subtask: Filter to FAE", "Ensures city entries are scoped to Faerûn", "10 XP"],
            ["Subtask: Add Waterdeep", "Main hub and first city configured", "15 XP"],
            ["Subtask: Add Baldur's Gate", "Major coastal city, freight-heavy", "10 XP"],
            ["Subtask: Add Neverwinter", "High-value logistics and magical trade", "10 XP"],
            ["Subtask: Add 15 Optional Cities", "Diverse additions including extraplanar entries (15 × 7 XP avg)", "105 XP"],
            ["Subtask: Province Association", "Assigning correct province to each city", "20 XP"],
            ["Subtask: Descriptions for Cities", "Enhances usability and lore immersion", "20 XP"],
            ["Complexity Multiplier (30%)", "Address data drives downstream functions (shipping, tax, validation)", "+90 XP"],
            ["Lore Integration Bonus", "Extensive use of Faerûnian and extraplanar locations", "+17 XP"]
          ],
          closing: "The scribing is done. The cities of the Sword Coast and beyond are now etched into the firmament of our ledger. Onward, to the next configuration waypoint!"
        }
      },

      /* ------------------------------------------------------------------ LAB 5 */
      {
        id: "lab-05",
        number: 5,
        title: "Districts",
        short: "Give each ward of Waterdeep a digital identity",
        xp: 345,
        briefing: {
          intro: [
            "In Dynamics 365 Finance and Supply Chain Management, **districts** provide a layer of address granularity beneath the city level. By defining district records, organizations can apply region-specific business logic, streamline delivery routes and enhance address validation for transactions that require sub-city precision.",
            "For the Waterdeep Trading Company, this means mapping the famous Wards of Waterdeep into the system, from Castle Ward and Dock Ward to Sea Ward and Trades Ward. Each ward is a distinct commercial and cultural zone.",
            "In this lab, we will configure district-level address segmentation for the city of Waterdeep."
          ],
          overview: "We will configure the city districts, known as Wards, for Waterdeep, the commercial hub of the Sword Coast province. By reflecting the divisions of Waterdeep, the Waterdeep Trading Company can apply region-specific business logic and be sure a shipment of enchanted lanterns bound for Sea Ward is not routed to Field Ward's outskirts.",
          objective: [
            "Establish district-level address segmentation for Waterdeep within the legal entity Waterdeep Trading Company, enabling:",
            "- Accurate city-level address validation",
            "- Region-based service logic (for example, different couriers per ward)",
            "- Enhanced customer service and reporting capabilities"
          ]
        },
        reference: {
          intro: "Across Faerûn, urban centers like Neverwinter, Silverymoon and Baldur's Gate each have their own districts, such as the Scholar's Quarter of Silverymoon or the Outer City of Baldur's Gate. After configuring Waterdeep's wards, extend the same logic to other cities by repeating the district setup.",
          tables: [
            {
              title: "Waterdeep wards",
              columns: ["District name", "Description"],
              copy: true,
              rows: [
                ["Castle Ward", ""],
                ["Dock Ward", ""],
                ["Field Ward", ""],
                ["North Ward", ""],
                ["Sea Ward", ""],
                ["South Ward", ""],
                ["Trades Ward", "Trade Ward"]
              ]
            }
          ]
        },
        tasks: [
          {
            id: "t1",
            title: "Configure Waterdeep City Districts",
            intro: [
              "Waterdeep is a tapestry of distinct Wards, each pulsing with its own purpose, from the noble estates of North Ward to the busy Dock Ward where ships unload rare goods from Chult and Kara-Tur.",
              "These Wards must be mirrored in Dynamics 365 as city districts so the system can route deliveries, assign shipping providers by destination and apply localized business logic such as ward-specific service agreements or delivery cutoffs. We begin with the first district, **Castle Ward**."
            ],
            objective: "Define Waterdeep's city districts (Wards) starting with Castle Ward, enabling ward-level precision in address management and service routing.",
            fields: {
              title: "First district: Castle Ward",
              columns: ["Field", "Value", "Description"],
              rows: [
                ["Country/region", "FAE (Faerûn)", "Filters results to Faerûnian data"],
                ["State/province", "SC (Sword Coast)", "Points to Waterdeep's province"],
                ["City", "Waterdeep", "Specifies the city for the new ward"],
                ["District", "Castle Ward", "The name of the first ward"],
                ["Description", "Castle Ward", "Description for clarity"]
              ]
            },
            how: "Using the **Address setup** form, we will create a new record and populate its key fields, including **Country/region**, **State/province**, **City**, **District** and **Description**.",
            notes: [
              { type: "tip", text: "Repeat steps 3 to 9 for the remaining six wards in the reference table: Dock Ward, Field Ward, North Ward, Sea Ward, South Ward and Trades Ward." }
            ],
            steps: [
              NAV_STEP,
              { a: "Select the **District** tab", d: "This displays the existing city districts." },
              { a: "Click **New**", d: "Begin creating a new district record." },
              { a: "Set the **Country/region** to `FAE (Faerûn)`", d: "Filters results to Faerûnian data." },
              { a: "Set the **State/province** to `SC (Sword Coast)`", d: "Points to Waterdeep's province." },
              { a: "Set the **City** to `Waterdeep`", d: "Specifies the city for the new ward." },
              { a: "Set the **District** to `Castle Ward`", d: "The name of the first ward." },
              { a: "Set the **Description** to `Castle Ward`", d: "Description for clarity." },
              { a: "Click **Save**", d: "Saves the new district record." }
            ],
            review: "We have configured the first Waterdeep district, establishing ward-level granularity in the system's address structure. Castle Ward is now a selectable district, paving the way for precise deliveries and localized business logic across the City of Splendors."
          }
        ],
        practice: [
          {
            type: "form",
            title: "Create Castle Ward",
            intro: "Create the first district record on the District tab.",
            tab: "District",
            fields: [
              { id: "country", label: "Country/region", kind: "select", options: ["", "FAE (Faerûn)", "KAR (Kara-Tur)"], expected: "FAE (Faerûn)" },
              { id: "state", label: "State/province", kind: "select", options: ["", "SC (Sword Coast)", "TN (The North)", "WH (Western Heartlands)"], expected: "SC (Sword Coast)" },
              { id: "city", label: "City", kind: "select", options: ["", "Waterdeep", "Baldur's Gate", "Neverwinter", "Silverymoon"], expected: "Waterdeep" },
              { id: "district", label: "District", expected: "Castle Ward" },
              { id: "desc", label: "Description", expected: "Castle Ward" }
            ],
            success: "District record complete. Save it, then repeat for the other six wards."
          },
          {
            type: "pick",
            title: "Which are the wards of Waterdeep?",
            intro: "Select every district that belongs to **Waterdeep**. Beware: some options belong to other cities.",
            options: ["Castle Ward", "Dock Ward", "Field Ward", "North Ward", "Sea Ward", "South Ward", "Trades Ward", "Scholar's Quarter", "Outer City"],
            correct: ["Castle Ward", "Dock Ward", "Field Ward", "North Ward", "Sea Ward", "South Ward", "Trades Ward"],
            success: "Seven wards identified. The Scholar's Quarter belongs to Silverymoon and the Outer City to Baldur's Gate."
          }
        ],
        quiz: [
          {
            q: "Which tab holds the city district records?",
            options: ["District", "City", "State/province", "Country/region"], answer: 0,
            why: "Districts are created on the District tab of Address setup."
          },
          {
            q: "Which fields locate the city a new district belongs to?",
            options: ["Country/region, State/province and City", "Only District", "Address format and Description", "Postal code and Region"], answer: 0,
            why: "The district is anchored by Country/region (FAE), State/province (SC) and City (Waterdeep)."
          },
          {
            q: "How many wards of Waterdeep does the reference table define?",
            options: ["7", "5", "9", "12"], answer: 0,
            why: "Castle, Dock, Field, North, Sea, South and Trades Ward make seven."
          },
          {
            q: "Which business benefit does ward-level setup enable?",
            options: ["Region-based service logic, such as different couriers per ward", "Automatic currency conversion", "Faster Excel imports", "Language translation"], answer: 0,
            why: "District granularity supports ward-specific couriers, service agreements and delivery cutoffs."
          }
        ],
        wrapup: [
          "We have configured all of Waterdeep's principal wards as city districts within Dynamics 365. With Castle Ward, Dock Ward and their kin embedded in the system's address logic, our legal entity can distinguish between shipping destinations with precision and apply ward-specific service rules.",
          "This setup strengthens logistics, reduces delivery errors and ensures that customer records reflect the civic structure of Faerûn's largest city. It also lays the groundwork for extending the structure to other cities such as the arcane towers of Silverymoon or the shadowed quarters of Baldur's Gate. **Greta Ironfist** can now deploy her caravans and griffon couriers with full confidence."
        ],
        award: {
          xp: 345,
          story: "We've earned 345 XP for configuring the City Districts (Wards) of Waterdeep within Dynamics 365, a feat of geographical precision. Our careful orchestration ensures scrolls, spell components and shipments reach the right ward.",
          rows: [
            ["Base Task XP", "Core configuration task for city districts", "100 XP"],
            ["Subtask: Navigate to Address Setup", "Essential navigation action", "10 XP"],
            ["Subtask: Create Castle Ward", "Foundational record creation", "20 XP"],
            ["Subtask: Add Remaining Wards", "Configuration of additional city districts (6 wards × 10 XP each)", "60 XP"],
            ["Subtask: Save Records", "Commit configuration to system", "10 XP"],
            ["Complexity Multiplier (40%)", "Moderate complexity with significant operational impact", "+80 XP"],
            ["Lore Integration Bonus", "Rich embedding within Waterdeep's Faerûnian narrative", "+65 XP"]
          ],
          closing: "The ledgers gleam with precision. With 345 XP secured, Districts is now firmly woven into the Waterdeep Trading Company's operations. Onward, adventurer."
        }
      },

      /* ------------------------------------------------------------------ LAB 6 */
      {
        id: "lab-06",
        number: 6,
        title: "Postal Codes",
        short: "Tie region, city and ward together in one code",
        xp: 372,
        briefing: {
          intro: [
            "**Postal codes** in Dynamics 365 Finance and Supply Chain Management provide structured geographic identifiers that link addresses to specific regions, cities and districts. They play a vital role in address validation, freight calculations and regional tax rules, ensuring that every address resolves to a precise and consistent location.",
            "For the Waterdeep Trading Company, configuring postal codes for Faerûn is the final layer of the address localization framework. The structured format combines a regional identifier with city and ward abbreviations, such as `01-WDEP-CW` for Castle Ward in Waterdeep. With these codes in place, every purchase order, invoice and shipping document carries a complete, validated Faerûnian address.",
            "In this lab, we will configure postal codes for key Faerûn locations, linking them to the appropriate country/region, province and city records."
          ],
          overview: "Postal codes (or ZIP codes) link addresses to specific regions, cities and districts. Configuring them for Faerûn ensures that address validation, freight calculations and regional tax rules operate correctly across the Waterdeep Trading Company's operations.",
          objective: ["Configure postal codes for key Faerûn locations, linking them to the appropriate country/region, province and city records. This includes creating the primary code for Waterdeep (`01-WDEP-CW`) and additional codes for major cities along the Sword Coast."]
        },
        reference: {
          intro: "The Faerûn postal code is built from three parts joined with hyphens.",
          tables: [
            {
              title: "Anatomy of 01-WDEP-CW",
              columns: ["Part", "Example", "Meaning"],
              rows: [
                ["Region identifier", "01", "Regional identifier for the layered geography"],
                ["City abbreviation", "WDEP", "Waterdeep"],
                ["Ward abbreviation", "CW", "Castle Ward"]
              ]
            }
          ]
        },
        tasks: [
          {
            id: "t1",
            title: "Create the Waterdeep Postal Code",
            authored: true,
            intro: [
              "We will create the primary postal code for Waterdeep, `01-WDEP-CW`, and link it to the FAE country/region, the Sword Coast province and the Waterdeep city record built in the earlier labs. The same pattern is then repeated for other cities, such as Baldur's Gate, Silverymoon and Neverwinter."
            ],
            objective: "Create the postal code 01-WDEP-CW for Waterdeep and link it to the FAE country/region, the SC province and the Waterdeep city.",
            fields: {
              title: "Waterdeep postal code",
              columns: ["Field", "Value", "Description"],
              rows: [
                ["Country/region", "FAE (Faerûn)", "Key linkage to the custom geography"],
                ["ZIP/postal code", "01-WDEP-CW", "Region 01 + Waterdeep + Castle Ward"],
                ["City", "Waterdeep", "The city created in Lab 4"],
                ["State", "SC (Sword Coast)", "Waterdeep's province"]
              ]
            },
            how: "We will use the **ZIP/postal code** tab of the **Address setup** form to add the record.",
            notes: [
              { type: "warn", text: "The source lab describes the goal and the code format but does not include a click-by-click table. These steps follow the same Address setup pattern as the earlier labs. Field and tab labels can differ slightly between Dynamics 365 versions, so confirm them in your own environment." }
            ],
            steps: [
              NAV_STEP,
              { a: "Select the **ZIP/postal code** tab", d: "This lists the postal codes already defined in the system." },
              { a: "Click **New**", d: "Begin creating a new postal code record." },
              { a: "Set the **Country/region** to `FAE (Faerûn)`", d: "Key linkage to the custom geography." },
              { a: "Set the **ZIP/postal code** to `01-WDEP-CW`", d: "Region 01, Waterdeep (WDEP), Castle Ward (CW)." },
              { a: "Set the **City** to `Waterdeep`", d: "Maps the code to the city configured in Lab 4." },
              { a: "Set the **State** to `SC (Sword Coast)`", d: "Maps the code to the province configured in Lab 3." },
              { a: "Optionally map the code to **Castle Ward**, if your version exposes a district or description field", d: "Adds granularity and clarity for address forms." },
              { a: "Click **Save**", d: "Commits the postal code record." }
            ],
            review: "We have created the primary Waterdeep postal code and linked it to its country/region, province and city, completing the address hierarchy for Castle Ward."
          },
          {
            id: "t2",
            title: "Configure Postal Codes for Other Sword Coast Cities",
            authored: true,
            intro: [
              "With the pattern established, add postal codes for **Baldur's Gate**, **Silverymoon** and **Neverwinter**. Keep the same structure: a region identifier, a short city abbreviation and, where it applies, a ward abbreviation."
            ],
            objective: "Create additional postal codes for Baldur's Gate, Silverymoon and Neverwinter, each linked to the correct country/region, province and city.",
            notes: [
              { type: "tip", text: "Choose abbreviations you can document and reuse, for example four letters for a city as in WDEP. Silverymoon sits in The North, while Baldur's Gate and Neverwinter sit in the Sword Coast." }
            ],
            steps: [
              { a: "Repeat the steps from the Waterdeep postal code task", d: "Use the same Address setup > ZIP/postal code tab flow.", path: NAV_PATH, search: "Address setup" },
              { a: "Set the **ZIP/postal code** using the region-city-ward pattern", d: "Follow the 01-WDEP-CW structure with the correct abbreviations." },
              { a: "Link each code to its **City** and **State**", d: "Baldur's Gate and Neverwinter use SC. Silverymoon uses The North." },
              { a: "Click **Save** after each record", d: "Commit each postal code before starting the next." }
            ],
            review: "Every key Sword Coast city now has a structured postal code, giving address validation, freight calculation and tax logic a consistent anchor."
          }
        ],
        practice: [
          {
            type: "compose",
            title: "Build the postal code",
            intro: "Compose the postal code for **Castle Ward in Waterdeep, region 01**. The preview updates as you type.",
            separator: "-",
            parts: [
              { id: "region", label: "Region identifier", placeholder: "01" },
              { id: "city", label: "City abbreviation", placeholder: "WDEP" },
              { id: "ward", label: "Ward abbreviation", placeholder: "CW" }
            ],
            expected: "01-WDEP-CW",
            success: "That is the Castle Ward code, **01-WDEP-CW**."
          },
          {
            type: "form",
            title: "Create the postal code record",
            intro: "Fill in the new record on the ZIP/postal code tab.",
            tab: "ZIP/postal code",
            fields: [
              { id: "country", label: "Country/region", kind: "select", options: ["", "FAE (Faerûn)", "KAR (Kara-Tur)"], expected: "FAE (Faerûn)" },
              { id: "zip", label: "ZIP/postal code", expected: "01-WDEP-CW" },
              { id: "city", label: "City", kind: "select", options: ["", "Waterdeep", "Baldur's Gate", "Neverwinter"], expected: "Waterdeep" },
              { id: "state", label: "State", kind: "select", options: ["", "SC (Sword Coast)", "TN (The North)", "WH (Western Heartlands)"], expected: "SC (Sword Coast)" }
            ],
            success: "Postal code record complete. Click **Save** in Dynamics 365."
          }
        ],
        quiz: [
          {
            q: "In the code 01-WDEP-CW, what does CW stand for?",
            options: ["Castle Ward", "City of Waterdeep", "Country Wide", "Common Waypoint"], answer: 0,
            why: "CW is the ward abbreviation for Castle Ward."
          },
          {
            q: "In the code 01-WDEP-CW, what does WDEP stand for?",
            options: ["Waterdeep", "Western Depths", "Ward Deployment", "Wide Depot"], answer: 0,
            why: "WDEP is the city abbreviation for Waterdeep."
          },
          {
            q: "What does the leading 01 represent?",
            options: ["A regional identifier", "The number of wards", "A tax rate", "The legal entity ID"], answer: 0,
            why: "The structured format combines a regional identifier with city and ward abbreviations."
          },
          {
            q: "Which downstream functions rely on postal codes?",
            options: ["Address validation, freight calculations and regional tax rules", "Currency conversion only", "Language translation", "Calendar setup"], answer: 0,
            why: "Postal codes tie addresses to a precise location that these processes use."
          }
        ],
        wrapup: [
          "Our postal code configuration is now complete, providing a consistent and scalable foundation for geographic precision within Faerûn. By implementing structured codes like `01-WDEP-CW`, we have aligned address data with the realm's regional and municipal structure, enabling smarter logistics, cleaner data and enhanced customer service.",
          "As our operations grow, this framework will support more advanced features such as automated freight calculations, district-based service areas and compliance with regional tax rules. With every city and ward now mapped into the system, the Waterdeep Trading Company is well-positioned to navigate both mundane trade routes and magical supply chains."
        ],
        award: {
          xp: 372,
          story: "We've earned 372 XP for configuring the structured postal code system of Faerûn, laying the foundation for precise deliveries, regional tax logic and the alignment of scrolls, spices and sword shipments. The High Couriers of Waterdeep salute our foresight; not a single rune-etched box will be lost to the mists now.",
          rows: [
            ["Base Task XP", "Initial setup of a custom Faerûnian postal code system", "100 XP"],
            ["Subtask: Create Zip Code 01-WDEP-CW", "Manual entry, regional link, and description setup", "25 XP"],
            ["Subtask: Assign Country/Region (FAE)", "Key linkage to custom geography", "15 XP"],
            ["Subtask: Map to Province & City", "Precision alignment with Sword Coast and Waterdeep", "20 XP"],
            ["Subtask: Optional District Mapping", "Additional granularity (e.g., Castle Ward)", "10 XP"],
            ["Subtask: Add Descriptions for Clarity", "Enhances user readability across address forms", "10 XP"],
            ["Subtask: Configure 3 Additional Cities", "Zip codes for Baldur's Gate, Silverymoon, Neverwinter", "60 XP (20 x 3)"],
            ["Complexity Multiplier (25%)", "Ties into logistics, taxation, validation, and automation", "+60 XP"],
            ["Lore Integration Bonus", "Faerûn-specific structure (e.g., 01-WDEP-CW), ward alignment, trade route support", "+72 XP"]
          ],
          closing: "Our postal grid now weaves through the continent like a net of silk and steel, binding commerce and magic alike."
        }
      }
    ],

    summary: {
      intro: "This module detailed the step-by-step process for localizing address data within **Dynamics 365 Finance and Supply Chain Management** to support the fictional realm of **Faerûn**. Key components of the configuration included:",
      points: [
        { title: "Country/Region Code", text: "Creation of a custom code \"FAE\" for Faerûn, serving as the foundation for all address-related records." },
        { title: "Address Format", text: "A unique structure displaying addresses as Street, District (Ward), City, Province (State) and Country/Region, ensuring accurate document generation and regulatory compliance." },
        { title: "Provinces", text: "Manual entry and Excel import of key Faerûnian provinces such as the Sword Coast, The North and Western Heartlands." },
        { title: "Cities", text: "Major urban centers, including Waterdeep, Baldur's Gate and Neverwinter, tied to their provinces to support address validation, logistics and tax calculation." },
        { title: "Districts (Wards)", text: "Intra-city districts, particularly for Waterdeep, enabling precise deliveries, region-specific business logic and improved customer service." },
        { title: "Postal Codes", text: "A structured format combining regional and city/ward identifiers (for example 01-WDEP-CW), supporting freight routing and tax zoning." },
        { title: "Extended Realms", text: "Optional country/region codes for extraplanar locations such as Sigil, Mechanus and the City of Brass, enabling multiversal trade and document support." }
      ],
      outro: "Together, these configurations transform Dynamics 365 into a realm-aware system ready to support both magical and mundane operations for the Waterdeep Trading Company and beyond.",
      finalQuiz: [
        {
          q: "Put the address hierarchy in order, from broadest to most specific.",
          options: [
            "Country/region, State/province, City, District",
            "District, City, State/province, Country/region",
            "City, Country/region, District, State/province",
            "State/province, Country/region, District, City"
          ],
          answer: 0,
          why: "Provinces belong to a country, cities to a province, and districts to a city."
        },
        {
          q: "Which lab must come first, because the country/region record references it?",
          options: ["Address Formats", "Postal Codes", "Districts", "Cities"],
          answer: 0,
          why: "The FAE country/region links to the FAE address format, so the format is created first."
        },
        {
          q: "Which configuration approach is best for loading many provinces at once?",
          options: ["Excel integration via Office Integration", "Typing each record by hand", "Deleting and re-creating the country", "Editing the address format"],
          answer: 0,
          why: "Excel integration saves time and reduces typing errors on bulk data."
        },
        {
          q: "Which of these is a valid Waterdeep postal code from this module?",
          options: ["01-WDEP-CW", "WDEP/01/CW", "CW-WDEP-01", "FAE-01"],
          answer: 0,
          why: "The pattern is region identifier, city abbreviation, ward abbreviation, separated by hyphens."
        },
        {
          q: "Total XP available in this module?",
          options: ["2,120 XP", "1,000 XP", "3,500 XP", "288 XP"],
          answer: 0,
          why: "288 + 374 + 344 + 397 + 345 + 372 = 2,120 XP across the six labs."
        }
      ]
    }
  });
})();

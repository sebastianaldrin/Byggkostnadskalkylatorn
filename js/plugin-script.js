/*
 * Proprietär Licensversion 1.0
 *
 * Copyright [2024] [John Sebastian Aldrin]
 *
 * Alla rättigheter förbehållna.
 *
 * Tillåtelse att använda, kopiera, modifiera och distribuera denna kod eller delar av den är endast tillåtet med skriftligt tillstånd från upphovsrättsinnehavaren.
 */

// Materialalternativ per kategori
var materialOptions = {
    "Altan": ["Tryckimpregnerat-28x120", "Tryckimpregnerat-34x145", "Kärnfuru", "Ädelträ", "Träkomposit"],
    "Inomhusmålning": ["Nej", "Små", "Medel", "Stora"],
    "Fasadmålning": ["Alkyd/Akrylat", "Slamfärg", "Linoljefärg"]
};

// Priser per kategori (arbetskostnad per timme)
var prices = {
    "Altan": 750,
    "Inomhusmålning": 450, // Genomsnittlig arbetskostnad
    "Fasadmålning": 650
};

// Material och arbetsfaktorer
var materialPrices = {
    "Tryckimpregnerat-28x120": {
        "price": 189,
        "labor_factor": 1.2,
        "description": "Standard tryckimpregnerad furu 28x120mm. Mest vanlig typ av trall, bra hållbarhet och prisvärd. Kräver regelbundet underhåll för att behålla utseendet."
    },
    "Tryckimpregnerat-34x145": {
        "price": 239,
        "labor_factor": 1.3,
        "description": "Bredare tryckimpregnerad furu 34x145mm. Ger ett mer exklusivt intryck, särskilt lämplig för större altaner. Kräver regelbundet underhåll."
    },
    "Kärnfuru": {
        "price": 599,
        "labor_factor": 1.4,
        "description": "Naturligt motståndskraftig mot röta och skadedjur. Kräver minst 30 cm avstånd från marken för ventilation. Bra miljöval."
    },
    "Ädelträ": {
        "price": 899,
        "labor_factor": 1.5,
        "description": "Exklusivt och elegant utseende. Naturligt väderbeständigt. Perfekt för påkostade altaner. Kräver speciell skötsel."
    },
    "Träkomposit": {
        "price": 799,
        "labor_factor": 1.3,
        "description": "Hållbart material som kräver minimalt underhåll. Högre initial kostnad men längre livslängd och mindre underhåll."
    },
    "Nej": {
        "price": 500, // Materialkostnad per m² (12% av totalkostnaden)
        "labor_price": 3667, // Arbetskostnad per m² före ROT (88% av totalkostnaden)
        "description": "Ingen spackling behövs. Väggarna är i mycket gott skick och redo för målning."
    },
    "Små": {
        "price": 700, // Materialkostnad per m² (12% av totalkostnaden)
        "labor_price": 5133, // Arbetskostnad per m² före ROT (88% av totalkostnaden)
        "description": "Mindre reparationer och spackling på upp till 20% av ytan. Väggar i generellt gott skick."
    },
    "Medel": {
        "price": 800, // Materialkostnad per m² (12% av totalkostnaden)
        "labor_price": 5867, // Arbetskostnad per m² före ROT (88% av totalkostnaden)
        "description": "Reparationer och spackling på upp till 50% av ytan. Vissa områden kräver mer arbete."
    },
    "Stora": {
        "price": 900, // Materialkostnad per m² (12% av totalkostnaden)
        "labor_price": 6600, // Arbetskostnad per m² före ROT (88% av totalkostnaden)
        "description": "Omfattande reparationer på mer än 50% av ytan. Kan inkludera borttagning av tapeter och större lagningar."
    },
    "Alkyd/Akrylat": {
        "price": 300, // Pris per liter
        "coverage": 7, // Kvadratmeter per liter
        "labor_factor": 1.0,
        "description": "Systemmålning med alkyd- och akrylatfärger. Inkluderar grundolja för utsatta områden, grundmålning vid behov, och två strykningar. Ger ett hållbart resultat och bra täckning."
    },
    "Slamfärg": {
        "price": 150, // Pris per liter
        "coverage": 5, // Kvadratmeter per liter
        "labor_factor": 0.8, // Enklare att underhålla och måla
        "description": "Traditionell och pålitlig färgtyp (t.ex. falu rödfärg). Billigare alternativ med enklare underhåll. Kräver mindre förarbete, appliceras med rödfärgspensel."
    },
    "Linoljefärg": {
        "price": 450, // Pris per liter
        "coverage": 8, // Kvadratmeter per liter
        "labor_factor": 1.2, // Kräver mer noggrannt arbete
        "description": "Traditionell färgtyp som kräver noggrannt förarbete. Färgen ska arbetas in ordentligt i underlaget. Kräver grundmålning på nytt virke, helst två strykningar."
    }
};

// Funktion för att uppdatera formulärfält baserat på vald kategori
function updateFormFields() {
    var categorySelect = document.getElementById("job_category");
    var grundarbeteContainer = document.getElementById("grundarbete-container");
    var materialContainer = document.getElementById("material-container");
    var selectedCategory = categorySelect.value;

    // Återställ alla fält
    resetFormFields();

    if (selectedCategory === "Inomhusmålning") {
        // För inomhusmålning: Visa grundarbete, dölj material
        grundarbeteContainer.style.display = "block";
        materialContainer.style.display = "none";
    } else {
        // För andra kategorier: Dölj grundarbete, visa material
        grundarbeteContainer.style.display = "none";
        materialContainer.style.display = "block";
        updateMaterialOptions();
    }
}

// Funktion för att återställa formulärfält
function resetFormFields() {
    // Återställ grundarbete
    var grundarbeteSelect = document.getElementById("grundarbete_type");
    var grundarbeteInfo = document.getElementById("grundarbete-info");
    grundarbeteSelect.selectedIndex = 0;
    grundarbeteInfo.style.display = "none";
    grundarbeteInfo.innerHTML = "";

    // Återställ material
    var materialSelect = document.getElementById("material_type");
    var materialInfo = document.getElementById("material-info");
    materialSelect.innerHTML = '<option value="" disabled selected>-- Välj material --</option>';
    materialInfo.style.display = "none";
    materialInfo.innerHTML = "";

    // Återställ kvadratmeter
    document.getElementById("square_meters").value = "";
}

// Funktion för att visa beskrivning av grundarbete
function showGrundarbeteDescription() {
    var grundarbeteSelect = document.getElementById("grundarbete_type");
    var grundarbeteInfo = document.getElementById("grundarbete-info");
    var selectedGrundarbete = grundarbeteSelect.value;

    if (materialPrices[selectedGrundarbete] && materialPrices[selectedGrundarbete].description) {
        grundarbeteInfo.style.display = "block";
        grundarbeteInfo.innerHTML = "<strong>Beskrivning:</strong> " + materialPrices[selectedGrundarbete].description;
    } else {
        grundarbeteInfo.style.display = "none";
    }
}

// Funktion för att visa beskrivning av material
function showMaterialDescription() {
    var materialSelect = document.getElementById("material_type");
    var materialInfo = document.getElementById("material-info");
    var selectedMaterial = materialSelect.value;

    if (materialPrices[selectedMaterial] && materialPrices[selectedMaterial].description) {
        materialInfo.style.display = "block";
        materialInfo.innerHTML = "<strong>Beskrivning:</strong> " + materialPrices[selectedMaterial].description;
    } else {
        materialInfo.style.display = "none";
    }
}

// Funktion för att uppdatera materialalternativ
function updateMaterialOptions() {
    var categorySelect = document.getElementById("job_category");
    var materialSelect = document.getElementById("material_type");
    var selectedCategory = categorySelect.value;

    // Rensa befintliga alternativ
    materialSelect.innerHTML = "";
    
    // Lägg till default option
    var defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- Välj material --";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    materialSelect.appendChild(defaultOption);

    // Lägg till nya alternativ baserat på vald kategori
    if (materialOptions[selectedCategory]) {
        materialOptions[selectedCategory].forEach(function(option) {
            var optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.textContent = option;
            materialSelect.appendChild(optionElement);
        });
    }

    // Lägg till händelselyssnare för materialval
    materialSelect.addEventListener("change", showMaterialDescription);
}

// Funktion för att formatera nummer med tusentalsavgränsare
function formatNumber(number) {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Uppdaterad beräkningsfunktion för fasadmålning
function calculateFacadePaintingCost(squareMeters, materialType) {
    // Grundpriser enligt Excel-modellen
    const priser = {
        fasad: 400,
        takfot: 300,
        vindskiva: 300,
        puts_fasad: 370,
        puts_takfot: 350,
        puts_vindskiva: 200,
        plat_fasad: 370,
        plat_takfot: 250,
        stallning: 400,
        tvatt_induren: 50
    };

    // Beräkna kostnader
    var fasadKostnad = squareMeters * priser.fasad;
    var tvattKostnad = squareMeters * priser.tvatt_induren;
    
    // Extra kostnader (ställning etc.)
    var extraKostnad = 800 * 4; // 4 extra punkter á 800 kr
    
    // Total arbetskostnad
    var totalWorkCost = fasadKostnad + tvattKostnad + extraKostnad;
    
    // Materialkostnad (12% enligt Excel)
    var materialCost = totalWorkCost * 0.12;
    
    // ROT-avdrag (50% av arbetskostnaden, max 50000 kr)
    var rotDeduction = Math.min(totalWorkCost * 0.5, 50000);
    
    // Slutlig kostnad
    var totalAfterRot = totalWorkCost + materialCost - rotDeduction;
    
    return {
        totalBeforeRot: totalWorkCost + materialCost,
        materialCost: materialCost,
        laborCost: totalWorkCost,
        rotDeduction: rotDeduction,
        totalAfterRot: totalAfterRot
    };
}

// Funktion för att beräkna kostnaden
function calculateCost() {
    var form = document.getElementById("calculation-form");
    var jobType = form["job_category"].value;
    var squareMeters = parseFloat(form["square_meters"].value);

    if (!jobType || !squareMeters || isNaN(squareMeters)) {
        alert("Fyll i alla fält innan du beräknar kostnaden.");
        return;
    }

    if (squareMeters <= 0) {
        alert("Ange ett giltigt antal kvadratmeter (större än 0).");
        return;
    }

    var resultHTML = "<h2>Kostnadsberäkning</h2>";
    var totalCostWithoutRot = 0;

    if (jobType === "Inomhusmålning") {
        var grundarbeteType = form["grundarbete_type"].value;
        if (!grundarbeteType) {
            alert("Välj omfattning av reparationer.");
            return;
        }

        // Beräkna pris baserat på typ av grundarbete och yta
        var totalPrice;
        
        if (grundarbeteType === "Nej") {
            if (squareMeters <= 10) {
                totalPrice = 25000; // Minimipris för små ytor (före ROT)
            } else if (squareMeters <= 70) {
                // Linjär ökning från 25000 till 56000
                var range = 70 - 10;
                var priceRange = 56000 - 25000;
                var progress = (squareMeters - 10) / range;
                totalPrice = 25000 + (priceRange * progress);
            } else if (squareMeters <= 100) {
                // Linjär ökning från 56000 till 80000
                var range = 100 - 70;
                var priceRange = 80000 - 56000;
                var progress = (squareMeters - 70) / range;
                totalPrice = 56000 + (priceRange * progress);
            } else {
                // Linjär ökning från 80000 till 96000
                var range = 50;
                var priceRange = 96000 - 80000;
                var progress = Math.min((squareMeters - 100) / range, 1);
                totalPrice = 80000 + (priceRange * progress);
            }
        } else if (grundarbeteType === "Små") {
            if (squareMeters <= 10) {
                totalPrice = 32000; // Minimipris för små ytor (före ROT)
            } else if (squareMeters <= 70) {
                // Linjär ökning från 32000 till 70000
                var range = 70 - 10;
                var priceRange = 70000 - 32000;
                var progress = (squareMeters - 10) / range;
                totalPrice = 32000 + (priceRange * progress);
            } else if (squareMeters <= 100) {
                // Linjär ökning från 70000 till 100000
                var range = 100 - 70;
                var priceRange = 100000 - 70000;
                var progress = (squareMeters - 70) / range;
                totalPrice = 70000 + (priceRange * progress);
            } else {
                // Linjär ökning från 100000 till 120000
                var range = 50;
                var priceRange = 120000 - 100000;
                var progress = Math.min((squareMeters - 100) / range, 1);
                totalPrice = 100000 + (priceRange * progress);
            }
        } else if (grundarbeteType === "Medel") {
            if (squareMeters <= 10) {
                totalPrice = 46000; // Minimipris för små ytor (före ROT)
            } else if (squareMeters <= 70) {
                // Linjär ökning från 46000 till 80000
                var range = 70 - 10;
                var priceRange = 80000 - 46000;
                var progress = (squareMeters - 10) / range;
                totalPrice = 46000 + (priceRange * progress);
            } else if (squareMeters <= 100) {
                // Linjär ökning från 80000 till 120000
                var range = 100 - 70;
                var priceRange = 120000 - 80000;
                var progress = (squareMeters - 70) / range;
                totalPrice = 80000 + (priceRange * progress);
            } else {
                // Linjär ökning från 120000 till 140000
                var range = 50;
                var priceRange = 140000 - 120000;
                var progress = Math.min((squareMeters - 100) / range, 1);
                totalPrice = 120000 + (priceRange * progress);
            }
        } else { // Stora
            if (squareMeters <= 10) {
                totalPrice = 62000; // Minimipris för små ytor (före ROT)
            } else if (squareMeters <= 70) {
                // Linjär ökning från 62000 till 90000
                var range = 70 - 10;
                var priceRange = 90000 - 62000;
                var progress = (squareMeters - 10) / range;
                totalPrice = 62000 + (priceRange * progress);
            } else if (squareMeters <= 100) {
                // Linjär ökning från 90000 till 140000
                var range = 100 - 70;
                var priceRange = 140000 - 90000;
                var progress = (squareMeters - 70) / range;
                totalPrice = 90000 + (priceRange * progress);
            } else {
                // Linjär ökning från 140000 till 160000
                var range = 50;
                var priceRange = 160000 - 140000;
                var progress = Math.min((squareMeters - 100) / range, 1);
                totalPrice = 140000 + (priceRange * progress);
            }
        }

        // Dela upp i material (12%) och arbetskostnad (88%)
        var materialCost = totalPrice * 0.12;
        var laborCost = totalPrice * 0.88;
        var rotDeduction = Math.min(laborCost * 0.5, 50000);
        var totalCostAfterRot = totalPrice - rotDeduction;

        resultHTML += 
            "<p>Materialkostnad: " + formatNumber(materialCost) + " kr</p>" +
            "<p>Arbetskostnad (före ROT): " + formatNumber(laborCost) + " kr</p>" +
            "<p>ROT-avdrag: -" + formatNumber(rotDeduction) + " kr</p>" +
            "<p><strong>Total kostnad efter ROT-avdrag: " + formatNumber(totalCostAfterRot) + " kr</strong></p>" +
            "<p><em>(" + materialPrices[grundarbeteType].description + ")</em></p>";

        // Lägg till information om ROT-avdragsbegränsning om det behövs
        if (laborCost * 0.5 > 50000) {
            resultHTML += "<p><em>OBS: ROT-avdraget är begränsat till 50 000 kr per person och år. " +
                         "Om ni är flera personer i hushållet som kan utnyttja ROT-avdrag, " +
                         "kontakta entreprenören för att diskutera möjligheten att dela upp arbetet på flera personer.</em></p>";
        }

        // Visa relevant prisintervall baserat på omfattning och storlek
        if (grundarbeteType === "Nej") {
            if (squareMeters <= 10) {
                resultHTML += "<p><em>För målning utan reparationer upp till 10 kvm ligger priset normalt runt 12 500 kr efter ROT-avdrag</em></p>";
            } else if (squareMeters <= 70) {
                resultHTML += "<p><em>För målning utan reparationer upp till 70 kvm ligger priset normalt runt 28 000 kr efter ROT-avdrag</em></p>";
            } else if (squareMeters <= 100) {
                resultHTML += "<p><em>För målning utan reparationer upp till 100 kvm ligger priset normalt runt 40 000 kr efter ROT-avdrag</em></p>";
            } else {
                resultHTML += "<p><em>För målning utan reparationer över 100 kvm ligger priset normalt runt 48 000 kr efter ROT-avdrag för 150 kvm</em></p>";
            }
        } else if (grundarbeteType === "Små") {
            if (squareMeters <= 10) {
                resultHTML += "<p><em>För mindre reparationer upp till 10 kvm ligger priset normalt runt 16 000 kr efter ROT-avdrag</em></p>";
            } else if (squareMeters <= 70) {
                resultHTML += "<p><em>För mindre reparationer upp till 70 kvm ligger priset normalt runt 35 000 kr efter ROT-avdrag</em></p>";
            } else if (squareMeters <= 100) {
                resultHTML += "<p><em>För mindre reparationer upp till 100 kvm ligger priset normalt runt 50 000 kr efter ROT-avdrag</em></p>";
            } else {
                resultHTML += "<p><em>För mindre reparationer över 100 kvm ligger priset normalt runt 60 000 kr efter ROT-avdrag för 150 kvm</em></p>";
            }
        } else if (grundarbeteType === "Medel") {
            if (squareMeters <= 10) {
                resultHTML += "<p><em>För medelstora reparationer upp till 10 kvm ligger priset normalt runt 23 000 kr efter ROT-avdrag</em></p>";
            } else if (squareMeters <= 70) {
                resultHTML += "<p><em>För medelstora reparationer upp till 70 kvm ligger priset normalt runt 40 000 kr efter ROT-avdrag</em></p>";
            } else if (squareMeters <= 100) {
                resultHTML += "<p><em>För medelstora reparationer upp till 100 kvm ligger priset normalt runt 60 000 kr efter ROT-avdrag</em></p>";
            } else {
                resultHTML += "<p><em>För medelstora reparationer över 100 kvm ligger priset normalt runt 70 000 kr efter ROT-avdrag för 150 kvm</em></p>";
            }
        } else {
            if (squareMeters <= 10) {
                resultHTML += "<p><em>För stora reparationer upp till 10 kvm ligger priset normalt runt 31 000 kr efter ROT-avdrag</em></p>";
            } else if (squareMeters <= 70) {
                resultHTML += "<p><em>För stora reparationer upp till 70 kvm ligger priset normalt runt 45 000 kr efter ROT-avdrag</em></p>";
            } else if (squareMeters <= 100) {
                resultHTML += "<p><em>För stora reparationer upp till 100 kvm ligger priset normalt runt 70 000 kr efter ROT-avdrag</em></p>";
            } else {
                resultHTML += "<p><em>För stora reparationer över 100 kvm ligger priset normalt runt 80 000 kr efter ROT-avdrag för 150 kvm</em></p>";
            }
        }
        
        showResult(resultHTML);
        return;
    } else if (jobType === "Fasadmålning") {
        var materialType = form["material_type"].value;
        if (!materialType) {
            alert("Välj material.");
            return;
        }

        var costs = calculateFacadePaintingCost(squareMeters, materialType);
        
        resultHTML += 
            "<p><strong>Material:</strong> " + materialType + "</p>" +
            "<p><em>" + materialPrices[materialType].description + "</em></p>" +
            "<p>Materialkostnad (12%): " + formatNumber(costs.materialCost) + " kr</p>" +
            "<p>Arbetskostnad: " + formatNumber(costs.laborCost) + " kr</p>" +
            "<p>ROT-avdrag (50%): -" + formatNumber(costs.rotDeduction) + " kr</p>" +
            "<p><strong>Total kostnad efter ROT-avdrag: " + formatNumber(costs.totalAfterRot) + " kr</strong></p>" +
            "<p><strong>Detta ingår i priset:</strong></p>" +
            "<ul>" +
            "<li>Fasadtvätt med indurent</li>" +
            "<li>Täckning av ytor och skrapning av lös färg</li>" +
            "<li>Grundoljning och grundmålning av trärena ytor</li>" +
            "<li>Två strykningar av färdigfärg på fasad, vindskivor, taksprång, knutar och fönsterfoder</li>" +
            "</ul>" +
            "<p><strong>Tillkommande kostnader kan behövas för:</strong></p>" +
            "<ul>" +
            "<li>Ställning (rullställning eller fast ställning beroende på husets höjd och åtkomlighet)</li>" +
            "</ul>" +
            "<p><em>OBS: Priset är baserat på standardutförande. Kontakta oss för exakt prisuppgift baserat på husets förutsättningar och eventuella specialbehov.</em></p>";

        // Lägg till information om ROT-avdragsbegränsning om det behövs
        if (costs.laborCost * 0.5 > 50000) {
            resultHTML += "<p><em>OBS: ROT-avdraget är begränsat till 50 000 kr per person och år. " +
                         "Om ni är flera personer i hushållet som kan utnyttja ROT-avdrag, " +
                         "kontakta oss för att diskutera möjligheten att dela upp arbetet på flera personer.</em></p>";
        }

        showResult(resultHTML);
        return;
    } else {
        var materialType = form["material_type"].value;
        if (!materialType) {
            alert("Välj material.");
            return;
        }

        var laborCost = squareMeters * prices[jobType] * materialPrices[materialType]['labor_factor'];
        var materialCost = squareMeters * materialPrices[materialType]['price'];
        var extraMaterialCost = squareMeters * 150;
        materialCost += extraMaterialCost;
        totalCostWithoutRot = laborCost + materialCost;

        // Beräkna ungefärliga kostnader baserat på storlek och material
        var basePrice;
        if (squareMeters <= 25) {
            basePrice = 40000; // Grundpris för altan upp till 25 kvm med marksten
        } else {
            basePrice = 40000 + ((squareMeters - 25) * 1600); // Ökar med 1600 kr per extra kvm
        }

        // Justera pris baserat på material
        var materialFactor = materialPrices[materialType]['labor_factor'];
        totalCostWithoutRot = basePrice * materialFactor;

        resultHTML += 
            "<p><strong>Material:</strong> " + materialType + "</p>" +
            "<p><em>" + materialPrices[materialType]['description'] + "</em></p>" +
            "<p>Uppskattad kostnad (marksten som grund): " + formatNumber(totalCostWithoutRot) + " kr</p>" +
            "<p>Uppskattad kostnad (betongplintar som grund): " + formatNumber(totalCostWithoutRot * 1.5) + " kr</p>" +
            "<p><strong>Observera:</strong></p>" +
            "<ul>" +
            "<li>Priserna är baserade på standardutförande utan extra tillbehör som trappsteg eller belysning</li>" +
            "<li>För altan på marksten ingår fiberduk och marksten som stöttning för stommen</li>" +
            "<li>För altan på betongplintar ingår kryssbjälkslag och betongplintar</li>" +
            "<li>Det faktiska priset kan variera beroende på markförhållanden och specifika önskemål</li>" +
            "<li>Kontakta entreprenören för exakt prisuppgift baserat på dina specifika förutsättningar</li>" +
            "</ul>";

        var rotDeduction = Math.min(totalCostWithoutRot * 0.5, 50000);
        var totalCostWithRot = totalCostWithoutRot - rotDeduction;

        resultHTML += 
            "<p>Total kostnad utan ROT-avdrag: " + formatNumber(totalCostWithoutRot) + " kr</p>" +
            "<p>Total kostnad med ROT-avdrag: " + formatNumber(totalCostWithRot) + " kr</p>" +
            "<p>Observera att de beräknade priserna är en grov uppskattning och endast avsedda för att ge en preliminär bild av kostnaderna. " +
            "Vid verklig upphandling med en entreprenör kan många faktorer påverka den slutliga kostnaden. " +
            "Använd denna kalkylator som en vägledning och rådgör med entreprenören för en exakt bedömning av dina behov och kostnader.</p>";

        showResult(resultHTML);
    }
}

// Lägg till händelselyssnare
document.getElementById("grundarbete_type").addEventListener("change", showGrundarbeteDescription);

// Funktion för att visa resultat med animation och kontaktformulär
function showResult(resultHTML) {
    var resultDiv = document.getElementById("calculation-result");
    
    // Lägg till kontaktformulär efter resultatet
    resultHTML += `
        <div class="contact-form-container">
            <h2>Kontakta oss</h2>
            <p class="contact-subtitle">Vi återkommer så fort som möjligt</p>
            
            <div class="contact-info">
                <p class="contact-phone">📞 Telefon: 070-797 85 47</p>
                <p class="contact-email">✉️ Epost: info@Vilchesab.se</p>
            </div>

            <form id="contact-form" class="contact-form" onsubmit="return handleContactSubmit(event)">
                <div class="form-group">
                    <input type="text" id="contact-name" name="contact-name" placeholder="Namn" required>
                </div>
                <div class="form-group">
                    <input type="email" id="contact-email" name="contact-email" placeholder="Epost" required>
                </div>
                <div class="form-group">
                    <input type="tel" id="contact-phone" name="contact-phone" placeholder="Telefonnummer" required>
                </div>
                <div class="form-group">
                    <textarea id="contact-message" name="contact-message" rows="4" placeholder="Meddelande" required></textarea>
                </div>
                <input type="hidden" id="calculation-details" name="calculation-details">
                <button type="submit" class="submit-button">SKICKA MEDDELANDE</button>
            </form>
        </div>
    `;

    resultDiv.innerHTML = resultHTML;
    resultDiv.classList.remove("show");
    // Trigger reflow
    void resultDiv.offsetWidth;
    resultDiv.classList.add("show");

    // Spara beräkningsdetaljerna i det dolda fältet
    var calculationDetails = document.getElementById("calculation-result").innerText;
    document.getElementById("calculation-details").value = calculationDetails;
}

// Hantera kontaktformulär submit
function handleContactSubmit(event) {
    event.preventDefault();
    
    // Samla formulärdata
    var formData = new FormData(event.target);
    
    // Skicka data till WordPress via AJAX
    jQuery.ajax({
        url: ajaxurl, // WordPress AJAX URL (definierad i PHP)
        type: 'POST',
        data: {
            action: 'submit_calculation_contact', // Action hook för WordPress
            name: formData.get('contact-name'),
            email: formData.get('contact-email'),
            phone: formData.get('contact-phone'),
            address: formData.get('contact-address'),
            message: formData.get('contact-message'),
            calculation: formData.get('calculation-details')
        },
        success: function(response) {
            if (response.success) {
                alert('Tack för din förfrågan! Vi återkommer till dig så snart som möjligt.');
                document.getElementById('contact-form').reset();
            } else {
                alert('Ett fel uppstod. Vänligen försök igen eller kontakta oss via telefon.');
            }
        },
        error: function() {
            alert('Ett fel uppstod. Vänligen försök igen eller kontakta oss via telefon.');
        }
    });
    
    return false;
}

// Uppdatera formulärfält när sidan laddas
updateFormFields();

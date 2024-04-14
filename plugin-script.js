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
    "Golvläggning": ["Furugolv", "keramik", "Laminatgolv", "Linoleumgolv", "parkettgolv", "Vinylgolv"],
    "Målning-Inomhus": ["Standard"],
    "Målning-Fasad": ["Vit", "Svart", "Grå", "Beige", "Brun", "Blå", "Röd", "Grön"]
};

// Funktion för att uppdatera materialalternativen baserat på vald kategori
function updateMaterialOptions() {
    var categorySelect = document.getElementById("job_category");
    var materialSelect = document.getElementById("material_type");
    var selectedCategory = categorySelect.value;

    // Rensa befintliga alternativ
    materialSelect.innerHTML = "";

    // Lägg till nya alternativ baserat på vald kategori
    materialOptions[selectedCategory].forEach(function(option) {
        var optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        materialSelect.appendChild(optionElement);
    });
}

// Funktion för att beräkna kostnaden
function calculateCost() {
    var form = document.getElementById("calculation-form");
    var jobType = form["job_category"].value;
    var squareMeters = form["square_meters"].value;
    var materialType = form["material_type"].value;

    if (jobType && squareMeters) {
        var price = prices[jobType];
        var laborFactor = materialPrices[materialType]['labor_factor'];
        var laborCost = squareMeters * price * laborFactor;

        var totalCostWithoutRot = laborCost;

        if (jobType === "Golvläggning") {
            var materialCost = squareMeters * materialPrices[materialType]['price'];
            totalCostWithoutRot += materialCost;
        }

        if (jobType === "Målning-Inomhus") {
            var paintLiters = squareMeters / 4;
            var paintPricePerLiter = 350;
            var paintCost = paintLiters * paintPricePerLiter;
            totalCostWithoutRot += paintCost;
        }

        var rotDeduction = Math.min(laborCost * 0.3, 50000);
        var totalCostWithRot = totalCostWithoutRot - rotDeduction;

        var resultDiv = document.getElementById("calculation-result");
        resultDiv.innerHTML = "<h2>Total kostnad:</h2>" +
            "<p>Arbetskostnad: " + laborCost.toFixed(2) + " kr</p>";

        if (jobType === "Golvläggning") {
            resultDiv.innerHTML += "<p>Materialkostnad: " + materialCost.toFixed(2) + " kr</p>";
        }

        if (jobType === "Målning-Inomhus") {
            resultDiv.innerHTML += "<p>Materialkostnad: " + paintCost.toFixed(2) + " kr</p>";
        }

        resultDiv.innerHTML += "<p>Total kostnad utan ROT avdrag: " + totalCostWithoutRot.toFixed(2) + " kr</p>" +
            "<p>Total kostnad med ROT avdrag: " + totalCostWithRot.toFixed(2) + " kr</p>" +
            "<p>Observera att de beräknade priserna är en grov uppskattning och endast avsedda för att ge en preliminär bild av kostnaderna. " +
            "Vid verklig upphandling med en leverantör kan många faktorer påverka den slutliga kostnaden. " +
            "Använd denna kalkylator som en vägledning och rådgör med en professionell för en exakt bedömning av dina behov och kostnader.</p>";
    } else {
        alert("Fyll i alla fält innan du beräknar kostnaden.");
    }
}

// Uppdatera materialalternativ när sidan laddas
updateMaterialOptions();

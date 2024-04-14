<?php
/*
Plugin Name: Byggkostnadskalkylatorn
Description: En plugin för att beräkna kostnader baserat på olika parametrar inom byggbranschen.
Version: 1.0
Author: John Sebastian Aldrin
*/

/*
 * Proprietär Licensversion 1.0
 *
 * Copyright [2024] [John Sebastian Aldrin]
 *
 * Alla rättigheter förbehållna.
 *
 * Tillåtelse att använda, kopiera, modifiera och distribuera denna kod eller delar av den är endast tillåtet med skriftligt tillstånd från upphovsrättsinnehavaren.
 */

// Register shortcode
function calculation_shortcode() {
    // Initialize variables
    $prices = array(
        "Golvläggning" => 650,
        "Målning-Inomhus" => 650,
        "Målning-Fasad" => 650,
    );

    $material_prices_per_square_meter = array(
        "Furugolv" => array(
            "price" => 400, // Pris per kvadratmeter för Furugolv
            "labor_factor" => 1.2 // Arbetstidsfaktor för Furugolv
        ),
        "keramik" => array(
            "price" => 200,    // Pris per kvadratmeter för keramik
            "labor_factor" => 1.5 // Arbetstidsfaktor för keramik
        ),
        "Laminatgolv" => array(
            "price" => 250, // Pris per kvadratmeter för laminatgolv
            "labor_factor" => 1.3 // Arbetstidsfaktor för laminatgolv
        ),
        "Linoleumgolv" => array(
            "price" => 650, // Pris per kvadratmeter för Linoleumgolv
            "labor_factor" => 1.8 // Arbetstidsfaktor för Linoleumgolv
        ),
        "parkettgolv" => array(
            "price" => 400, // Pris per kvadratmeter för parkettgolv-Ek
            "labor_factor" => 1.4 // Arbetstidsfaktor för parkettgolv-Ek
        ),
        "Vinylgolv" => array(
            "price" => 350, // Pris per kvadratmeter för Vinylgolv
            "labor_factor" => 1.3 // Arbetstidsfaktor för Vinylgolv
        ),
        "Standard" => array(
            "price" => 750, // Pris för 2.8 liter färg
            "labor_factor" => 1.0 // Arbetstidsfaktor för standard färg
        ),
        "Akrylat" => array(
            "price" => 780, // Pris för 2.8 liter färg
            "labor_factor" => 1.0 // Arbetstidsfaktor för standard färg
        ),
    );

    ob_start();
    ?>
    <script>
        var prices = <?php echo json_encode($prices); ?>;
        var materialPrices = <?php echo json_encode($material_prices_per_square_meter); ?>;
    </script>
    <div id="calculation-form-container">
        <!-- Your form HTML goes here -->
        <!-- Example: -->
        <form id="calculation-form" method="post" onsubmit="return false;">
            <label for="job_category">Välj Kategori:</label>
            <select name="job_category" id="job_category" onchange="updateMaterialOptions()">
                <option value="" disabled selected>Välj en kategori</option>
                <option value="Golvläggning">Golvläggning</option>
                <option value="Målning-Inomhus">Målning-Inomhus</option>
                <option value="Målning-Fasad">Målning-Fasad</option>
            </select>
            <br>
            <label for="square_meters">Ange kvadratmeter:</label>
            <input type="number" name="square_meters" id="square_meters" min="0">
            <br>
            <label for="material_type">Typ av material:</label>
            <select name="material_type" id="material_type">
                <!-- Options will be dynamically populated -->
            </select>
            <br>
            <input type="submit" value="Beräkna kostnad" onclick="calculateCost()">
        </form>
        <div id="calculation-result"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('calculation_form', 'calculation_shortcode');

// Enqueue JavaScript
function add_plugin_scripts() {
    wp_enqueue_script('plugin-script', plugin_dir_url( __FILE__ ) . 'js/plugin-script.js', array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'add_plugin_scripts');
// Funktion för att lägga till CSS
function add_plugin_styles() {
    // Ange sökvägen till din CSS-fil
    $css_file = plugin_dir_url(__FILE__) . 'plugin-style.css';

    // Registrera och anslut din CSS-fil
    wp_enqueue_style('plugin-style', $css_file);
}

add_action('wp_enqueue_scripts', 'add_plugin_styles');

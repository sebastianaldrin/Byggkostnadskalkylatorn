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
        "Altan" => 750, // Arbetskostnad per timme för altanbygge
        "Inomhusmålning" => 650,
        "Fasadmålning" => 650,
    );

    $material_prices_per_square_meter = array(
        "Tryckimpregnerat-28x120" => array(
            "price" => 189,
            "labor_factor" => 1.2,
            "description" => "Standard tryckimpregnerad furu 28x120mm. Mest vanlig typ av trall, bra hållbarhet och prisvärd. Kräver regelbundet underhåll för att behålla utseendet."
        ),
        "Tryckimpregnerat-34x145" => array(
            "price" => 239,
            "labor_factor" => 1.3,
            "description" => "Bredare tryckimpregnerad furu 34x145mm. Ger ett mer exklusivt intryck, särskilt lämplig för större altaner. Kräver regelbundet underhåll."
        ),
        "Kärnfuru" => array(
            "price" => 599,
            "labor_factor" => 1.4,
            "description" => "Naturligt motståndskraftig mot röta och skadedjur. Kräver minst 30 cm avstånd från marken för ventilation. Bra miljöval."
        ),
        "Ädelträ" => array(
            "price" => 899,
            "labor_factor" => 1.5,
            "description" => "Exklusivt och elegant utseende. Naturligt väderbeständigt. Perfekt för påkostade altaner. Kräver speciell skötsel."
        ),
        "Träkomposit" => array(
            "price" => 799,
            "labor_factor" => 1.3,
            "description" => "Hållbart material som kräver minimalt underhåll. Högre initial kostnad men längre livslängd och mindre underhåll."
        ),
        // Behåll de existerande alternativen för målning
        "Nej" => array(
            "price" => 500,
            "labor_price" => 3667,
            "description" => "Ingen spackling behövs. Väggarna är i mycket gott skick och redo för målning."
        ),
        "Små" => array(
            "price" => 700,
            "labor_price" => 5133,
            "description" => "Mindre reparationer och spackling på upp till 20% av ytan. Väggar i generellt gott skick."
        ),
        "Medel" => array(
            "price" => 800,
            "labor_price" => 5867,
            "description" => "Reparationer och spackling på upp till 50% av ytan. Vissa områden kräver mer arbete."
        ),
        "Stora" => array(
            "price" => 900,
            "labor_price" => 6600,
            "description" => "Omfattande reparationer på mer än 50% av ytan. Kan inkludera borttagning av tapeter och större lagningar."
        ),
        "Akrylat" => array(
            "price" => 780,
            "labor_factor" => 1.0,
            "description" => "Standard akrylatfärg för fasadmålning."
        ),
        // Fasadmålning alternativ
        "Alkyd/Akrylat" => array(
            "price" => 300,
            "coverage" => 7,
            "labor_factor" => 1.0,
            "description" => "Systemmålning med alkyd- och akrylatfärger. Inkluderar grundolja för utsatta områden, grundmålning vid behov, och två strykningar. Ger ett hållbart resultat och bra täckning."
        ),
        "Slamfärg" => array(
            "price" => 150,
            "coverage" => 5,
            "labor_factor" => 0.8,
            "description" => "Traditionell och pålitlig färgtyp (t.ex. falu rödfärg). Billigare alternativ med enklare underhåll. Kräver mindre förarbete, appliceras med rödfärgspensel."
        ),
        "Linoljefärg" => array(
            "price" => 450,
            "coverage" => 8,
            "labor_factor" => 1.2,
            "description" => "Traditionell färgtyp som kräver noggrannt förarbete. Färgen ska arbetas in ordentligt i underlaget. Kräver grundmålning på nytt virke, helst två strykningar."
        ),
    );

    ob_start();
    ?>
    <script>
        var prices = <?php echo json_encode($prices); ?>;
        var materialPrices = <?php echo json_encode($material_prices_per_square_meter); ?>;
    </script>
    <div id="calculation-form-container">
        <form id="calculation-form" method="post" onsubmit="return false;">
            <!-- Kategori val -->
            <div class="form-group">
                <label for="job_category">Välj Kategori:</label>
                <select name="job_category" id="job_category" onchange="updateFormFields()">
                    <option value="" disabled selected>Välj en kategori</option>
                    <option value="Altan">Altan</option>
                    <option value="Inomhusmålning">Inomhusmålning</option>
                    <option value="Fasadmålning">Fasadmålning</option>
                </select>
            </div>

            <!-- Grundarbete val för inomhusmålning -->
            <div id="grundarbete-container" class="form-group" style="display: none;">
                <label for="grundarbete_type">Reparationer av väggar, spackling av hål eller borttagning av tapeter:</label>
                <select name="grundarbete_type" id="grundarbete_type" onchange="showGrundarbeteDescription()">
                    <option value="" disabled selected>-- Välj omfattning --</option>
                    <option value="Nej">Nej</option>
                    <option value="Små">Små (upp till 20% av ytan)</option>
                    <option value="Medel">Medel (upp till 50% av ytan)</option>
                    <option value="Stora">Stora (mer än 50% av ytan)</option>
                </select>
                <div id="grundarbete-info" class="info-text"></div>
            </div>

            <!-- Material val för andra kategorier -->
            <div id="material-container" class="form-group">
                <label for="material_type" id="material-type-label">Typ av material:</label>
                <select name="material_type" id="material_type">
                    <!-- Options will be dynamically populated -->
                </select>
                <div id="material-info" class="info-text"></div>
            </div>

            <!-- Kvadratmeter input -->
            <div class="form-group">
                <label for="square_meters">Ange kvadratmeter:</label>
                <input type="number" name="square_meters" id="square_meters" min="0">
            </div>
            
            <input type="submit" value="Beräkna kostnad" onclick="calculateCost()">
        </form>
        <div id="calculation-result"></div>
    </div>

    <style>
        .form-group {
            margin-bottom: 1rem;
        }
        .info-text {
            margin-top: 0.5rem;
            padding: 0.5rem;
            background-color: #f8f9fa;
            border-radius: 4px;
            font-size: 0.9rem;
            color: #666;
        }
    </style>
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

// Lägg till AJAX URL för WordPress
function add_ajax_url() {
    ?>
    <script type="text/javascript">
        var ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";
    </script>
    <?php
}
add_action('wp_head', 'add_ajax_url');

// Hantera kontaktformulär submission
function handle_calculation_contact() {
    // Verifiera nonce för säkerhet (implementera vid behov)
    
    // Samla in formulärdata
    $name = sanitize_text_field($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $phone = sanitize_text_field($_POST['phone']);
    $address = sanitize_text_field($_POST['address']);
    $message = sanitize_textarea_field($_POST['message']);
    $calculation = sanitize_textarea_field($_POST['calculation']);
    
    // Bygg e-postmeddelandet
    $to = get_option('admin_email'); // WordPress admin e-post
    $subject = 'Ny förfrågan från Byggkostnadskalkylatorn';
    
    $email_content = "Ny förfrågan från Byggkostnadskalkylatorn\n\n";
    $email_content .= "Namn: $name\n";
    $email_content .= "E-post: $email\n";
    $email_content .= "Telefon: $phone\n";
    $email_content .= "Adress: $address\n";
    $email_content .= "Meddelande: $message\n\n";
    $email_content .= "Beräkningsdetaljer:\n$calculation";
    
    $headers = array('Content-Type: text/plain; charset=UTF-8');
    
    // Skicka e-post
    $mail_sent = wp_mail($to, $subject, $email_content, $headers);
    
    // Spara i databasen (valfritt)
    global $wpdb;
    $table_name = $wpdb->prefix . 'calculation_requests';
    
    // Skapa tabellen om den inte finns
    if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        $charset_collate = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            time datetime DEFAULT CURRENT_TIMESTAMP,
            name tinytext NOT NULL,
            email varchar(100) NOT NULL,
            phone varchar(20) NOT NULL,
            address text NOT NULL,
            message text NOT NULL,
            calculation text NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
    
    // Spara förfrågan
    $wpdb->insert(
        $table_name,
        array(
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'address' => $address,
            'message' => $message,
            'calculation' => $calculation
        ),
        array('%s', '%s', '%s', '%s', '%s', '%s')
    );
    
    // Skicka svar
    wp_send_json(array(
        'success' => $mail_sent,
        'message' => $mail_sent ? 'Förfrågan skickad!' : 'Ett fel uppstod vid skickandet av förfrågan.'
    ));
}

// Registrera AJAX handlers för både inloggade och utloggade användare
add_action('wp_ajax_submit_calculation_contact', 'handle_calculation_contact');
add_action('wp_ajax_nopriv_submit_calculation_contact', 'handle_calculation_contact');

// Lägg till admin-meny för att visa förfrågningar
function add_calculation_requests_menu() {
    add_menu_page(
        'Byggkostnadskalkylatorn - Förfrågningar',
        'Byggförfrågningar',
        'manage_options',
        'calculation-requests',
        'display_calculation_requests',
        'dashicons-calculator',
        30
    );
}
add_action('admin_menu', 'add_calculation_requests_menu');

// Visa förfrågningar i admin
function display_calculation_requests() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'calculation_requests';
    $requests = $wpdb->get_results("SELECT * FROM $table_name ORDER BY time DESC");
    
    ?>
    <div class="wrap">
        <h1>Förfrågningar från Byggkostnadskalkylatorn</h1>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Datum</th>
                    <th>Namn</th>
                    <th>E-post</th>
                    <th>Telefon</th>
                    <th>Adress</th>
                    <th>Meddelande</th>
                    <th>Beräkning</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($requests as $request): ?>
                <tr>
                    <td><?php echo esc_html($request->time); ?></td>
                    <td><?php echo esc_html($request->name); ?></td>
                    <td><?php echo esc_html($request->email); ?></td>
                    <td><?php echo esc_html($request->phone); ?></td>
                    <td><?php echo esc_html($request->address); ?></td>
                    <td><?php echo esc_html($request->message); ?></td>
                    <td><?php echo esc_html($request->calculation); ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}

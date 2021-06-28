<?php
/*
Plugin Name: Vue FSA LDTA
Description: FSA LDTA Application
Version: 0.1
*/

if ( !defined( 'ABSPATH' ) ) exit;

define( 'VUEFSALDTA_URL' , plugin_dir_url(  __FILE__ ) );
define( 'VUEFSALDTA_PLUGIN_DIR' , plugin_dir_path( __FILE__ ) );

add_action('admin_menu', 'fsa_team_members_setup_menu');

function fsa_team_members_setup_menu(){
    add_menu_page( 'FSA Members', 'FSA Members', 'manage_options', 'fsa-team-members',
      'handle_adminview' );
}
function handle_adminview(){
    echo '<div id="app-admin"></div>';
}

function handle_shortcode() {
    return '<div id="app-frontend"></div>';
}
add_shortcode('vue-fsa-team', 'handle_shortcode');

wp_enqueue_script('vue-script', VUEFSALDTA_URL . 'includes/js/vue.js', [], '2.5.17');
wp_enqueue_script('axios-script', VUEFSALDTA_URL . 'includes/js/axios.js', [], '0.21.1');
wp_enqueue_script('fsa-mt-front-js', VUEFSALDTA_URL . 'includes/Frontend.js', [], '0.1', true);
wp_enqueue_script('fsa-mt-admin-js', VUEFSALDTA_URL . 'includes/Admin.js', [], '0.1', true);

//Adding styles
wp_register_style( 'fsa-mt-front-style', VUEFSALDTA_URL . 'includes/css/frontend.css' );
wp_enqueue_style( 'fsa-mt-front-style' );

wp_register_style( 'fsa-mt-admin-style', VUEFSALDTA_URL . 'includes/css/admin.css' );
wp_enqueue_style( 'fsa-mt-admin-style' );

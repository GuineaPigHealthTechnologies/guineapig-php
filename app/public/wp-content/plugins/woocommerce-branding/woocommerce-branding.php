<?php
/**
 * Plugin Name: WooCommerce Branding
 * Plugin URI: http://woocommerce.com/products/branding/
 * Description: Rebrand WooCommerce using your own brand name, colour scheme, and icon.
 * Version: 1.0.17
 * Author: WooCommerce
 * Author URI: https://woocommerce.com/
 * Requires at least: 3.1
 * Tested up to: 4.8
 * Woo: 19003:b57eb3de77456cf73ef6f7456a03ea83
 * WC tested up to: 3.4
 * WC requires at least: 2.6
 *
 * Copyright: © 2009-2017 WooCommerce.
 * License: GNU General Public License v3.0
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 */

/**
 * Required functions
 */
if ( ! function_exists( 'woothemes_queue_update' ) )
	require_once( 'woo-includes/woo-functions.php' );

/**
 * Plugin updates
 */
woothemes_queue_update( plugin_basename( __FILE__ ), 'b57eb3de77456cf73ef6f7456a03ea83', '19003' );

if ( is_woocommerce_active() ) {

    /**
     * Localisation
     **/
    load_plugin_textdomain( 'wc_branding', false, dirname( plugin_basename( __FILE__ ) ) . '/' );

	require_once( 'classes/class-wc-branding.php' );

	$woocommerce_branding = new WC_Branding( __FILE__ );

}

/**
 * Activation
 **/
register_activation_hook( __FILE__, 'activate_woocommerce_branding' );

function activate_woocommerce_branding() {

	// Ensure WC Extensions Flash is disabled
	update_option('hide-wc-extensions-message', 1);

}

<?php
/**
 * Mix and Match Child Item Details Wrapper
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/mnm/grid/mnm-child-item-details-wrapper-open.php.
 *
 * HOWEVER, on occasion WooCommerce Mix and Match will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @author  Kathy Darling
 * @package WooCommerce Mix and Match/Templates
 * @since   1.3.0
 * @version 1.3.0
 */
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ){
	exit;
}
?>
<li class="<?php echo esc_attr( join( ' ', get_post_class( 'mnm_item') ) ); ?>" data-regular_price="<?php echo esc_attr( $regular_price ); ?>" data-price="<?php echo esc_attr( $price );?>" >
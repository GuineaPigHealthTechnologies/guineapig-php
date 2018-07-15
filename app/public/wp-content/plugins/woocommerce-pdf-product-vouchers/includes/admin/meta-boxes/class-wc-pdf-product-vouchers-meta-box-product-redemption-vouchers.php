<?php
/**
 * WooCommerce PDF Product Vouchers
 *
 * This source file is subject to the GNU General Public License v3.0
 * that is bundled with this package in the file license.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.gnu.org/licenses/gpl-3.0.html
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@skyverge.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade WooCommerce PDF Product Vouchers to newer
 * versions in the future. If you wish to customize WooCommerce PDF Product Vouchers for your
 * needs please refer to https://docs.woocommerce.com/document/woocommerce-pdf-product-vouchers/ for more information.
 *
 * @package   WC-PDF-Product-Vouchers/Admin/Meta-Boxes
 * @author    SkyVerge
 * @copyright Copyright (c) 2012-2018, SkyVerge, Inc.
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 */

defined( 'ABSPATH' ) or exit;

/**
 * PDF Product Vouchers Product Redemption Vouchers Meta Box
 *
 * @since 3.4.0
 */
class WC_PDF_Product_Vouchers_Meta_Box_Product_Redemption_Vouchers {


	/**
	 * Sets up the meta box.
	 *
	 * @since 3.4.0
	 */
	public function __construct() {

		add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ), 30 );
		add_action( 'woocommerce_process_product_meta', array( $this, 'save' ), 30 );
	}


	/**
	 * Adds the meta box.
	 *
	 * @internal
	 *
	 * @since 3.4.0
	 */
	public function add_meta_box() {
		add_meta_box( 'wc-pdf-product-vouchers-product-redemption-vouchers', __( 'Redemption vouchers', 'woocommerce-pdf-product-vouchers' ), array( $this, 'output' ), 'product', 'side' );
	}


	/**
	 * Outputs meta box contents.
	 *
	 * @internal
	 *
	 * @since 3.4.0
	 *
	 * @param \WP_Post $post the post object
	 */
	public function output( $post ) {
		$voucher_template_ids = explode(',', get_post_meta( $post->ID, '_wc_pdf_product_vouchers_redeemable_by', true ) );
		$voucher_templates    = ! empty( $voucher_template_ids ) ? array_filter( array_map( 'wc_pdf_product_vouchers_get_voucher_template', $voucher_template_ids ) ) : array();
		?>

		<label for="_wc_pdf_product_vouchers_redeemable_by"><?php esc_html_e( 'Redeemable by', 'woocommerce-pdf-product-vouchers' ); ?></label>

		<?php echo wc_help_tip( __( 'Select any single-purpose PDF product vouchers that can be used to redeem this product online.', 'woocommerce-pdf-product-vouchers' ) ); ?>

		<p>
			<?php if ( SV_WC_Plugin_Compatibility::is_wc_version_gte_3_0() ) : ?>

				<select
					name="_wc_pdf_product_vouchers_redeemable_by[]"
					id="_wc_pdf_product_vouchers_redeemable_by"
					class="sv-wc-enhanced-search"
					style="min-width: 100%;"
					multiple="multiple"
					data-action="wc_pdf_product_vouchers_json_search_single_purpose_voucher_templates"
					data-nonce="<?php echo wp_create_nonce( 'search-voucher-templates' ); ?>"
					data-placeholder="<?php esc_attr_e( 'Search for a voucher template&hellip;', 'woocommerce-pdf-product-vouchers' ); ?>"
					data-allow_clear="true">
					<?php if ( ! empty( $voucher_templates ) ) : ?>
						<?php foreach( $voucher_templates as $voucher_template ) : ?>
							<option value="<?php echo esc_attr( $voucher_template->get_id() ); ?>" selected><?php echo esc_html( $voucher_template->get_name() ); ?></option>
						<?php endforeach; ?>
					<?php endif; ?>
				</select>

			<?php else : ?>

				<input
					type="hidden"
					name="_wc_pdf_product_vouchers_redeemable_by"
					id="_wc_pdf_product_vouchers_redeemable_by"
					class="sv-wc-enhanced-search"
					style="min-width: 100%;"
					data-multiple="true"
					data-action="wc_pdf_product_vouchers_json_search_single_purpose_voucher_templates"
					data-nonce="<?php echo wp_create_nonce( 'search-voucher-templates' ); ?>"
					data-placeholder="<?php esc_attr_e( 'Search for a voucher template&hellip;', 'woocommerce-pdf-product-vouchers' ); ?>"
					data-allow_clear="true"
					data-selected="<?php
					$json_ids = array();

					if ( ! empty( $voucher_templates ) ) {

						foreach ( $voucher_templates as $voucher_template ) {
							$json_ids[ $voucher_template->get_id() ] = wp_kses_post( html_entity_decode( $voucher_template->get_name() ) );
						}
					}

					echo esc_attr( wp_json_encode( $json_ids ) ); ?>"
					value="<?php echo esc_attr( implode( ',', array_keys( $json_ids ) ) ); ?>"
				/>

			<?php endif; ?>
		</p>

		<?php

		SV_WC_Helper::render_select2_ajax();
	}


	/**
	 * Processes and saves meta box data.
	 *
	 * @internal
	 *
	 * @since 3.4.0
	 *
	 * @param int $post_id post identifier
	 */
	public function save( $post_id ) {

		$voucher_template_ids = ! empty( $_POST['_wc_pdf_product_vouchers_redeemable_by'] ) ? $_POST['_wc_pdf_product_vouchers_redeemable_by'] : null;

		if ( ! empty( $voucher_template_ids ) ) {
			$voucher_template_ids = implode( ',', array_map( 'absint', $voucher_template_ids ) );
		}

		update_post_meta( $post_id, '_wc_pdf_product_vouchers_redeemable_by', $voucher_template_ids );
	}
}
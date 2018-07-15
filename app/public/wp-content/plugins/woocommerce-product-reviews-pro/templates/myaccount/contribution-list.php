<?php
/**
 * WooCommerce Product Reviews Pro
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
 * Do not edit or add to this file if you wish to upgrade WooCommerce Product Reviews Pro to newer
 * versions in the future. If you wish to customize WooCommerce Product Reviews Pro for your
 * needs please refer to http://docs.woocommerce.com/document/woocommerce-product-reviews-pro/ for more information.
 *
 * @package   WC-Product-Reviews-Pro/Templates
 * @author    SkyVerge
 * @copyright Copyright (c) 2015-2018, SkyVerge, Inc.
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 */

defined( 'ABSPATH' ) or exit;

/**
 * Renders any user contributions on the my account page.
 *
 * @type array $comments All comments generated by the user
 * @type array $enabled_contribution_types All enabled contribution types
 * @type array $comments_on All post types that comments have been left on by the user
 *
 * @version 1.9.0
 * @since 1.2.0
 */
?>

<div class="wc-product-reviews-pro-profile">

	<?php if ( in_array( 'product', $comments_on, true ) ) : ?>

		<table class="shop_table shop_table_responsive my_account_orders my_account_contributions">

			<thead>
				<tr>

					<th colspan="2" class="contributions-product">
						<span class="nobr"><?php echo sprintf( /* translators: Placeholders: %s - contribution type name for product */
								__( '%s for', 'woocommerce-product-reviews-pro' ), ucwords( esc_attr( wc_product_reviews_pro_get_enabled_types_name() ) ) ); ?></span>
					</th>

					<?php if ( count( $enabled_contribution_types ) > 1 ) : ?>

						<th class="contributions-type">
							<span class="nobr"><?php esc_html_e( 'Type', 'woocommerce-product-reviews-pro' ); ?></span>
						</th>

					<?php endif; ?>

					<th class="contributions-date">
						<span class="nobr"><?php esc_html_e( 'Left on', 'woocommerce-product-reviews-pro' ); ?></span>
					</th>

					<?php if ( 'yes' === get_option( 'woocommerce_enable_review_rating' ) ) : ?>

						<th class="contributions-rating">
							<span class="nobr"><?php esc_html_e( 'Rating', 'woocommerce-product-reviews-pro' ); ?></span>
						</th>

					<?php endif; ?>

					<th class="contributions-content" style="width: 30% !important;">
						<span class="nobr"><?php esc_html_e( 'Content', 'woocommerce-product-reviews-pro' ); ?></span>
					</th>

					<?php
						/**
						 * Fires after the contributions columns, before the actions column in my contributions table header
						 *
						 * @since 1.1.0
						 */
						do_action( 'wc_product_reviews_pro_my_account_column_headers' );
					?>

					<th class="contributions-actions">
						&nbsp;
					</th>

				</tr>
			</thead>

			<tbody>

			<?php foreach ( $comments as $comment ) :

				$contribution_type = wc_product_reviews_pro_get_contribution_type( $comment->comment_type );

				if ( $comment->comment_type ) {
					$contribution_type_title = $contribution_type->get_title();
				} else {
					$contribution_type_title = __( 'Comment', 'woocommerce-product-reviews-pro' );
				}

				$product_name = get_the_title( $comment->comment_post_ID );
				$product_url  = get_permalink( $comment->comment_post_ID );
				$rating       = get_comment_meta( $comment->comment_ID, 'rating', true );

				?>

				<?php if ( 'product' === get_post_type( $comment->comment_post_ID ) ) : ?>

					<tr class="contribution">

						<td class="contribution-photo" data-title="<?php esc_attr_e( 'Product photo', 'woocommerce-product-reviews-pro' ); ?>">
							<a href="<?php echo esc_url( $product_url ); ?>">
								<span class="contribution-product-thumbnail"><?php echo get_the_post_thumbnail( $comment->comment_post_ID, array( 48, 48 ), array( 'class' => 'aligncenter' ) ); ?></span>
							</a>
						</td>

						<td class="contribution-product" data-title="<?php
							/* translators: Placeholder: %s - contribution type name (e.g. 'Review') */
							printf( __( '%s for', 'woocommerce-product-reviews-pro' ), esc_attr( $contribution_type_title ) );?>">
							 <a href="<?php echo esc_url( $product_url ); ?>">
								 <span class="contribution-product-name"><?php echo esc_html( $product_name ); ?></span>
							 </a>
						</td>

			 			<?php if ( count( $enabled_contribution_types ) > 1 ) :?>

				 			<td class="contribution-type" data-title="<?php esc_attr_e( 'Type', 'woocommerce-product-reviews-pro' ); ?>">
								<?php printf( '<span class="contribution-type contribution-type-%1$s">%2$s</span>', esc_attr( $comment->comment_type ), esc_attr( $contribution_type_title ) ); ?>
				 			</td>

						 <?php endif; ?>

			 			<td class="contribution-date" data-title="<?php
					        /* translators: Placeholder: %s - contribution date */
					        printf( __( '%s date', 'woocommerce-product-reviews-pro' ), esc_attr( $contribution_type_title ) ); ?>">
				 			<time datetime="<?php echo esc_attr( $comment->comment_date ); ?>" title="<?php echo esc_attr( $comment->comment_date ); ?>"><?php echo date_i18n( get_option( 'date_format' ), strtotime( $comment->comment_date ) ); ?></time>
						 </td>

			 			<?php if ( 'yes' === get_option( 'woocommerce_enable_review_rating' ) ) : ?>

				 			<td class="contribution-rating" style="text-align:left; white-space:nowrap;" data-title="<?php esc_attr_e( 'Rating', 'woocommerce-product-reviews-pro' ); ?>">

					 			<?php if ( 'review' === $comment->comment_type ) : ?>

						 			<?php if ( $rating ) : ?>
							 			<div class="star-rating" title="<?php echo esc_html( $rating ); ?> stars out of 5">
											 <span style="width:<?php echo ( $rating / 5 ) * 100; ?>%;"><?php printf( /* translators: Placeholders: %s - rating (e.g. 4.2 out of 5) */
													 __( '%s out of 5', 'woocommerce-product-reviews-pro' ), '<strong>' . esc_html( $rating ) . '</strong>' ); ?></span>
							 			</div>

							 		<?php else : ?>

							            <span><?php esc_html_e( 'none',  'woocommerce-product-reviews-pro' ); ?></span>

							 		<?php endif; ?>

					 			<?php else: ?>

									 <span>&mdash;</span>

					 			<?php endif; ?>

				 			</td>

			 			<?php endif; ?>

				 		<td class="contribution-content" style="text-align:left;" data-title="<?php
					        /* translators: Placeholder: %s contribution type name */
					        printf( __( '%s content', 'woocommerce-product-reviews-pro' ), esc_attr( $contribution_type_title ) ); ?>">
							 <?php echo wp_kses_post( $comment->comment_content ); ?>
				 		</td>

			 			<?php
							/**
							 * Fires after the contribution columns, before the actions column in my contributions table
							 *
							 * @since 1.1.0
							 * @param $comment
							 */
							do_action( 'wc_product_reviews_pro_my_account_columns', $comment );
						 ?>

						 <td class="contribution-actions" data-title="<?php esc_attr_e( 'Actions', 'woocommerce-product-reviews-pro' ); ?>">
					 		<?php

						 	$actions = array();

						 	$actions['view'] = array(
								'url'  => get_comment_link( $comment ),
								'name' => __( 'View', 'woocommerce-product-reviews-pro' ),
						 	);

							/**
							 * Filter contribution actions on my account page
							 *
							 * @since 1.0.0
							 * @param array $actions
							 * @param $comment
							 */
							$actions = apply_filters( 'wc_product_reviews_pro_my_account_actions', $actions, $comment );

							if ( $actions ) {
								foreach ( $actions as $key => $action ) {
								 	echo '<a href="' . esc_url( $action['url'] ) . '" class="button ' . sanitize_html_class( $key ) . '">' . esc_html( $action['name'] ) . '</a>';
							 	}
					 		}

							?>
						</td>
					</tr>

				<?php endif; ?>

			<?php endforeach; ?>

			</tbody>

		</table>

	<?php else : ?>

		<p>
			<?php
				/* translators: Placeholders: %1$s - contribution type name, %2$s - opening <a> link tag, %3$s - closing </a> link tag */
				echo sprintf( __( 'You have not added any %1$s yet. %2$sAdd one now%3$s', 'woocommerce-product-reviews-pro' ), wc_product_reviews_pro_get_enabled_types_name(), '<a href="' . esc_url( wc_get_page_permalink( 'shop' ) ) . '">', '</a>' );
			?>
		</p>

	<?php endif; ?>

</div>

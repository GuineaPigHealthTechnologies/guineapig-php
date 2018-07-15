jQuery( function( $ ) {

	var enhanced_select_format_string = {
		'language' : {
			errorLoading: function() {
				// Workaround for https://github.com/select2/select2/issues/4355 instead of i18n_ajax_error.
				return wc_composite_admin_params.i18n_searching;
			},
			inputTooLong: function( args ) {
				var overChars = args.input.length - args.maximum;

				if ( 1 === overChars ) {
					return wc_composite_admin_params.i18n_input_too_long_1;
				}

				return wc_composite_admin_params.i18n_input_too_long_n.replace( '%qty%', overChars );
			},
			inputTooShort: function( args ) {
				var remainingChars = args.minimum - args.input.length;

				if ( 1 === remainingChars ) {
					return wc_composite_admin_params.i18n_input_too_short_1;
				}

				return wc_composite_admin_params.i18n_input_too_short_n.replace( '%qty%', remainingChars );
			},
			loadingMore: function() {
				return wc_composite_admin_params.i18n_load_more;
			},
			maximumSelected: function( args ) {
				if ( args.maximum === 1 ) {
					return wc_composite_admin_params.i18n_selection_too_long_1;
				}

				return wc_composite_admin_params.i18n_selection_too_long_n.replace( '%qty%', args.maximum );
			},
			noResults: function() {
				return wc_composite_admin_params.i18n_no_matches;
			},
			searching: function() {
				return wc_composite_admin_params.i18n_searching;
			}
		}
	};

	// Regular select2 fields init. Code duplicated to prevent expensive DOM searches when firing 'wc-enhanced-select-init'.
	$.fn.wc_cp_select2 = function() {

		// Regular select boxes.
		$( ':input.wc-enhanced-select', this ).filter( ':not(.enhanced)' ).each( function() {

			var $el          = $( this ),
				select2_args = $.extend( {
					minimumResultsForSearch: 10,
					allowClear:              $el.data( 'allow_clear' ) ? true : false,
					placeholder:             $el.data( 'placeholder' )
				}, enhanced_select_format_string );


			if ( 'yes' === wc_composite_admin_params.is_wc_version_gte_3_2 ) {
				$el.selectWoo( select2_args ).addClass( 'enhanced' );
			} else {
				$el.select2( select2_args ).addClass( 'enhanced' );
			}

			if ( $el.data( 'sortable' ) ) {

				var $list = $el.next( '.select2-container' ).find( 'ul.select2-selection__rendered' );

				$list.sortable( {
					placeholder : 'ui-state-highlight select2-selection__choice',
					forcePlaceholderSize: true,
					items       : 'li:not(.select2-search__field)',
					tolerance   : 'pointer',
					stop: function() {
						$( $list.find( '.select2-selection__choice' ).get().reverse() ).each( function() {
							var id     = $( this ).data( 'data' ).id;
							var option = $el.find( 'option[value="' + id + '"]' )[0];
							$el.prepend( option );
						} );
					}
				} );
			}

		} );

		// Ajax product search box.
		$( ':input.wc-product-search', this ).filter( ':not(.enhanced)' ).each( function() {

			var $el          = $( this ),
				select2_args = {
				allowClear:         $el.data( 'allow_clear' ) ? true : false,
				placeholder:        $el.data( 'placeholder' ),
				minimumInputLength: $el.data( 'minimum_input_length' ) ? $el.data( 'minimum_input_length' ) : '3',
				escapeMarkup: function( m ) {
					return m;
				},
				ajax: {
					url:         wc_enhanced_select_params.ajax_url,
					dataType:    'json',
					delay:       250,
					data:        function( params ) {
						return {
							term:     params.term,
							action:   $el.data( 'action' ) || 'woocommerce_json_search_products_and_variations',
							security: wc_enhanced_select_params.search_products_nonce,
							exclude:  $el.data( 'exclude' ),
							include:  $el.data( 'include' ),
							limit:    $el.data( 'limit' )
						};
					},
					processResults: function( data ) {
						var terms = [];
						if ( data ) {
							$.each( data, function( id, text ) {
								terms.push( { id: id, text: text } );
							} );
						}
						return {
							results: terms
						};
					},
					cache: true
				}
			};

			select2_args = $.extend( select2_args, enhanced_select_format_string );

			if ( 'yes' === wc_composite_admin_params.is_wc_version_gte_3_2 ) {
				$el.selectWoo( select2_args ).addClass( 'enhanced' );
			} else {
				$el.select2( select2_args ).addClass( 'enhanced' );
			}

			if ( $el.data( 'sortable' ) ) {

				var $list = $( this ).next( '.select2-container' ).find( 'ul.select2-selection__rendered' );

				$list.sortable( {
					placeholder : 'ui-state-highlight select2-selection__choice',
					forcePlaceholderSize: true,
					items       : 'li:not(.select2-search__field)',
					tolerance   : 'pointer',
					stop: function() {
						$( $list.find( '.select2-selection__choice' ).get().reverse() ).each( function() {
							var id     = $( this ).data( 'data' ).id;
							var option = $el.find( 'option[value="' + id + '"]' )[0];
							$el.prepend( option );
						} );
					}
				} );

			// Keep multiselects ordered alphabetically if they are not sortable.
			} else if ( $el.prop( 'multiple' ) ) {

				$el.on( 'change', function(){

					var $children = $el.children();

					$children.sort( function( a, b ) {

						var atext = a.text.toLowerCase(),
							btext = b.text.toLowerCase();

						if ( atext > btext ) {
							return 1;
						}

						if ( atext < btext ) {
							return -1;
						}

						return 0;
					} );

					$el.html( $children );
				} );
			}
		} );
	};

	// Custom select2 fields init.
	$.fn.wc_cp_select2_component_options = function() {

		$( ':input.wc-component-options-search', this ).filter( ':not(.enhanced)' ).each( function() {

			var $select      = $( this ),
				action       = $select.data( 'action' ),
				select2_args = {
				allowClear:         $select.data( 'allow_clear' ) ? true : false,
				placeholder:        $select.data( 'placeholder' ),
				minimumInputLength: $select.data( 'minimum_input_length' ) ? $( this ).data( 'minimum_input_length' ) : '3',
				escapeMarkup: function( m ) {
					return m;
				},
				ajax: {
					url:         wc_enhanced_select_params.ajax_url,
					dataType:    'json',
					quietMillis: 250,
					data: function( params ) {
						return {
							term:      params.term,
							action:    action,
							security:  wc_enhanced_select_params.search_products_nonce,
							exclude:   $select.data( 'exclude' ),
							include:   $select.data( 'include' ),
							limit:     $select.data( 'limit' )
						};
					},
					processResults: function( data ) {
						var terms = [];

						if ( 'yes' === $select.data( 'component_optional' ) ) {
							terms.push( { id: '-1', text: wc_composite_admin_params.i18n_none } );
						}

						terms.push( { id: '0', text: wc_composite_admin_params.i18n_all } );

						if ( data ) {
							$.each( data, function( id, text ) {
								terms.push( { id: id, text: text } );
							} );
						}

						return { results: terms };
					},

					cache: true
				}
			};

			select2_args = $.extend( select2_args, enhanced_select_format_string );

			if ( 'yes' === wc_composite_admin_params.is_wc_version_gte_3_2 ) {
				$( this ).selectWoo( select2_args ).addClass( 'enhanced' );
			} else {
				$( this ).select2( select2_args ).addClass( 'enhanced' );
			}

		} );
	};

	var $components_panel          = $( '#bto_product_data' ),
		$components_toggle_toolbar = $components_panel.find( '.bulk_toggle_wrapper' ),
		$components_container      = $( '.config_group', $components_panel ),
		$component_metaboxes       = $( '.bto_groups', $components_container ),
		$components                = $( '.bto_group', $component_metaboxes ),
		component_add_count        = $components.length,
		component_objects          = {},
		$scenarios_panel           = $( '#bto_scenario_data' ),
		$scenarios_toggle_toolbar  = $scenarios_panel.find( '.bulk_toggle_wrapper' ),
		$scenarios_container       = $( '.scenarios_config_group', $scenarios_panel ),
		$scenario_metaboxes        = $( '.bto_scenarios', $scenarios_panel ),
		$scenarios                 = $( '.bto_scenario', $scenario_metaboxes ),
		scenario_add_count         = $scenarios.length,
		scenario_objects           = {},
		component_image_frame_data = {
			image_frame: false,
			$button:     false
		},
		block_params               = {
			message:    null,
			overlayCSS: {
				background: '#fff',
				opacity:    0.6
			}
		};

	// Composite type move stock msg up.
	$( '.composite_stock_msg' ).appendTo( '._manage_stock_field .description' );

	// Hide the default "Sold Individually" field.
	$( '#_sold_individually' ).closest( '.form-field' ).addClass( 'hide_if_composite' );

	// Hide the "Grouping" field.
	$( '#linked_product_data .grouping.show_if_simple, #linked_product_data .form-field.show_if_grouped' ).addClass( 'hide_if_composite' );

	// Simple type options are valid for bundles.
	$( '.show_if_simple:not(.hide_if_composite)' ).addClass( 'show_if_composite' );

	if ( typeof woocommerce_admin_meta_boxes === 'undefined' ) {
		woocommerce_admin_meta_boxes = woocommerce_writepanel_params;
	}

	// Composite type specific options.
	$( 'body' ).on( 'woocommerce-product-type-change', function( event, select_val ) {

		if ( 'composite' === select_val ) {

			$( '.show_if_external' ).hide();
			$( '.show_if_composite' ).show();

			$( 'input#_manage_stock' ).change();
		}

	} );

	$( 'select#product-type' ).change();

	// Downloadable support.
	$( 'input#_downloadable' ).change( function() {
		$( 'select#product-type' ).change();
	} );

	// Layout selection.
	$( '.bundle_group .bto_layouts', $components_panel ).on( 'click', '.bto_layout_label', function() {

		$( this ).closest( '.bto_layouts' ).find( '.selected' ).removeClass( 'selected' );
		$( this ).addClass( 'selected' );

	} );

	// Update component DOM elements, menu order and toolbar state.
	$components_panel.on( 'wc-cp-components-changed', function() {

		$component_metaboxes = $( '.bto_groups', $components_container );
		$components          = $( '.bto_group', $component_metaboxes );

		$components.each( function( index, el ) {
			$( '.group_position', el ).val( index );
			$( el ).attr( 'rel', index );
		} );

		update_components_toolbar_state();
	} );

	// Update scenario DOM elements, menu order and toolbar state.
	$scenarios_panel.on( 'wc-cp-scenarios-changed', function() {

		$scenario_metaboxes = $( '.bto_scenarios', $scenarios_panel );
		$scenarios          = $( '.bto_scenario', $scenario_metaboxes );

		$scenarios.each( function( index, el ) {
			$( '.scenario_position', el ).val( index );
			$( el ).attr( 'rel', index );
		} );

		update_scenarios_toolbar_state();
	} );

	/*------------------------------------------*/
	/*  Components                              */
	/*------------------------------------------*/

	function Component( $el ) {

		var self = this;

		this.$el                        = $el;
		this.$content                   = $el.find( '.bto_group_data' );
		this.$metabox_title             = $el.find( 'h3 .group_name' );
		this.$section_links             = this.$content.find( '.subsubsub a' );
		this.$sections                  = this.$content.find( '.tab_group' );
		this.$discount                  = this.$content.find( '.group_discount' );
		this.$filters                   = this.$content.find( '.group_filters' );
		this.$display_prices            = this.$content.find( '.component_display_prices' );
		this.$pagination_style          = this.$content.find( '.component_pagination_style' );

		this.$query_type_containers     = this.$content.find( '.bto_query_type_selector' );
		this.$query_type_selector       = this.$content.find( 'select.bto_query_type' );
		this.$options_style_selector    = this.$content.find( 'select.options_style_selector' );

		this.$title_input               = this.$content.find( 'input.group_title' );
		this.$priced_individually_input = this.$content.find( '.group_priced_individually input' );
		this.$show_filters_input        = this.$content.find( '.group_show_filters input' );

		this.selectWoo_initialized      = false;

		this.component_toggled = function() {

			if ( ! self.selectWoo_initialized ) {
				self.selectWoo_lazy();
			}
		};

		this.section_changed = function( $section_link ) {

			self.$section_links.removeClass( 'current' );
			$section_link.addClass( 'current' );

			self.$sections.addClass( 'tab_group_hidden' );
			self.$content.find( '.tab_group_' + $section_link.data( 'tab' ) ).removeClass( 'tab_group_hidden' );
		};

		this.title_changed = function() {

			self.$metabox_title.text( self.$title_input.val() );
		};

		this.query_type_changed = function() {

			self.$query_type_containers.hide();
			self.$content.find( '.bto_query_type_' + self.$query_type_selector.val() ).show();
		};

		this.options_style_changed = function() {

			if ( 'yes' === self.$options_style_selector.find( 'option[value="' + self.$options_style_selector.val() + '"]' ).data( 'supports_pagination' ) ) {
				self.$pagination_style.show();
			} else {
				self.$pagination_style.hide();
			}
		};

		this.priced_individually_input_changed = function() {

			if ( self.$priced_individually_input.is( ':checked' ) ) {
				self.$discount.show();
				self.$display_prices.show();
			} else {
				self.$discount.hide();
				self.$display_prices.hide();
			}
		};

		this.show_filters_input_changed = function() {

			if ( self.$show_filters_input.is( ':checked' ) ) {
				self.$filters.show();
			} else {
				self.$filters.hide();
			}
		};

		this.initialize = function() {

			self.query_type_changed();
			self.options_style_changed();
			self.priced_individually_input_changed();
			self.show_filters_input_changed();
		};

		this.selectWoo_lazy = function() {

			var $product_search_lazy  = self.$content.find( '.wc-product-search-lazy' ),
				$enhanced_select_lazy = self.$content.find( '.wc-enhanced-select-lazy' );

			$product_search_lazy.addClass( 'wc-product-search' );
			$enhanced_select_lazy.addClass( 'wc-enhanced-select' );

			self.$content.wc_cp_select2();

			$product_search_lazy.removeClass( 'wc-product-search' );
			$enhanced_select_lazy.removeClass( 'wc-enhanced-select' );

			self.selectWoo_initialized = true;
		};

		this.initialize();
	}

	function update_components_toolbar_state() {

		if ( $components.length > 0 ) {
			$components_toggle_toolbar.removeClass( 'disabled' );
		} else {
			$components_toggle_toolbar.addClass( 'disabled' );
		}
	}

	function init_component_event_handlers() {

		/*
		 * Component Handlers.
		 */

		$components_container

			// selectWoo init on expand.
			.on( 'click', '.expand_all', function() {

				if ( $( this ).hasClass( 'disabled' ) ) {
					return false;
				}

				$.each( component_objects, function( index, component_object ) {
					component_object.selectWoo_lazy();
					setTimeout( function() {
						component_object.$content.show();
					}, 50 );

				} );

				return false;
			} )

			// selectWoo init.
			.on( 'mouseover click', '.bto_group_handle', function() {

				var $el       = $( this ).closest( '.bto_group' ),
					el_id     = $el.data( 'component_metabox_id' ),
					component = component_objects[ el_id ];

				if ( typeof( component ) !== 'undefined' ) {
					component.component_toggled();
				}
			} )

			// Subsubsub navigation.
			.on( 'click', '.subsubsub a', function( e ) {

				var $section_link   = $( this ),
					$el             = $( this ).closest( '.bto_group' ),
					el_id           = $el.data( 'component_metabox_id' ),
					component       = component_objects[ el_id ];

				component.section_changed( $section_link );

				e.preventDefault();
			} )

			// Component Remove.
			.on( 'click', 'a.remove_row', function( e ) {

				var $el   = $( this ).closest( '.bto_group' ),
					el_id = $el.data( 'component_metabox_id' );

				$el.find( '*' ).off();
				$el.remove();

				delete component_objects[ el_id ];

				$components_panel.triggerHandler( 'wc-cp-components-changed' );

				e.preventDefault();
			} )

			// Component Keyup.
			.on( 'keyup', 'input.group_title', function() {

				var $el             = $( this ).closest( '.bto_group' ),
					el_id           = $el.data( 'component_metabox_id' ),
					component       = component_objects[ el_id ];

				component.title_changed();
			} )

			// Query type.
			.on( 'change', 'select.bto_query_type', function() {

				var $el             = $( this ).closest( '.bto_group' ),
					el_id           = $el.data( 'component_metabox_id' ),
					component       = component_objects[ el_id ];

				component.query_type_changed();
			} )

			// Options style.
			.on( 'change', 'select.options_style_selector', function() {

				var $el             = $( this ).closest( '.bto_group' ),
					el_id           = $el.data( 'component_metabox_id' ),
					component       = component_objects[ el_id ];

				component.options_style_changed();
			} )

			// Priced individually.
			.on( 'change', '.group_priced_individually input', function() {

				var $el             = $( this ).closest( '.bto_group' ),
					el_id           = $el.data( 'component_metabox_id' ),
					component       = component_objects[ el_id ];

				component.priced_individually_input_changed();
			} )

			// Filters.
			.on( 'change', '.group_show_filters input', function() {

				var $el             = $( this ).closest( '.bto_group' ),
					el_id           = $el.data( 'component_metabox_id' ),
					component       = component_objects[ el_id ];

				component.show_filters_input_changed();
			} )

			// Set Image.
			.on( 'click', '.upload_component_image_button', function( e ) {

				component_image_frame_data.$button = $( this );

				e.preventDefault();

				// If the media frame already exists, reopen it.
				if ( component_image_frame_data.image_frame ) {

					component_image_frame_data.image_frame.open();

				} else {

					// Create the media frame.
					component_image_frame_data.image_frame = wp.media( {

						// Set the title of the modal.
						title: wc_composite_admin_params.i18n_choose_component_image,
						button: {
							text: wc_composite_admin_params.i18n_set_component_image
						},
						states: [
							new wp.media.controller.Library( {
								title: wc_composite_admin_params.i18n_choose_component_image,
								filterable: 'all'
							} )
						]
					} );

					// When an image is selected, run a callback.
					component_image_frame_data.image_frame.on( 'select', function () {

						var attachment = component_image_frame_data.image_frame.state().get( 'selection' ).first().toJSON(),
							url        = attachment.sizes && attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url;

						component_image_frame_data.$button.addClass( 'has_image' );
						component_image_frame_data.$button.closest( '.component_image' ).find( '.remove_component_image_button' ).addClass( 'has_image' );
						component_image_frame_data.$button.find( 'input' ).val( attachment.id ).change();
						component_image_frame_data.$button.find( 'img' ).eq( 0 ).attr( 'src', url );
					} );

					// Finally, open the modal.
					component_image_frame_data.image_frame.open();
				}

			} )

			// Remove Image.
			.on( 'click', '.remove_component_image_button', function( e ) {

				var $button         = $( this ),
					$option_wrapper = $button.closest( '.component_image' ),
					$upload_button  = $option_wrapper.find( '.upload_component_image_button' );

				e.preventDefault();

				$upload_button.removeClass( 'has_image' );
				$button.removeClass( 'has_image' );
				$option_wrapper.find( 'input' ).val( '' ).change();
				$upload_button.find( 'img' ).eq( 0 ).attr( 'src', wc_composite_admin_params.wc_placeholder_img_src );

			} );

		/*
		 * Add Component.
		 */

		$components_panel.on( 'click', 'button.add_bto_group', function() {

			$components_panel.block( block_params );

			component_add_count++;

			var data = {
				action:   'woocommerce_add_composite_component',
				post_id:  woocommerce_admin_meta_boxes.post_id,
				id:       component_add_count,
				security: wc_composite_admin_params.add_component_nonce
			};

			setTimeout( function() {

				$.post( woocommerce_admin_meta_boxes.ajax_url, data, function ( response ) {

					$component_metaboxes.append( response );

					var $added    = $( '.bto_group', $component_metaboxes ).last(),
						added_obj = new Component( $added ),
						added_id  = 'component_' + component_add_count;

					$added.data( 'component_metabox_id', added_id );
					component_objects[ added_id ] = added_obj;

					$components_panel.triggerHandler( 'wc-cp-components-changed' );

					// selectWoo init.
					added_obj.selectWoo_lazy();

					// Help-tips init.
					$added.find( '.woocommerce-help-tip' ).tipTip( {
						'attribute': 'data-tip',
						'fadeIn':    50,
						'fadeOut':   50,
						'delay':     200
					} );

					$components_panel.triggerHandler( 'wc-cp-component-added', [ added_obj ] );
					$components_panel.unblock();

				} );

			}, 250 );

			return false;

		} );

	}

	function init_component_metaboxes() {

		// Component sorting.
		$component_metaboxes.sortable( {
			items: '.bto_group',
			cursor: 'move',
			axis: 'y',
			handle: 'h3',
			scrollSensitivity: 40,
			forcePlaceholderSize: true,
			helper: 'clone',
			opacity: 0.65,
			placeholder: 'wc-metabox-sortable-placeholder',
			start: function( event, ui ){
				ui.item.css( 'background-color','#f6f6f6' );
			},
			stop: function( event, ui ){
				ui.item.removeAttr( 'style' );
				$components_panel.triggerHandler( 'wc-cp-components-changed' );
			}
		} );

		update_components_toolbar_state();
	}

	function init_component_objects() {

		component_objects = {};

		// Create objects.
		$components.each( function( index ) {

			var $el   = $( this ),
				el_id = 'component_' + index;

			$el.data( 'component_metabox_id', el_id );
			component_objects[ el_id ] = new Component( $el );
		} );

		// Initialize metaboxes.
		init_component_metaboxes();
	}

	function init_components() {

		// Attach event handlers.
		init_component_event_handlers();

		// Create objects.
		init_component_objects();
	}

	init_components();


	/*--------------------------------------------------*/
	/*  Scenarios                                       */
	/*--------------------------------------------------*/

	function Scenario( $el ) {

		var self = this;

		this.$el                                   = $el;
		this.$content                              = $el.find( '.bto_scenario_data' );
		this.$metabox_title                        = $el.find( 'h3 .scenario_name' );

		this.$title_input                          = this.$content.find( 'input.scenario_title' );
		this.$conditional_components_action_input  = this.$content.find( '.toggle_conditional_components input' );

		this.$conditional_components_action_config = this.$content.find( '.scenario_action_conditional_components_group .action_components' );

		this.selectWoo_initialized                 = false;

		this.scenario_toggled = function() {

			if ( ! self.selectWoo_initialized ) {
				self.selectWoo_lazy();
			}
		};

		this.title_changed = function() {

			self.$metabox_title.text( self.$title_input.val() );
		};

		this.component_modifier_changed = function( $modifier ) {

			if ( 'masked' === $modifier.val() ) {
				$modifier.closest( '.bto_scenario_selector' ).find( '.bto_scenario_selector_inner' ).slideUp( 200 );
			} else {
				$modifier.closest( '.bto_scenario_selector' ).find( '.bto_scenario_selector_inner' ).slideDown( 200 );
			}
		};

		this.conditional_components_action_input_changed = function() {

			if ( self.$conditional_components_action_input.is( ':checked' ) ) {
				self.$conditional_components_action_config.slideDown( 200 );
			} else {
				self.$conditional_components_action_config.slideUp( 200 );
			}
		};

		this.selectWoo_lazy = function() {

			var $component_options_search_lazy = self.$content.find( '.wc-component-options-search-lazy' ),
				$enhanced_select_lazy          = self.$content.find( '.wc-enhanced-select-lazy' );

			$component_options_search_lazy.addClass( 'wc-component-options-search' );
			$enhanced_select_lazy.addClass( 'wc-enhanced-select' );

			self.$content.wc_cp_select2();
			self.$content.wc_cp_select2_component_options();

			$component_options_search_lazy.removeClass( 'wc-component-options-search' );
			$enhanced_select_lazy.removeClass( 'wc-enhanced-select' );

			self.selectWoo_initialized = true;
		};

		this.initialize = function() {
			// Emptiness.
		};

		this.initialize();
	}

	function update_scenarios_toolbar_state() {

		if ( $scenarios.length > 0 ) {
			$scenarios_toggle_toolbar.removeClass( 'disabled' );
		} else {
			$scenarios_toggle_toolbar.addClass( 'disabled' );
		}
	}

	function init_scenario_event_handlers() {

		$scenarios_container

			// selectWoo init on expand.
			.on( 'click', '.expand_all', function() {

				if ( $( this ).hasClass( 'disabled' ) ) {
					return false;
				}

				$.each( scenario_objects, function( index, scenario_object ) {
					scenario_object.selectWoo_lazy();
					setTimeout( function() {
						scenario_object.$content.show();
					}, 50 );

				} );

				return false;
			} )

			// selectWoo init.
			.on( 'mouseover click', '.bto_scenario_handle', function() {

				var $el      = $( this ).closest( '.bto_scenario' ),
					el_id    = $el.data( 'scenario_metabox_id' ),
					scenario = scenario_objects[ el_id ];

				if ( typeof( scenario ) !== 'undefined' ) {
					scenario.scenario_toggled();
				}
			} )

			// Scenario Remove.
			.on( 'click', 'a.remove_row', function( e ) {

				var $el   = $( this ).closest( '.bto_scenario' ),
					el_id = $el.data( 'scenario_metabox_id' );

				$el.find( '*' ).off();
				$el.remove();

				delete scenario_objects[ el_id ];

				$scenarios_panel.triggerHandler( 'wc-cp-scenarios-changed' );

				e.preventDefault();
			} )

			// Scenario Keyup.
			.on( 'keyup', 'input.scenario_title', function() {

				var $el      = $( this ).closest( '.bto_scenario' ),
					el_id    = $el.data( 'scenario_metabox_id' ),
					scenario = scenario_objects[ el_id ];

				scenario.title_changed();
			} )

			// Exclude option modifier.
			.on( 'change', 'select.bto_scenario_exclude', function() {

				var $el      = $( this ).closest( '.bto_scenario' ),
					el_id    = $el.data( 'scenario_metabox_id' ),
					scenario = scenario_objects[ el_id ];

				scenario.component_modifier_changed( $( this ) );
			} )

			// "Hide Components" scenario action.
			.on( 'change', '.toggle_conditional_components input', function() {

				var $el      = $( this ).closest( '.bto_scenario' ),
					el_id    = $el.data( 'scenario_metabox_id' ),
					scenario = scenario_objects[ el_id ];

				scenario.conditional_components_action_input_changed();
			} )

			// Add scenario.
			.on( 'click', 'button.add_bto_scenario', function () {

				$scenarios_panel.block( block_params );

				scenario_add_count++;

				var data = {
					action: 	'woocommerce_add_composite_scenario',
					post_id: 	woocommerce_admin_meta_boxes.post_id,
					id: 		scenario_add_count,
					security: 	wc_composite_admin_params.add_scenario_nonce
				};

				setTimeout( function() {

					$.post( woocommerce_admin_meta_boxes.ajax_url, data, function ( response ) {

						$scenario_metaboxes.append( response );

						var $added    = $( '.bto_scenario', $scenario_metaboxes ).last(),
							added_obj = new Scenario( $added ),
							added_id  = 'scenario_' + scenario_add_count;

						$added.data( 'scenario_metabox_id', added_id );
						scenario_objects[ added_id ] = added_obj;

						$scenarios_panel.triggerHandler( 'wc-cp-scenarios-changed' );

						// selectWoo init.
						added_obj.selectWoo_lazy();

						// Help-tips init.
						$added.find( '.tips, .woocommerce-help-tip' ).tipTip( {
							'attribute': 'data-tip',
							'fadeIn':    50,
							'fadeOut':   50,
							'delay':     200
						} );

						$scenarios_panel.triggerHandler( 'wc-cp-scenario-added', [ added_obj ] );
						$scenarios_panel.unblock();

					} );

				}, 250 );

				return false;
			} );
	}

	function init_scenario_metaboxes() {

		// Scenario ordering.
		$scenario_metaboxes.sortable( {
			items: '.bto_scenario',
			cursor: 'move',
			axis: 'y',
			handle: 'h3',
			scrollSensitivity: 40,
			forcePlaceholderSize: true,
			helper: 'clone',
			opacity: 0.65,
			placeholder: 'wc-metabox-sortable-placeholder',
			start: function( event, ui ){
				ui.item.css( 'background-color','#f6f6f6' );
			},
			stop: function( event, ui ){
				ui.item.removeAttr( 'style' );
				$scenarios_panel.triggerHandler( 'wc-cp-scenarios-changed' );
			}
		} );

		update_scenarios_toolbar_state();
	}

	function init_scenario_objects() {

		scenario_objects = {};

		// Create objects.
		$scenarios.each( function( index ) {

			var $el   = $( this ),
				el_id = 'scenario_' + index;

			$el.data( 'scenario_metabox_id', el_id );
			scenario_objects[ el_id ] = new Scenario( $el );
		} );

		// Initialize metaboxes.
		init_scenario_metaboxes();
	}

	function init_scenarios() {

		// Attach event handlers.
		init_scenario_event_handlers();

		// Create objects.
		init_scenario_objects();
	}

	init_scenarios();

	/*
	 * Save data and update configuration options via ajax.
	 */
	$( '.save_composition' ).on( 'click', function() {

		$components_panel.block( block_params );
		$scenarios_panel.block( block_params );

		$components.find( '*' ).off();

		var data = {
			post_id:  woocommerce_admin_meta_boxes.post_id,
			data:     $( '#bto_product_data, #bto_scenario_data' ).find( 'input, select, textarea' ).serialize(),
			action:   'woocommerce_bto_composite_save',
			security: wc_composite_admin_params.save_composite_nonce
		};

		setTimeout( function() {

			$.post( woocommerce_admin_meta_boxes.ajax_url, data, function( post_response ) {

				var this_page = window.location.toString();

				this_page = this_page.replace( 'post-new.php?', 'post.php?post=' + woocommerce_admin_meta_boxes.post_id + '&action=edit&' );

				$.get( this_page, function( response ) {

					var open_components               = [],
						open_scenarios                = [],
						$components_group             = $( '#bto_config_group_inner', $components_panel ),
						$scenarios_group              = $( '#bto_scenarios_inner', $scenarios_panel ),
						$components_group_in_response = $( response ).find( '#bto_config_group_inner' ),
						$components_in_response       = $components_group_in_response.find( '.bto_group' ),
						$scenarios_group_in_response  = $( response ).find( '#bto_scenarios_inner' ),
						$scenarios_in_response        = $scenarios_group_in_response.find( '.bto_scenario' );

					// Remember open/close state of Components.
					if ( $components.length === $components_in_response.length ) {

						// Make a list of open Components.
						$components.each( function() {

							var $el = $( this );

							if ( $el.hasClass( 'open' ) ) {
								var rel = $el.attr( 'rel' );
								open_components.push( rel );
							}
						} );
					}

					// Apply open/close state to Components in response.
					$components_in_response.each( function() {

						var $el = $( this ),
							rel = $el.attr( 'rel' );

						if ( $.inArray( rel, open_components ) !== -1 ) {
							$el.addClass( 'open' ).removeClass( 'closed' );
							$el.find( '.wc-metabox-content' ).show();
						} else {
							$el.find( '.wc-metabox-content' ).hide();
						}
					} );

					// Remember open/close state of Scenarios.
					if ( $scenarios.length === $scenarios_in_response.length ) {

						// Make a list of open Scenarios.
						$scenarios_group.find( '.bto_scenario' ).each( function() {

							var $el = $( this );

							if ( $el.hasClass( 'open' ) ) {
								var rel = $el.attr( 'rel' );
								open_scenarios.push( rel );
							}
						} );
					}

					// Apply open/close state to Scenarios in response.
					$scenarios_in_response.each( function() {

						var $el = $( this ),
							rel = $el.attr( 'rel' );

						if ( $.inArray( rel, open_scenarios ) !== -1 ) {
							$el.addClass( 'open' ).removeClass( 'closed' );
							$el.find( '.wc-metabox-content' ).show();
						} else {
							$el.find( '.wc-metabox-content' ).hide();
						}
					} );

					$components.find( '*' ).off();
					$scenarios.find( '*' ).off();

					$components_group.html( $components_group_in_response.html() );
					$scenarios_group.html( $scenarios_group_in_response.html() );

					$components_toggle_toolbar = $components_group.find( '.bulk_toggle_wrapper' );
					$scenarios_toggle_toolbar  = $scenarios_group.find( '.bulk_toggle_wrapper' );

					// Trigger change event.
					$components_panel.triggerHandler( 'wc-cp-components-changed' );

					// Create objects.
					init_component_objects();

					// Trigger change event.
					$scenarios_panel.triggerHandler( 'wc-cp-scenarios-changed' );

					// Create objects.
					init_scenario_objects();

					// Init helptips.
					$( '#bto_product_data .woocommerce-help-tip, #bto_scenario_data .woocommerce-help-tip, #bto_scenario_data .tips' ).tipTip( {
						'attribute': 'data-tip',
						'fadeIn':    50,
						'fadeOut':   50,
						'delay':     200
					} );

					// selectWoo init - open components.
					$components.each( function() {

						var $el = $( this );

						if ( $el.hasClass( 'open' ) ) {

							var el_id     = $el.data( 'component_metabox_id' ),
								component = component_objects[ el_id ];

							component.selectWoo_lazy();
						}
					} );

					// selectWoo init - open scenarios.
					$scenarios.each( function() {

						var $el = $( this );

						if ( $el.hasClass( 'open' ) ) {

							var el_id    = $el.data( 'scenario_metabox_id' ),
								scenario = scenario_objects[ el_id ];

							scenario.selectWoo_lazy();
						}
					} );

					if ( post_response.length > 0 ) {
						$.each( post_response, function( index, part ) {
							window.alert( part );
						} );
					}

					$components_panel.unblock();
					$scenarios_panel.unblock();

				} );

			}, 'json' );

		}, 250 );

	} );

} );

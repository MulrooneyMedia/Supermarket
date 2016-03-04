/**
 * @fileoverview This file contains the primary JavaScript for the Sainsbury's Groceries site.
 *
 * @authors Anthony Jeffery, David Moore, Tom Newman
 * @version 1.0
 */

/**
 * Stores document body object
 * @type Object
 */
var docBody;

JS = {}; // JS (J Sainsbury) namespace
JS = JS || {};
JS.ele = {}; // Used for caching elements
JS.pageName = ''; // Stores ID from <body> tag to identify the page we are on
JS.objects = {};

/**
 * Base object that controls which objects are called on which pages
 */
JS.base = new (function(){

    /**
     * Will run on page load. Called from JS.base.init() which is called instantiated by dojo.ready
     */
    this.init = function (){
        var addSubscriptionOptions = {};

        docBody = document.body;
        JS.pageName = docBody.id;

        // Set up the clear text functionality for the search field
        JS.setupClearTextButton('search','clearSearch');

        // Set up the Floating Header
        JS.objects.floatingHeader = new JS.FloatingHeader();

        // Set up checkout walkbar
        JS.objects.walkbar = new JS.positionWalkBar();

        // Set up the Floating Trolley
        JS.objects.floatingTrolley = new JS.FloatingTrolley({floatingHeader:JS.objects.floatingHeader,checkoutWalkBar:JS.objects.walkbar});

        // Set up the Global Nav
        JS.objects.globalNav = new JS.GlobalNav('#globalHeader .globalNav > li');

        // Set up trolley controls
        if (JS.pageName != 'billingDetails') {
            // Build AddSubscription options only for the Create Auto Order/Regular Shop Only
            if (JS.pageName === 'autorderSubscription') {
                addSubscriptionOptions = {
                    errorViewName: 'AjaxAddItemToSubscriptionView',
                    ajaxAddToSubscriptionCommand: 'AjaxAddItemToSubscriptionList',
                    aboveMinSpendElementsQuery: '.addItemsAboveMinSpendAction',
                    belowMinSpendElementsQuery: '.addItemsBelowMinSpendAction',
                    updateFrequency: true
                };
            }
            JS.objects.trolleyObj = new JS.Trolley({floatingTrolley:JS.objects.floatingTrolley});
            JS.objects.addSubscriptionObj = new JS.AddSubscription(addSubscriptionOptions);
        }

        // Set up the Interactive Breadcrumb
        // AJ - Works for now, but may need to re-think how we do this
        if (dojo.byId('breadcrumbNav'))
            JS.objects.breadcrumbNav = new JS.Breadcrumb('#breadcrumbNav ul > li');

        // Switch statement to determine what objects/functions to work with, based on the page name.
        // For the sake of performance, key pages should be listed higher in the case statement.
        switch (JS.pageName){
            case 'searchResultsPage':
                JS.objects.gridView = new JS.EqualHeightRows('#content .gridItem');
                JS.objects.brandFilters = new JS.FilterBoxes({totalOptionsCount: "#filterOptions .topBrands .input", extraOptionsContainerId: "extraTopBrandCheckboxes", whereToPlaceShowHide: {element:"extraTopBrandCheckboxes"} });
                JS.objects.dietaryFilters = new JS.FilterBoxes({totalOptionsCount: "#filterOptions #dietAndLifestyle .input", extraOptionsContainerId: "extraDietaryCheckboxes", whereToPlaceShowHide: {element:"extraDietaryCheckboxes"} });
                JS.objects.paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize');
                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();
                JS.objects.filter = new JS.Filter({tabs:JS.objects.subscribeTabs.cacheBuildBind,gridViewObject:JS.objects.gridView,paginationAutoSubmitObject:JS.objects.paginationSubmit,trolleyObject:JS.objects.trolleyObj,addSubscriptionObject:JS.objects.addSubscriptionObj,ajaxAction:'AjaxApplyFilterSearchResultView',filterBoxes:[JS.objects.brandFilters,JS.objects.dietaryFilters]});
                break;
            case 'shelfPage':

                JS.objects.gridView = new JS.EqualHeightRows('#content .gridItem');
                JS.objects.brandFilters = new JS.FilterBoxes({totalOptionsCount: "#filterOptions .topBrands .input", extraOptionsContainerId: "extraTopBrandCheckboxes", whereToPlaceShowHide: {element:"extraTopBrandCheckboxes"} });
                JS.objects.dietaryFilters = new JS.FilterBoxes({totalOptionsCount: "#filterOptions #dietAndLifestyle .input", extraOptionsContainerId: "extraDietaryCheckboxes", whereToPlaceShowHide: {element:"extraDietaryCheckboxes"} });
                JS.objects.paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize');
                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();
                JS.objects.filter = new JS.Filter({tabs:JS.objects.subscribeTabs.cacheBuildBind,gridViewObject:JS.objects.gridView,paginationAutoSubmitObject:JS.objects.paginationSubmit,trolleyObject:JS.objects.trolleyObj,addSubscriptionObject:JS.objects.addSubscriptionObj,ajaxAction:'AjaxApplyFilterBrowseView',filterBoxes:[JS.objects.brandFilters,JS.objects.dietaryFilters]});


                break;
            case 'favDisplay':
                JS.objects.gridView = new JS.EqualHeightRows('#content .gridItem');
                var previousOrdersSubmit = new JS.AutoSubmit('#previousOrderId');
                break;
            case 'favouritesPreviousOrder':
                JS.objects.gridView = new JS.EqualHeightRows('#content .gridItem');
                JS.objects.paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize');
                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();
                JS.objects.filter = new JS.Filter({tabs:JS.objects.subscribeTabs.cacheBuildBind,gridViewObject:JS.objects.gridView,paginationAutoSubmitObject:JS.objects.paginationSubmit,collapseFilterByDefault:true,trolleyObject:JS.objects.trolleyObj,addSubscriptionObject:JS.objects.addSubscriptionObj,ajaxAction:'AjaxApplyFilterFavouritesByOrderView'});

                var previousOrdersSubmit = new JS.AutoSubmit('#previousOrderId');
                break;
            case 'favouritesOnOffer':
                JS.objects.gridView = new JS.EqualHeightRows('#content .gridItem');
                JS.objects.paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize');
                JS.objects.removeFavourites = new JS.RemoveFavourites();
                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();
                JS.objects.filter = new JS.Filter({tabs:JS.objects.subscribeTabs.cacheBuildBind,gridViewObject:JS.objects.gridView,paginationAutoSubmitObject:JS.objects.paginationSubmit,collapseFilterByDefault:true,trolleyObject:JS.objects.trolleyObj,addSubscriptionObject:JS.objects.addSubscriptionObj,ajaxAction:'AjaxApplyFilterFavouritesOnOfferView'});

                break;
            case 'favsByAisle':
                JS.objects.gridView = new JS.EqualHeightRows('#content .gridItem');
                JS.objects.paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize');
                JS.objects.removeFavourites = new JS.RemoveFavourites();
                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();
                JS.objects.filter = new JS.Filter({tabs:JS.objects.subscribeTabs.cacheBuildBind,gridViewObject:JS.objects.gridView,paginationAutoSubmitObject:JS.objects.paginationSubmit,collapseFilterByDefault:true,trolleyObject:JS.objects.trolleyObj,addSubscriptionObject:JS.objects.addSubscriptionObj,ajaxAction:'AjaxApplyFilterFavouritesByAisleView'});

                break;
            case 'favouritesSingleList':
                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();
                JS.objects.gridView = new JS.EqualHeightRows('#content .gridItem');
                JS.objects.paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize');
                JS.objects.removeFavourites = new JS.RemoveFavourites();
                JS.objects.filter = new JS.Filter({tabs:JS.objects.subscribeTabs.cacheBuildBind,gridViewObject:JS.objects.gridView,paginationAutoSubmitObject:JS.objects.paginationSubmit,collapseFilterByDefault:true,trolleyObject:JS.objects.trolleyObj,addSubscriptionObject:JS.objects.addSubscriptionObj,ajaxAction:'AjaxApplyFilterFavouritesBySingleListView'});
                break;
            case 'productDetails':
                JS.objects.pdpTabs = new JS.TabSet(['information','reviews','moreInfo']);

                var hash = location.hash.replace('#', '');
                if (hash == 'reviews') {
                    JS.objects.pdpTabs.showTab(hash);
                    JS.SmoothScroll(hash);
                } else {
                    JS.objects.pdpTabs.showTab('information');
                }

                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();

                JS.objects.checkFacebook = new JS.HideBlockedContent('#content .facebook', 'http://www.facebook.com/favicon.ico');

                JS.objects.scene7Instance = new JS.Scene7ImageViewer();

                break;
            case 'shoppingListResults':
                JS.objects.gridView = new JS.EqualHeightRows('#content .gridItem');
                JS.objects.brandFilters = new JS.FilterBoxes({totalOptionsCount: "#filterOptions .topBrands .input", extraOptionsContainerId: "extraTopBrandCheckboxes", whereToPlaceShowHide: {element:"extraTopBrandCheckboxes"} });
                JS.objects.dietaryFilters = new JS.FilterBoxes({totalOptionsCount: "#filterOptions #dietAndLifestyle .input", extraOptionsContainerId: "extraDietaryCheckboxes", whereToPlaceShowHide: {element:"extraDietaryCheckboxes"} });
                JS.objects.paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize');
                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();
                JS.objects.filter = new JS.Filter({tabs:JS.objects.subscribeTabs.cacheBuildBind,gridViewObject:JS.objects.gridView,paginationAutoSubmitObject:JS.objects.paginationSubmit,trolleyObject:JS.objects.trolleyObj,addSubscriptionObject:JS.objects.addSubscriptionObj,ajaxAction:'AjaxApplyFilterSearchResultView',filterBoxes:[JS.objects.brandFilters,JS.objects.dietaryFilters]});
                break;
            case 'quickRegistration':
                var registerFormValidate = new JS.FormValidator('Register','messageArea',_quickRegRuleset,{jumpListErrorHtmlStart:'<h2>Sorry but registration has failed for the reasons listed below:</h2><ul>'});
                JS.objects.tooltips = new JS.Tooltips('#content .tipLink');
                var preventPaste = new JS.preventPaste(['logonPasswordVerify', 'email_verify']);
                break;
            case 'fullTrolley':
                var updateSubstitutePreference = new JS.updateSubstitutePreference('MySubstitutePreference');
                var autoSubmit = new JS.AutoSubmit('select#sortBy');
                JS.objects.tooltips = new JS.Tooltips('#content .tipLink');
                break;
            case 'recipeDisplay':
                JS.objects.recipeTabs = new JS.TabSet(['information','reviews','video','nutrition','ingredients']);
                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();
                var hash = location.hash.replace('#', '');
                if (hash == 'reviews') {
                    JS.objects.recipeTabs.showTab(hash);
                    JS.SmoothScroll(hash);
                }
                else {
                    JS.objects.recipeTabs.showTab('information','reviews');
                }
                dojo.connect(dojo.byId("conversionCalc"),"click",function(e){
                    e.preventDefault();
                    JS.Popup({url:dojo.byId("conversionCalc").href, windowName: "conversionCalulator", width:500, height:400});
                });
                JS.objects.checkFacebook = new JS.HideBlockedContent('#content .facebook', 'http://www.facebook.com/favicon.ico');
                break;
            case 'chooseDeliveryAddress':
                JS.objects.tooltips = new JS.Tooltips('#content .tipLink');
                break;
            case 'zonePage':
                JS.objects.paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize');
                break;
            case 'promoPage':
                JS.objects.paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize');
                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();
                break;
            case 'recipesTipsLanding':
                JS.base.cacheElements(['showHideFilterSlither','showHideDietAndLifestyle']);
                var mainShelfFilter = new JS.ExpandingPanel('filterOptions',{collapseClass:'jsHide',collapseLinkClass:'visible',collapseByDefault:false});
                mainShelfFilter.addLink(JS.ele['showHideFilterSlither'],0);
                var dietFilter = new JS.ExpandingPanel('dietAndLifestyle',{collapseClass:'jsHide',collapseLinkClass:'visible'});
                dietFilter.addLink(JS.ele['showHideDietAndLifestyle'],0);
                JS.objects.gridView = new JS.EqualHeightRows('#content .recipeResults > li');
                JS.objects.dietaryFilters = new JS.FilterBoxes({totalOptionsCount: "#filterOptions #dietAndLifestyle .input", extraOptionsContainerId: "extraDietaryCheckboxes", whereToPlaceShowHide: {element:"extraDietaryCheckboxes"} });
                break;
            case 'recipesTips':
                JS.base.cacheElements(['showHideFilterSlither','showHideDietAndLifestyle']);
                var mainShelfFilter = new JS.ExpandingPanel('filterOptions',{collapseClass:'jsHide',collapseLinkClass:'visible',collapseByDefault:false});
                mainShelfFilter.addLink(JS.ele['showHideFilterSlither'],0);
                var dietFilter = new JS.ExpandingPanel('dietAndLifestyle',{collapseClass:'jsHide',collapseLinkClass:'visible'});
                dietFilter.addLink(JS.ele['showHideDietAndLifestyle'],0);
                JS.objects.gridView = new JS.EqualHeightRows('#content .recipeResults > li');
                JS.objects.paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize');
                JS.objects.dietaryFilters = new JS.FilterBoxes({totalOptionsCount: "#filterOptions #dietAndLifestyle .input", extraOptionsContainerId: "extraDietaryCheckboxes", whereToPlaceShowHide: {element:"extraDietaryCheckboxes"} });
                JS.objects.filterSubmit = new JS.AutoSubmit('#filterOptions input[type="checkbox"], #filterOptions select');
                break;
            case 'bookDeliverySlotPage':
                JS.DeliveryPass('deliveryPassOverlay');
                JS.objects.slotTimeFilter = new JS.SlotTimeFilter();
                JS.objects.deliverySlots = new JS.DeliverySlots({bookingMessageHtml:htmlForCheckingDeliverySlot});
                JS.objects.fixedSlotTableHeader = new JS.FloatingSlotTableHeader();
                JS.objects.slotTooltips = new JS.Tooltips('.promoSlot a',
                    {
                        tooltipMarkup:
                            '<div class="tooltip hoverTooltip" id="JSHoverTooltip">' +
                                '<div class="tooltipInner">' +
                                    '<div class="tooltipText" id="JSHoverTooltipText"></div>' +
                                    '<div class="tooltipArrow" id="JSHoverTooltipArrow"></div>' +
                                '</div>' +
                            '</div>',
                        containerID: 'JSHoverTooltip',
                        textID: 'JSHoverTooltipText',
                        arrowID: 'JSHoverTooltipArrow',
                        tooltipTextClass: 'slotTip',
                        positioning: 'top',
                        triggeredOnClick: false
                    });
                break;
            case 'orderShippingBillingDetails':
                var updateSubstitutePreference = new JS.updateSubstitutePreference('MySubstitutePreference');
                JS.objects.tooltips = new JS.Tooltips('#CheckoutMoreDetails .tipLink');
                if (typeof _moreDetailsRuleset != 'undefined')
                    var moreDetailsFormValidate = new JS.FormValidator('CheckoutMoreDetails','messageArea',_moreDetailsRuleset,{submitButtons:"#continueCheckoutInitial,#continueCheckout"});
                dojo.connect(dojo.byId("useSameDelivery"),"click",function(){
                    if ( dojo.byId("useSameDelivery").checked ) {
                        JS.copyValues(_moreDetailsCopyAddress);
                    } else {
                        JS.deleteValues(_moreDetailsCopyAddress);
                    }
                });
                break;
            case 'billingDetails':
                JS.base.cacheElements(['showBagChargeInfo','showNoBagsInfo']);
                var billingDetailsFormValidate = new JS.FormValidator('PaymentForm','messageArea',_billingDetailsRuleset,{submitButtons:'#sendOrderInitial,#sendOrder'});
                JS.objects.tooltips = new JS.Tooltips('#content .tipLink');
                JS.objects.paginationSubmit = new JS.AutoSubmit('#myBaggingPreference input[type="radio"]');
                var bagChargeInfoToggle = new JS.ExpandingPanel('bagChargeInfo',{collapseClass:'jsHide',collapseLinkClass:'visible', collapsedText:'Show information about shopping without bags', expandedText:'Close information about shopping without bags'});
                bagChargeInfoToggle.addLink(JS.ele['showBagChargeInfo'],0);

                break;
            case 'ideaDisplay':
                JS.objects.gridView = new JS.EqualHeightRows('#content .gridItem');
                JS.objects.paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize');
                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();
                break;
            case 'groceriesSiteDown':
                JS.siteRunningCheck(window.location.protocol+'//'+window.location.host,'/wcsstore/SainsburysStorefrontAssetStore/img/header-logo.gif');
                break;
            case 'orderSummary':
                JS.objects.tooltips = new JS.Tooltips('#content .tipLink');
                break;
            case 'orderConfirmation':
                JS.objects.tooltips = new JS.Tooltips('#content .tipLink');
                break;
            case 'missedFavourites':
                JS.objects.gridView = new JS.EqualHeightRows('#content .gridItem');
                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();
                break;
            case 'missedPromotions':
                JS.objects.gridView = new JS.EqualHeightRows('#content .gridItem');
                JS.objects.subscribeTabs = new JS.AddAndSubscribeTabs();
                break;
            case 'checkoutPleaseWait':
                var threeDSecureForm = document.getElementById('threeDForm');
                if (threeDSecureForm)
                    threeDSecureForm.submit();
                break;
            case 'paymentGatewayIframeReturncheckoutPleaseWait':
                var threeDSecureForm = document.getElementById('PaymentGatewayIframeReturnEndPoint');
                if (threeDSecureForm)
                    threeDSecureForm.submit();
                break;
            case 'threeDLaunch':
                var threeDSecureForm = document.getElementById('threeDForm');
                // Check the form exists and that the timeout variable exists
                if (threeDSecureForm && typeof threeDAttemptTimeout !== 'undefined'){
                    // Submit the form
                    threeDSecureForm.submit();
                    // Reloads the iframe at the specified timeout, just in case the form doesn't submit
                    setTimeout(function(){location.reload(true)},threeDAttemptTimeout);
                }
                break;
            case 'switchAndSave':
                JS.objects.switchAndSave = new JS.EqualHeightRows(dojo.query('#content .switchProduct'));
                break;
            case 'greatOffersPage':
                JS.objects.gridView = new JS.EqualHeightRows('#content .greatOffersList .productESpot',{usesStraplines:false, blockClass:'productESpot'});
                break;
            case 'viewSubscriptionDisplay':
                //The tourStep array is located in viewMySubscriptionDisplay.jsp
                if(document.getElementById('onboarding_steps')){
                    JS.objects.SubscriptionPageTour = new JS.PageTour(
                        [
                            {
                                referenceElement : 'overviewTab',
                                espotId : 'onboarding_1',
                                positioning : 'bottom',
                                arrowPosition :'middle',
                                boxWidth:'433px'
                            },
                            {
                                referenceElement : 'ReserveSlot',
                                espotId : 'onboarding_2',
                                positioning : 'bottom',
                                arrowPosition :'middle',
                                boxWidth:'433px'
                            },
                            {
                                referenceElement : 'ConvertedToOrder',
                                espotId : 'onboarding_3',
                                positioning : 'bottom',
                                arrowPosition : 'middle',
                                boxWidth:'621px'
                            }
                        ]
                    );
                }


                JS.objects.tooltips = new JS.Tooltips('#content .tipLink',{positioning:'bottom'});
                JS.objects.accordionToggle = new JS.toggleAccordion('.accordionAnchor');
                JS.objects.paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize,#SubmitTab');
                JS.objects.ErrorMessage = new JS.ErrorMessageHandler({
                    messageContainerId:'messageArea'
                });

                JS.objects.saveItem = new JS.saveSubscriptionItem();

                JS.objects.tabSubmit = (function(){

                    var selectElem = dojo.byId('SubmitTab');

                    if(selectElem != null){
                        dojo.connect( selectElem, 'onchange', function(e) {
                            // Show the spinner overlay
                            var _ajaxOverlay;
                            if (!_ajaxOverlay){
                                _ajaxOverlay = new JS.AreaOverlay({
                                    overlayClass: 'ajaxSpinner',
                                    overlayId:'ajaxSpinner',
                                    areaId:'viewSubscriptionDisplay'
                                },true);
                            }
                            _ajaxOverlay.show();
                        });
                    }
                })();

                break;
            case 'autorderSubscription':
                JS.objects.tooltips = new JS.Tooltips('#content .tipLink');
                JS.objects.autoOrderFixedProgressBar = new JS.FloatingProgressBar();

                JS.objects.slotTimeFilter = new JS.SlotTimeFilter();
                JS.objects.autoOrderSubscription = new JS.setupAutoOrderSubscriptionProcess();
                break;
            case 'subscriptionMinimumSpend':
                JS.objects.saveItem = new JS.saveSubscriptionItem();
                JS.objects.tooltips = new JS.Tooltips('#content .tipLink',{positioning:'bottom'});
                JS.objects.ErrorMessage = new JS.ErrorMessageHandler({
                    messageContainerId:'messageArea'
                });
                break;
            case 'collectLocationPage':
                JS.objects.locationDirectionsOverlay = new JS.AjaxOverlay('#collectLocationPage .clickCollectDirection');
                JS.objects.locationTypeSubmit = new JS.AutoSubmit('#selectedLocationType');
                JS.objects.locationsPostCodeValidation = new JS.FormValidator('locationTypeFilter','messageArea',_locationsCheckPostCodeRuleset);
                break;
            case 'enclosedVoucherDisplay':
                JS.objects.ErrorMessage = new JS.ErrorMessageHandler({
                    messageContainerId:'messageArea'
                });
                JS.objects.voucherList = new JS.VoucherList();
                JS.objects.addVoucherForm = new JS.AddVoucherForm();
                JS.objects.nectarConversion = new JS.NectarConversion({});
                break;
            case 'orderAmendConfirm':
                var btn = dojo.query('.process')[0];
                 dojo.connect(btn,"click",function(e){
                            if((navigator.userAgent.indexOf('Safari') > -1)||(navigator.userAgent.indexOf('Firefox') > -1)) {
                                if(e.preventDefault) {
                                    e.preventDefault();
                                } else {
                                    e.returnValue = false;
                                }
                            }
                            var _amendConfirmOverlay;
                            // Check that we do not already have an overlay created
                                  if (!_amendConfirmOverlay){
                                        _amendConfirmOverlay = new JS.Overlay({overlayBoxClass:'overlayBox addAllOverlay',clickToClose:false,centreVertically:true});
                                  }
                                  // Get height and width of body and assign to the DIV
                                  var _body = document.body;
                              var _bodyDimensions = dojo.position(_body);

                              // Set the width and height of the page overlay
                              var _pageOverlayElem = dojo.create('DIV',{
                                  className:pageOverlay,
                                id:pageOverlay
                            },
                            _body,
                            'first');
                              dojo.style(_pageOverlayElem,
                                  {
                                      height:'100%'
                                  });
                              // Unhide the page overlay
                              _amendConfirmOverlay.show('<div class="overlayBody"><img style="position:relative;top:30%;left:45%;margin-bottom:20px" src="/wcsstore/SainsburysStorefrontAssetStore/img/ajax-spinner.gif" /><p style="font-size:1.7em;margin:0">Sorry, this page is loading slower than usual. It\'ll take a few seconds and then you can continue. Thank you.</p></div>');
                              if((navigator.userAgent.indexOf('Safari') > -1)||(navigator.userAgent.indexOf('Firefox') > -1)) {
                                  setTimeout(function(){window.location.assign(btn.getAttribute('href'))},1000);
                                  return false;
                              }

                 });
                break;

        }

        // Check if the diet filter should display by default or not
        if (dojo.query("#dietAndLifestyle input:checked").length > 0) dietFilter.expandPanel();

        // RHS check delivery post code form validation
        if (typeof _rhsCheckPostCodeRuleset != 'undefined')
            var checkPostCodeValidation = new JS.FormValidator("Rhs_checkPostCode",null,_rhsCheckPostCodeRuleset,{populateErrorContainer:false});

        // RHS login form validation and login tooltip
        var checkLoginValidation = new JS.FormValidator("Rhs_signIn",null,_rhsLoginValidationRuleset,{populateErrorContainer:false});

        // Add any RHS tooltips
        var rhsTooltipsSelector = '#auxiliary .tipLink';
        if (JS.objects.tooltips){
            // Use existing tooltips object
            JS.objects.tooltips.add(rhsTooltipsSelector,'top');
        } else {
            // Create tooltips object
            JS.objects.tooltips = new JS.Tooltips(rhsTooltipsSelector,{positioning:'top'});
        }

        // Autocomplete search functionality
        JS.objects.autoCompleteSearch = new JS.AutoComplete('search');

        // Handle external links
        JS.objects.externalLinks = new JS.ExternalLinks();

        // RHS Booking slot AJAX
        // Needs _deliverySlotInfo to be defined in <head>
        if (_deliverySlotInfo) {
            var deliverySlotOptions = {
                currentServerDateTime: _deliverySlotInfo.currentDateTime,
                expiryServerDateTime: _deliverySlotInfo.expiryDateTime,
                warningThresholdInMinutesHtml: _deliverySlotInfo.ajaxCountDownUrl,
                expiryHtml: _deliverySlotInfo.ajaxExpiredUrl
            }
            JS.objects.rhsBookingSlot = new JS.BookingSlot(deliverySlotOptions);
        }

        if(_amendOrderSlotInfo) {
            var amendOrderSlotTimerOptions = {
                currentServerDateTime: _amendOrderSlotInfo.currentDateTime,
                expiryServerDateTime: _amendOrderSlotInfo.expiryDateTime,
                warningThresholdInMinutesHtml: _amendOrderSlotInfo.ajaxAmendOrderExpiryUrl
            }
            JS.objects.rhsAmendOrderSlotTimer = new JS.OrderAmendSlotTimer(amendOrderSlotTimerOptions);
        }
        // Check for placeholder support
        var checkPlaceholderSupport = new JS.Placeholder();
        JS.CancelOrderAmendOverlay();

        // Action Bright Tagger
        JS.brightTagger();
    }

    /**
     * Caches relevant objects into a private variable
     * @param {Array} eleCache An array of IDs of the elements to be cached
     */
    this.cacheElements = function(eleCache){
        dojo.forEach(eleCache, function(item, i){
            if(dojo.byId(item) != null){
                if(!JS.ele[item]){
                    JS.ele[item] = dojo.byId(item);
                }
            }
        });
    }

});

/**
 * BookingSlot
 * @param {Object} options An object containing configuration options
 *        countdownContainerId: ID of the container showing the countdown
 *        deliveryInfoContainerId: ID of the container showing the delivery information
 *        currentServerDateTime: The current date and time on the server
 *        expiryServerDateTime: The date and time (using server time) when the booking slot expires
 *        warningThresholdInMinutesHtml: Absolute URL of the HTML to show when warning threshold (warningThresholdInMinutes) reached
 *        warningThresholdInMinutesTextId: ID used in the warning threshold HTML(warningThresholdInMinutesHtml) to hold the minutes left text
 *        warningThresholdInMinutesId: ID used in the warning threshold HTML(warningThresholdInMinutesHtml) to hold the minutes left value
 *        warningThresholdUpdate: Millisecond value of how often to update the warning threshold value
 *        warningThreshold: Milliseconds before expiry that will trigger the warning threshold HTML AJAX request
 *        warningThresholdUnitPlural: Plural unit to use in countdown messaging
 *        warningThresholdUnitSingle: Singular unit to use in countdown messaging
 *        expiryHtml: Absolute URL of the HTML to show when the slot has expired reached
 *        debug:
 * @constructor
*/
JS.BookingSlot = function(options) {

    /**
    * Stores configuration options
    * @type Object
    * @private
    */
    var _config = {
        countdownContainerId: 'expiryCountdown',
        deliveryInfoContainerId: 'deliveryInfoPanel',
        currentServerDateTime: null,
        expiryServerDateTime: null,
        warningThresholdInMinutesHtml: '30mins.html',
        warningThresholdInMinutesTextId: 'timeLeftText',
        warningThresholdInMinutesId: 'timeLeftMinutes',
        warningThresholdUpdate: 60000,
        /* The following is set to 30 minutes minus 5 seconds. The extra 5 seconds is because
         * when resetting the time, the warning sometimes came back blank because the server hadn't
         * set up the expiry countdown for the slot. */
        warningThreshold: 1800000 - 5000,
        warningThresholdUnitPlural: 'minutes',
        warningThresholdUnitSingle: 'minute',
        expiryHtml: 'results.html'
    };

    /**
    * Container for the countdown info
    * @type Object
    * @private
    */
    var _countdownContainer;

    /**
    * Container for the delivery information
    * @type Object
    * @private
    */
    var _deliveryInfoContainer;

    /**
    * Div that contains the countdown text
    * @type Object
    * @private
    */
    var _timeLeftTextElem;

    /**
    * Div that contains the countdown value
    * @type Object
    * @private
    */
    var _timeLeftMinutesElem;

    /**
    * Used instead of 'this' in certain functions
    * @type Object
    * @private
    */
    var _self = this;

    /**
    * Variable that contains the millisecond value of time left until the delivery slot expires
    * @type String
    * @private
    */
    var _timeUntilExpires;

    /**
    * Variable that is used for the countdown interval
    * @type Object
    * @private
    */
    var _countDownTimer;

    /**
     * Variable that is used for the warning interval
     * @type Object
     * @private
     */
     var _warningTimer;

    /**
    * Variable that is used for the countdown value
    * @type String
    * @private
    */
    var _timeToGo;

    /**
     * Runs at set intervals (every 60 seconds as default) once the warning threshold has been reached.
     * @private
     */
    var _countDown = function() {
        // Decrement the expiry time
        _timeUntilExpires -= _config.warningThresholdUpdate;
        // If the time left is less than or equal to zero, we should get the expired HTML
        if ( _timeUntilExpires <= 0 ) {
            // Get the updated expired slot content
            dojo.xhrGet({
                url: _config.expiryHtml,
                preventCache: true,
                handleAs:"text",
                timeout: 10000,
                load: function(data, ioArgs){
                    // Stop the countdown function from firing again by clearing the interval
                    clearInterval(_countDownTimer);

                    // Change the HTML
                    dojo.place(data,_deliveryInfoContainer,'replace');
                    _self.cacheDeliveryInfoElements();

                    // Get rid of the countdown container
                    dojo.destroy(_countdownContainer);

                    // If we are on the book slot page, remove the booked slot from the table
                    if (typeof JS.objects.deliverySlots != 'undefined')
                        JS.objects.deliverySlots.removeBookedSlot();
                },
                error: function(err, ioArgs){
                    //_countdownContainer.innerHTML = "An unexpected error occurred: " + error;
                }
            });

        } else {
            // If the element can be found, update the value every time the function is called
            if (!_timeLeftTextElem)
                _timeLeftTextElem = dojo.byId(_config.warningThresholdInMinutesTextId);
            if (!_timeLeftMinutesElem)
                _timeLeftMinutesElem = dojo.byId(_config.warningThresholdInMinutesId);

            // Calculates the time left and rounds up to nearest minute
            _timeToGo = Math.ceil(_timeUntilExpires / 60000);

            // Output the time left in the HTML
            if (_timeLeftTextElem && _timeLeftMinutesElem) {
                if ( _timeToGo > 1 ) {
                    _timeLeftTextElem.innerHTML = _timeToGo + " " + _config.warningThresholdUnitPlural;
                } else {
                    _timeLeftTextElem.innerHTML = _timeToGo + " " + _config.warningThresholdUnitSingle;
                }
                // Adds leading zero if needed. Uses ternary padding technique seen here: http://jsperf.com/zero-padding
                _timeLeftMinutesElem.innerHTML = (_timeToGo < 10) ? ('0' + _timeToGo) : _timeToGo;
            }
        }

     }

     /**
      * Runs when the warning threshold is reached
      * @private
      */
     var _showWarning = function() {
        // Set the time until expiry (if needed)
        if (_timeUntilExpires > _config.warningThreshold)
            _timeUntilExpires = _config.warningThreshold;

        // Set timer for the countdown function
        _countDownTimer = setInterval(_countDown,_config.warningThresholdUpdate);

        // If backend already returns countdown HTML when rendering the page,
        // we don't need to redownload via AJAX
        if (!_countdownContainer) {
            dojo.xhrGet({
                url: _config.warningThresholdInMinutesHtml,
                preventCache: true,
                handleAs:"text",
                timeout: 10000,
                load: function(data, ioArgs) {
                    // Place the new countdown container
                    dojo.place(data,_deliveryInfoContainer,'after');
                    _cacheCountdownElements();

                    // A new element has been created in the RHS so the snapping positions of the elements
                    // need to be recalculated & mini trolley then resized
                    JS.objects.floatingTrolley.resizeMiniTrolley({recalculateSnappingPositions: true});
                },
                error: function(err, ioArgs) {
                    // Add error to div
                    var errorHtml = '<p>An unexpected error occurred: ' + err + '</p>';
                    //dojo.place(errorHtml,_deliveryInfoContainer,'after');

                }
            });
        }

     }

     /**
      * Sets the times for calculating the countdown and expiry, and sets timers in motion.
      * @param {String} currentTime The current time on the server.
      * @param {String} expiryTime The time on the server at which the slot expires.
      */
     var _setTimes = function(currentTime,expiryTime){
         // Set the two times as date objects
         var _currentTime = new Date(currentTime);
         var _expirationTime = new Date(expiryTime);

         // Calculate difference between the two times for expiry time
         _timeUntilExpires = _expirationTime.getTime() - _currentTime.getTime();

         // Calculate the time until warning function should be fired
         var _warningBeforeExpiry = (_timeUntilExpires - _config.warningThreshold);

         // If the time sent by the server is in the future
         // set the warning timer
         if ( _timeUntilExpires > 0 ) {
             // Set timer to run function when we reach the warning threshold
             _warningTimer = setTimeout(_showWarning,_warningBeforeExpiry);
         }
     }

     /**
      * Resets the times and timers for the countdown and expiry, and clears the countdown
      * element.
      * @param {String} currentTime The current time on the server.
      * @param {String} expiryTime The time on the server at which the slot expires.
      */
     this.resetTimes = function(currentTime,expiryTime){
         // Clear our timers
         clearInterval(_warningTimer);
         clearInterval(_countDownTimer);

         // Set the times
         _setTimes(currentTime,expiryTime);

         // Remove the countdown element if it exists
         if (_countdownContainer) {
             dojo.destroy(_countdownContainer);
             // Complete clear the element and child elements from the cache.
             // TODO: Figure out if this is the right way to do this from a memory standpoint.
             _countdownContainer = _timeLeftTextElem = _timeLeftMinutesElem = false;
         }
     }

     /**
      * Caches elements for the Delivery Information panel.
      */
     this.cacheDeliveryInfoElements = function(){
         _deliveryInfoContainer = dojo.byId(_config.deliveryInfoContainerId);
     }

     /**
      * Caches elements for the slot expiry countdown.
      * @private
      */
     var _cacheCountdownElements = function(){
        _countdownContainer = dojo.byId(_config.countdownContainerId);
        _timeLeftTextElem = dojo.byId(_config.warningThresholdInMinutesTextId);
        _timeLeftMinutesElem = dojo.byId(_config.warningThresholdInMinutesId);
     }

     /**
      * Initialises the bookingSlot object
      */
     var _init = function() {
        // Mixing the config options
        if (options)
            _config = new JS.mixin(_config,options);

        // Cache our elements
        _self.cacheDeliveryInfoElements();
        _cacheCountdownElements();

        // Check that the elemId has been passed
        if (!_deliveryInfoContainer) return false;

        // Check that the server times have been passed from server into the page header
        if (!_config.currentServerDateTime || !_config.expiryServerDateTime) return false;

        // Set the times for calculating the countdown and expiry
        _setTimes(_config.currentServerDateTime,_config.expiryServerDateTime);
    }

    _init();
}

/**
 * OrderAmendSlotTimer
 * @param {Object} options An object containing configuration options
 *        countdownContainerId: ID of the container showing the countdown
 *        currentServerDateTime: The current date and time on the server
 *        expiryServerDateTime: The date and time (using server time) when the booking slot expires
 *        warningThresholdInMinutesId: ID used in the warning threshold HTML(warningThresholdInMinutesHtml) to hold the minutes left value
 *        warningThresholdUpdate: Millisecond value of how often to update the warning threshold value
 *        warningThreshold: Milliseconds before expiry that will trigger the warning threshold HTML AJAX request
 *        warningThresholdUnitPlural: Plural unit to use in countdown messaging
 *        warningThresholdUnitSingle: Singular unit to use in countdown messaging
 *        expiryHtml: Absolute URL of the HTML to show when the slot has expired reached
 *        debug:
 * @constructor
*/
JS.OrderAmendSlotTimer = function(options) {

    /**
    * Stores configuration options
    * @type Object
    * @private
    */
     var _config = {
                countdownContainerId: 'countDownContainer',
                currentServerDateTime: null,
                expiryServerDateTime: null,
                orderAmendSlotTimeCountId: 'orderAmendSlotTimeCount',
                changeSlotLink: 'changeSlotLink',
                warningThresholdUpdate: 60000,
                /* The following is set to 30 minutes minus 5 seconds. The extra 5 seconds is because
                 * when resetting the time, the warning sometimes came back blank because the server hadn't
                 * set up the expiry countdown for the slot. */
                warningThreshold: 1800000 - 5000,
                warningThresholdUnitPlural: 'minutes',
                warningThresholdUnitSingle: 'minute',
                expiryHtml: 'results.html'
            };

            /**
            * Container for the countdown info
            * @type Object
            * @private
            */
            var _countdownContainer;

            /**
            * Div that contains the countdown value
            * @type Object
            * @private
            */
            var _timeLeftMinutesElem;

            /**
            * Used instead of 'this' in certain functions
            * @type Object
            * @private
            */
            var _self = this;

            /**
            * Variable that contains the millisecond value of time left until the delivery slot expires
            * @type String
            * @private
            */
            var _timeUntilExpires;

            /**
            * Variable that is used for the countdown interval
            * @type Object
            * @private
            */
            var _countDownTimer;

            /**
             * Variable that is used for the warning interval
             * @type Object
             * @private
             */
             var _warningTimer;

            /**
            * Variable that is used for the countdown value
            * @type String
            * @private
            */
            var _timeToGo;

            /**
            * Variable that is used to hold the slot expiry data
            * @type Object
            * @private
            */
            var _slotExpiryData;

            /**
             * Runs at set intervals (every 60 seconds as default) once the warning threshold has been reached.
             * @private
             */
            var _countDown = function() {
                // Decrement the expiry time
                _timeUntilExpires -= _config.warningThresholdUpdate;
                // If the time left is less than or equal to zero, we should get the expired HTML
                if ( _timeUntilExpires <= 0 ) {
                    // Stop the countdown function from firing again by clearing the interval
                    clearInterval(_countDownTimer);
                    if(_slotExpiryData['countDownExpireType'].type && _slotExpiryData['countDownExpireType'].type == "cutoffExpire"){
                        var _cutOffExpiryOverlay = new JS.Overlay();
                        _cutOffExpiryOverlay.show(_slotExpiryData['cutoffTimeExpired'].expiredText,JS.pageName);
                        // Set the red alert message to "0 minute left to change..."
                        _timeLeftMinutesElem.innerHTML = "0 " + _config.warningThresholdUnitSingle;
                    } else {
                        // Change the HTML
                        if(JS.pageName == 'bookDeliverySlotPage'){
                            _countdownContainer.innerHTML = _slotExpiryData['bookDeliverySlotData'].expiredText;
                            JS.objects.deliverySlots.removeBookedSlot();
                        } else {
                            _countdownContainer.innerHTML = _slotExpiryData['slotTimeExpired'].expiredText;
                        }

                        var _changeSlotLink = dojo.byId(_config.changeSlotLink);
                        if (_changeSlotLink)
                        _changeSlotLink.innerHTML = _slotExpiryData['slotTimeExpired'].bookSlotLinkName;
                    }
                } else {

                    if (!_timeLeftMinutesElem)
                        _timeLeftMinutesElem = dojo.byId(_config.orderAmendSlotTimeCountId);

                    // Calculates the time left and rounds up to nearest minute
                    _timeToGo = Math.ceil(_timeUntilExpires / 60000);

                    // Output the time left in the HTML
                    if (_timeLeftMinutesElem) {
                        if ( _timeToGo > 1 ) {
                            _timeLeftMinutesElem.innerHTML = _timeToGo + " " + _config.warningThresholdUnitPlural;
                        } else {
                            _timeLeftMinutesElem.innerHTML = _timeToGo + " " + _config.warningThresholdUnitSingle;
                        }

                    }
                }

             }

             /**
              * Runs when the warning threshold is reached
              * @private
              */
             var _showWarning = function() {
                // Set the time until expiry (if needed)
                if (_timeUntilExpires > _config.warningThreshold)
                    _timeUntilExpires = _config.warningThreshold;

                // Set timer for the countdown function
                _countDownTimer = setInterval(_countDown,_config.warningThresholdUpdate);

                 // Place the new countdown data
                var deferred = _getSlotExpiryData();
                deferred.then(
                    function(){
                        if(JS.pageName == 'bookDeliverySlotPage'){
                            _countdownContainer.innerHTML = _slotExpiryData['bookDeliverySlotData'].bookDeliverySlotCountdown;
                        }else{
                            _countdownContainer.innerHTML = _slotExpiryData['slotTimeCountDown'].countDownText;
                        }

                    }

                );

             }

             /**
              * Sets the times for calculating the countdown and expiry, and sets timers in motion.
              * @param {String} currentTime The current time on the server.
              * @param {String} expiryTime The time on the server at which the slot expires.
              */
             var _setTimes = function(currentTime,expiryTime){
                 // Set the two times as date objects
                 var _currentTime = new Date(currentTime);
                 var _expirationTime = new Date(expiryTime);

                 // Calculate difference between the two times for expiry time
                 _timeUntilExpires = _expirationTime.getTime() - _currentTime.getTime();

                 // Calculate the time until warning function should be fired
                 var _warningBeforeExpiry = (_timeUntilExpires - _config.warningThreshold);

                 // If the time sent by the server is in the future
                 // set the warning timer
                 if ( _timeUntilExpires > 0 ) {
                     // Set timer to run function when we reach the warning threshold
                     _warningTimer = setTimeout(_showWarning,_warningBeforeExpiry);
                 }
             }

             /**
              * Resets the times and timers for the countdown and expiry, and clears the countdown
              * element.
              * @param {String} currentTime The current time on the server.
              * @param {String} expiryTime The time on the server at which the slot expires.
              */
             this.resetTimes = function(currentTime,expiryTime){
                 // Clear our timers
                 clearInterval(_warningTimer);
                 clearInterval(_countDownTimer);
                 // Set the times
                 _setTimes(currentTime,expiryTime);

             }


             /**
              * Caches elements for the slot expiry countdown.
              * @private
              */
             var _cacheCountdownElements = function(){
                _countdownContainer = dojo.byId(_config.countdownContainerId);
             }

             var _getSlotExpiryData = function() {
                var xhrArgs =  {
                    url: _config.warningThresholdInMinutesHtml,
                    preventCache: true,
                    handleAs:"json",
                    timeout: 10000,
                    load: function(data, ioArgs) {
                        _slotExpiryData = data;
                    },
                    error: function(err, ioArgs) {
                        // Add error to div
                        var errorHtml = '<p>An unexpected error occurred: ' + err + '</p>';
                        //dojo.place(errorHtml,_deliveryInfoContainer,'after');

                    }
                }
                return dojo.xhrGet(xhrArgs);
            }

            this.updateOrderAmendBookingSlotRHS = function(_self){
                var deferred = _getSlotExpiryData();
                deferred.then(function(){
                    _countdownContainer.innerHTML = _slotExpiryData['bookDeliverySlotData'].bookDeliverySlotCountdown;
                });
            }

             /**
              * Initialises the bookingSlot object
              */
             var _init = function() {
                // Mixing the config options
                if (options)
                    _config = new JS.mixin(_config,options);

                // Cache our elements
                _cacheCountdownElements();
                // Check that the elemId has been passed
                if (!_countdownContainer) return false;

                // Check that the server times have been passed from server into the page header
                if (!_config.currentServerDateTime || !_config.expiryServerDateTime) return false;

                // Set the times for calculating the countdown and expiry
                _setTimes(_config.currentServerDateTime,_config.expiryServerDateTime);
            }

    _init();
}

/**
 * setupClearTextButton Sets up buttons used to clear a text field. Handles the clearing
 * of the text field as well as when the clear button should be displayed.
 * @param  {String} textFieldId ID of the text field that will be cleared.
 * @param  {String} clearButtonId ID of the button that will clear the text field.
 */
JS.setupClearTextButton = function(textFieldId,clearButtonId){
    'use strict';

    var _hideClass = 'hidden',
        _textField,
        _textFieldKeyUpHandler,
        _textFieldKeyDownHandler,
        _clearButton,
        _clearButtonClickHandler;

    /**
     * Caches the elements used.
     * @private
     */
    var _cacheElements = function(){
        _textField = document.getElementById(textFieldId);
        _clearButton = document.getElementById(clearButtonId);
    };

    /**
     * Hides the clear button.
     * @private
     */
    var _hideClearButton = function(){
        dojo.addClass(_clearButton,_hideClass);
    };

    /**
     * Toggles when the clear button is displayed, based on whether the text field
     * contains any text.
     * @private
     */
    var _toggleClearButton = function(){
        if (_textField.value.length > 0) {
            dojo.removeClass(_clearButton,_hideClass);
        } else {
            _hideClearButton();
        }
    };

    /**
     * Binds the events for this function.
     * @private
     */
    var _bindEvents = function(){
        // Bind for keyup even to detect when a character would have been output
        _textFieldKeyUpHandler = dojo.connect(_textField,'onkeyup',function(e){
            _toggleClearButton();
        });

        // Bind for keydown to handle the escape key shortcut
        _textFieldKeyDownHandler = dojo.connect(_textField,'onkeydown',function(e){
            // If the customer hit the escape key, then clear the field
            if (e.keyCode === 27){
                _textField.value='';
                _hideClearButton();
            }
        });

        _clearButtonClickHandler = dojo.connect(_clearButton,'onclick',function(e){
            e.preventDefault();
            _textField.value='';
            _textField.focus();
            _hideClearButton();
        });
    };

    /**
     * Tears down the object.
     */
    this.tearDown = function(){
        dojo.disconnect(_textFieldKeyUpHandler);
        dojo.disconnect(_textFieldKeyDownHandler);
        dojo.disconnect(_clearButtonClickHandler);
    };

    var _init = function(){
        _cacheElements();

        // Dive out if either the text field or clear buttons isn't available
        if (!_textField || !_clearButton) return;

        _bindEvents();

        /**
         * There may be text in the field already, so need to determine
         * whether we need to show the clear button or not.
         */
        _toggleClearButton();
    };

    this.init = _init;

    _init();
}


/**
* AutoComplete
* @param {Array} searchElemId ID of the input element to perform the autocomplete upon
* @param {Object} options An object containing configuration options
* @constructor
*/
// ToDo: Need to tidy up the _init() function. Move event handlers into separate functions to make it easier to read.
JS.AutoComplete = function(searchElemId,options) {

    /**
     * Stores configuration options for AutoComplete
     * @type Object
     * @private
     */
    var _config = {
        listId: 'autoCompleteList',
        listClasses: 'autoCompleteList',
        linkClasses: 'autoLink',
        hidingClassName: 'jsAccess',
        ajaxAction: 'AjaxAutoCompleteDisplayView',
        lengthTrigger: typeAheadTrigger ,
        searchSubmitId: 'searchSubmit',
        searchFormId: 'globalSearchForm',
        debugAjax: [{'term':'cheese'},{'term':'chicken'},{'term':'choose'}],
        debug: false
    };

    /**
     * Used instead of 'this' in certain functions
     * @type Object
     * @private
     */
    var _self = this;

    /**
     * Holds the Search submit button element
     * @type Object
     * @private
     */
    var _searchSubmitElem;

    /**
     * Holds the Search field element
     * @type Object
     * @private
     */
    var _searchElem;

    /**
     * Holds the Search form element
     * @type Object
     * @private
     */
    var _searchFormElem;

    /**
     * Holds the display state of the auto complete list
     * @type Object
     * @private
     */
    var _autoCompleteVisible;

    /**
     * Holds the current value of autocomplete list
     * @type Object
     * @private
     */
    var _autoCompleteValue;

    /**
     * Stores the element containing the autocomplete list
     * @type Object
     * @private
     */
    var _autoCompleteElem;

    /**
     * Stores the links the customer can choose from
     * @type Array
     * @private
     */
    var _autoCompleteLinks = [];

    /**
     * Stores the index of the currently focused link (keyboard)
     * @type Array
     * @private
     */
    var _focusedLinkIndex = -1;

    /**
     * Stores whether we are temporarily hiding the list due to ESC key being used
     * @type Boolean
     * @private
     */
    var _temporarilyHidden = false;

    // Variables
    var _elemValue;
    var _autoCompleteList = [];

    var _getMatchingSearchTerms = function(){
        // Convert the form info into an object
        var searchFormObject = dojo.formToObject(_searchFormElem);

        // Do AJAX call to get the matching list
        dojo.xhrGet({
            url: _config.ajaxAction,
            content: searchFormObject,
            preventCache: true,
            handleAs:"json",
            timeout: 5000,
            load: function(data, ioArgs) {

                // Set the data to a variable
                _autoCompleteList = data;

                // Call function to populate the list
                if (data && data.length > 0) {
                    _populate(_autoCompleteList,_elemValue);
                }

            },
            error: function(err, ioArgs) {

                // Debug info
                _debug("AJAX call failed");

            }
        });
    }

    /**
     * Initialises the deleteValues object
     */
    var _init = function (){
        // Mixing the config options
        if (options) _config = new JS.mixin(_config,options);

        // Empty the _debug function if we don't want to output debug info
        if (!_config.debug)
            _debug = function(){};

        // Check that the search form and field can be found
        _searchElem = dojo.byId(searchElemId);
        _searchFormElem = dojo.byId(_config.searchFormId);
        if (!_searchElem || !_searchFormElem) return false;

        // Get the Search submit button element
        _searchSubmitElem = dojo.byId(_config.searchSubmitId);

        // Add the autocomplete list to the document body
        _autoCompleteElem = dojo.place( '<div id="'+_config.listId+'" class="'+_config.listClasses + ' ' + _config.hidingClassName + '"></div>',  dojo.body(),'first');

        // Position the autocomplete list
        _setPosition();

        // Make sure the autocomplete position is updated when the browser is resized
        dojo.connect(window,'onresize',function (){
            _setPosition();
        });

        // KEY UP event handler
        dojo.connect( _searchElem ,"onkeyup",function(event){
            if (event.keyCode === 27 // escape
                || (event.keyCode >= 35 && event.keyCode <= 40) // end, home, arrows
                || (event.keyCode >= 16 && event.keyCode <= 20) // shift, ctrl, alt, caps-lock, etc
                ) {
                return;
            }

            // Debug info
            _debug("Event keyUp has been triggered");

            // Set the value for the elem
            _elemValue = _searchElem.value;

            // If the length of the field is longer than the trigger
            // run the AJAX to get the list of matching autocompletes
            if ( _elemValue.length >= _config.lengthTrigger ) {

                // Debug info
                _debug("Text value is greater or equals than " + _config.lengthTrigger + ". Length of string = " + _elemValue.length);

                // The cache won't have the autocomplete list if this
                // is the first time the trigger value has been exceeded.
                // In which case, we'll need to do an AJAX call.
                // If we already have the list, perform a filter on the list
                // and then populate the autocomplete list.
                if (_autoCompleteList.length < 1) {

                    // Should we make an AJAX call? If we're in debug, we should
                    // use the dummy data supplied in the config options
                    if (!_config.debug) {

                        _getMatchingSearchTerms();

                    } else {

                        // Debug info
                        _debug("In debug mode so no AJAX call, use debug data");

                        // Set the data to a variable
                        _autoCompleteList = _config.debugAjax;

                        // Debug info
                        _debug(_autoCompleteList);

                        // Call function to filter the list
                        _self.filter(_elemValue,_autoCompleteList);

                    }

                } else {

                    // Debug info
                    _debug("Already have the list as we have more than the trigger. About to filter the list.");

                    // Call function to filter the list
                    _self.filter(_elemValue,_autoCompleteList);

                }

            } else {

                // Reset the autocomplete list as we have less than the required amount of characters
                _autoCompleteList = [];

                // Hide the container
                _self.hideElem(_autoCompleteElem);

            }
        });

        // KEYDOWN Navigation for list
        dojo.connect( _autoCompleteElem ,'onkeydown',function(event){
            _debug('onkeydown in list');

            if (event.keyCode == 38) { // UP
                // Prevent page scroll
                event.preventDefault();

                _prevItem();

            } else if (event.keyCode == 40) { // DOWN
                // Prevent page scroll
                event.preventDefault();

                _nextItem();

            } else if (event.keyCode == 27) { // ESCAPE
                // Flag that we are only hiding the list temporarily
                _temporarilyHidden = true;

                // Hide the container
                _self.hideElem(_autoCompleteElem);

                // Change focus
                _searchElem.focus();

            } else if (event.keyCode == 9) { // TAB
                event.preventDefault();

                if (event.shiftKey){ // SHIFT + TAB
                    // Move focus to search element
                    _searchElem.focus();

                } else {
                    // Populate search box with current value from suggestions list
                    _self.selectItem(_autoCompleteValue);

                    // Move focus to next select element in search form
                    _searchSubmitElem.focus();

                    // Hide the container
                    _self.hideElem(_autoCompleteElem);
                }

            } else {
                return false;
                    }
        });

        // KEYDOWN Navigation for search field
        dojo.connect( _searchElem ,'onkeydown',function(event){
            _debug('onkeydown in searchElem');

            if (_elemValue.length < _config.lengthTrigger) return;

            if (event.keyCode == 38) { // UP
                // Prevent page scroll
                event.preventDefault();

                // If the list is hidden, but should be shown, show it
                if (!_autoCompleteVisible && _autoCompleteLinks.length > 0)
                    _self.showElem(_autoCompleteElem);

                _prevItem();

            } else if (event.keyCode == 40) { // DOWN
                // Prevent page scroll
                event.preventDefault();

                // If the list is hidden, but should be shown, show it
                if (!_autoCompleteVisible && _autoCompleteLinks.length > 0)
                    _self.showElem(_autoCompleteElem);

                _nextItem();

            } else if (event.keyCode == 9) { // TAB
                // Hide the container
                _self.hideElem(_autoCompleteElem);
            } else {
                return false;
            }
        });

        // Handle the search field is focused on
        dojo.connect( _searchElem ,'onfocus',function(event){

            // Reset keyboard Navigation
            _focusedLinkIndex = -1;

            // If there's no value, set the value for the elem
            if ( !_elemValue ) _elemValue = _searchElem.value;

            // Show the container
            if ( (_elemValue.length >= _config.lengthTrigger) && (_autoCompleteList.length > 0) && !_temporarilyHidden) {
                _self.showElem(_autoCompleteElem);
                    }

            // List is not longer temporarily hidden (for now)
            _temporarilyHidden = false;

        });

        // CLICK/BLUR handler

        // Listen for clicks on html tag
        dojo.query('html').connect('onclick',function(e){

            // Only run if the autocomplete list is visible
            if (_autoCompleteVisible == true) {
                // Find the event target
                var evt=window.event || e;
                var targetElem = evt.target;
                if (!targetElem) //if event obj doesn't support e.target, presume it does e.srcElement
                    targetElem=evt.srcElement; //extend obj with custom e.target prop

                if (dojo.attr(targetElem, 'type') != 'submit')
                    e.preventDefault();

                var targetQuery = dojo.query(targetElem);
                var targetId = targetElem.id;

                // Create array of target element's parent divs
                var targetParents = targetQuery.parents('div');

                // Find target element's immediate parent and store its tagname
                var targetParent = targetQuery.parent();
                var parentTagName = targetParent[0].tagName.toLowerCase();


                // Loop through parents to see if target element is inside the autocomplete div
                for(currentParent = 0, parentsLength = targetParents.length ; currentParent < parentsLength ; currentParent++)  {

                    var parentId = dojo.query(targetParents[currentParent]).attr('id');

                    // The target is not inside autocomplete area and therefore is blurred so close autocomplete list
                    if (parentId != _config.listId && targetId != searchElemId) { // The autocomplete area isn't blurred if the search input field is the target
                        _self.hideElem(_autoCompleteElem);
                    }

                    // If the target, or the parent of target, is an autocomplete link then pass along innerHTML to populate search input with selection, reorder and close the list
                    if (parentId = _config.listId) {
                        if (parentTagName == 'a') {
                            //console.log(evt);
                            _self.updateSearch(targetParent[0].innerHTML);
                        }
                        else if (dojo.hasClass(targetElem,_config.linkClasses)){
                            _self.updateSearch(targetElem.innerHTML);
                        }
                    }
                }
            }
        });
    };

    /**
     * Moves focus to the previous item in the list
     * @private
     */
    var _prevItem = function(){
        // If we are on the first item in the list, send focus to the Search input
        if (_focusedLinkIndex == 0){
            _searchElem.focus();
        } else {
            // If we are in the Search input, set the index to the number of links available
            if (_focusedLinkIndex == -1){
                _focusedLinkIndex = _autoCompleteLinks.length;
            }
            // Focus on the previous link
            _autoCompleteLinks[--_focusedLinkIndex].focus();
            // Update current value after moving down through the list of options
            _autoCompleteValue = _autoCompleteLinks[_focusedLinkIndex].innerHTML;
        }
    }

    /**
     * Moves focus to the next item in the list
     * @private
     */
    var _nextItem = function(){
        // If we are on the last item in the list, send focus to the Search input
        if (++_focusedLinkIndex == _autoCompleteLinks.length){
            _searchElem.focus();
            _focusedLinkIndex = -1;
        } else {
            // Focus on the next link
            _autoCompleteLinks[_focusedLinkIndex].focus();
            // Update current value after moving down through the list of options
            _autoCompleteValue = _autoCompleteLinks[_focusedLinkIndex].innerHTML;
        }
    }

    this.updateSearch = function(val) {

        // Assign value
        _self.selectItem(val);

        // Submit search form
        document.forms["sol_search"].submit();
    }

    /**
     * Sets the position of the autocomplete list
     * @private
     */
    var _setPosition = function(){
        // Get the position of the search field
        var searchFieldPos = dojo.position(_searchElem,true);

        // Position the autocomplete list
        //var autoCompleteWidth = searchFieldPos.w;
        var autoCompleteX = searchFieldPos.x;
        var autoCompleteY = searchFieldPos.y + searchFieldPos.h /*- 3*/; /* AntJ - What is the 3 for??? */

        dojo.style(_autoCompleteElem,"top",autoCompleteY+"px");
        dojo.style(_autoCompleteElem,"left",autoCompleteX+"px");
        //dojo.style(_autoCompleteElem,"width",autoCompleteWidth+"px");
    }

    // Function to select an item from the auto complete list
    this.selectItem = function(val) {
        // Set value
        _searchElem.value = val.replace(/<(?:.|\n)*?>/gm, '');
    };

    // Function to hide an element (obj)
    this.hideElem = function(elem) {

        // Hide the passed element obj
        dojo.addClass(elem,_config.hidingClassName);
        // Flag it as hidden
        _autoCompleteVisible = false;
    };

    // Function to show an element (obj)
    this.showElem = function(elem) {

        // Show the passed element obj
        dojo.removeClass(elem,_config.hidingClassName);
        // Flag it as visible
        _autoCompleteVisible = true;
    };

    // Function to filter the passed array by the passed value
    this.filter = function(value,arr) {

        // Debug info
        _debug("About to filter the list");

        // Debug info
        _debug(arr);

        // If the value passed is non-existant, return false
        if (value == "" || value == "undefined" || value == undefined) return false;

        // Remove the emphasis from the item
        value = value.replace(/<(?:.|\n)*?>/gm, '');
        _debug(value);

        // If the array passed is non-existant, return false
        if (arr == "" || arr == "undefined" || arr == undefined) return false;

        // Check the array length
        if (arr.length < 1) return false;

        // Get original array and assign to new variable to be filtered
        var newArr = [];

        // Loop through array and create new array
        dojo.forEach(arr, function(item, index){

            // If the value entered into the text box matches the item in the array, add the item to the new filtered array
            if ( item.term.indexOf( value.toLowerCase() ) != -1 ) newArr.push( item );

        });

        // Debug info
        _debug(newArr.length);

        // Debug info
        _debug(newArr);

        // Call function to populate the list
        _populate(newArr,value);

    };

    /**
     * Populates the autocomplete list with the passed array.
     * @private
     */
    var _populate = function(arr,value) {
        // Debug info
        _debug("About to populate the list");

        // Debug info
        _debug(arr);

        // Debug info
        _debug(_autoCompleteElem);

        // Set variable for the HTML to inject
        var _htmlToInject = "<ul>";

        // Loop through array and create HTML list
        dojo.forEach(arr, function(item, index){

            _htmlToInject += '<li><a href="#" class="autoLink">' + item.term.replace(value,'<em>' + value + '</em>') + '</a></li>';

        });

        // Close the html list
        _htmlToInject += "</ul>";

        // If no results in the array
        if (!arr instanceof Array) _htmlToInject = "";

        // If the array is 0 empty the list
        if (arr.length < 1) _htmlToInject = "";

        // Populate the div
        dojo.place('<h2 class="access">Auto Suggest list for search box</h2>' + _htmlToInject , _autoCompleteElem, "only");

        // Cache the links with created
        _autoCompleteLinks = dojo.query('.autoLink',_autoCompleteElem);

        _debug('_autoCompleteLinks',_autoCompleteLinks);

        // Show the container and the overlay
        _self.showElem(_autoCompleteElem);

    };

    /**
     * Does the same as console.log. However, function will be reset to do nothing when
     * _config.debug is false.
     * @private
     */
    var _debug = function(){
        if (arguments.length>0) console.log(arguments);
    }

    _init();

}

/**
* preventPaste
* @param {Array} arr An array of ID's to prevent the paste function from happening upon
* @constructor
*/
JS.preventPaste = function(arr) {
    var el = null;

    function _preventPaste(e) {
        var target = e.target ? e.target : window.event.srcElement;
        var event = e ? e : window.event;
        if(event.preventDefault) {
            event.preventDefault();
        } else {
            return false;
        }
    }

    // Loop through the passed array of IDs and prevent pasting of content
    for(i=0, j=arr.length; i<j; ++i) {
        el = document.getElementById(arr[i]);
        if(el) {
            JS.addEvent(el, "paste", _preventPaste);
            JS.addEvent(el, "copy", _preventPaste);
            JS.addEvent(el, "drop", _preventPaste);
        }
    }
}

/**
* Add Event
* @param {Object} obj Object to add the listener to
* @param {string} evType A string containing the event type to handle i.e. click, focus, etc...
* @param {function} fn A function to call when the event has been captured
* @param {String} useCapture If true, useCapture indicates that the user wishes to initiate capture. After initiating capture, all events of the specified type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree. Events which are bubbling upward through the tree will not trigger a listener designated to use capture. See DOM Level 3 Events for a detailed explanation. Note that this parameter is not optional in all browser versions. If not specified, useCapture is false.
* @constructor
*/
JS.addEvent = function(obj, evType, fn, useCapture){
    if (obj.addEventListener){
        obj.addEventListener(evType, fn, useCapture);
        return true;
    } else if (obj.attachEvent){
        var r = obj.attachEvent("on"+evType, fn);
        return r;
    } else {
        alert("Handler could not be attached");
    }
}

/**
* Delete field Values
* @param {Object} fields An object containing the fields to delete
* @param {Object} options An object containing configuration options
* @constructor
*/
JS.deleteValues = function(fields,options){

    /**
     * Stores configuration options for deleteValues
     * @type Object
     * @private
     */
     var _config = {
         debug: false
     };

     /**
      * Initialises the deleteValues object
      */
      this.init = function (){

          // Mixing the config options
          if (options)
                _config = new JS.mixin(_config,options);

          // Check that the fields object has been passed
          if (!fields || fields == "" || fields =="undefined" || fields == undefined) {
              alert("Error: please pass the object for deleteValues");
              return false;
          }

          // For each field in the array of objects,
          // copy the value into the appropriate field
          var _fieldToDelete;
          for (var field in fields) {
              _fieldToDelete = dojo.query(fields[field].to);
              _fieldToDelete.attr("value","");
          }
      };

      this.init();

}

/**
* Copy field values
* @param {Object} fields An object containing the fields to copy/paste
* @param {Object} options An object containing configuration options
* @constructor
*/
JS.copyValues = function(fields,options){

    /**
     * Stores configuration options for copyValues
     * @type Object
     * @private
     */
     var _config = {
         debug: false
     };

     /**
      * Initialises the copyValues object
      */
      this.init = function (){

          // Mixing the config options
          if (options)
                _config = new JS.mixin(_config,options);

          // Check that the fields object has been passed
          if (!fields || fields == "" || fields =="undefined" || fields == undefined) {
              alert("Error: please pass the object for copyValues");
              return false;
          }

          // For each field in the array of objects,
          // copy the value into the appropriate field
          var _fieldToCopy;
          var _fieldToPaste;
          for (var field in fields) {
              _fieldToCopy = dojo.query(fields[field].from);
              _fieldToPaste = dojo.query(fields[field].to);
              _fieldToPaste.attr("value",_fieldToCopy.attr("value"));
          }
      };

      this.init();

}

/**
* Form Validator
* @param {string} formId A string containing the ID for the form to be validated
* @param {string} errorContainer A string containing the ID for the error container that will hold all of the jump links
* @param {Object} ruleset An object containing the validation rules for each field
* @param {Object} options An object containing configuration options
* @constructor
*/
JS.FormValidator = function(formId,errorContainerId,ruleset,options){
    'use strict';
    /**
     * Stores configuration options for the formValidator
     * @type Object
     * @private
     */
    var _config = {
        individualErrorHtmlStart: "<div class='errorText'><p>",
        individualErrorHtmlFinish: "</p></div>",
        individualErrorHtmlPlacement: "first", // options are: before || after || first || last || replace || only
        jumpListErrorHtmlStart: "<h2> It seems that this form contains errors, please check any fields marked in red. </h2><ul>",
        jumpListErrorHtmlFinish: "</ul>",
        jumpListItemErrorHtmlStart: "<li>",
        jumpListItemErrorHtmlFinish: "</li>",
        scrollToTopOfPage: true,
        populateErrorContainer: true,
        showInlineErrors: true,
        submitButtons: null,
        debug: false,
        afterValidationSuccess: false,
        afterValidationFail: false
    };

    /**
     * The form we are validating.
     * @private
     */
    var _formElem;

    /**
     * Initialises the formValidator object
     */
    this.init = function (){
        // Mixing the config options
        if (options)
            _config = new JS.mixin(_config,options);

        // Check that the form id has been passed
        _formElem = dojo.byId(formId);
        if (!_formElem) return false;

        // Check that the error container id has been passed
        // If it hasn't, the error container will not be filled
        // with the jumplist
        if (_config.populateErrorContainer) {
            var _errorContainer = dojo.byId(errorContainerId);
            if (!_errorContainer) {
                _config.populateErrorContainer = false;
            }
        }

        // Check that the ruleset has been passed
        if (!ruleset || ruleset == "" || ruleset =="undefined" || ruleset == undefined) return false;

        // Arrays to collect the elements that error classes have been added to and messages have placed into
        // which allows us to loop through these and remove them when re-validating the form
        var _validationErrorContainersArray = [];
        var _validationErrorClassesArray = [];

        // Array for caching the fields that need validating
        var _validationFieldsToCheck = [];

        // Flag to indicate that this is the first time the form has been submitted
        var _validationCheckFirstRun = true;

        // Should the form validation run? If there is more than one form submit button,
        // only validate the form when the correct button has been clicked or upon pressing enter.
        if (_config.submitButtons) {

            var _shouldValidateForm = false;
            var _clickedFormSubmitButtonId;

            var _submitButtonsArray = dojo.query(_config.submitButtons);

            dojo.query('#' + formId).query('input[type=submit]').connect('onclick', function() {

                _clickedFormSubmitButtonId = this.id;

                dojo.forEach(_submitButtonsArray, function(item, index){
                    if ( (_submitButtonsArray[index].id != _clickedFormSubmitButtonId) && (!_shouldValidateForm) ) {
                        _shouldValidateForm = false;
                    } else {
                        _shouldValidateForm = true;
                    }
                });
            });
        }

        // Form onSubmit event handler
        dojo.connect(_formElem,"onsubmit",function(event){
            // Debug
            if (_config.debug) event.preventDefault();

            // Should validate form?
            if (_config.submitButtons) {
                if (!_shouldValidateForm) return false;
                _shouldValidateForm = false;
            }

            // Variables
            var _validationRules = new JS.validationRules;
            var _validationErrorsArray = [];
            var _elemBeingValidated;
            var _elemBeingValidatedId;
            var _elemBeingValidatedErrorMsg;
            var _elemBeingValidatedRules;

            // Remove the error classes and remove the error messages
            if ( _validationErrorContainersArray.length > 0 && _validationErrorClassesArray.length > 0 ) {
                // Remove the error classes
                for (var elemWithClass in _validationErrorClassesArray) {
                    if (dojo.query(_validationErrorClassesArray[elemWithClass]).length > 0)
                        dojo.removeClass(dojo.query(_validationErrorClassesArray[elemWithClass])[0], "error");
                }
                // Remove the error messages
                for (var errorContainerToDelete in _validationErrorContainersArray) {
                    if (dojo.query(_validationErrorContainersArray[errorContainerToDelete]).query(".errorText").length > 0)
                        dojo.destroy( dojo.query(_validationErrorContainersArray[errorContainerToDelete]).query(".errorText")[0] );
                }
                // Reset the arrays
                _validationErrorContainersArray = [];
                _validationErrorClassesArray = [];
            }

            // Loop through the fields in the validation ruleset
            for (var field in ruleset) {
                if ( field.hasOwnProperty ) {
                    // Check if the element(s) that need validating are already cached
                    if (!_validationFieldsToCheck[field]) {
                        // Not cached, so try and find them on the page
                        _elemBeingValidated = dojo.query('#' + formId).query('input[name="'+field+'"], select[name="'+field+'"], textarea[name="'+field+'"]');
                        // If they've been found on the page, cache them!
                        if (_elemBeingValidated.length > 0) _validationFieldsToCheck[field] = _elemBeingValidated;
                    } else {
                        // It's cached so let's grab it from there!
                        _elemBeingValidated = _validationFieldsToCheck[field];
                    }

                    if (_elemBeingValidated.length > 0) {

                        // ID of the element being validated
                        _elemBeingValidatedId = _elemBeingValidated.attr("id");

                        // Object containing the properties for each rule
                        var ruleProperties = ruleset[field];

                        // Loop through the rules for the element being validated
                        for (var validationfunctionToCall in ruleProperties) {
                            if ( validationfunctionToCall.hasOwnProperty ) {

                                // Run the appropriate validation check and if it fails, go into the if statement
                                if ( !_validationRules[validationfunctionToCall](_elemBeingValidated,ruleProperties[validationfunctionToCall].param) ) {

                                    // Add error class to elements that do not validate
                                    if ( dojo.query(ruleProperties[validationfunctionToCall].elemToAddErrorClassTo).length > 0 )
                                        dojo.addClass(dojo.query(ruleProperties[validationfunctionToCall].elemToAddErrorClassTo)[0], "error");

                                    // Add first error message for each error. Subsequent error messages will not display until user passes first validation check.
                                    if ( dojo.query(ruleProperties[validationfunctionToCall].msgPlacement).length > 0 ) {
                                        if ( !dojo.query(ruleProperties[validationfunctionToCall].msgPlacement).query(".errorText")[0] ) {

                                            // Add error message to individual elements
                                            if (_config.showInlineErrors){
                                                dojo.place(_config.individualErrorHtmlStart+ruleProperties[validationfunctionToCall].text+_config.individualErrorHtmlFinish, dojo.query(ruleProperties[validationfunctionToCall].msgPlacement)[0],_config.individualErrorHtmlPlacement);
                                            }

                                            // Add the error message to the array that creates the jump list
                                            _validationErrorsArray.push( ruleProperties[validationfunctionToCall].text + "||" + _elemBeingValidatedId[0] );

                                        }
                                    }

                                    // Add the error container to an array so we can reset these at the start when revalidating
                                    _validationErrorContainersArray.push( ruleProperties[validationfunctionToCall].msgPlacement );

                                    // Add the error class to an array so we can reset these at the start when revalidating
                                    _validationErrorClassesArray.push( ruleProperties[validationfunctionToCall].elemToAddErrorClassTo );

                                }
                            }
                        }
                    }
                }
            }

            // Stop the form from submitting,
            // fill the error div with jump links
            // and jump to the top of the page
            if (_validationErrorsArray.length > 0) {

                // Prevent the form from submitting
                event.preventDefault();

                // Add HTML to the start of the error container
                var _validationErrorsHtml = _config.jumpListErrorHtmlStart;

                // Add HTML for each error in the array
                for (var error in _validationErrorsArray) {
                    var _validationErrorsTextAndLink = _validationErrorsArray[error].split("||");
                    _validationErrorsHtml += _config.jumpListItemErrorHtmlStart + "<a href='#"+ _validationErrorsTextAndLink[1] +"'>" + _validationErrorsTextAndLink[0] + "</a>" + _config.jumpListItemErrorHtmlFinish;
                }

                // Add HTML to the end of the error container
                _validationErrorsHtml += _config.jumpListErrorHtmlFinish;

                if ( _config.populateErrorContainer ) {
                    // Add the completed HTML to the error container
                    _errorContainer.innerHTML = _validationErrorsHtml;

                    // Show the error container
                    _errorContainer.style.display = "block";
                }

                // Jump the browser to the top of the window to bring the jump list into view
                if ( _config.scrollToTopOfPage ) {
                    // Scroll to top of window
                    dojo.body().scrollIntoView();
                }

                // Focus first jump list element or form element
                if ( _config.populateErrorContainer ) {
                    /* Set the tabIndex so we can focus on the error container and tab from
                     * its position, as it is unlikely to be a tabbable element.
                     */
                    _errorContainer.tabIndex = -1;
                    // Give focus to the error container
                    _errorContainer.focus();
                } else {
                    var _focusLink = _validationErrorsArray[0].split("||");
                    dojo.byId(_focusLink[1]).focus();
                }

                // Let's see if we need to do anything now the validation failed.
                if (typeof _config.afterValidationFail === 'function'){
                    _config.afterValidationFail();
                }
            } else {
                // Validation was successful!
                // Let's see if we need to do anything after the validation.
                if (typeof _config.afterValidationSuccess === 'function'){
                    _config.afterValidationSuccess(_formElem, event);
                }
            }

            // As we have now run through the first validation check, we can set this flag to FALSE
            _validationCheckFirstRun = false;
        });
    }

    this.init();
};

/**
* Validation Rules
* @constructor
*/
JS.validationRules = function(){

    this.validFromDate = function(elem,year) {
        if (!elem || !year) {
            alert("Please check that you're passing the params for validationRules.validFromDate");
            return false;
        }

        // Current month and year
        var _currentDate = new Date();
        var _currentMonth = _currentDate.getMonth();
        var _currentYear = _currentDate.getFullYear();

        // Month and year to check
        var _passedMonth = parseInt(elem.attr('value') - 1);
        if (_passedMonth == "") return true;
        if (_passedMonth > 12) return false;
        var _passedYear = dojo.query(year).attr('value');
        if (_passedYear == "") return true;
        if (_passedYear > _currentYear) return false;

        // Compare the dates
        if ( new Date(_passedYear,_passedMonth) > new Date(_currentYear,_currentMonth) ) return false;

        return true;
    }

    this.validEndDate = function(elem,year) {

        // Ensure we have data passed
        if (!elem || !year) {
            alert("Please check that you're passing the params for validationRules.validFromDate");
            return false;
        }

        // Current month and year
        var _currentDate = new Date();
        var _currentMonth = _currentDate.getMonth(); // Month is one behind as JS is zero based
        var _currentYear = _currentDate.getFullYear();

        // Month and year to check
        var _passedMonth = parseInt(elem.attr('value'));

        // Stop processing if the values are empty. Let the isEmpty function take care of this.
        if (_passedMonth == "") return true;
        if (_passedYear == "") return true;

        // Make sure the passed month is within boundaries
        if (_passedMonth < 1 || _passedMonth > 12) return false;

        // Make sure the passed year is not before the current year
        var _passedYear = dojo.query(year).attr('value');
        if (_passedYear < _currentYear) return false;

        // Remove 1 from the passed month to make a direct comparison with JS zero based months
        _passedMonth = _passedMonth - 1;

        // Compare the dates
        // If date is before current date, return false
        var passedDate = new Date(_passedYear,_passedMonth);
        var currentDate = new Date(_currentYear,_currentMonth);
        if ( passedDate < currentDate ) return false;

        // If date is valid, return true.
        return true;
    }


    this.exclusiveOr = function(elem,checkAgainstThisElem) {
          if (!elem || !checkAgainstThisElem) {
            alert("Please check that you're passing the params for validationRules.exclusiveOr");
            return false;
          }
          var checkAgainstThisElemSplit = checkAgainstThisElem.split("||");
          checkAgainstThisElem = dojo.query(checkAgainstThisElemSplit[0]);
          if ( checkAgainstThisElemSplit[1] ) var addErrorClass = dojo.query(checkAgainstThisElemSplit[1]);
          var errorClass = "error";
          if ( checkAgainstThisElemSplit[2] ) errorClass = checkAgainstThisElemSplit[2];
          if ( addErrorClass ) addErrorClass.addClass( errorClass );
          if ( String(elem.attr('value')) == "" && String(checkAgainstThisElem.attr('value')) == "" ) {
                return false;
          }
          if ( addErrorClass ) addErrorClass.removeClass( errorClass );
          return true;
    }

    this.alphaNumericWithPunctuation = function (elem,shouldCheck){
        if (!shouldCheck) return true;
        if (!elem) {
              alert("Please check that you're passing the params for validationRules.alphaNumericWithPunctuation");
              return false;
        }
        if (elem.attr('value') == "") return true;
        var valueToCheck = elem.attr('value');
        var regExp = /^[0-9a-zA-Z ,'"]+$/;
        return regExp.test(valueToCheck);
    }

    this.alphaNumericWithPeriod = function (elem,shouldCheck){
        if (!shouldCheck) return true;
        if (!elem) {
              alert("Please check that you're passing the params for validationRules.alphaNumericWithPunctuation");
              return false;
        }
        if (elem.attr('value') == "") return true;
        var valueToCheck = elem.attr('value');
        var regExp = /^[0-9a-zA-Z \.\-\']+$/;
        return regExp.test(valueToCheck);
    }

    this.alphaNumeric = function (elem,shouldCheck){
        if (!shouldCheck) return true;
        if (!elem) {
              alert("Please check that you're passing the params for validationRules.alphaNumeric");
              return false;
        }
        if (elem.attr('value') == "") return true;
        var valueToCheck = elem.attr('value');
        var regExp = /^[0-9a-zA-Z]+$/;
        return regExp.test(valueToCheck);
    }

    this.isNumeric = function (elem,shouldCheck){
        if (!shouldCheck) return true;
        if (!elem) {
              alert("Please check that you're passing the params for validationRules.isNumeric");
              return false;
        }
        if (elem.attr('value') == "") return true;
        var valueToCheck = elem.attr('value');
        var regExp = /^[0-9]+$/;
        return regExp.test(valueToCheck);
    }

    this.isPhoneNumber = function (elem,shouldCheck){
        if (!shouldCheck) return true;
        if (!elem) {
              alert("Please check that you're passing the params for validationRules.isNumeric");
              return false;
        }
        if (elem.attr('value') == "") return true;
        var valueToCheck = elem.attr('value');
        var regExp = /^[\+\d](?:\s*\d\s*){9,19}$/;
        return regExp.test(valueToCheck);
    }

    this.isEmpty = function (elem,shouldCheck){
        if (!shouldCheck) return true;
        if (!elem) {
              alert("Please check that you're passing the params for validationRules.isEmpty");
              return false;
        }

        // If more than one element in the array, put the first one into the variable
        if ( elem.length > 1 ) elem.splice(1, (elem.length - 1) );

        var _elemType = elem.attr("type");
        var _elemVal = elem.attr("value");

        // Hidden field check
        if (_elemType == "hidden") {
            return true;
        // Check box check
        } else if (_elemType == "checkbox") {
            var _countOfCheckedCheckboxes = parseInt(elem.parent().parent().query(':checked').length);
            if ( _countOfCheckedCheckboxes < 1 ) {
                return false;
            }
        // Radio button check
        } else if (_elemType == "radio") {
            var _countOfSelectedRadios = parseInt(elem.parent().parent().query(':checked').length);
            if ( _countOfSelectedRadios < 1 ) {
                return false;
            }
        // Select check
        } else if (elem[0].tagName.toLowerCase() == "select") {
            var selected = false;
            for (i = 0; i < elem[0].options.length; i++) {
                if (elem[0].options[i].selected && elem[0].options[i].value) {
                    selected = true;
                    break;
                }
            }
            return selected;
        // Text box or textarea check
        } else {
            if (_elemVal == "") {
                return false;
            }
        }
        return true;
    }

    this.notMatches = function(elem,matchToThisElem) {
        if (!elem || !matchToThisElem) {
              alert("Please check that you're passing the params for validationRules.notMatches");
              return false;
        }
        matchToThisElem = dojo.query(matchToThisElem);
        if ( String(elem.attr('value')) == String(matchToThisElem.attr('value')) ) {
              return false;
        }
        return true;
      }

      this.minLength = function(elem,minStrLength) {
            if (!elem || !minStrLength) {
                  alert("Please check that you're passing the params for validationRules.minLength");
                  return false;
            }
            if (elem.attr('value') == "") return true;
            if (elem.attr('value')[0].length < minStrLength) {
                  return false;
            }
            return true;
      }

      this.maxLength = function (elem,maxStrLength){
            if (!elem || !maxStrLength) {
                  alert("Please check that you're passing the params for validationRules.maxLength");
                  return false;
            }
            if (elem.attr('value')[0].length > maxStrLength) {
                  return false;
            }
            return true;
      }

      this.matches = function (elem, matchToThisElem){
            if (!elem || !matchToThisElem) {
                  alert("Please check that you're passing the params for validationRules.matches");
                  return false;
            }
            if (elem.attr('value') == "") return true;
            matchToThisElem = dojo.query(matchToThisElem);
            if ( String(elem.attr('value')) != String(matchToThisElem.attr('value')) ) {
                  return false;
            }
            return true;
      }

      this.email = function (elem, shouldCheck){
            if (!shouldCheck) return true;
            if (!elem) {
                  alert("Please check that you're passing the params for validationRules.email");
                  return false;
            }
            if (elem.attr('value') == "") return true;
            var valueToCheck = elem.attr('value');
            var regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regExp.test(valueToCheck);
      }

      this.isPostcode = function(elem, shouldCheck) {
            if (!shouldCheck) return true;
            if (!elem) {
                  alert("Please check that you're passing the params for validationRules.isPostcode");
                  return false;
            }
            if (elem.attr('value') == "") return true;
            var valueToCheck = elem.attr('value');
            var regExp = /^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i;
            return regExp.test(valueToCheck);
      }

      this.luhn = function(elem,shouldCheck) {
          if (!shouldCheck) return true;
          if (!elem) {
              alert("Please check that you're passing the params for validationRules.luhn");
              return false;
          }
          if (elem.attr('value') == "") return true;
          var valueToCheck = '98263000' + String(elem.attr('value'));
          if (valueToCheck.length > 19) return false;
          sum = 0; mul = 1; l = valueToCheck.length;
          for (i = 0; i < l; i++) {
              digit = valueToCheck.substring(l-i-1,l-i);
              tproduct = parseInt(digit,10)*mul;
              if (tproduct >= 10) {
                  sum += (tproduct % 10) + 1;
              } else {
                  sum += tproduct;
              }
              if (mul == 1) {
                  mul++;
              } else {
                  mul--;
              }
          }
          if ((sum % 10) == 0) {
              return true;
          } else {
              return (false);
          }
    }

    this.isMultipleOf = function(elem,multipleValue) {
        if (!elem || !multipleValue) {
            console.log('Please check that you\'re passing the params for validationRules.isMultipleOf');
            return false;
        }

        var remainder = elem[0].value % multipleValue;
        return (remainder === 0);
    }

    this.isMoreThan = function(elem, paramValue) {
        if (!elem || ('undefined' === typeof paramValue)) {
            console.log('Please check that you\'re passing the params for validationRules.isMoreThan');
            return false;
        }

        return Number(elem[0].value) > paramValue;
    }
};

/**
 * Class to create popup windows
 * @param {Object} options JSON object
 * @constructor
 */
JS.Popup = function(options){

    /**
     * Stores configuration options for the popup
     * @type Object
     * @private
     */
    var _config = {
        url: "http://www.sainsburys.co.uk",
        windowName: "newWindow",
        dependent: null,
        directories: null,
        fullscreen: null,
        location: null,
        menubar: null,
        resizable: null,
        scrollbars: null,
        status: null,
        toolbar: null,
        top: 200,
        left: 400,
        width: 200,
        height: 200,
        screenX: 400,
        screenY: 200
    };

    /**
     * Initialises the popup object
     */
    this.init = function (){
        if (options)
            _config = new JS.mixin(_config,options);

        var _popupUrl = _config.url;
        var _popupWindowName = _config.windowName;

        delete _config.url;
        delete _config.windowName;

        var _otherOptions = "";
        for (var opt in _config) {
            if (_config[opt] != null)
                _otherOptions += opt +"="+ _config[opt] + ",";
        }
        _otherOptions = _otherOptions.substring(0,_otherOptions.length-1);

        window.open(_popupUrl, _popupWindowName, _otherOptions);
        return false;
    }

    this.init();
};

/**
 * Mixes two nested objects from right to left (use instead of dojo.mixin). Will work on nested or single level JSON objects
 * @param {Array} obj1 JSON object
 * @param {Object} obj2 JSON object
 * @constructor
 */
JS.mixin = function(obj1, obj2){
    if (!obj1 || !obj2) return;
    for (var p in obj2) {
        try {
            if ( obj2[p].constructor==Object ) {
                obj1[p] = JS.mixin(obj1[p], obj2[p]);
            } else {
                obj1[p] = obj2[p];
            }
        } catch(e) {
            obj1[p] = obj2[p];
        }
    }
    return obj1;
};

/**
 * Creates the show/hides for the options within a filter box based on an array of IDs passed in the parameters
 * @param {Object} options An object containing configuration options for the tab set
 * @constructor
 */
JS.FilterBoxes = function(options){

    /**
     * Stores configuration options for the filterboxes
     * @type Object
     * @private
     */
    var _config = {
        totalOptionsCount: '#filterOptions .input',
        extraOptionsContainerId: 'extraOptions',
        extraOptionsContainerHideClass:'jsHide',
        collapseByDefault: true,
        filterClosedClass: 'filterBoxShowHide_closed',
        whereToPlaceShowHide: {
            element:'showHidePlacement',
            placement:'after'
        }
    };

    /**
     * Needed for closure when used in events
     * @type Object
     * @private
     */
    var _self = this;

    /**
     * Stores the container for the extra items that should be hidden if it's on the page
     * @type Object
     * @private
     */
    var _extraOptionsContainer;

    /**
     * Stores the checkboxes within the hidden extra options container
     * @type Object
     * @private
     */
    var _extraOptionsCheckboxes;

    /**
     * Stores whether the extra options container is collapsed
     * @type Boolean
     * @private
     */
    var _extraOptionsContainerCollapsed;

    /**
     * Stores the anchor element for the "Show more" link.
     * @type Object
     * @private
     */
    var _anchorElem;

    /**
     * Stores the onclick event handler for the "Show more" link.
     * @type Object
     * @private
     */
    var _expandHandler;

    /**
     * Initialises the filterBoxes object
     * @private
     */
    var _init = function (){
        if (options) _config = new JS.mixin(_config,options);

        _extraOptionsContainerCollapsed = _config.collapseByDefault;

        _self.cacheBuildAndBind();



    }

    /**
     * Caches container, builds the "show more/less" link and (re)binds events
     */
    this.cacheBuildAndBind = function (){
        // Container that holds the extra options
        _extraOptionsContainer = dojo.byId(_config.extraOptionsContainerId);

        // Checkboxes inside the extra options container
        _extraOptionsCheckboxes = dojo.query('input[type="checkbox"]', _extraOptionsContainer)

        // If there is a container that holds extra checkboxes, run the code...
        if ( _extraOptionsContainer ) {
            // Create the more/less link
            _anchorElem = dojo.place('<a class="filterBoxShowHide" href="#"><span class="more">See more <span>(' + dojo.query('input',_extraOptionsContainer).length + ')</span></span><span class="less">See less</span></a>', _config.whereToPlaceShowHide.element, _config.whereToPlaceShowHide.placement);

            // Show/Hide the container according to how the flag is set
            if (_extraOptionsContainerCollapsed) {
                _hide();
            } else {
                _show();
            }

            // Add the on click event for the more/less link
            _addClickEvent(_extraOptionsCheckboxes[0]);
        }
    }

    /**
     * Adds the click event for the more/less link
     * @private
     */
    var _addClickEvent = function (checkboxToFocus){
        // If an event handler exists, then unbind it
        if (_expandHandler)
            dojo.disconnect(_expandHandler);

        // Bind the onclick event to the "show more/less" link if it exists
        if (_anchorElem) {
            _expandHandler = dojo.connect(_anchorElem,'onclick', function(e) {
                e.preventDefault();
                if (_extraOptionsContainerCollapsed) {
                    // If the container is currently collapsed, show it
                    _show();

                    /**
                     * Move focus to the first option in the expanded list for accessibility.
                     * The show/hide links come after the content they refer to in the source order.
                     * It wouldn't be clear to screen reader users that new content had appeared
                     * so if they click 'show more' link the focus shifts to the first option within
                     * the extra content now being displayed on the page.
                     */
                    checkboxToFocus.focus();

                } else {
                    // If the container is currently collapsed, hide it
                    _hide();
                }
            });
        }
    }

    /**
     * Shows the extra options
     * @private
     */
    var _show = function(){
        dojo.removeClass(_anchorElem,_config.filterClosedClass);
        //dojo.style(_extraOptionsContainer,'display', 'block');
        dojo.removeClass(_extraOptionsContainer,_config.extraOptionsContainerHideClass);

        _extraOptionsContainerCollapsed = false;
    }

    /**
     * Hides the extra options
     * @private
     */
    var _hide = function(){
        dojo.addClass(_anchorElem,_config.filterClosedClass);
        //dojo.style(_extraOptionsContainer,'display', 'none');
        dojo.addClass(_extraOptionsContainer,_config.extraOptionsContainerHideClass);
        _extraOptionsContainerCollapsed = true;
    }

    _init();
};

/**
 * Auto Order Toggle Accordion
 * ******this will need a refactor has its too auto order specific***************
**/

JS.toggleAccordion = function(accordionElem){
    var Elem = dojo.query(accordionElem);
    // Set onclick event for accordion link
    dojo.connect(Elem[0],'onclick',function(e){
        e.preventDefault();
        var parentElemBlock,blockBodyElem,blockFooterElem;

        //get the anchor parent element and children to toogle a show/hide class.
        parentElemBlock= dojo.query(this).parents('.block');
        blockBodyElem = parentElemBlock.children('.blockBody');
        blockFooterElem = parentElemBlock.children('.blockFooter');
        blockBodyElem.toggleClass('accordionHide');
        blockFooterElem.toggleClass('accordionHide');
        parentElemBlock.toggleClass('closedBlock');
    });
};

/**
 * Construncts an object for handling the filter component.
 * @param options Object containing the configuration options for the filter.
 * @constructor
 */
JS.Filter = function(options){

    /**
     * Stores configuration options for the filter
     * @type Object
     * @private
     */
    var _config = {
        filterContainerId: 'filterContainer',
        showHideFilterLinkId: 'showHideFilterSlither',
        showHideDietFilterLinkId: 'showHideDietAndLifestyle',
        filterFormId: 'filterOptions',
        filterPanelId: 'filterOptions',
        dietFilterPanelId: 'dietAndLifestyle',
        hOneId: 'resultsHeading',
        quantitySelectedId: 'quantitySelected',
        filterOptionsId: 'filterOptionsContainer',
        dietFilterOptionsId: 'dietAndLifestyle',
        resultsListId: 'productLister',
        collapseFilterByDefault: false,
        collapseDietFilterByDefault: true,
        gridViewObject: false,
        paginationAutoSubmitObject: false,
        trolleyObject: false,
        addSubscriptionObject:false,
        ajaxAction: '',
        filterBoxes: []
    };

    /**
     * Used to store the filter form
     * @type Object
     * @private
     */
    var _filterForm;

    /**
     * Flag to specify whether the hash is being set for the first time
     * @type Boolean
     * @private
     */
    var _firstHash = false;

    /**
     * Used to store the filter section
     * @type Object
     * @private
     */
    var _filterPanel;

    /**
     * Used to store the dietary and lifestyle filter section
     * @type Object
     * @private
     */
    var _dietFilterPanel;

    /**
     * Used to store the H1
     * @type Object
     * @private
     */
    var _hOneElem;

    /**
     * Used to store the quantity selected textfilter container
     * @type Object
     * @private
     */
    var _quantitySelectedElem;

    /**
     * Used to store the filter element
     * @type Object
     * @private
     */
    var _filterElem;

    /**
     * Used to store the dietary and lifestyle filter element
     * @type Object
     * @private
     */
    var _dietFilterElem;

    /**
     * Used to store the results element (container for products, recipes, etc.)
     * @type Object
     * @private
     */
    var _resultsElem;

    /**
     * Used to store the product overlay object
     * @type Object
     * @private
     */
    var _productsOverlay;

    /**
     * Used to store the filter overlay object
     * @type Object
     * @private
     */
    var _filterOverlay;

    /**
     * Array to store handles for the filter fields (IE8 and below only)
     * @type Array
     * @private
     */
    var _fieldHandles = [];

    /**
     * Handle onchange event on the filter
     * @param e event object
     * @private
     */
    var _filterChange = function(e){
        var evt=window.event || e;
        var targetElem = evt.target;
        if (!targetElem) //if event obj doesn't support e.target, presume it does e.srcElement
            targetElem=evt.srcElement; //extend obj with custom e.target prop

        // Test what was changed, and if element is a SELECT or a checkbox then submit the form
        if (targetElem.tagName == 'SELECT'){
            _updateHash();
        } else {
            if (targetElem.tagName == 'INPUT' && targetElem.type == 'checkbox'){
                _updateHash();
            } else {
                // If not correct action, then return
                return;
            }
        }
    }

    /**
     * Updates the hash for the filter
     * @param replaceCurrentEntry A boolean value that specifies whether the change to the hash value
     *        should replace the current entry in the browser history. Defaults to false.
     * @private
     */
    var _updateHash = function(replaceCurrentEntry){
         options.tabs();
        // Set the default value of the replaceCurrentEntry parameter
        replaceCurrentEntry = typeof replaceCurrentEntry == 'boolean' ? replaceCurrentEntry : false;
        // Get the form data into a query string
        var ajaxFormQuery = dojo.formToQuery(_filterForm);
        // Set the hash value
        dojo.hash(ajaxFormQuery,replaceCurrentEntry);
    }

    /**
     * Handles submitting the filter via AJAX
     * @param e event object
     * @private
     */
    var _submitFilter = function(e){
        /* If this is the first hash change, i.e. the first time we have landed at this page, then
         * we do not need to submit the filter, so we can just return.
         */

        if (_firstHash){
            _firstHash = false;
            return;
        }

        // Get the form data from the hash into an object
        var hashString = dojo.hash();

        /* Test to see whether the hash string has the equals sign in it. If it doesn't, then we can
         * assume the hash is a result of clicking on a link to another part of the current page. In
         * this case, we can just return out of this function.
         */
        if (hashString.indexOf('=') == -1)
            return;

        // Place an overlay over the products
        _filterOverlay.show();
        _productsOverlay.show();

        //prevent screenreader from annoucing live area changes until ready with aria-busy
        _quantitySelectedElem.setAttribute('aria-busy', 'true');
        _filterElem.setAttribute('aria-busy', 'true');

        // Convert hash string to object
        var hashObject = dojo.queryToObject(hashString);

        // Get the URL to submit to
        var ajaxUrl = _filterForm.action;
        if (_config.ajaxAction)
            ajaxUrl = _config.ajaxAction;

        // Send the form via AJAX
        dojo.xhrGet({
            url:ajaxUrl,
            content:hashObject,
            handleAs:'json',
            load:function(rawResultsData){
                if (rawResultsData){
                    // Because of restrictions on how the back end returns the JSON, we've got to do a bit
                    // of work to get the results data into an object close to what we want to see.
                    var resultsData = {};
                    // Loop through the array returned in the JSON
                    for (i=0,il=rawResultsData.length;i<il;i++){
                        for (var propName in rawResultsData[i]){
                            resultsData[propName] = rawResultsData[i][propName];
                        }
                    }

                    // If no results come back in the JSON we just need to update the H1 and give the user a no results message
                    if (resultsData.noResultsMessage) {
                        if (_hOneElem)
                            _hOneElem.innerHTML = resultsData.pageHeading;

                        if (_quantitySelectedElem)
                            _quantitySelectedElem.innerHTML = '';

                        if (_resultsElem)
                         _resultsElem.innerHTML = resultsData.noResultsMessage;
                    }

                    // If we do get results then update the page with the returned JSON
                    else {
                        // Update H1
                        if (_hOneElem && resultsData.pageHeading)
                            _hOneElem.innerHTML = resultsData.pageHeading;

                        // Update number of filters selected
                        if (_quantitySelectedElem){
                            if(resultsData.filtersSelectedText){
                                _quantitySelectedElem.innerHTML = resultsData.filtersSelectedText;
                            } else {
                                _quantitySelectedElem.innerHTML = '';
                            }
                        }

                        // Update filter
                        if (_filterElem && resultsData.filterOptions)
                            _filterElem.innerHTML = resultsData.filterOptions;

                        // Update dietary and lifestyle filter
                        if (_dietFilterElem && resultsData.dietFilterOptions)
                            _dietFilterElem.innerHTML = resultsData.dietFilterOptions;

                        // Rebuild and bind JS.FilterBoxes objects
                        for (i=0,il=_config.filterBoxes.length;i<il;i++){
                            _config.filterBoxes[i].cacheBuildAndBind();
                        }

                        // If IE8 or below, need to rebind onchange events for filter options as those browsers do
                        // not support bubbling of the onchange event
                        if (dojo.isIE <= 8)
                            _setFieldEvents();

                        // Start building HTML for product lister
                        var resultsHtml = '';

                        // Add the top pagination bar to the HTML
                        if (resultsData.paginationTop){
                            resultsHtml += resultsData.paginationTop;
                        }

                        // Add the products to the HTML
                        if (_resultsElem && resultsData.productLists) {
                            var productListData = resultsData.productLists;

                            // Loop through aisles
                            for (i=0,il=productListData.length;i<il;i++){
                                // Add the code for the start of the aisle
                                resultsHtml += productListData[i].listStart;

                                // Loop through products in that aisle, and add to the HTML
                                for (c=0,cl=productListData[i].products.length;c<cl;c++){
                                    resultsHtml += productListData[i].products[c].result;
                                }

                                // Close off the aisle
                                resultsHtml += productListData[i].listEnd;
                            }
                        }

                        // Add the bottom pagination bar to the HTML
                        if (resultsData.paginationBottom){
                            resultsHtml += resultsData.paginationBottom;
                        }

                        // Now we've built up the HTML, lets place it into the page
                        _resultsElem.innerHTML = resultsHtml;

                        // Redraw product rows (Grid view only)
                        if (_config.gridViewObject)
                            _config.gridViewObject.getBlocks();

                        // Rebind events for add to trolley
                        if (_config.trolleyObject)
                            _config.trolleyObject.setAddToTrolleyEvents();

                        // Rebind events for subscribe and save
                        if (_config.addSubscriptionObject)
                            _config.addSubscriptionObject.setAddToSubscriptionEvents();

                        // Rebind events for pagination bar
                        if (_config.paginationAutoSubmitObject)
                            _config.paginationAutoSubmitObject.rebind();

                        // Rebind events for tabs bar
                        if( _config.tabs)
                             _config.tabs();

                    }


                }

                // Remove the overlay
                _filterOverlay.hide();
                _productsOverlay.hide();
                //inform screenreader it's ok to announce changes by removing aria-busy
                _quantitySelectedElem.removeAttribute('aria-busy');
                _filterElem.removeAttribute('aria-busy');
            },
            error : function(response, ioArgs) {
                /* handle the error... */
                //console.log("failed xhrGet", response, ioArgs);
                alert('There was a problem handling your request. Please try another option.');

                // Remove the overlay
                _filterOverlay.hide();
                _productsOverlay.hide();
                //inform screenreader it's ok to announce changes by removing aria-busy
                _quantitySelectedElem.removeAttribute('aria-busy');
                _filterElem.removeAttribute('aria-busy');
            }
        });
    }

    /**
     * Binds onchange events for fields in the filter for good 'ol IE8 and below.
     * @private
     */
    var _setFieldEvents = function(){
        // Unbind the existing events
        if (_fieldHandles.length > 0){
            // Disconnect the existing events
            for (var i=0,il=_fieldHandles.length;i<il;i++){
                dojo.disconnect(_fieldHandles[i]);
            }
            // Empty the array of handles
            _fieldHandles.length = 0;
        }

        // Set the onclick event for the checkboxes
        var _filterFields = dojo.query('input[type="checkbox"]',_filterForm);
        if (_filterFields){
            for (var i=0,il=_filterFields.length;i<il;i++){
                // Bind onclick event and add to array of handles
                _fieldHandles.push(
                    dojo.connect(_filterFields[i],'onclick',_updateHash)
                );
            }
        }

        // Set the onchange event for the selects
        _filterFields = dojo.query('select',_filterForm);
        if (_filterFields){
            for (var i=0,il=_filterFields.length;i<il;i++){
                // Bind onchange event and add to array of handles
                _fieldHandles.push(
                    dojo.connect(_filterFields[i],'onchange',_updateHash)
                );
            }
        }
    }

    /**
     * Initialises the Filter object
     */
    function _init(){

        // Extend _config options with those passed into constructor
        if (options)
            dojo.mixin(_config,options);

        // Cache filter form
        _filterForm = document.getElementById(_config.filterFormId);

        if (_filterForm) {

            // If hide filters flag is present on page set collapsed to default
            if (dojo.byId('hideFilters'))
                _config.collapseFilterByDefault = true;

            // Cache filter section links
            JS.base.cacheElements([_config.showHideFilterLinkId,_config.showHideDietFilterLinkId]);

            // Set up the expanding panel for the filter
            _filterPanel = new JS.ExpandingPanel(_config.filterPanelId,{collapseClass:'jsHide',collapseLinkClass:'visible',collapseByDefault:_config.collapseFilterByDefault});
            _filterPanel.addLink(JS.ele[_config.showHideFilterLinkId],0);

            // Set up the expanding panel for the dietary and lifestyle filter
            _dietFilterPanel = new JS.ExpandingPanel(_config.dietFilterPanelId,{collapseClass:'jsHide',collapseLinkClass:'visible',collapseByDefault:_config.collapseDietFilterByDefault});
            _dietFilterPanel.addLink(JS.ele[_config.showHideDietFilterLinkId],0);

            // Cache H1
            _hOneElem = document.getElementById(_config.hOneId);

            // Cache the quantity selected element
            _quantitySelectedElem = document.getElementById(_config.quantitySelectedId);

            // Cache the filter options container
            _filterElem = document.getElementById(_config.filterOptionsId);

            // Cache the filter options container
            _dietFilterElem = document.getElementById(_config.dietFilterOptionsId);

            // Cache results container
            _resultsElem = document.getElementById(_config.resultsListId);

            // Create the overlays for when the page updates
            // AntJ - Using two overlays, could we just do one based on a wrapper around the filter, products/recipes, pagination, etc.?
            _filterOverlay = new JS.AreaOverlay({areaId:'filterContainer',overlayId:'filterOverlay'});
            _productsOverlay = new JS.AreaOverlay({overlayId:'productsOverlay'},false);

            // If hash is empty (initial page state) then set the hash based on the initial form values
            if (!dojo.hash()){
                // Hide the overlay as it's not needed in this instance
                _productsOverlay.hide();

                /*
                 * We only want the filter submit to occur on the first page of a set of results
                 * so the hash should only be applied to the first page of results.
                 * This is so that the back button still works when returning to a deeper search results page from a PDP.
                 */

                // Get query string and make it an object
                var uri = dojo.queryToObject(dojo.doc.location.search.substr((dojo.doc.location.search[0] === "?" ? 1 : 0)));

                // Apply the hash to the URI only if this is the first page in a list of results
                if (!uri.beginIndex || uri.beginIndex == 0) {
                    _firstHash = true;
                    _updateHash(true);
                }

            } else {
                _submitFilter();
            }

            // Bind onhashchange event to handle Back button functionality
            dojo.subscribe("/dojo/hashchange", _submitFilter);

            // Bind onchange event
            if (dojo.isIE <= 8) {
                /* IE8 and below doesn't support bubbling of the onchange event, so sadly we need to bind the
                 * event to every checkbox and dropdown in the filter.
                 */
                _setFieldEvents();
            } else {
                // We can bind the event to whole filter, so no re-binding for the nice browsers!
                dojo.connect(_filterForm,'onchange',null,_filterChange);
            }
        }

    }

    _init();
}

/**
 * Constructs an overlay to sit inside a container. Mainly used for dynamic updates
 * to areas of the page where we don't want the user to interact while it's updating.
 * @param options Object containing the configuration options for the overlay.
 * @param createNew Boolean value to determine whether we will be creating the overlay,
 *        or using one that is already on the page. Defaults to true.
 * @constructor
 */
JS.AreaOverlay = function(options,createNew){
    /**
     * Stores configuration options for the overlay
     * @type Object
     * @private
     */
    var _config = {
        areaId: '',
        overlayClass: 'areaOverlay',
        overlayId: 'areaOverlay',
        showOverlayClass: 'areaOverlayShow'
    };

    /**
     * Used to store the area overlay element
     * @type Object
     * @private
     */
    var _areaOverlayElem;

    /**
     * Sizes and shows the area overlay
     */
    this.show = function(){
        if (!_areaOverlayElem) return;

        // Add the class needed to show the overlay
        dojo.addClass(_areaOverlayElem,_config.showOverlayClass);
    }

    /**
     * Hides the area overlay
     */
    this.hide = function(){
        if (!_areaOverlayElem) return;

        // Remove the class used to show the overlay
        dojo.removeClass(_areaOverlayElem,_config.showOverlayClass);
    }

    /**
     * Gets the area overlay element
     * @return {Object} Returns the area overlay element
     */
    this.getOverlayElement = function(){
        return _areaOverlayElem;
    }

    /**
     * Initialises the AreaOverlay object
     */
    function _init(){
        // Extend _config options with those passed into constructor
        if (options)
            dojo.mixin(_config,options);

        // Set default value for createNew if not passed
        createNew = typeof createNew !== 'undefined' ? createNew : true;

        // If we are creating the overlay <div>
        if (createNew){
            // Get the element to place the overlay inside
            var area = document.getElementById(_config.areaId);

            if (area){
                // Create the page overlay DIV
                _areaOverlayElem = dojo.create('DIV',
                    {
                        className:_config.overlayClass,
                        id:_config.overlayId
                    },
                    area,
                    'first');
            }
        } else {
            // If we are using a <div> that already exists on the page.
            // Find the overlay element
            _areaOverlayElem = document.getElementById(_config.overlayId);
        }
    }

    _init();
}

/**
 * Constructs a TabSet based on an array of IDs passed in the parameters
 * @param {Array} tabIds An array of IDs for the tabs to be included in the set
 * @param {Object} options An object containing configuration options for the tab set
 * @constructor
 */
JS.TabSet = function(tabIds, options){
    /**
     * Stores content and link elements for each tab in the set
     * @type Object
     * @private
     */
    var _tabs = {};

    /**
     * Stores configuration options for the tab set
     * @type Object
     * @private
     */
    var _config = {
        currentTabLinkClass: 'currentTab',
        hideTabClass: 'tabHidden',
        parentTabsClass: 'tabLinks'
    };

    /**
     * Initialises the TabSet object
     */
    this.init = function (){
        if (!tabIds) return;

        // Extend _config options with those passed into constructor
        if (options)
            dojo.mixin(_config,options);

        // Loop through tabIds and adds tabs to the tab set
        for (var i = 0, il = tabIds.length; i<il;i++){
            this.addTab(tabIds[i]);
        }
    }

    /**
     * Adds a tab to the TabSet
     * @param {String} tabId ID of the tab to add
     */
    this.addTab = function (tabId){
        // Check tabId is set
        if (!tabId) return false;

        var tabElem = dojo.byId(tabId);

        if (tabElem) {
            // Get content and link elements for the tab and assign to _tabs
            var tabLinkQuery = 'a[href="#' + tabId + '"]';
            var tabLinks = dojo.query(tabLinkQuery);

            _tabs[tabId] = {
                content : tabElem,
                links : tabLinks
            };
            _setTabLinkClickEvent(this,tabLinks,tabId);
        }
    }

    /**
     * Sets the onClick event for a tab link
     * @param {Object} _this The current TabSet object
     * @param {Array} tabLinks Array of links to bind the onClick event to
     * @param {String} tabId The ID of the tab to show when the link is clicked
     * @private
     */
    function _setTabLinkClickEvent(_this,tabLinks,tabId){
        tabLinks.connect('onclick',null,function(e){
            _this.showTab(tabId);
            if (dojo.hasClass(dojo.query(this).parents('ul')[0], _config.parentTabsClass)) {
                e.preventDefault();
            }
            else {
                JS.SmoothScroll(tabId);
            }
        });
    }

    /**
     * Shows the tab specified by tabId and hides the other tabs in the set
     * @param {String} tabId ID of the tab to show
     */
    this.showTab = function (tabId,secondaryTabId){
        // Check tabId is set and tab exists in the tab set
        if (!tabId || (!_tabs[tabId] && !_tabs[secondaryTabId])) return false;

        // Check to see if the tab is present
        // If it isn't, use the secondary tab
        if ( !_tabs[tabId] ) tabId = secondaryTabId;

        // Loops through tabs and adds hide class to all content blocks and removes current tab class from all links
        for (var i in _tabs){
            dojo.addClass(_tabs[i].content,_config.hideTabClass);
            // Remove parent class of currentTabLinkClass for use of sliding-doors support (rounded corner IE8).
            _tabs[i].links.parent().removeClass(_config.currentTabLinkClass);
        }
        // Removes hide class from tab being shown
        dojo.removeClass(_tabs[tabId].content,_config.hideTabClass);
        // Set class of links to tabId to currentTabLinkClass parent for use of sliding-doors support (rounded corner IE8).
        _tabs[tabId].links.parent().addClass(_config.currentTabLinkClass);
    }

    this.init();
};

/**
 * Constructs a set of Tooltips. Built to only show one tooltip at a time. Tooltips can
 * be configured to be triggered by click, or by mouseover and focus. You cannot trigger
 * a tooltip using all three methods.
 * @param {String or Object} tooltipLinks The element that triggers the tooltip we are adding.
 *        This can either be a CSS selector to query to DOM for the elements, or an actual
 *        element.
 * @param {Object} options An object containing configuration options for the tooltips
 * @constructor
 *
 * ToDo: Figure out if there's a way to unbind hoverIntent.
 */
JS.Tooltips = function(tooltipLinks, options){
    'use strict';

    /**
     * Stores configuration options for the toolips
     * @type Object
     * @private
     */
    var _config = {
        tooltipMarkup:
            '<div class="tooltip" id="JSTooltip">' +
                '<div class="tooltipInner">' +
                    '<a href="#" class="closeTooltip" id="JSTooltipClose">Close<span class="access"> this tooltip and return to the page</span></a>' +
                    '<div class="tooltipText" id="JSTooltipText"></div>' +
                    '<div class="tooltipArrow" id="JSTooltipArrow"></div>' +
                '</div>' +
            '</div>',
        closeLinkID: 'JSTooltipClose',
        containerID: 'JSTooltip',
        textID: 'JSTooltipText',
        arrowID: 'JSTooltipArrow',
        tooltipTextClass: 'tip',
        tooltipPositionClasses: {
            top: 'JSTooltipPositionedTop',
            right: 'JSTooltipPositionedRight',
            bottom: 'JSTooltipPositionedBottom',
            left: 'JSTooltipPositionedLeft'
        },
        fx: null,
        positioning: 'right', // Show tooltip to the right || left || top || bottom of the element. Default is RIGHT.
        triggeredOnClick: true
    };

    /**
     * Stores content and link elements for each tooltip
     * @type Array
     * @private
     */
    var _tooltips = [];

    /**
     * Stores the handles for any events for the display of tooltips.
     * @type Array
     * @private
     */
    var _tooltipEventHandler = [];

    /**
     * Stores the handles for the onBlur event for the display of tooltips.
     * @type Array
     * @private
     */
    var _tooltipOnBlurEventHandler = [];

    /**
     * Stores container for the tooltip to appear in
     * @type Object
     * @private
     */
    var _tooltipContainer = {};

    /**
     * Stores close link
     * @type Object
     * @private
     */
    var _tooltipCloseLink = {};

    /**
     * Stores container for the tooltip text
     * @type Object
     * @private
     */
    var _tooltipText = {};

    /**
     * Stores the element that opened the tooltip
     * @type Object
     * @private
     */
    var _tooltipOpenerElem = {};

    /**
     * Stores container for the tooltip text
     * @type Object
     * @private
     */
    var _tooltipArrow;

    /**
     * Stores the object that controls tabbing within the tooltips
     * @type Object
     * @private
     */
    var _tabController = {};

    /**
     * Stores a space separated list of the classes used for positioning the tooltip.
     * @type String
     * @private
     */
    var _allTooltipPositionClasses = '';

    /**
     * Used instead of 'this' in certain functions
     * @type Object
     * @private
     */
    var _self = this;

    /**
     * Takes a link and gets the ID it refers to from the href.
     * @return {String} The ID of the tooltip
     */
    var _getTooltipIdFromLink = function(link){
        return link.hash.substr(1);
    };

    /**
     * Initialises the object for click triggered tooltips
     * @private
     */
    var _initTriggeredOnClick = function(){
        // Set onclick event for close link
        dojo.connect(_tooltipCloseLink,'onclick',null,function(e){
            _hideTooltip();
            e.preventDefault();
        });

        // Handle keyboard controls. Presumes there is at least 1 link in the tooltip.
        dojo.connect(_tooltipContainer,'onkeydown',null,function(e){
            // Close the tooltip when ESC is hit
            if (e.keyCode==27){
                _hideTooltip();
            }
        });

        // Set up the tab controller
        _tabController = new JS.TabControl(_tooltipContainer,{elementSelector:'a'});
    };

    /**
     * Initialises the object for tooltips triggered on mouseover and focus
     * @private
     */
    var _initTriggeredOnMouseOver = function(){
        // Change what method me use for adding tooltips
        _setupTooltip = _setupMouseOverTriggeredTooltip;
    };

    /**
     * Caches commonly used elements
     * @returns {Boolean} Returns true if all key elements have been cached, otherwise false.
     * @private
     */
    var _cacheElements = function(){
        // Cache the tooltip container
        _tooltipContainer = dojo.byId(_config.containerID);

        // Cache close link
        _tooltipCloseLink = dojo.byId(_config.closeLinkID);

        // Cache the arrow element
        _tooltipArrow = dojo.byId(_config.arrowID);

        // Cache text container
        _tooltipText = dojo.byId(_config.textID);

        return (_tooltipContainer && _tooltipText);
    };

    /**
     * Sets up hoverIntent for a NodeList.
     * @param {Array} triggerElems A NodeList containing the elements that we are applying
     *        hoverIntent to.
     * @private
     */
    var _setupHoverIntent = function(triggerElems){
        triggerElems.hoverIntent(
            {
                over:function(e){
                    _showTooltip(this.tooltipIndex,this);
                },
                out:function(e){
                    _hideTooltip();
                },
                timeout:0
            }
        );
    }

    /**
     * Sets the positioning for the tooltip.
     * @param tooltip {Object} The tooltip we are setting the positioning for.
     * @param positioning {String} What positioning the tooltip should use.
     * @return
     */
    var _setTooltipPositioning = function(tooltip,positioning){
        // If no positioning is provided, use what was in the config
        tooltip.positioning = positioning || _config.positioning;
    }

    /**
     * Sets up a single click triggered tooltip and caches it in the _tooltips object.
     * @param {Object} tooltipLink The anchor element that links to the tooltip to add
     * @param {String} positioning Where the tooltip should be positioned in relation to
     *        the link. If nothing is passed, then _config.positioning will be used.
     * @private
     */
    var _setupClickTriggeredTooltip = function(tooltipLink,positioning){
        if (!tooltipLink) return;

        // Cache the Tooltip
        var tooltipId = _getTooltipIdFromLink(tooltipLink);
        if (!_tooltips[tooltipId]){
            _tooltips[tooltipId] = dojo.byId(tooltipId);
        }

        _setTooltipPositioning(_tooltips[tooltipId],positioning);

        // Set onclick event for link
        _tooltipEventHandler.push(dojo.connect(tooltipLink,'onclick',null,function(e){
            e.preventDefault();
            // Set which element opened the tooltip
            _tooltipOpenerElem = tooltipLink;
            _showTooltip(tooltipId,this);
        }));
    };

    /**
     * Sets up a single mouseover and focus triggered tooltip and caches it in the _tooltips object.
     * @param {Object} tooltipElem The element that triggers the tooltip we are adding.
     * @param {String} positioning Where the tooltip should be positioned in relation to
     *        the link. If nothing is passed, then _config.positioning will be used.
     * @private
     */
    var _setupMouseOverTriggeredTooltip = function(tooltipElem,positioning){
        var tooltipIndex,
            tooltip;

        // Leave if we didn't receive an element
        if (!tooltipElem) return false;

        tooltip = dojo.query('.'+_config.tooltipTextClass,tooltipElem)[0];

        // Leave if we don't find a tooltip
        if (!tooltip) return false;

        // Cache the Tooltip and get its index in the array
        tooltipIndex = _tooltips.push(tooltip) - 1;

        // Save the tooltip index onto the element
        tooltipElem.tooltipIndex = tooltipIndex;

        _setTooltipPositioning(tooltip,positioning);

        // Set focus event for link
        _tooltipEventHandler.push(dojo.connect(tooltipElem,'onfocus',null,function(e){
            _showTooltip(this.tooltipIndex,this);
        }));

        // Set blur event for link
        _tooltipEventHandler.push(dojo.connect(tooltipElem,'onblur',null,function(e){
            _hideTooltip();
        }));
    };

    /**
     * Single method for setting up a tooltip. By default we set this to the method for
     * setting up a click triggered tooltip, but it can be changed if the tooltip is
     * triggered by mouseover/focus.
     * @private
     */
    var _setupTooltip = _setupClickTriggeredTooltip;

    /**
     * Shows a tooltip
     * @param {String} tooltipId ID of the tooltip to show
     * @param {Object} position Contains data around the position and dimensions of the
     *        tooltip link.
     * @private
     */
    var _showTooltip = function(tooltipId,tooltipLink){
        // Local variables
        var currentTooltip = _tooltips[tooltipId],
            tooltipPositioning = currentTooltip.positioning,
            classForTooltip,
            tooltipArrowPos,
            firstTooltipLink,
            tooltipPositionInfo;

        // Copies innerHTML from tooltip to tooltip container
        _tooltipText.innerHTML = currentTooltip.innerHTML;

        // Sets the position of the tooltip
        classForTooltip = _config.tooltipPositionClasses[tooltipPositioning];

        dojo.removeClass(_tooltipContainer, _allTooltipPositionClasses);
        dojo.addClass(_tooltipContainer, classForTooltip);

        // Grab the coordinates for where we need to position the tooltip
        tooltipPositionInfo = JS.positionElement(_tooltipContainer,tooltipLink,tooltipPositioning);

        // If the tooltip needed to be adjusted we'll have to adjust the tooltip arrow
        if (tooltipPositionInfo.horizontalAdjustment !== 0){
            /* Recalculate the arrow's left position value. By default the arrow is left positioned to
             * 50% of the tooltip width minus the width of the arrow.
             */
            tooltipArrowPos = (tooltipPositionInfo.w / 2) + tooltipPositionInfo.horizontalAdjustment;
            dojo.style(_tooltipArrow, 'left', tooltipArrowPos + 'px');
        }

        JS.bgiframe(_tooltipContainer);
        dojo.style(_tooltipContainer,{
            'left':tooltipPositionInfo.leftVal + 'px',
            'top':tooltipPositionInfo.topVal + 'px'
        });

        if (_config.triggeredOnClick){
            // Tell the tab controller to (re)cache the tabable elements
            _tabController.cache();

            // Give focus to the first link in the tooltip (usually the close link) for keyboard users
            firstTooltipLink = _tabController.getFirstElem();
            firstTooltipLink.focus();
        }
    };

    /**
     * Hides the tooltip
     * @private
     */
    var _hideTooltip = function(){
        dojo.style(_tooltipContainer,{'left': '-999px', 'top': '-999px'});
        // Reset the arrow position
        if (_tooltipArrow)
            dojo.style(_tooltipArrow, {'left': ''});
        // Reset the tooltip text
        _tooltipText.innerHTML = '';

        if (_config.triggeredOnClick){
            // Reset the first and last tooltip links
            _tabController.reset();

            //check if the _tooltipOpenerElem exist
            if(_tooltipOpenerElem){
                // Give focus back to the element that opened the tooltip
                _tooltipOpenerElem.focus();
            }

        }
    };


    /**
     * Clears all tooltips, unbinding any events and clearing cached tooltip
     * elements, then recaching and rebinding for the new tooltips.
     */
    this.clear = function(){
        var i=0,
            il=_tooltipEventHandler.length;

        //set the _tooltipOpenerElem to false has we do not have a focus element to get back to
        _tooltipOpenerElem = false;

        //Hide existing tooltips on the page
        _hideTooltip();

        // Unbind any events
        for (;i<il;i++){
            dojo.disconnect(_tooltipEventHandler[i]);
        }
        _tooltipEventHandler.length = 0;

        /* Clear out our tooltips and tooltip links.
         * Although we use this as an array, it is an associative array, so needs to be reset
         * like any other object.
         */
        _tooltips = {};
    };

    /**
     * Public method for adding tooltips.
     * @param {String or Object} triggerElem The element that triggers the tooltip we are adding.
     *        This can either be a CSS selector to query to DOM for the elements, or an actual
     *        element.
     * @param {String} positioning Where the tooltip should be positioned in relation to
     *        the link. If nothing is passed, then _config.positioning will be used.
     */
    this.add = function(triggerElem,positioning){
        var tooltipTriggerElems,
            i=0,
            il;

        // Test if we've been given a string
        if (typeof triggerElem === 'string'){
            // Get and setup the tooltips
            tooltipTriggerElems = dojo.query(triggerElem);
            for (il=tooltipTriggerElems.length;i<il;i++){
                _setupTooltip(tooltipTriggerElems[i],positioning);
            }

            // If these are mouseover triggered tooltips, add hoverIntent
            if (!_config.triggeredOnClick)
                _setupHoverIntent(tooltipTriggerElems);
        } else {
            // Else we presume it's a single element.
            _setupTooltip(triggerElem,positioning);
        }
    };

    /**
     * Initialises the Tooltips object
     * @private
     */
    var _init = function(){
        // Local variables
        var tooltipPositionClasses;

        //if (!tooltipLinks) return; // AJ - Is this enough of a test?

        // Extend _config options with those passed into constructor
        if (options)
            dojo.mixin(_config,options);

        // Build a space separated list of the classes used for positioning the tooltip
        tooltipPositionClasses = _config.tooltipPositionClasses;
        _allTooltipPositionClasses =
            tooltipPositionClasses.top + ' ' +
            tooltipPositionClasses.right + ' ' +
            tooltipPositionClasses.bottom + ' ' +
            tooltipPositionClasses.left;

        // Create tooltip container using markup in _config
        if (!dojo.place(_config.tooltipMarkup,document.body,'last')) return;

        // Cache elements, but dive out if it isn't successful
        if (!_cacheElements()) return;

        dojo.style(_tooltipContainer,{'position':'absolute','left':'-999px','top':'-999px'});

        // Initialise the object based on what will be triggering the tooltips
        if (_config.triggeredOnClick){
            _initTriggeredOnClick();
        } else {
            _initTriggeredOnMouseOver();
        }

        _self.add(tooltipLinks);
    };

    _init();
}

/**
 * Constructs a ExpandingPanel based on an array of IDs passed in the parameters
 * @param {Array} tabIds An array of IDs for the tabs to be included in the set
 * @param {Object} options An object containing configuration options for the expanding panel
 * @constructor
 */
JS.ExpandingPanel = function(panelId, options){
    /**
     * Stores panel and link elements for the panel.
     * Will contain the following:
     *     panel - The element to be collapsed/expanded
     *     links - An array of elements that, when clicked, expand, collapse or toggle the panel.
     *
     * @type Object
     * @private
     */

    /**
     * Initialises the ExpandingPanel object
     */
     var _expandingPanel = {
            panel: null,
            links: []
        };

    /**
     * Needed for closure when used in events
     * @type Object
     * @private
     */
    var _self = this;

    /**
     * Stores configuration options for the tab set
     * @type Object
     * @private
     */
    var _config = {
        expandClass: '',
        collapseClass: 'panelHidden',
        collapseLinkClass: 'panelVisible',
        collapseByDefault: true,
        collapsedText: "Open filter options",
        expandedText: "Close filter options",
        accessibleTextHtml: '<span class="access"></span>'
    };

    /**
     * Stores the state of the panel
     * @type Boolean
     * @private
     */
    var _collapsed = false;

    /**
     * Initialises the ExpandingPanel object
     */
    this.init = function (){
        if (!panelId) return;

        // Extend _config options with those passed into constructor
        if (options)
            dojo.mixin(_config,options);

        var panelElem = dojo.byId(panelId);
        if (!panelElem) return;

        _expandingPanel.panel = panelElem;

        // Collapse the panel if it should be collapsed by default
        if (_config.collapseByDefault)
            this.collapsePanel();
    };

    /**
     * Expands the panel
     */
    this.expandPanel = function (){
        if (!_expandingPanel || !_collapsed) return;
        dojo.removeClass(_expandingPanel.panel,_config.collapseClass);
        dojo.addClass(_expandingPanel.panel,_config.expandClass);
        _collapsed = false;
        _expandingPanel.panel.setAttribute('tabindex', '-1');
        _setToggleState();
    };

    /**
     * Collapses the panel
     */
    this.collapsePanel = function (){
        if (!_expandingPanel || _collapsed) return;
        dojo.removeClass(_expandingPanel.panel,_config.expandClass);
        dojo.addClass(_expandingPanel.panel,_config.collapseClass);
        _collapsed = true;
        _expandingPanel.panel.removeAttribute('tabindex');
        _setToggleState();
    };

    var _setToggleState = function() {

        var panelExpanded = _collapsed ? false : true;

        for(var i = 0; i < _expandingPanel.links.length; i++){
            _expandingPanel.links[i].setAttribute('aria-expanded', panelExpanded);

            if(_collapsed === false) {
                dojo.addClass(_expandingPanel.links[i],_config.collapseLinkClass);
            } else {
                dojo.removeClass(_expandingPanel.links[i],_config.collapseLinkClass);
            }
        }

        _setAccessibleText();
    };
    /**
     * Toggles the panel between being expanded or collapsed, based on its current state
     */
    this.togglePanel = function (){
        if (_collapsed) {
            _self.expandPanel();
        }
        else {
            _self.collapsePanel();
        }
    };

    var _setAccessibleText = function(){

        for(var i = 0; i < _expandingPanel.links.length; i = i + 1) {
            /* Set up variables,
             * accessElContainer for the accessible text element injection based on the current link in the array
             * accessElText is taken from config based on the expanded state of the panel
             * accessEl is the accessible text element to be injected
             */

            var accessElContainer = dojo.query(_expandingPanel.links[i]),
                accessElText = _collapsed === true? _config.collapsedText : _config.expandedText,
                accessEl;

            /*
             * check that the accessible text element has not already been injected
             */

            if(dojo.query('span.access', accessElContainer[0]).length === 0) {
                dojo.place(_config.accessibleTextHtml,accessElContainer[0]);
            }

            /*
             * then set accessEl variable and inject the text
             */
            accessEl = dojo.query('span.access', accessElContainer[0]);
            accessEl[0].innerHTML = accessElText;
        }
    };

    /**
     * Adds a link for collapsing, expanding or toggling the panel
     * @param {Object} linkElement DOM element to bind the onclick event to
     * @param {Integer} action What action the link performs.
     *        0 (zero) = toggle (Default)
     *        1 = expand
     *        2 = collapse
     */
    this.addLink = function(linkElement,action){
        if (!_expandingPanel || !linkElement || action > 2) return false;

        /* Place toggle, expand and collapse functions in an Array so we don't need an if statement.
         * Also means we don't have to worry about using 'this' inside the onclick event */

        var _actionFunctions = [_self.togglePanel,_self.expandPanel,_self.collapsePanel],
            _numLinks,  // will be used to store a reference to the index of _currentLink
            _currentLink;  // this will be linkElement

        /* Set _numLinks to the length of array before we push linkElement so that _numLinks will match _currentLink
         * index in _expandingPanel.links array
         */

        _numLinks = _expandingPanel.links.length;

        /* now push linkElement */
        _expandingPanel.links.push(linkElement);

        /* set _currentLink to the current index of _expandingPanel.links */
        _currentLink = _expandingPanel.links[_numLinks];

        /* bind the toggle link */

        dojo.connect(_currentLink,'onclick',null,function(e){
            e.preventDefault();
            _actionFunctions[action]();
        });

        /* set up the initial states for the filter:
         * collaseLinkClass
         * waiaria state for the links
         * accessible link text */

        _setToggleState();
    };

    this.init();
};


/**
 * Function for smoothly scrolling the browser window to a particular element on
 * the page base
 * @param {String} elemId ID of the element to scroll to.
 * @param {Boolean} focusWhenDone Determines whether the element being scrolled
 *        to is given focus at the end of the scroll.
 * @param {Number} scrollAdjustment The amount to adjust the scroll position by.
 *        This is useful for when there is another element you want to scroll
 *        past.
 */
JS.SmoothScroll = function(elemId, focusWhenDone, scrollAdjustment){
    /**
     * Stores documentElement object used to get current scroll position
     * @type Object
     * @private
     */
    var _doc = document.documentElement;

    /**
     * Stores body object used to get current scroll position
     * @type Object
     * @private
     */
    var _body = document.body;

    /**
     * Stores the element we are scrolling to
     * @type Object
     * @private
     */
    var _element = document.getElementById(elemId);

    /**
     * Stores animation object for handling the smooth scrolling
     * @type Object
     * @private
     */
    var _scrollAnim = new dojo._Animation({
        curve: [0,0],
        easing: JS.objects.easing.cubicOut,
        onAnimate: function(value){
            window.scrollTo(0,value);
        },
        onEnd: function(){
            if(focusWhenDone){
                _element.tabIndex = -1;

                _element.focus();

                // Need this as focusing on an element tends to scroll the page to the top again.
                window.scrollTo(0,_scrollAnim.curve.end);
            }
        }
    });

    // Find the current Y position of the document in the window
    var windowTop = ((_doc && _doc.scrollTop) || (_body && _body.scrollTop) || 0);

    // Get Y position of the element
    var elemPosition = dojo.position(_element,true);

    // Get the height of the fixed header
    var fixedHeaderHeight = JS.objects.floatingHeader.headerHeight;

    // Set the animation parameters, end is dependent on whether page has a fixed header
    _scrollAnim.curve.start = windowTop;
    if(fixedHeaderHeight) {
        _scrollAnim.curve.end = elemPosition.y - fixedHeaderHeight;
    } else {
        _scrollAnim.curve.end = elemPosition.y;
    }

    if (typeof scrollAdjustment != 'undefined'){
        _scrollAnim.curve.end -= scrollAdjustment;
    }

    _scrollAnim.duration = 500;

    // Animate!
    _scrollAnim.play();
};

/**
 * Constructs an object for handling the interactive breadcrumb
 * @param {String} breadcrumbItemQuery Query for selecting the breadcrumb items
 * @constructor
 */
JS.Breadcrumb = function(breadcrumbItemQuery){
    /**
     * Initialises the Breadcrumb object
     */
    var _init = function(){
        var breadcrumbItems = dojo.query(breadcrumbItemQuery);
        breadcrumbItems.hoverIntent(
            {
                over: function(){
                    var itemClassName = dojo.trim(this.className);
                    var hoverClass = {
                        'first':'hover firstHover',
                        'second':'hover secondHover',
                        'third':'hover thirdHover'
                    };
                    dojo.addClass(this,hoverClass[itemClassName]);
                },
                out: function(){
                    dojo.removeClass(this,"hover firstHover secondHover thirdHover");
                }
            }
        );
    }

    _init();
}

/**
 * Constructs an object for handling the Global Nav
 * @param {String} globalNavItemQuery Query for selecting the Global Nav items
 * @param {Object} options An object containing configuration options for the Global Nav
 * @constructor
 */
JS.GlobalNav = function(globalNavItemQuery,options){
    /**
     * Stores configuration options for the Global Navigation
     * @type Object
     * @private
     */
    var _config = {
        hoverClass: 'hover'
    };

    /**
     * Initialises the GlobalNav object
     * @private
     */
    var _init = function(){
        // Extend _config options with those passed into constructor
        if (options)
            dojo.mixin(_config,options);

        var globalNavItems = dojo.query(globalNavItemQuery);
        globalNavItems.hoverIntent(
            {
                over: function(){
                    dojo.addClass(this,_config.hoverClass);
                },
                out: function(){
                    dojo.removeClass(this,_config.hoverClass);
                }
            }
        );
    }

    _init();
}

/**
* Brian Cherne's jQuery plugin hoverIntent, refactored for Dojo 1.7.1.
* Based on:
* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
*
* hoverIntent is currently available for use in all personal or commercial
* projects under both MIT and GPL licenses. This means that you can choose
* the license that best suits your project, and use it accordingly.
*
* // basic usage (just like .hover) receives onMouseOver and onMouseOut functions
* $("ul li").hoverIntent( showNav , hideNav );
*
* // advanced usage receives configuration object only
* $("ul li").hoverIntent({
*   sensitivity: 7, // number = sensitivity threshold (must be 1 or higher)
*   interval: 100,   // number = milliseconds of polling interval
*   over: showNav,  // function = onMouseOver callback (required)
*   timeout: 0,   // number = milliseconds delay before onMouseOut function call
*   out: hideNav    // function = onMouseOut callback (required)
* });
*
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
*/
dojo.NodeList.prototype.hoverIntent = function(f,g){
    // default configuration options
    var cfg = {
        sensitivity: 7,
        interval: 200,
        timeout: 400
    };
    // override configuration options with user supplied object
    dojo.mixin(cfg, g ? { over: f, out: g } : f );

    // instantiate variables
    // cX, cY = current X and Y position of mouse, updated by mousemove event
    // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
    var cX, cY, pX, pY;

    // A private function for getting mouse position
    var track = function(ev) {
        cX = ev.pageX;
        cY = ev.pageY;
    };

    // A private function for comparing current and previous mouse position
    var compare = function(ev,ob) {
        ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
        // compare mouse positions to see if they've crossed the threshold
        if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
            dojo.disconnect(ob.hoverIntent_c);
            // set hoverIntent state to true (so mouseOut can be called)
            ob.hoverIntent_s = 1;
            return cfg.over.apply(ob,[ev]);
        } else {
            // set previous coordinates for next time
            pX = cX; pY = cY;
            // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
            ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
        }
    };

    // A private function for delaying the mouseOut function
    var delay = function(ev,ob) {
        ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
        ob.hoverIntent_s = 0;
        return cfg.out.apply(ob,[ev]);
    };

    // A private function for handling mouse 'hovering'
    var handleHover = function(e) {
        // copy objects to be passed into t (required for event object to be passed in IE)
        var ev = dojo.mixin({},e);
        var ob = this;

        // cancel hoverIntent timer if it exists
        if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

        // if e.type == "mouseenter"
        if (e.type == "mouseenter" || e.type == "mouseover") {
            // set "previous" X and Y position based on initial entry point
            pX = ev.pageX; pY = ev.pageY;
            // update "current" X and Y position based on mousemove
            ob.hoverIntent_c = dojo.connect(ob,"onmousemove",null,track);
            // start polling interval (self-calling timeout) to compare mouse coordinates over time
            if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

        // else e.type == "mouseleave"
        } else {
            // unbind expensive mousemove event
            dojo.disconnect(ob.hoverIntent_c);
            // if hoverIntent state is true, then call the mouseOut function after the specified delay
            if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
        }
    };

    // bind the function to the two event listeners
    return this.connect("onmouseenter",null,handleHover).connect("onmouseleave",null,handleHover);
}

/**
 * Chris Coyier's Equal Height Blocks in Rows, refactored for Dojo 1.7.1.
 * Based on:
 * <http://css-tricks.com/equal-height-blocks-in-rows/>
 *
 * Constructs a set of equal height boxes in fluid width rows.
 * @param {Array} blocksArray - Set of elements that need to be redrawn to equal heights.
 * @param {Object} options Configuration options for the object
 * @constructor
 */
JS.EqualHeightRows = function(blocksQuery,options){

    /**
     * Stores configuration options
     * @type Object
     * @private
     */
    var _config = {
        usesStraplines: true, // Are straplines going to be used on these blocks
        blockClass: 'gridItem' // Class that will be used to identify the blocks
    };

    /**
     * Stores this instance of EqualHeightRows object for closure.
     * @private
     */
    var _self = this;

    /**
     * Stores the blocks on the page.
     * @private
     */
    var _blocks;

    /**
     * Stores whether Flexbox and the @Supports rule in CSS is supported
     * @private
     */
    var _flexboxSupported;

    /**
     * First time run flag
     * @private
     */
    var _firstPass = true;

    /**
     * Flag to say if we are in the process of redrawing the rows. Need this as IE7 crashes because
     * it triggers the window.onresize event whenever we update the content of the page.
     * @private
     */
    var _redrawing = false;

    /**
     * Initialises the equalHeightRows object
     * @private
     */
    var _init = function(){
        // Extend _config options with those passed into constructor
        if (options)
            dojo.mixin(_config,options);

        if (!blocksQuery) return;

        _flexboxSupported = JS.SupportsCSSRule('(-webkit-flex-wrap:wrap) or (-moz-flex-wrap:wrap) or (flex-wrap:wrap)');

        /* If Flexbox is supported and we are not using straplines, then we don't need to do anything,
         * because the browser's got this covered. Ace!
         */
        if (_flexboxSupported && !_config.usesStraplines)
            return false;

        if (!_self.getBlocks())
            return false;

        // Redraw the rows when the browser window is resized.
        dojo.connect(window,'onresize',function (){
            if (!_redrawing){
                _self.redrawRows();
            }
        });
    }

    /**
     * Getter for grabbing the class used to identify blocks. Public so it can be used when
     * page is updated, via AJAX for example.
     * @return {String} The class used to identify blocks
     */
    this.getBlockClass = function(){
        return _config.blockClass;
    }

    /**
     * Gets the blocks that match the query. Public so it can be used when
     * page is updated, via AJAX for example.
     */
    this.getBlocks = function(){
        _firstPass = true; // First pass has finished

        // Cache the blocks in our private variable
        _blocks = dojo.query(blocksQuery);

        if (_blocks.length == 0 || !_blocks) return false;

        //_self.findStraplines();
        _self.redrawRows();
        // First pass has finished
        _firstPass = false;

        return true;
    }

    /**
     * Returns true if grid item contains a strapline
     * @private
     */
    function _checkForStrapline(el) {
        var productDiv = dojo.query('.highlighted, .spotlight', el);
        if (productDiv.length > 0) {
            return true;
        }
    };

    /**
     * Sets the height to something new, but remembers the original height in case things change
     * @private
     */
    function _setConformingHeight(el, newHeight) {
        el.originalHeight = (el.originalHeight == undefined) ? (_elHeight) : (el.originalHeight);
        dojo.style(el, 'minHeight', newHeight + "px");

    }

    /**
     * If the height has changed, send the originalHeight
     * @param el - element from _blocks array that is having new height calculated
     * @param elHeight - current height of el before new height is applied
     * @private
     */
    function _getOriginalHeight(el,elHeight) {
        return (el.originalHeight == undefined) ? (_elHeight) : (el.originalHeight);
    }

    /**
     * Finds the tallest block on each row and sets all blocks on the row to the same height
     */
    this.redrawRows = function() {
        _redrawing = true;
        var currentTallest = 0,
            currentRowStart = 0,
            rowDivs = new Array(),
            elTopPosition = 0,
            hasStrapline = false,
            elOriginalHeight,
            elPosition;

        // If Flexbox is supported, we only have to worry about the straplines
        if (_flexboxSupported){
        _blocks.forEach(function(el){
                elPosition = dojo.position(el);
                elTopPosition = elPosition.y;

                if (currentRowStart != elTopPosition) {
                    // Is this the first pass and does the row array contain a strapline?
                    if (hasStrapline == true && _firstPass == true)
                        _addStraplineSpace(rowDivs,currentTallest);

                    // set the variables for the new row
                    rowDivs.length = 0; // empty the array
                    currentRowStart = elTopPosition;
                    hasStrapline = false;
                }

                // Add the div to the arrow for this row
                rowDivs.push(el);

                // If this item has a strapline set flag to true for this row
                if (_checkForStrapline(el) == true)
                    hasStrapline = true;
            });
            // do the last row
                // Is this the first pass and does the row array contain a strapline?
            if (hasStrapline == true && _firstPass == true)
                _addStraplineSpace(rowDivs,currentTallest);
        } else {
            // A little more complicated for the not-so-modern browsers
            _blocks.forEach(function(el){
                elPosition = dojo.position(el);
                elTopPosition = elPosition.y;
                _elHeight = dojo.contentBox(el).h + 1; // +1 because of how IE handles sub-pixels

                if (currentRowStart != elTopPosition) {

                    // Is this the first pass and does the row array contain a strapline?
                    if (_config.usesStraplines && hasStrapline == true && _firstPass == true)
                        currentTallest = _addStraplineSpace(rowDivs,currentTallest);

                    // Loop through row and set height to currentTallest
                    for(currentDiv = 0, rowDivsLength = rowDivs.length ; currentDiv < rowDivsLength ; currentDiv++)
                        _setConformingHeight(rowDivs[currentDiv], currentTallest );

                    // Now that new heights have been drawn assign the new top position value to elTopPosition
                    elTopPosition = dojo.position(el).y;

                // set the variables for the new row
                    rowDivs.length = 0; // empty the array
                    currentRowStart = elTopPosition;
                    currentTallest = _getOriginalHeight(el,_elHeight);
                    rowDivs.push(el),
                    hasStrapline = false;

                // If this item has a strapline set flag to true for this row
                    if (_config.usesStraplines && _checkForStrapline(el) == true) {
                        hasStrapline = true;
                };
            } else {
                // another div on the current row.  Add it to the list and check if it's taller
                    rowDivs.push(el);
                    elOriginalHeight = _getOriginalHeight(el);
                    currentTallest = Math.max(elOriginalHeight,currentTallest);

                // If this item has a strapline set flag to true for this row
                    if (_config.usesStraplines && _checkForStrapline(el) == true) {
                        hasStrapline = true;
                };
            }

            // do the last row
            // Is this the first pass and does the row array contain a strapline?
                if (_config.usesStraplines && hasStrapline == true && _firstPass == true)
                    currentTallest = _addStraplineSpace(rowDivs,currentTallest);

                for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++)
                    _setConformingHeight(rowDivs[currentDiv],currentTallest);
            });
            }
        _redrawing = false;
    }

    /**
     * Adds a space (via a CSS class) at the top of the blocks so that everything lines up
     * when we have a strapline.
     * @param rowDivs {Array} Array of blocks that we will be adding the space to.
     * @param currentTallest {Number} The height of the tallest block before the changes.
     * @return {Number} The height of the tallest block in the row after these changes.
     */
    function _addStraplineSpace(rowDivs,currentTallest){
        var divOriginalHeight;

        for(var i=0, il = rowDivs.length ; i < il ; i++)  {
                    // Find the product div inside this row item
            var straplineRowItem = dojo.query('.product', rowDivs[i]);

                    // Apply strapline class to product div
                    if (straplineRowItem.length > 0)
                        dojo.addClass(straplineRowItem[0], 'straplineRow');

            // Set row items originalHeight property to it's new height including padding
            rowDivs[i].originalHeight = dojo.contentBox(rowDivs[i]).h + 1;

            // Get the original height for this div
            divOriginalHeight = _getOriginalHeight(rowDivs[i]);

            currentTallest = Math.max(divOriginalHeight,currentTallest);
                }

        return currentTallest;
            }

    /**
     * When a block has had content added dynamically e.g. 'xx added to trolley message'.
     * Finds the tallest block on that row and sets all blocks on the row to the same height
     * Pass in the element that has changed e.g. gridView.redrawSingleRow(e);
     * @private
     */
    this.redrawSingleRow = function(elem) {
        // No need to do anything here if Flexbox is supported
        if (_flexboxSupported) return;

        // Reset the min-height for the block
        dojo.style(elem,'minHeight','');

        // find dimensions and position of block that has been changed dynamically
        var changedBlockPosition = dojo.position(elem),
            changedBlockTopPosition = changedBlockPosition.y,
            changedBlockHeight = dojo.contentBox(elem).h + 1; // Using contentbox rather than dojo position so that it includes padding in height calculation

        // Reset changed block's originalHeight property to its new height
        elem.originalHeight = changedBlockHeight;

        var currentTallest = 0,
            rowDivs = new Array(),
            elTopPosition = 0,
            elOriginalHeight;

        // Loop through all the blocks
        _blocks.forEach(function(el){
            elPosition = dojo.position(el);
            elTopPosition = elPosition.y;
            elHeight = dojo.contentBox(el).h;

            // If the blocks have the same top position as the dynamically changed block then they are on the same row
            if (elTopPosition == changedBlockTopPosition) {
                // Another div on the single row.  Add it to the list and check if it's taller
                rowDivs.push(el);
                // Get the original height of the element
                elOriginalHeight = _getOriginalHeight(el);
                currentTallest = Math.max(elOriginalHeight,currentTallest);

                // We have come to the end of the the single row.  Set all the heights on the completed row
                for(currentDiv = 0, rowDivsLength = rowDivs.length ; currentDiv < rowDivsLength ; currentDiv++)
                    // Using Math.ceil as there are sometimes rounding issues when redrawing just a single row
                    _setConformingHeight(rowDivs[currentDiv], Math.ceil(currentTallest));
        }

        });

    }

    _init();
}

/**
 * Automatically submit form on input change
 * @param {String} Selector to return form elements that will trigger form submission onchange
 */
JS.AutoSubmit = function(elems){
    /**
     * Needed for closure when used in events
     * @type Object
     * @private
     */
    var _self = this;

    /**
     * Stores handles for events
     * @type Array
     * @private
     */
    var _changeEventHandles = [];

    /**
     * Stores event type for <input> elements. Needed for good ol' IE8 and below as they
     * cannot handle onchange for these.
     * @type String
     * @private
     */
    var _inputEventType = 'onchange';

    /**
     * Initialises the JS.AutoSubmit object
     * @constructor
     * @private
     */
    var _init = function() {
        if (!elems || elems == "" || elems == undefined) return;
        // Set the event type for inputs to onclick for IE8 and below.
        if (dojo.isIE <= 8) _inputEventType = 'onclick';
        _bind();
    }

    /**
     * Binds the onchange events in the fields
     * @private
     */
    var _bind = function(){
        // Get the elements from the query
        var inputArray = dojo.query(elems);

        // Check that there are items in the array
        if (inputArray.length == 0 || !inputArray) return;

        // Loop through the returned elements
        dojo.forEach(inputArray, function(item, index){
            // Set the event type based on whether this is a SELECT or and INPUT
            var eventType = inputArray[index].tagName == 'INPUT' ? _inputEventType : 'onchange';
            // Bind the change event to the current element, and add to the array of events
            _changeEventHandles.push(
                dojo.connect( inputArray[index], eventType, function(e) {
                    //console.log(dojo.query(this).parents('form'));
                    /* ToDo - AntJ - I think this could be streamlined*/
                    dojo.query(this).parents('form')[0].submit();
                }
            ));
        });
    }

    /**
     * Rebinds the onchange events
     */
    this.rebind = function(){
        // Check if we already have some events bound for this
        if (_changeEventHandles.length > 0){
            // Disconnect the existing events
            for (var i=0,il=_changeEventHandles.length;i<il;i++){
                dojo.disconnect(_changeEventHandles[i]);
            }
            // Empty the array of handles
            _changeEventHandles.length = 0;
        }

        _bind();
    }

    _init();
}

/**
 * Object to handle the remove from favourites functionality.
 */
JS.RemoveFavourites = function(options){
    /**
     * Config options
     * @type Object
     * @private
     */
    var _config = {
        removeFavouritesLinkClass:'removeFavourite',
        productsContainerId:'productsContainer',
        favouriteContainerIdPrefix:'favourite_'
    };

    /**
     * Stores the products container element.
     * @type Object
     * @private
     */
    var _productsContainerElem = {};

    /**
     * Handle onclick event on the products container
     * @param e event object
     * @private
     */
    var _productClick = function(e){
        // Find out what was clicked on
        var evt=window.event || e;
        var targetElem = evt.target;
        if (!targetElem) //if event obj doesn't support e.target, presume it does e.srcElement
            targetElem=evt.srcElement; //extend obj with custom e.target prop

        // If it wasn't a remove from favourites link, then we don't need to do anything
        if (!dojo.hasClass(targetElem,_config.removeFavouritesLinkClass)) return;

        // Split the URL
        var ajaxUrl = targetElem.href.split('?',2);
        // Convert the query string into an object for manipulation
        var ajaxQueryObject = dojo.queryToObject(ajaxUrl[1]);
        // Remove redirUrl from the query string object so Back End doesn't re-direct
        delete ajaxQueryObject.redirUrl;

        // Place overlay on the product
        var favouriteOverlay = new JS.AreaOverlay({
            areaId:'favourite'+ajaxQueryObject.catentryId,
            overlayId:'filterOverlay'+ajaxQueryObject.catentryId,
            overlayClass:'productOverlay',
            showOverlayClass:'showProductOverlay'
        },true);

        // Need to get this to animate somehow!!!!!
        favouriteOverlay.show();

        // Grab the overlay element
        var overlayElem = favouriteOverlay.getOverlayElement();

        // Send the request via AJAX
        dojo.xhrGet({
            url:ajaxUrl[0],
            content:ajaxQueryObject,
            handleAs:'json',
            sync:true,
            load:function(responseData){
                // If the product has been removed, change overlay so that it displays message
                if (responseData.removed){
                    /* We only prevent default once the product is successfully removed
                     * so that the customer is directed to an error page if there is a problem.
                     * An example is when the customer logs out in a separate tab, but tries to
                     * remove a favourite in another tab.
                     */
                    e.preventDefault();

                    // Change the class of the overlay to help show it has been removed
                    dojo.addClass(overlayElem,'favouriteRemoved');

                    // Add some content to indicate it has been removed
                    overlayElem.innerHTML = responseData.removedMessage;

                    // Assign focus to the overlay element
                    overlayElem.focus();
                }
            },
            error : function(response, ioArgs) {
                /* handle the error... */
                //console.log("failed xhrGet", response, ioArgs);
            }
        });
    }

    /**
     * Initialises the JS.RemoveFavourites object
     * @constructor
     * @private
     */
    var _init = function(){
        // Mix in our options
        if (options)
            _config = new JS.mixin(_config,options);

        // Get the products container
        _productsContainerElem = document.getElementById(_config.productsContainerId);

        // Bind on click to product area
            dojo.connect(_productsContainerElem,'onclick',_productClick);
    }

    _init();
}


/**
 * Object to add a subscription item on PDP/PLP pages and when creating an
 * Auto Order/Regular Shop subscription. When doing the latter, we also update
 * a version of the mini trolley for what is in your subscription.
 * @param {Object} options Configuration options for the object.
 */
JS.AddSubscription = function(options) {
    /**
     * Config options
     * @type Object
     * @private
     */
    var _config = {
        errorViewName:'AjaxSubscriptionListBtnDisplay',
        ajaxAddToSubscriptionCommand: 'AjaxSubscriptionListOrderItemAdd',
        ajaxMiniTrolleyEditView: 'AjaxAddItemToSubscriptionView',
        addToSubscriptionFormQuery: '.addToSubscriptionContainer form',
        subscriptionTrolleyElemId: 'miniSubscriptionTrolley',
        aboveMinSpendElementsQuery: '',
        belowMinSpendElementsQuery: '',
        updateFrequency: false,
        itemFrequencyFieldsQuery: '.itemFrequency select'
    };

    /**
     * Needed for closure when used in events
     * @type Object
     * @private
     */
    var _self = this;

    /**
    * Array to store handles for the add to subscription events
    * @type Array
    * @private
    */
    var _addToSubscriptionHandles = [];

    /**
    * Array to store handles for the change item frequency events
    * @type Array
    * @private
    */
    var _changeItemFrequencyHandles = [];

    /**
    * Stores the element that contains the Subscription Mini Trolley.
    * Only used when creating an Auto Order Subscription.
    * @type Object
    * @private
    */
    var _subscriptionTrolleyElem;

    /**
    * Array to store elements that are displayed when above the minimum spend
    * threshold.
    * @type Array
    * @private
    */
    var _aboveMinSpendElems = [];

    /**
    * Array to store elements that are displayed when below the minimum spend
    * threshold.
    * @type Array
    * @private
    */
    var _belowMinSpendElems;

    /**
     * Initialises the JS.AddSubscription object
     * @constructor
     * @private
     */
    var _init = function(){
        // Mix in our options
        if (options)
            _config = new JS.mixin(_config,options);

        _self.cacheElements();

         // Set the Add to Subscription events
        _self.setAddToSubscriptionEvents();
    }

    /**
     * Caches commonly used elements.
     */
    this.cacheElements = function(){
        _subscriptionTrolleyElem = dojo.byId(_config.subscriptionTrolleyElemId);
        if (_config.aboveMinSpendElementsQuery)
            _aboveMinSpendElems = dojo.query(_config.aboveMinSpendElementsQuery);
        if (_config.belowMinSpendElementsQuery)
            _belowMinSpendElems = dojo.query(_config.belowMinSpendElementsQuery);
    };

    /**
     * Binds events for add to subscription to products on the page.
     */
    this.setAddToSubscriptionEvents = function(){
        var i,
            il,
            addToSubscriptionForms,
            itemFrequencyFields;

        // Unbind the existing events for Add to Subscription
        _addToSubscriptionHandles = JS.multiDisconnect(_addToSubscriptionHandles);

        // Set the onSubmit event for the Add to Subscription forms on the page
        addToSubscriptionForms = dojo.query(_config.addToSubscriptionFormQuery);
        _addToSubscriptionHandles = JS.multiConnect(addToSubscriptionForms,'onsubmit',_addToSubscription);

        if (_config.updateFrequency){
            // Unbind the existing events for the change frequency fields
            _changeItemFrequencyHandles = JS.multiDisconnect(_changeItemFrequencyHandles);

            // Set the onChange event for the item frequency fields
            itemFrequencyFields = dojo.query(_config.itemFrequencyFieldsQuery);
            _changeItemFrequencyHandles = JS.multiConnect(itemFrequencyFields,'onchange',_itemFrequencyChanged);
        }

        // Set onClick event for trolley.
        if (_subscriptionTrolleyElem){
            dojo.connect(_subscriptionTrolleyElem,'onclick',_subscriptionTrolleyClick);
    }
    };

    /**
     * Shows and hides elements based on whether the customer is above the minimum spend
     * threashold. Used primarily when creating an auto order/regular shop subscription.
     * @param {Boolean} aboveMinSpend Whether the customer is above the minimum spend threshold.
     * @private
     */
    var _showHideMinSpendElements = function(aboveMinSpend){
        if (_aboveMinSpendElems.length > 0 && _belowMinSpendElems.length > 0){
            if (aboveMinSpend) {
                _aboveMinSpendElems.removeClass('hidden');
                _belowMinSpendElems.addClass('hidden');
            } else {
                _aboveMinSpendElems.addClass('hidden');
                _belowMinSpendElems.removeClass('hidden');
            }
        }
    };

    /**
     * Handles onchaneg event for the item frequency fields.
     * @param e event object
     * @private
     */
    var _itemFrequencyChanged = function(e){
        var itemFrequencyField = this,
            addToSubscriptionForm = dojo.NodeList(itemFrequencyField).parents('form')[0],
            productId = _getProductIdFromFormId(addToSubscriptionForm.id),
            itemMessageContainer = dojo.byId('numberInSubscribed_' + productId),
            formObject;

        if (!dojo.hasClass(itemMessageContainer,'hidden')){
            formObject = _prepareToAddToSubscription(addToSubscriptionForm, true),
            _sendAddToSubscriptionForm(formObject);
        }
    };

    /**
     * Handle onclick event on the mini subscription trolley
     * @param e event object
     * @private
     */
    var _subscriptionTrolleyClick = function(e){
        var elementClicked = JS.whatTagWasClicked(e),
            ajaxUrl,
            ajaxQueryObject;

        // If element clicked wasn't a link, then return
        if (elementClicked.tagName !== 'A') return;

        ajaxUrl = elementClicked.href.split('?',2);
        ajaxQueryObject = dojo.queryToObject(ajaxUrl[1]);
        ajaxQueryObject.URL = _config.ajaxMiniTrolleyEditView;
        ajaxQueryObject.errorViewName = _config.ajaxMiniTrolleyEditView;

        // Post the form via AJAX
        dojo.xhrGet({
            url:ajaxUrl[0],
            content:ajaxQueryObject,
            handleAs:'json',
            sync:true,
            load:function(subscriptionTrolleyData){
                var subscriptionData = subscriptionTrolleyData.subscriptionData,
                    numberSubscribed = subscriptionData.numberSubscribed,
                    itemCatentryId = subscriptionData.itemCatentryId;

                //set and show error message if it exist
                _self.setErrorMessage(itemCatentryId,subscriptionData.errorMessage);

                // Updates subscription info for a product
                _self.setSubscriptionMessage(itemCatentryId,numberSubscribed,subscriptionData.itemFrequencyTxt,subscriptionData.itemFrequency);

                _updateSubscriptionTrolley(subscriptionData.subscriptionTrolleyHtml);
                JS.objects.floatingTrolley.resizeMiniTrolley({recacheTrolleyElements: true});

                _showHideMinSpendElements(subscriptionData.isOverMinimumSpend);
            },
            error : function(response, ioArgs) {
                /* handle the error... */
                //console.log("failed xhrGet", response, ioArgs);
            }
        });
        e.preventDefault();
    };

    /**
     * Updates the Subscription Mini Trolley content.
     * @param {String} trolleyHtml The HTML for the mini trolley.
     * @private
     */
    var _updateSubscriptionTrolley = function(trolleyHtml){
        if (_subscriptionTrolleyElem){
            dojo.place(trolleyHtml, _subscriptionTrolleyElem, 'only');
        }
    };

    /**
     * Takes a form ID and returns the ID of the product it relates to.
     * This can either be the Product ID if it's not a cross sell item OR the
     * Parent Product ID concatenated with Product ID if it is a cross sell item.
     * @param {String} formId The ID of the form.
     * @return {String} The product ID.
     * @private
     */
    var _getProductIdFromFormId = function(formId){
        var split,
            productId;

        // Split the formID at '_' characters
        split = formId.split('_');

        // If the split array length is 3 it means that the Parent Product Id is present and the add to trolley form is in a cross sell
        if (split.length == 3) {
            productId = split[1] + split[2]; // concatenate Parent ProductId + productId
        } else {
            productId = split[1]; // Normal product, not a cross sell so just use the Product Id
        }

        return productId;
    };

    /**
     * Builds the form object for adding to subscription and displays a message to
     * state we are updating.
     * @param {Object} form                 The form we will be submitting.
     * @param {Boolean} updateFrequencyOnly Whether we are preparing to submit the whole
     *                                      form or just the frequency info.
     * @return {Object} Object containing the form data to be sent in the AJAX request.
     * @private
     */
    var _prepareToAddToSubscription = function(form, updateFrequencyOnly){
        var formObject,
            productId,
            URLElem;

        // Get the form values into an object and adjust for AJAX
        formObject = dojo.formToObject(form);

        formObject.isAjax = true;
        formObject.errorViewName = _config.errorViewName;

        if (updateFrequencyOnly){
            formObject.updateFrequencyOnly = 'true';
        }

        productId = _getProductIdFromFormId(form.id);

        // Pass "updating", 'saving' message onClick before the Ajax Call back kicks in
        _self.setSubscriptionMessage(productId,'Updating...','Saving...','');

        // Needed so that URL isn't set to one that will return AJAX content. Certainly not the most robust way of
        // doing this. Would much prefer it if this was done on the Back End.
        // Get URL parameter from the add to subscription form.
        URLElem = dojo.query('input[name=URL]',form);
        // Set the URL to what is in the browser address bar
        if (URLElem.length > 0){
            URLElem[0].value=window.location.href;
        }

        // Ensures that the correct current page URL is used in any links in the resulting HTML that is returned
        formObject.currentPageUrl=formObject.URL;

        // Remove URL from the object of form values so Back End doesn't re-direct
        delete formObject.URL;

        return formObject;
    };

    /**
     * Sends the AJAX request to add an item to the subscription.
     * @param {Object} formObject Object containing the data to be posted to the
     *                            server.
     * @private
     */
    var _sendAddToSubscriptionForm = function(formObject){
        // Post the form via AJAX
        dojo.xhrPost({
            url: _config.ajaxAddToSubscriptionCommand,
            content: formObject,
            handleAs:'json',
            load:function(addToSubscriptionData){
                var subscriptionData = addToSubscriptionData.subscriptionData,
                    numberSubscribed = subscriptionData.numberSubscribed,
                    itemCatentryId,
                    trolleyObject;

                if (typeof subscriptionData === 'undefined') return;

                itemCatentryId = subscriptionData.itemCatentryId;

                //set and show error message if it exist
                _self.setErrorMessage(itemCatentryId,subscriptionData.errorMessage);
                // Updates subscription info for a product
                _self.setSubscriptionMessage(itemCatentryId,numberSubscribed,subscriptionData.itemFrequencyTxt,subscriptionData.itemFrequency);

                _updateSubscriptionTrolley(subscriptionData.subscriptionTrolleyHtml);
                JS.objects.floatingTrolley.resizeMiniTrolley({recacheTrolleyElements: true});

                _showHideMinSpendElements(subscriptionData.isOverMinimumSpend);

                // Check if we have any trolley data to determine whether this was an add and subscribe action
                if (typeof addToSubscriptionData.trolleyHtml !== 'undefined'){
                    trolleyObject = JS.objects.trolleyObj;

                    // Update the mini trolley
                    trolleyObject.updateTrolley(addToSubscriptionData);
                    // Update the product messages
                    trolleyObject.updateProducts(addToSubscriptionData.products);
                }
            }
        });
    };

    /**
     * Handle submit event on add to subscription forms
     * @param e event object
     * @private
     */
    var _addToSubscription = function(e){
        var formObject;

        e.preventDefault();

        formObject = _prepareToAddToSubscription(this, false);

        _sendAddToSubscriptionForm(formObject);
    };


    /**
     * Update the product subscription message
     */
    this.setSubscriptionMessage = function(subscriptionProductId,subscriptionMessage,itemFrequencyMessage,itemFrequencyValue) {
        // Find number in Subscribed message container
        var messageContainer = dojo.byId('numberInSubscribed_' + subscriptionProductId); //

        //Find itemFrequency text and remove the drop-down from the DOM if it exist
        var itemFrequencyContainer = dojo.byId('itemFrequency_' + subscriptionProductId);

        if (!messageContainer) return false;

        if (subscriptionMessage && subscriptionMessage.length > 0 ){
            // If a message is supplied, apply the new message and show the container

            if(itemFrequencyContainer && itemFrequencyValue.length > 0){
                itemFrequencyContainer.innerHTML = itemFrequencyMessage;
                //Create an hidden input DOM element for item frequency with an Ajax value passed, used for onsubmit POST
                var inputItemFrequency = document.createElement('input');
                inputItemFrequency.setAttribute('type','hidden');
                inputItemFrequency.setAttribute('name','itemFrequency');
                inputItemFrequency.setAttribute('value',itemFrequencyValue);
                itemFrequencyContainer.appendChild(inputItemFrequency);
            }

            messageContainer.children[0].innerHTML = subscriptionMessage;
            dojo.removeClass(messageContainer,'hidden') // Put this is a parameter
        } else {
            // If no message is supplied, hide the container
            messageContainer.focus();
            dojo.addClass(messageContainer,'hidden')
        }
            // Redraw the product row
            _redrawProductRow(messageContainer);

    };

    /**
     * Populates the box for showing error messages against a product subscription.
     * @param productId ID of the product the message should be set for.
     * @param message The message to display. If no message is supplied, the error message box is hidden.
     */
    this.setErrorMessage = function(productId,subscriptionMessage){
        // Find number in trolley message container
        var messageContainer = dojo.byId('error' + productId);

        if (!messageContainer) return false;

        if (subscriptionMessage && subscriptionMessage.length > 0){
            // If a message is supplied, apply the new message and show the container
            messageContainer.innerHTML = subscriptionMessage;
            dojo.removeClass(messageContainer,'hidden') // Put this is a parameter
            messageContainer.focus();
        } else {
            // If no message is supplied, hide the container
            messageContainer.innerHTML = '';
            dojo.addClass(messageContainer,'hidden');
        }
        // Redraw the product row
        _redrawProductRow(messageContainer)
    };

    /**
     * Function that takes an element inside a product, finds its main product parent, and
     * then uses the JS.EqualHeightRows object (represented by JS.objects.gridView) to redraw
     * the row for that product.
     * @param childElem {Object} Element that we need to find the product parent for
     */
    var _redrawProductRow = function(childElem){
        if (JS.objects.gridView) {
            var childNodeList = dojo.query(childElem);
            var parentContainer = childNodeList.parents('.' + JS.objects.gridView.getBlockClass());
            // ToDo: JS.objects.gridView should be passed as a parameter
            if (parentContainer.length > 0)
                JS.objects.gridView.redrawSingleRow(parentContainer[0]);
        }
    };


    _init();
}

/**
 * Object to look after all the events that update the trolley
 */
JS.Trolley = function(options){
    /**
     * Config options
     * @type Object
     * @private
     */
    var _config = {
        floatingTrolley: {},
        addAllClass: 'addAll'
    };

    /**
     * Stores the element that contains the trolley.
     * @type Object
     * @private
     */
    var _trolleyElem = {};

    /**
     * Stores the tbody for the trolley table.
     * @type Object
     * @private
     */
    var _trolleyTableBody = {};

    /**
     * Stores the Total Price element.
     * @type Object
     * @private
     */
    var _trolleyTotal = {};

    /**
     * Stores the Total Savings element.
     * @type Object
     * @private
     */
    var _trolleySavings = {};

    /**
     * Stores the Total Price element that appears in the table.
     * @type Object
     * @private
     */
    var _trolleyTableTotal = {};

    /**
     * Stores the Total Savings element that appears in the table.
     * @type Object
     * @private
     */
    var _trolleyTableSavings = {};

    /**
     * Stores the delivery slot price element.
     * @type Object
     * @private
     */
    var _deliverySlotPrice = {};

    /**
     * Stores the sub panel that contains the delivery price information text.
     * @type Object
     * @private
     */
    var _deliverySlotPriceInfoPanel = {};

    /**
     * Stores the parent panel of the sub panel that contains the delivery information.
     * @type Object
     * @private
     */
    var _deliverySlotPriceInfoPanelParent = {};

    /**
     * Stores the carrier bag charge text element.
     * @type Object
     * @private
     */
    var _carrierBagTextElem = {};

    /**
     * Stores the carrier bag charge tooltip text element.
     * @type Object
     * @private
     */
    var _carrierBagTooltipTextElem = {};

    /**
     * Array to store handles for the add to trolley events
     * @type Array
     * @private
     */
    var _addToTrolleyHandles = [];

    /**
     * Stores the empty trolley link element.
     * @type Object
     * @private
     */
    var _emptyTrolleyLinkElem = {};

    /**
     * Stores the save trolley link elements.
     * @type Array
     * @private
     */
    var _saveTrolleyLinkElems = [];

    /**
     * Stores whether the JS.FloatingTrolley object has been passed and if it has the
     * methods needed for updating the floating trolley. This is because for some browsers
     * we do not use the floating trolley.
     * @type Boolean
     * @private
     */
    var _floatingTrolleyInUse = false;

    /**
     * Stores the overlay object for when we use Add All buttons
     * @type Object
     * @private
     */
    var _addAllOverlay;

    /**
     * Needed for closure when used in events
     * @type Object
     * @private
     */
    var _self = this;

    /**
     * Initialises the JS.Trolley object
     * @constructor
     * @private
     */
    var _init = function(){
        // Mix in our options
        if (options)
            _config = new JS.mixin(_config,options);

        if (_config.floatingTrolley && typeof _config.floatingTrolley.resizeMiniTrolley != 'undefined')
            _floatingTrolleyInUse = true;

        _trolleyElem = dojo.byId('miniTrolley');
        if (_trolleyElem){
            _cacheTrolleyElements();

            // Get delivery slot price elements
            _deliverySlotPrice = dojo.byId('deliverySlotPrice');
            _deliverySlotPriceInfoPanel = dojo.byId('deliverySlotPricing');

            // Get carrier bag charge elements
            _carrierBagTextElem = dojo.byId('carrierBagText');
            _carrierBagTooltipTextElem = dojo.byId('bagChargeTip');

            /**
             * Set onClick event for trolley.
             * Bind the event to the trolley table itself, then use
             * srcElement (IE) or target (others) in the event object to
             * determine what actually was clicked. This will eliminate
             * the need to (re)bind every link in the trolley.
             */
            dojo.connect(_trolleyElem,'onclick',_trolleyClick);
        }

        // Set the Add to Trolley events
        _self.setAddToTrolleyEvents();
    }

    /**
     * Binds events for add to trolley to products on the page.
     */
    this.setAddToTrolleyEvents = function(){
        // Unbind the existing events
        if (_addToTrolleyHandles.length > 0){
            // Disconnect the existing events
            for (var i=0,il=_addToTrolleyHandles.length;i<il;i++){
                dojo.disconnect(_addToTrolleyHandles[i]);
            }
            // Empty the array of handles
            _addToTrolleyHandles.length = 0;
        }

        // Set the onSubmit event for the Add to Trolley forms on the page
        // TODO: PUT THIS QUERY INTO CONFIG OBJECT FOR REUSE
        var addToBasketForms = dojo.query('.addToTrolleyForm form');
        if (addToBasketForms){
            for (var c=0,cl=addToBasketForms.length;c<cl;c++){
                // Bind onSubmit event and add to array of handles
                _addToTrolleyHandles.push(
                    dojo.connect(addToBasketForms[c],'onsubmit',_addToTrolley)
                );
            }
        }

        // Set the onSubmit event for the Add All to Trolley form (if it exists)
        var addAllToBasketForm = dojo.byId('addAllForm');
        if (addAllToBasketForm){
            // Bind onSubmit event and add to array of handles
            _addToTrolleyHandles.push(
                dojo.connect(addAllToBasketForm,'onsubmit',_addToTrolley)
            );
        }
    }

    /**
     * Populates the box for showing the number of products in the trolley.
     * @param productId ID of the product the message should be set for.
     * @param message The message to display. If no message is supplied, the box is hidden.
     */
    this.setInTrolleyMessage = function(productId,message){
        // Find number in trolley message container
        var messageContainer = dojo.query('#content .numberInTrolley_' + productId); // Using a class rather than ID as sometimes more than one identical product can appear on a page e.g cross sells
        if (!messageContainer) return false;

        for (var i=0,il=messageContainer.length;i<il;i++){
            if (message && message.length > 0){
                // If a message is supplied, apply the new message and show the container
                messageContainer[i].innerHTML = message;
                dojo.removeClass(messageContainer[i],'hidden') // Put this is a parameter
                // This needs to be put back when back end fix the number of items being returned. We should only have one item in the JSON
                //messageContainer[i].focus();
            } else {
                // If no message is supplied, hide the container
                messageContainer[i].focus();
                dojo.addClass(messageContainer[i],'hidden')
            }
            // Redraw the product row
            _redrawProductRow(messageContainer[i]);
        }
    }

    /**
     * Populates the box for showing error messages against a product.
     * @param productId ID of the product the message should be set for.
     * @param message The message to display. If no message is supplied, the error message box is hidden.
     */
    this.setErrorMessage = function(productId,message){
        // Find number in trolley message container
        var messageContainer = dojo.byId('error' + productId);

        if (!messageContainer) return false;

        if (message && message.length > 0){
            // If a message is supplied, apply the new message and show the container
            messageContainer.innerHTML = message;
            dojo.removeClass(messageContainer,'hidden') // Put this is a parameter
            messageContainer.focus();
        } else {
            // If no message is supplied, hide the container
            messageContainer.innerHTML = '';
            dojo.addClass(messageContainer,'hidden')
        }
        // Redraw the product row
        _redrawProductRow(messageContainer);
    }

    /**
     * Updates trolley info for a product in a list or on a PDP.
     * @param products Array of products to update
     */
    this.updateProducts = function(products){
        var i=0,
            il=products.length,
            productId,
            inTrolleyMessage;

        for (;i<il;i++){
            productId = products[i].productId;
            inTrolleyMessage = products[i].inTrolleyMessage;

            if (productId){
                _self.setInTrolleyMessage(productId,inTrolleyMessage);
            }
        }
    }

    /**
     * Updates the RHS mini-trolley.
     * @param trolleyData JSON data about the trolley
     */
    this.updateTrolley = function(trolleyData){
        switch (trolleyData.trolleyAction){
            case 'insert': // Add a new product to the top of the trolley or update existing product
                _updateTrolleyTotals(trolleyData.totalPrice,trolleyData.totalSavings);
                if (trolleyData.products.length > 0) {
                    var rowToUpdate = dojo.byId('row' + trolleyData.products[0].productId);
                    if (rowToUpdate) {
                        dojo.place(trolleyData.trolleyHtml,rowToUpdate,'replace');
                    } else {
                        dojo.place(trolleyData.trolleyHtml,_trolleyTableBody,'first');
                    }
                }
                break;
            case 'remove': // Remove a product from the trolley
                _updateTrolleyTotals(trolleyData.totalPrice,trolleyData.totalSavings);
                if (trolleyData.products.length > 0)
                    dojo.destroy('row' + trolleyData.products[0].productId);
                break;

            default: // Refresh the entire trolley
                if (_floatingTrolleyInUse){
                    // Get the current scrollTop position for the scrollable part of the trolley
                    var lastScrollTop = _config.floatingTrolley.getScrollTop();
                }

                // Replaced the trolley HTML
                dojo.place(trolleyData.trolleyHtml,_trolleyElem,'only');

                // Re-cache elements that may have changed
                _cacheTrolleyElements();

                // Make sure any missed promo tooltips are added back in
                JS.objects.tooltips.add('#miniTrolley .tipLink');

                // Update the previousUrl for Empty trolley link
                _updatePreviousUrl(_emptyTrolleyLinkElem);

                // Update the previousUrl for Save trolley link
                for(var i = 0, linkElementLength = _saveTrolleyLinkElems.length; i < linkElementLength; i++) {
                    _updatePreviousUrl(_saveTrolleyLinkElems[i]);
                }

                if (_floatingTrolleyInUse){
                    /* Since we've replaced the HTML for the trolley, we need to
                     * need to resize the floating trolley
                     */
                    _config.floatingTrolley.resizeMiniTrolley({recacheTrolleyElements: true});

                    /* We also need to make sure the scrollable part of the trolley retains
                     * its scroll position.
                     */
                    _config.floatingTrolley.setScrollTop(lastScrollTop);
                }
                break;
        }
    };

    /**
     * Handle submit event on add to trolley forms
     * @param e event object
     * @private
     */
    var _addToTrolley = function(e){
        // Cache form into a variable for closure
        var _form = this;

        // Store whether this is an add all request
        var isAddAll = dojo.hasClass(_form,_config.addAllClass);

        // Get the form values into an object and adjust for AJAX
        var _formObject = dojo.formToObject(_form);

        if (!_formObject.callAjax || _formObject.callAjax == 'true'){
            e.preventDefault();

            // If we are adding just a single product
            if (!isAddAll){
                // Find out the product ID
                // We get the product ID from the ID of the add to trolley form e.g. id="OrderItemAddForm_[productID]".
                // However cross sells can cause a situation where two identical products are displayed on the page.
                // To ensure we do not have duplicate IDs in the JSPs we add the parent product ID to the cross sell add to trolley form ID e.g. id="OrderItemAddForm_[parentProductID]_[productID]"
                // In our javascript the variable '_productId' can either be the Product ID if it's not a cross sell item OR the Parent Product ID concatenated with Product ID if it is a cross sell item

                var _formId = _form.id;
                var _productId;

                // Spit the formID at '_' characters
                var _split = _formId.split('_');

                // If the split array length is 3 it means that the Parent Product Id is present and the add to trolley form is in a cross sell
                if (_split.length == 3) {
                    _productId = _split[1] + _split[2]; // concatenate Parent ProductId + productId
                }
                else {
                    _productId = _split[1]; // Normal product, not a cross sell so just use the Product Id
                }

                // Show "updating" message
                _self.setInTrolleyMessage(_productId,'Updating...');
            } else {
                // Check that we do not already have an overlay created
                if (!_addAllOverlay){
                    _addAllOverlay = new JS.Overlay({overlayBoxClass:'overlayBox addAllOverlay',clickToClose:false,centreVertically:true});
                }
                _addAllOverlay.displayPageOverlay();
                _addAllOverlay.show('<div class="overlayBody"><p class="addAllWaitMessage">Please wait while we fill your trolley for you...</p></div>');
            }

            // Needed so that URL isn't set to one that will return AJAX content. Certainly not the most robust way of
            // doing this. Would much prefer it if this was done on the Back End.
            // Get URL parameter from the add to trolley form.
            var _URLElem = dojo.query('input[name=URL]',_form);
            // Set the URL to what is in the browser address bar
            if (_URLElem.length > 0) {
                _URLElem[0].value=window.location.href;
            }

            // Ensures that the correct current page URL is used in any links in the resulting HTML that is returned
            _formObject.currentPageUrl=_formObject.URL;

            // Remove URL from the object of form values so Back End doesn't re-direct
            delete _formObject.URL;

            // Set the Error View to an AJAX specific one
            _formObject.errorViewName='AjaxQuickCartDisplay';

            // Create a value to specify whether the trolley is currently empty or not
            _formObject.isCurrentlyEmpty = dojo.byId('emptyTrolley') ? true : false;

            // Post the form via AJAX
            dojo.xhrPost({
                url:'AjaxOrderItemAdd',
                content:_formObject,
                handleAs:'json',
                sync: (!isAddAll), // Don't want to block other calls when adding all, as we want to show overlay
                load:function(trolleyData){
                    // Output any error messages
                    if (!isAddAll)
                    _self.setErrorMessage(_productId,trolleyData.errorMessage);

                    // Update the product messages
                    _self.updateProducts(trolleyData.products);

                    // Update the mini trolley
                    _self.updateTrolley(trolleyData);

                    // Update delivery slot price
                    _updateDeliverySlotPrice(trolleyData.deliverySlotPrice,trolleyData.deliverySlotPriceInfo);

                    // Update Welsh carrier bag charge info
                    _updateCarrierBagInfo(trolleyData.bagChargeText,trolleyData.bagChargeTooltipText);

                    if (isAddAll){
                        // If we received an error, place it in the overlay
                        if (trolleyData.errorMessage && trolleyData.errorMessage.length > 0){
                            _addAllOverlay.show('<div class="overlayBody"><a class="closeOverlay" href="#">Close</a>' + trolleyData.errorMessage) + '</div>';
                        } else {
                            // Hide the overlay
                            _addAllOverlay.hide();
                        }
                    }
                }
            });
        }
    };

    /**
     * Handle onclick event on the mini trolley
     * @param e event object
     * @private
     */
    var _trolleyClick = function(e){
        var evt=window.event || e;
        var targetElem = evt.target;
        if (!targetElem) //if event obj doesn't support e.target, presume it does e.srcElement
            targetElem=evt.srcElement; //extend obj with custom e.target prop

        var trolleyAction = _whichTrolleyAction(targetElem);

        // If trolley action isn't one we are handling, then return
        if (!trolleyAction) return;

        var ajaxUrl = targetElem.href.split('?',2);
        var ajaxQueryObject = dojo.queryToObject(ajaxUrl[1]);
        ajaxQueryObject.URL = 'AjaxQuickCartDisplay';
        ajaxQueryObject.errorViewName = 'AjaxQuickCartDisplay';
        ajaxQueryObject.isCurrentlyBelowMinimumSpend = dojo.byId('minimumSpendMessage') ? true : false;;

        // Post the form via AJAX
        dojo.xhrGet({
            url:ajaxUrl[0],
            content:ajaxQueryObject,
            handleAs:'json',
            sync:true,
            load:function(trolleyData){
                _self.updateProducts(trolleyData.products);
                // Update mini trolley
                _self.updateTrolley(trolleyData);
                // Update delivery slot price
                _updateDeliverySlotPrice(trolleyData.deliverySlotPrice,trolleyData.deliverySlotPriceInfo);
                // Update Welsh carrier bag charge info
                _updateCarrierBagInfo(trolleyData.bagChargeText,trolleyData.bagChargeTooltipText);
            },
            error : function(response, ioArgs) {
                /* handle the error... */
                //console.log("failed xhrGet", response, ioArgs);
            }
        });
        e.preventDefault();
    }

    /**
     * Function to test whether the class of an element contains one of the valid
     * values for the actions we are handling.
     * @param targetElement The element whose class attribute we are testing
     * @return Returns the string representing the trolley action if found,
     *         otherwise it returns false.
     * @private
     */
    var _whichTrolleyAction = function(targetElement){
        var validValues = ['add','remove','delete'];
        for (var i=0,il=validValues.length;i<il;i++){
            if (dojo.hasClass(targetElement,validValues[i]))
                return validValues[i];
        }
        return false;
    }

    /**
     * Function to update the trolley totals.
     * @param trolleyTotal The total price of the trolley.
     * @param trolleySavings The total savings in the trolley.
     * @private
     */
    var _updateTrolleyTotals = function(trolleyTotal,trolleySavings){
        if (_trolleyTotal)
            _trolleyTotal.innerHTML = trolleyTotal;
        if (_trolleySavings)
            _trolleySavings.innerHTML = trolleySavings;
        if (_trolleyTableTotal)
            _trolleyTableTotal.innerHTML = trolleyTotal;
        if (_trolleyTableSavings)
            _trolleyTableSavings.innerHTML = trolleySavings;
    }

    /**
     * Function to update the delivery slot price and info.
     * @param deliverySlotPrice The current price for the delivery slot.
     * @param deliverySlotPriceInfo Pricing information for the selected delivery slot.
     * @private
     */
    var _updateDeliverySlotPrice = function(deliverySlotPrice,deliverySlotPriceInfo){
        if (_deliverySlotPrice){
            _deliverySlotPrice.innerHTML = deliverySlotPrice;
        }

        /* Sometimes we don't get the slot price information returned at all, so need
         * to check for this and set the variable to an empty string.
         */
        if (typeof deliverySlotPriceInfo == 'undefined'){
            deliverySlotPriceInfo = '';
        }

        if (_deliverySlotPriceInfoPanel){
            if (deliverySlotPriceInfo.length > 0){
                // If there's Delivery Slot Price Info text, then reveal the panel
                dojo.removeClass(_deliverySlotPriceInfoPanel,'hidden');
                // Fix styling of parent panel
                if (_deliverySlotPriceInfoPanelParent){
                    dojo.removeClass(_deliverySlotPriceInfoPanelParent,'unfulfilledDeliveryRule');
                }
            } else {
                // If there's no Delivery Slot Price Info text, then hide the panel
                dojo.addClass(_deliverySlotPriceInfoPanel,'hidden');
                // Fix styling of parent panel
                if (_deliverySlotPriceInfoPanelParent){
                    dojo.addClass(_deliverySlotPriceInfoPanelParent,'unfulfilledDeliveryRule');
                }
            }
            _deliverySlotPriceInfoPanel.innerHTML = deliverySlotPriceInfo;
        }
    }

    /**
     * Function to update the carrier bag charge info.
     * @param carrierBagText The carrier bag charge info text.
     * @param carrierBagTooltipText Text to go into the carrier bag charge tooltip.
     * @private
     */
    var _updateCarrierBagInfo = function(carrierBagText,carrierBagTooltipText){
        if (carrierBagText && _carrierBagTextElem)
            _carrierBagTextElem.innerHTML = carrierBagText;
        if (carrierBagTooltipText && _carrierBagTooltipTextElem)
            _carrierBagTooltipTextElem.innerHTML = carrierBagTooltipText;
    }

    /**
     * Function to edit links in the trolley (i.e. Save trolley, Empty trolley) so that the
     * previousPageUrl value points to the current page. We need to do this as the back end has
     * trouble doing this due to caching, and as a result links on subsequent pages are pointing
     * to URLs that generate JSON data.
     * @param linkElement The link whose previousUrl parameter we are updating.
     * @private
     */
    var _updatePreviousUrl = function(linkElement){
        if (!linkElement) return;

        // Split the url into the address and the query string
        var splitUrl = linkElement.href.split('?',2);
        // Convert the query string to an object
        var queryObject = dojo.queryToObject(splitUrl[1]);
        // Set the previousUrl parameter to what is in the address bar
        queryObject.previousPageUrl = window.location.href;
        // Set the href of the link to the new value
        linkElement.href = splitUrl[0] + '?' + dojo.objectToQuery(queryObject);
    }

    /**
     * Function that takes an element inside a product, finds its main product parent, and
     * then uses the JS.EqualHeightRows object (represented by JS.objects.gridView) to redraw
     * the row for that product.
     * @param childElem {Object} Element that we need to find the product parent for
     */
    var _redrawProductRow = function(childElem){
        if (JS.objects.gridView) {
            var childNodeList = dojo.query(childElem);
            var parentContainer = childNodeList.parents('.' + JS.objects.gridView.getBlockClass());

            // ToDo: JS.objects.gridView should be passed as a parameter
            if (parentContainer.length > 0)
                JS.objects.gridView.redrawSingleRow(parentContainer[0]);
        }
    }

    /**
     * Function to cache certain trolley elements.
     * @private
     */
    var _cacheTrolleyElements = function(){
        // Get the tbody of the trolley table
        _trolleyTableBody = dojo.byId('trolleyTableBody');

        // Get trolley total elements
        _trolleyTotal = dojo.byId('trolleyTotal');
        _trolleySavings = dojo.byId('trolleySavings');
        _trolleyTableTotal = dojo.byId('trolleyTableTotal');
        _trolleyTableSavings = dojo.byId('trolleyTableSavings');

        // Get empty and save trolley link elements
        _emptyTrolleyLinkElem = dojo.byId('emptyTrolleyLink');
        _saveTrolleyLinkElems = dojo.query('.saveTrolleyLink');

    }

    _init();
}



/**
 * Object to save subscription item on the master list
 */

JS.saveSubscriptionItem = function() {

    /**
     * Needed for closure when used in events
     * @type Object
     * @private
     */
    var _self = this;

    /**
    * Array to store handles save subscription item events
    * @type Array
    * @private
    */
    var _saveSubscriptionItems = [];

    /**
     * Initialises the JS.Trolley object
     * @constructor
     * @private
     */
    var _init = function(){

         // Save button item events
        _self.saveSubscriptionEvents();

    }
    /**
     * Binds events for save subscription items on the page.
     */
    this.saveSubscriptionEvents = function (){
        // Unbind the existing events
        if (_saveSubscriptionItems.length > 0){
            // Disconnect the existing events
            for (var i=0,il=_saveSubscriptionItems.length;i<il;i++){
                dojo.disconnect(_saveSubscriptionItems[i]);
            }
            // Empty the array of handles
            _saveSubscriptionItems.length = 0;
        }

        // Set the onSubmit event for the Save subscription forms on the page
        // TODO: PUT THIS QUERY INTO CONFIG OBJECT FOR REUSE
        var saveSubscriptionForm = dojo.query('.productFrequency form');
        if (saveSubscriptionForm){

            for (var c=0,cl=saveSubscriptionForm.length;c<cl;c++){
                // Bind onSubmit event and add to array of handles

                _saveSubscriptionItems.push(
                    dojo.connect(saveSubscriptionForm[c],'onsubmit',_saveSubscribedItem)
                );
            }
        }

    }
    /**
     * Handle submit event on save subscription forms
     * @param e event object
     * @private
     */
    var _saveSubscribedItem = function (e){

        // Cache form into a variable for closure
        var _form = this;

        // Get the form values into an object and adjust for AJAX
        var _formObject = dojo.formToObject(_form);

        _formObject.isAjax = true;

        e.preventDefault();

        // Find out the product ID
        // We get the product ID from the ID of the subscription form
        // In our javascript the variable '_productId' can either be the Product ID if it's not a cross sell item OR the Parent Product ID concatenated with Product ID if it is a cross sell item

        var _formId = _form.id;
        var _productId;

        // Spit the formID at '_' characters
        var _split = _formId.split('_');

        // If the split array length is 3 it means that the Parent Product Id is present and the add to trolley form is in a cross sell
        if (_split.length == 3) {
            _productId = _split[1] + _split[2]; // concatenate Parent ProductId + productId
        }
        else {
            _productId = _split[1]; // Normal product, not a cross sell so just use the Product Id
        }
        // Show "updating" message
        _self.setSaveSubscriptionMessage(_productId,'Saving...');

         // Post the form via AJAX
        dojo.xhrPost({
            url:'SubscribedItemSave',
            content:_formObject,
            handleAs:'json',
            load:function(saveSubscriptionData){
                //set and show error message if it exist
                //_self.setErrorMessage(subscriptionData.itemCatentryId,subscriptionData.errorMessage);
                // Updates subscription info for a product
                _self.setSaveSubscriptionMessage(saveSubscriptionData.itemCatentryId,saveSubscriptionData.itemMessage);
            }
        });
    }


    /**
     * Update the product subscription message
     */
    this.setSaveSubscriptionMessage = function(subscriptionProductId,subscriptionMessage) {
        // Find number in Subscribed message container
        var messageContainer = dojo.byId('saveSubscribedItem_' + subscriptionProductId); // Using a class rather than ID as sometimes more than one identical product can appear on a page e.g cross sells

        if (!messageContainer) return false;

        if (subscriptionMessage && subscriptionMessage.length > 0){
            // If a message is supplied, apply the new message and show the container
            messageContainer.innerHTML = subscriptionMessage;
            dojo.removeClass(messageContainer,'hidden') // Put this is a parameter
        } else {
            // If no message is supplied, hide the container
            messageContainer.focus();
            dojo.addClass(messageContainer,'hidden')
        }

    }

    _init();
}


/**
 * Looks after the booking of delivery slots.
 * @param options {Object} Configuration options for the object
 */
JS.DeliverySlots = function(options){
    'use strict';

    /**
     * Config options
     * @private
     */
    var _config = {
        slotsContainerId: 'deliverySlots',
        slotAreaContainerId: 'slotAreaContainer',
        bookingMessageHtml: '<span class="checkSlot">Checking<span class="access"> for availability</span></span>',
        ajaxBookSlotUrl: 'AjaxBookDeliverySlot',
        ajaxViewSlotUrl: 'AjaxBookDeliverySlotDisplayView',
        ajaxAmendOrderUrl: 'ExistingOrderDetails',
        bookSlotLinkClass: 'bookSlotLink',
        bookedSlotClass: 'slotBooked',
        bookedSlotLinkClass: 'slotBookedLink',
        initialBookedSlotLinkId: 'slotBookedLink',
        deliveryInfoElemId: 'deliveryInfoPanel',
        deliveryPriceTextElemId: 'deliverySlotPricing',
        continueActionsContainerId: 'bookSlotContinueActions',
        errorMessageContainerId: 'bookDeliveryMessageArea',
        hideClass: 'hidden'
    };

    /**
     * Stores the container for the delivery slots
     * @type Object
     * @private
     */
    var _slotsContainer;

    /**
     * Stores whether we are in the process of booking a slot
     * @type Boolean
     * @private
     */
    var _bookingInProgress = false;

    /**
     * Stores the overlay instance
     * @type Object
     * @private
     */
    var _overlay;

    /**
     * Stores the booking message element (created by _config.bookingMessageHtml)
     * @type Object
     * @private
     */
    var _bookingMessageElem;

    /**
     * Stores the link for the slot currently booked
     * @type Object
     * @private
     */
    var _bookedSlotLinkElem;

    /**
     * Stores and instance of JS.AreaOverlay for use when loading content via AJAX.
     * @type Object
     * @private
     */
    var _ajaxOverlay = false;

    /**
     * Stores the error message handler
     * @type Object
     * @private
     */
    var _errorMessageHandler;

     /**
     * Needed for closure when used in events
     * @type Object
     * @private
     */
    var _self = this;

    /**
     * Initialises the bookingDeliverySlotClicks object
     * @private
     */
    var _init = function(){
        if (options)
            _config = new JS.mixin(_config,options);

        // Create an error message handler
        _errorMessageHandler = new JS.ErrorMessageHandler({
            messageContainerId:_config.errorMessageContainerId
        });

        // Get the slots container
        _cacheSlotsContainer();

        // Check the slots container was found
        if (!_slotsContainer) return;

        _cacheBookedSlotLink();

        _bindSlotClickEvent();

        // Create an overlay instance
        _overlay = new JS.Overlay({overlayBoxId:'overlayBoxSlot',pageOverlayId:'pageOverlaySlot'});
    };

    /**
     * Finds and caches the slots container.
     * @private
     */
    var _cacheSlotsContainer = function(){
        _slotsContainer = document.getElementById(_config.slotsContainerId);
    };

    /**
     * Finds and caches the link for the slot that is booked.
     * @private
     */
    var _cacheBookedSlotLink = function(){
        _bookedSlotLinkElem = document.getElementById(_config.initialBookedSlotLinkId);
    };

    /**
     * Binds the onclick event to the delivery slots container.
     * @private
     */
    var _bindSlotClickEvent = function(){
        // Bind the onclick event to the slots container
        dojo.connect(_slotsContainer,'onclick',_slotClick);
    };

    /**
     * Loads delivery slots to be displayed on the page.
     * @param deliverySlotsUrl {String} The URL to use to get the delivery slots.
     * @param giveBookedSlotFocus {Boolean} Whether she should provide focus to the
     *        link for the Booked Slot when the slots are loaded. Defaults to true.
     * @private
     */
    var _loadDeliverySlots = function(deliverySlotsUrl,giveBookedSlotFocus){
        // Provide a default value for when giveBookedSlotFocus hasn't been passed.
        if (typeof giveBookedSlotFocus == 'undefined')
            giveBookedSlotFocus = true;

        // Show the spinner overlay
        if (!_ajaxOverlay){
            _ajaxOverlay = new JS.AreaOverlay({
                overlayClass: 'ajaxSpinner',
                overlayId:'ajaxSpinner',
                areaId:_config.slotAreaContainerId
            },true);
        }
        _ajaxOverlay.show();

        // Load the delivery slots via AJAX
        dojo.xhrGet({
            url:deliverySlotsUrl,
            handleAs:'json',
            sync:false,
            load:function(slotData){
                // Replace the delivery slots with those loaded
                dojo.place(slotData.deliverySlotsHtml,_slotsContainer,'replace');

                // Update the page title
                JS.setPageTitle(slotData.pageTitle);

                // Re-cache elements
                _cacheSlotsContainer();
                _cacheBookedSlotLink();

                // Re-bind any events
                _bindSlotClickEvent();

                // Reset the floating header for the delivery slots
                JS.objects.fixedSlotTableHeader.reset();

                // Reset the slot filter object
                JS.objects.slotTimeFilter.reset();

                // Reset the tooltips for the delivery slots
                JS.objects.slotTooltips.clear();
                JS.objects.slotTooltips.add('.promoSlot a');

                // Get the booked slot link and focus on it
                if (giveBookedSlotFocus)
                    _bookedSlotLinkElem.focus();
            },
            error : function(response, ioArgs) {
                /* handle the error... */
                //console.log("failed xhrGet", response, ioArgs);
            },
            handle : function(){
                // Hide the spinner overlay
                _ajaxOverlay.hide();
            }
        });
    };

    /**
     * Handles when a delivery slot is clicked
     * @param e {Object} Event object
     * @private
     */
    var _slotClick = function(e){
        // Make sure the customer isn't already trying to book a slot (or other action)
        if (_bookingInProgress) {
            e.preventDefault();
        } else {
            var evt=window.event || e;
            var targetElem=evt.target;
            if (!targetElem) //if event obj doesn't support e.target, presume it does e.srcElement
                targetElem=evt.srcElement; //extend obj with custom e.target prop

            // If it wasn't a link that was click (i.e. a <span>) check it isn't the child of a link
            if (targetElem.tagName!='A'){
                var parentLinks = dojo.query(targetElem).parents('a');
                // If parent link is found, set the target element to be that link
                if (parentLinks.length > 0){
                    targetElem = parentLinks[0];
                }
            }

            // Check that it was a link that was clicked. Presumes that we don't have a visible span inside the link.
            if (targetElem.tagName=='A'){
                e.preventDefault();

                // Get the parent cell. Presumes it's the immediate parent.
                var parentCell = targetElem.parentNode;

                // Has the customer clicked on a slot for an existing order?
                if (dojo.hasClass(parentCell,'existingOrder')){
                    _amendOrder(targetElem);
                } else {
                    _bookSlot(targetElem,parentCell);
                }
            }
        }
    }

    /**
     * Displays a message to indicate that booking is in progress.
     * @param tableCell {Object} A TD element for the cell where the message will be displayed.
     * @private
     */
    var _showBookingMessage = function(tableCell){
        dojo.addClass(tableCell, 'slotChecking');
        _bookingMessageElem = dojo.place(_config.bookingMessageHtml,tableCell,'last')
    }

    /**
     * Removes the message that indicates that booking is in progress.
     * @param tableCell {Object} A TD element for the cell with the message to be removed.
     * @param replaceWith {Object/String} The element or HTML to replace the message with.
     *        If no value or is passed, then the message will be removed without replacement.
     * @private
     */
    var _removeBookingMessage = function(tableCell,replaceWith){
        // If we haven't been given an element to replace the message with, remove the message.
        if (typeof replaceWith == 'undefined'){
            dojo.destroy(_bookingMessageElem);
        } else {
            _bookedSlotLinkElem = dojo.place(replaceWith,_bookingMessageElem,'replace');
        }

        // Remove the class for checking the slot
        dojo.removeClass(tableCell, 'slotChecking');
    }

    /**
     * Handles booking the delivery slot and displaying the confirmation overlay
     * @param linkElem {Object} The link that was clicked to trigger the overlay
     * @param parentCell {Object} The table cell that contains linkElem
     * @private
     */
    var _bookSlot = function(linkElem,parentCell){
        // Flag that we are now booking a slot
        _bookingInProgress = true;

        // Determine whether we are booking a slot or just viewing a slot that is already booked
        var bookIt = (!dojo.hasClass(linkElem,_config.bookedSlotLinkClass));

        // Update the slot to show the booking is in progress
        if (bookIt){
            _showBookingMessage(parentCell);
        }

        // Split the URL for the link
        var splitUrl = linkElem.href.split('?',2);

        // For IE, need to remove the hash at the end
        var hashIndex = splitUrl[1].lastIndexOf('#');
        if (hashIndex != -1)
            splitUrl[1] = splitUrl[1].substr(hashIndex);

        // Build the URL for the AJAX request
        var ajaxUrl = bookIt ? _config.ajaxBookSlotUrl :  _config.ajaxViewSlotUrl;
        ajaxUrl += '?' + splitUrl[1] + '&ajax=true';

        // Post the form via AJAX
        dojo.xhrGet({
            url:ajaxUrl,
            handleAs:'json',
            sync:false,
            load:function(bookSlotData){
                // Declare our variables
                var deliveryInfoElem,
                    deliveryPriceTextElem,
                    continueActionsContainerElem;

                // Check whether the Alternative Products Engine is needed
                if (bookSlotData.needAPE){
                    // Send the customer to the original link
                    location.href = linkElem.href;
                    // Don't need to carry out the rest of this function now
                    return;
                } else {
                    // Check whether there was an error returned
                    if (bookSlotData.error){
                        _errorMessageHandler.show(bookSlotData.errorMessage);
                        _removeBookingMessage(parentCell);
                        _bookingInProgress = false;
                        _loadDeliverySlots(bookSlotData.deliverySlotsUrl,false);
                        return;
                    }
                }

                // Get the page overlay displayed so customer knows something is happening
                _overlay.displayPageOverlay();

                // Update the page title
                JS.setPageTitle(bookSlotData.pageTitle);

                if (bookIt){
                    _self.removeBookedSlot();

                    // Remove the booking message
                    _removeBookingMessage(parentCell,bookSlotData.bookedLink);
                    // Change the class on the table cell to tell it is booked
                    dojo.addClass(parentCell, _config.bookedSlotClass);
                    // Get the delivery info element on the RHS
                    deliveryInfoElem = document.getElementById(_config.deliveryInfoElemId);
                    // Replace content on RHS
                    if (deliveryInfoElem){
                        dojo.place(bookSlotData.deliveryInfo,deliveryInfoElem,'replace');
                    } else {
                        JS.objects.rhsAmendOrderSlotTimer.updateOrderAmendBookingSlotRHS();
                    }

                    // Assuming the tooltips object already exists, add the carrier bag tooltip functionality
                    JS.objects.tooltips.add('#auxiliary .tipLink');

                    // Get the container for the continue button
                    continueActionsContainerElem = document.getElementById(_config.continueActionsContainerId);
                    // Replace the button
                    if (continueActionsContainerElem)
                        dojo.place(bookSlotData.continueButton,continueActionsContainerElem,'only');

                    // Get the delivery price text element on the RHS
                    deliveryPriceTextElem = document.getElementById(_config.deliveryPriceTextElemId);
                    // Replace delivery price text on RHS
                    if (deliveryPriceTextElem && typeof bookSlotData.deliveryPriceRuleText != 'undefined' && bookSlotData.deliveryPriceRuleText.length > 0){
                        deliveryPriceTextElem.innerHTML = bookSlotData.deliveryPriceRuleText;
                        // Make sure the Delivery Price Text element is visible
                        dojo.removeClass(deliveryPriceTextElem, _config.hideClass);
                    }

                    // Reset elements and timers
                    if (deliveryInfoElem && typeof JS.objects.rhsBookingSlot != 'undefined'){
                        JS.objects.rhsBookingSlot.cacheDeliveryInfoElements();
                        JS.objects.rhsBookingSlot.resetTimes(bookSlotData.currentTime,bookSlotData.slotExpiryTime);
                    }else{
                        JS.objects.rhsAmendOrderSlotTimer.resetTimes(bookSlotData.currentTime,bookSlotData.slotExpiryTime);
                    }
                }

                // Show the slot info in the overlay
                _overlay.show(
                    bookSlotData.overlayHtml,
                    bookIt ? _bookedSlotLinkElem : linkElem,
                    /* If we are actually booking a slot, then we need to reload the delivery slots
                     * if the the overlay is closed.
                     */
                    bookIt ? function(){
                        var deliverySlotsURL = bookSlotData.deliverySlotsUrl;
                        if (typeof deliverySlotsURL != 'undefined'){
                            _loadDeliverySlots(deliverySlotsURL);
                        }
                    } : false
                );

                // Hide error messages as we've now successfully booked a slot
                _errorMessageHandler.clear();

                _bookingInProgress = false;
            },
            error : function(response, ioArgs) {
                /* handle the error... */
                //console.log("failed xhrGet", response, ioArgs);
            }
        });
    }

    /**
     * Removes the booked slot highlighting and link from the slot booking table.
     */
    this.removeBookedSlot = function(){
        // If a slot was previously booked, remove the booked slot link
        if (_bookedSlotLinkElem){
            var bookedSlotLinkParent = _bookedSlotLinkElem.parentNode;
            // Remove the class from its parent
            dojo.removeClass(bookedSlotLinkParent, _config.bookedSlotClass);
            /* If the currently focused item is also the currently "booked" slot link, give focus
             * to link for booking the slot again. This is so keyboard users are not sent back to
             * the beginning of the page.
             */
            if (document.activeElement==_bookedSlotLinkElem){
                var slotLinks = dojo.query('.'+_config.bookSlotLinkClass,bookedSlotLinkParent);
                if (slotLinks.length > 0)
                    slotLinks[0].focus();
            }
            // Destroy him!!!
            dojo.destroy(_bookedSlotLinkElem);
            _bookedSlotLinkElem = false;
        }
    }

    /**
     * Displays the Amend Order overlay
     * @param linkElem {Object} The link that was clicked to trigger the overlay
     * @private
     */
    var _amendOrder = function(linkElem){
        // Get the page overlay displayed so customer knows something is happening
        _overlay.displayPageOverlay();

        // Flag that we are now booking a slot
        _bookingInProgress = true;

        // Split the URL for the link
        var splitUrl = linkElem.href.split('?',2);
        // Build the URL for the AJAX request
        var ajaxUrl = _config.ajaxAmendOrderUrl + '?' + splitUrl[1] + '&isAjaxCall=true';

        // Post the form via AJAX
        dojo.xhrGet({
            url:ajaxUrl,
            handleAs:'json',
            sync:false,
            load:function(amendSlotData){
                // Show the slot info in the overlay
                _overlay.show(amendSlotData.overlayHtml,linkElem);

                _bookingInProgress = false;
            },
            error : function(response, ioArgs) {
                /* handle the error... */
                //console.log("failed xhrGet", response, ioArgs);
            }
        });
    }

    _init();
}

/**
 * Handles filtering the display of delivery slots
 * @param options {Object} Configuration options for the object
 */
JS.SlotTimeFilter = function(options){
    /**
     * Config options
     * @type Object
     * @private
     */
    var _config = {
        filterFormId:'slotTimeFilter',
        slotTimeFieldId:'slotTimeRange',
        slotTableId:'deliverySlots',
        // ToDo: Make this dynamic???
        rangeClasses:['allDay','showMorning','showAfternoon','showEvening']
    };

    /**
     * Stores the JS.AutoSubmit object for the slot filter
     * @private
     */
    var _filterAutoSubmit = {};

    /**
     * Stores the slot filter form element
     * @private
     */
    var _filterFormElem = {};

    /**
     * Stores the delivery slot table element
     * @private
     */
    var _slotTableElem = {};

    /**
     * Stores the delivery slot time range field element
     * @private
     */
    var _slotTimeFieldElem = {};

    /**
     * Caches the slot table.
     * @private
     */
    var _cacheElements = function(){
        // Get the slot filter form
        _filterFormElem = document.getElementById(_config.filterFormId);

        // Get the delivery slot time range field
        _slotTimeFieldElem = document.getElementById(_config.slotTimeFieldId);

        // Get the delivery slot table
        _slotTableElem = document.getElementById(_config.slotTableId);
    }

    /**
     * Bind events
     * @private
     */
    var _bindEvents = function(){
        // Bind submit event
        dojo.connect(_slotTimeFieldElem,'onchange',_filterSlots);
    }

    /**
     * Initialises the object
     * @private
     */
    var _init = function(){
        if (options)
            _config = new JS.mixin(_config,options);
        _cacheElements();
        _bindEvents();
    };

    /**
     * Filters the delivery slots
     * @param e {Object} The event object
     * @private
     */
    var _filterSlots = function(e){
        if(_slotTableElem){
            dojo.removeClass(_slotTableElem,_config.rangeClasses);

            // Add class to the table
            dojo.addClass(_slotTableElem,_slotTimeFieldElem.value);
        }
    };

    /**
     * Resets the object. Used when the delivery slot table has been updated.
     */
    this.reset = function(){
        _cacheElements();
        _bindEvents();
        _filterSlots();
    }

    _init();
}

/**
 * Creates an overlay
 * @param {Object} options for the Overlay
 */
JS.Overlay = function(options){
    /**
     * Config options
     *
     * @type Object
     * @Private
     */
    var _config = {
        overlayBoxClass: 'overlayBox',
        overlayBoxId: 'overlayBox',
        pageId: 'page',
        pageOverlayClass: 'pageOverlay',
        pageOverlayId: 'pageOverlay',
        closeOverlayClass: 'closeOverlay',
        hideClass: 'hidden',
        offScreenClass: 'access',
        centreVertically: true,
        clickToClose:true
    };

    /**
     * Needed for closure when used in events
     * @type Object
     * @private
     */
    var _self = this;

    /**
     * Stores the page container element
     * @private
     */
    var _pageElem = {};

    /**
     * Stores the page overlay element
     * @private
     */
    var _pageOverlayElem = {};

    /**
     * Stores the overlay box element
     * @private
     */
    var _overlayBoxElem = {};

    /**
     * Stores the object that controls tabbing within the overlay
     * @type Object
     * @private
     */
    var _tabController = {};

    /**
     * The element to be focused on when we hide the overlay.
     * @type Object
     * @private
     */
    var _focusOnHideElem = false;

    /**
     * Customisable function to run when we close the overlay.
     * @type Function
     * @private
     */
    var _onCloseCallback = false;

    /**
     * Stores the body element
     * @private
     */
    var _body = document.body;

    /**
     * Initialises the Overlay object
     */
    var _init = function(){
        if (options)
            _config = new JS.mixin(_config,options);

        _pageElem = document.getElementById(_config.pageId);

        // Create the page overlay
        _pageOverlayElem = dojo.create('DIV',
            {
                className:_config.hideClass + ' ' + _config.pageOverlayClass,
                id:_config.pageOverlayId
            },
            _body,
            'first');

        // Create the overlay box DIV
        _overlayBoxElem = dojo.create('DIV',
            {
                className:_config.hideClass + ' ' + _config.overlayBoxClass,
                id:_config.overlayBoxId,
                role:'dialog'
            },
            _body,
            'first');

        // Handle keyboard controls
        dojo.connect(_overlayBoxElem,'onkeydown',null,function(e){
            // Close the tooltip when ESC is hit
            if (e.keyCode==27){
                e.preventDefault();
                _self.hide();
            }
        });

        // Set up the tab controller
        _tabController = new JS.TabControl(_overlayBoxElem);

        // Set up whether clicking on the page overlay will close the overlay
        if (_config.clickToClose === true)  {
            dojo.connect(_pageOverlayElem,'onclick',function(e) {
                _self.hide();
            });
        }
    }

    /**
     * Shows the overlay, populated with the content of the element ID passed.
     * @param element {String} Either the ID of an element to get the content from, or HTML to be
     *        placed inside the overlay.
     * @param focusElem {Object} Element to give focus to after the overlay is closed.
     * @param onCloseCallback {Function} Function to call once the overlay has been closed/
     */
    this.show = function(element,focusElem,onCloseCallback){
        if (!element) return false;
        _self.displayPageOverlay();

        /* Test whether we have been given an element to focus on after the overlay is hidden
         * and set the variable accordingly.
         */
        if (typeof focusElem != 'undefined'){
            _focusOnHideElem = focusElem;
        } else {
            _focusOnHideElem = false;
        }

        /* Test whether we have been given a function to call when the overlay closes and set
         * the private variable that stores it accordingly.
         */
        if (typeof onCloseCallback != 'undefined'){
            _onCloseCallback = onCloseCallback;
        } else {
            _onCloseCallback = false;
        }

        // Create an object for storing styles we will apply to the overlay
        var overlayStyle = {};

        // Position the overlay off screen so we can measure it without anyone watching!
        dojo.addClass(_overlayBoxElem,_config.offScreenClass);
        dojo.removeClass(_overlayBoxElem,_config.hideClass);

        // Whack the content into the overlay
        dojo.place(element,_overlayBoxElem,'only');

        // Get the width of the overlay so we can centre it
        var overlayPosition = dojo.position(_overlayBoxElem);

        // Set style for horizontally centering the overlay
        overlayStyle.marginLeft = '-' + (overlayPosition.w/2) + 'px';

        // If the overlay should be vertically centred
        if (_config.centreVertically){
            // Get the viewport dimensions
            var viewportSize = JS.getViewportSize();
            // Centre it
            overlayStyle.top = ((viewportSize.h/2) - (overlayPosition.h/2)) + 'px';
        }

        // Apply any styling we've created to the overlay
        dojo.style(_overlayBoxElem,overlayStyle);

        // Tell the tab controller to (re)cache the tabable elements
        _tabController.cache();

        // Give focus to the first tabable element in the overlay (usually the close link) for keyboard users
        var firstTabableElem = _tabController.getFirstElem();

        /* Check if we have a tabable element and if it has a focus method. Need to check this as it
         * is possible for _tabController.getFirstElem() to return an empty object.
         */
        if (firstTabableElem && typeof firstTabableElem.focus != 'undefined'){
            JS.safeFocus(firstTabableElem);
        }

        // Unhide the overlay box
        dojo.removeClass(_overlayBoxElem,_config.offScreenClass);

        // Hide the page content from ARIA compatible readers
        dojo.attr(_pageElem,'aria-hidden','true');

        // Grab all the close links in the overlay
        var _closeLinks = dojo.query('.' + _config.closeOverlayClass,_overlayBoxElem);

        // Counting backwards to improve performance
        for (i=_closeLinks.length;i--;){
            // Make the close links close the overlay
            dojo.connect(_closeLinks[i],'onclick',function(e){
                _self.hide();
                e.preventDefault();
            });
        }
    }

    /**
     * Hides the overlay.
     */
    this.hide = function(){
        // Hide the overlay box and the page overlay
        dojo.addClass(_overlayBoxElem,_config.hideClass);
        dojo.addClass(_pageOverlayElem,_config.hideClass);
        // Unhide the page content from ARIA compatible readers
        dojo.attr(_pageElem,'aria-hidden','false');
        // Reset the tab controller
        _tabController.reset();
        // If we have an element to focus on, give focus to that element
        if (dojo.isObject(_focusOnHideElem)) {
            JS.safeFocus(_focusOnHideElem);
        }

        // If we have a function to call on close, then call it.
        if (_onCloseCallback) {
            _onCloseCallback();
        }
    }

    /**
     * Displays the page overlay that the overlay box sits on top of
     */
    this.displayPageOverlay = function(){
        // Get height and width of body and assign to the DIV
        var _bodyDimensions = dojo.position(_body);

        // Set the width and height of the page overlay
        dojo.style(_pageOverlayElem,
            {
                height:JS.getDocHeight() + 'px'
            });
        // Unhide the page overlay
        dojo.removeClass(_pageOverlayElem,_config.hideClass);
    }

    _init();
}

/**
 * Function to display delivery pass overlay on slot booking screen.
 */
JS.DeliveryPass = function(overlayID) {
    var _deliveryPassOverlay;

    // Check delivery pass content exists
    if (!dojo.byId(overlayID)) return false;

    // Create new overlay object with delivery pass content
    _deliveryPassOverlay = new JS.Overlay();

    // Show delivery pass overlay
    _deliveryPassOverlay.show(overlayID);
}
/**
 * Function to display cancel order amends overlay.
 */
JS.CancelOrderAmendOverlay = function() {
    var _cancelOrderAmendOverlay = new JS.Overlay(),
    cancelOrderAmendBtn = dojo.byId('cancelOrderAmend'),
    cancelOrderAmendOverlayContent = dojo.byId('cancelOrderAmendOverlay');

    if(cancelOrderAmendBtn && cancelOrderAmendOverlayContent){
        dojo.connect(cancelOrderAmendBtn,'onclick', function(e) {
            e.preventDefault();
            _cancelOrderAmendOverlay.show('cancelOrderAmendOverlay');
        });
    }

}

/**
 * Function to display an overlay from a link using an Ajax call.
 * A URL for the Ajax call is created and stored from the link that's clicked
 * A new overlay object is created and then displayed and
 * populated using the content returned from the Ajax call.
 * @param selector {String} The selector for the Ajax triggering links
 * @type Constructor
 */
JS.AjaxOverlay = function (selector) {

    /**
     * Needed for closure when used in events
     * @type Object
     * @private
     */
    var _self = this;

    /**
     * Store links that will create an Ajax overlay
     * A selector is passed to the init function which then uses
     * dojo.query to store all the links that will trigger an overlay.
     *
     * @type Array
     * @private
     */
    var _ajaxLinks;

    /**
     * Stores the Ajax overlay object
     *
     * @type object
     * @private
     */
    var _ajaxPopulatedOverlay

    /**
     * The function that generates the overlay
     * and Ajax request from the link that has been clicked.
     *
     * @type function
     * @private
     */
    var _launchOverlay = function(clickedLink) {

        // Store the Ajax link to populate the overlay
        var _ajaxUrl = clickedLink.href;

        // Append ajaxUrl flag to link for so back end knows this is an AJAX call
        _ajaxUrl = _ajaxUrl+'&ajax=true'

        // Get the data from server
        dojo.xhrGet({
            url:_ajaxUrl,
            content:'json',
            handleAs:'json',
            sync:false,
            load:function(overlayData){

                // Show delivery pass overlay and populate with the returned HTML data
                _ajaxPopulatedOverlay.show(overlayData.overlayHtml, clickedLink);

            },
            error : function(response, ioArgs) {
                /* handle the error... */
                //console.log("failed xhrGet", response, ioArgs);
            }
        });
    };

    // Initialising the object
    var _init = function(){

        /**
         * Creating the new overlay object
         * This used to part of the Ajax launching function but it kept
         * creating duplicate overlays every time a link wasa clicked
         * Doing this first caches the overlay and avoids the duplication issue.
         *
         */

         _ajaxPopulatedOverlay = new JS.Overlay({centreVertically:true});

        // Get the Ajax links
        _ajaxLinks = dojo.query(selector);

        // Bind onclick event to AJAX links
        _ajaxLinks.connect('onclick', function(e) {

            // prevents default link execution
            e.preventDefault();

            // Launch and populate the ajax overlay function
            _launchOverlay(this);

        });
    };

    _init();
}

/**
 * Returns the height of the document.
 * Taken and adapted from: http://james.padolsey.com/javascript/get-document-height-cross-browser
 */
JS.getDocHeight = function() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}

JS.FloatingHeader = function(){
    /* Not going to use the floating header in IE6
     * Also not using on iOS or Android devices as the pinch/zoom functionality messes up positions
     * on elements with position:fixed
     */

    if (JS.isIe6() || dojo.isIos || JS.IsAndroid()) return false;

    /**
     * Needed for closure when used in events and private methods
     * @type Object
     * @private
     */
    var _self = this;

    /**
     * Allows other objects, etc. to pick up the height of the header
     * @type Numeric
     */
    this.headerHeight = 0;

    var _init = function(){
        dojo.addClass(document.body,'floatingHeader');

        // Get the elements needed
        var _globalHeaderElem = dojo.byId('globalHeaderContainer');
        var _mainElem = dojo.byId('page');

        // Exit if either element is missing
        if (!_globalHeaderElem || !_mainElem) return;
        var _globalHeaderPosition = dojo.position(_globalHeaderElem);

        // Assign the height to our public variable
        _self.headerHeight = _globalHeaderPosition.h;

        // Add some padding to the page so that the header doesn't sit on top of the page.
        dojo.style(_mainElem,'paddingTop',_globalHeaderPosition.h + 'px');
    }

    _init();
}

JS.FloatingTrolley = function(options){
    /* Not using floating trolley if in IE6.
     * Also not using on iOS or Android devices as the pinch/zoom functionality messes up positions
     * on elements with position:fixed
     */

    if (JS.isIe6() || dojo.isIos || JS.IsAndroid()) return false;

    /**
     * Config options
     * @type Object
     * @private
     */
    var _config = {
        floatingHeader: {},
        checkoutWalkBar: {},
        minAvailableSpace: 75
    };

    /**
    * Used instead of 'this' in certain functions
    * @type Object
    * @private
    */
    var _self = this;

    /**
     * Stores the whether the trolley is docked or not
     */
    var _isDocked = false;

    /**
     * Stores the element that will be "snapped" into a fixed position
     */
    var _snappingElement;

    /**
     * Stores the RHS container element
     */
    var _rhsElem;

    /**
     * Stores the starting position of the RHS container
     */
    var _rhsStartPos;

    /**
     * Stores the starting position of the snapped element
     */
    var _snapStartPos;

    /**
     * Stores the position at which the RHS should snapp
     */
    var _snappingPos;

    /**
     * Stores the scrolling trolley element
     */
    var _trolleyScrollElem;

    /**
     * Stores the inner scrolling wrapper. This was needed to get IE8 to report scrollHeight properly
     */
    var _scrollWrap;

    /**
     * Stores the main content element wrapper
     */
    var _pageWrapper;

    /**
     * Stores the main page element
     */
    var _mainPage;

    /**
     * Stores the main page element's min width
     */
    var _mainPageMin;

    /**
     * Stores the viewport dimensions
     */
    var _viewportSize;

    /**
     * Stores the window resize event handler
     */
    var _resizeHandler;

    /**
     * Stores the scroll event handler
     */
    var _scrollHandler;

    var _init = function(){
        // Mix in our options
        if (options)
            _config = new JS.mixin(_config,options);

        // Get the RHS container
        _rhsElem = dojo.byId('auxiliary');
        // Get the trolley elements
        _cacheTrolleyElements();
        // Get the content container
        _pageWrapper = dojo.byId('page');

        /* If we do not have the mini trolley, the scrolling element or the auxiliary element available,
         * then we won't be doing any snapping
         */
        if (!_snappingElement || !_trolleyScrollElem) return;

        // Get the starting positions of RHS elements
        _calculateSnappingPositions();

        // Get the viewport size
        _viewportSize = JS.getViewportSize();

        //Get the page min-width
        _mainPage = _pageWrapper;
        _mainPageMin = dojo.style(_mainPage, 'minWidth');

        //If viewport width is greater than page min-width resize trolley
        if(_viewportSize.w > _mainPageMin)
            _self.resizeMiniTrolley();

        _makeItStickOrUnstick();

        _bindEvents();
    };

    /**
     * Resets the sticky element. Used when we have replaced the sticky element with another
     * element or an updated version of itself.
     */
    this.reset = function(){
        // Reset the flag for whether the element is stuck in position
        _cacheTrolleyElements();

        if (!_snappingElement || !_trolleyScrollElem) return;

        _unstick();

        _calculateSnappingPositions();

        // Get the viewport size
        _viewportSize = JS.getViewportSize();

        //Get the page min-width
        _mainPage = _pageWrapper;
        _mainPageMin = dojo.style(_mainPage, 'minWidth');

        //If viewport width is greater than page min-width resize trolley
        if(_viewportSize.w > _mainPageMin)
            _self.resizeMiniTrolley();

        _makeItStickOrUnstick();

        _bindEvents();
    };

    /**
     * Caches elements that are commonly used, but may also changed
     * @private
     */
    var _cacheTrolleyElements = function(){
        // Get the element that will be snapped to
        _snappingElement = dojo.byId('miniTrolleyDock');
        /* Get the element for scrolling the trolley contents. This can sometimes be replaced
         * via JS.Trolley.
         */
        _trolleyScrollElem = dojo.byId('trolleyScroll');
        _scrollWrap = dojo.byId('scrollWrap');
        // console.log(_snappingElement, _trolleyScrollElem);
    };

    /**
     * Binds events for the floating trolley.
     * @private
     */
    var _bindEvents = function(){
        // Make sure the viewport size gets updated if/when the browser is resized
       _resizeHandler = dojo.connect(window,'onresize',function (){
            _viewportSize = JS.getViewportSize();

          //Check to see if min width is greater than viewport if it is don't snap or dock
            if (_mainPageMin > _viewportSize.w) {
                dojo.removeClass(_snappingElement,'docked');
                dojo.style(_trolleyScrollElem,'height','auto');
            } else {
                //Resize trolley
                _self.resizeMiniTrolley();
            }
        });

        // Bind to the onscroll event
        _scrollHandler = dojo.connect(window,'onscroll',_makeItStickOrUnstick);
    };

    /**
     * Used for tearing down the object.
     */
    this.tearDown = function(){
        if (_resizeHandler) dojo.disconnect(_resizeHandler);
        if (_scrollHandler) dojo.disconnect(_scrollHandler);
        if (_snappingElement) _unstick();
    };

    /**
     * Sticks the element into position
     * @private
     */
    var _stick = function(){
        //console.log('dock');
        _isDocked = true;
        dojo.style(_snappingElement,{'top':_config.floatingHeader.headerHeight + 'px'});
        dojo.addClass(_snappingElement,'docked');
            _self.resizeMiniTrolley();
    };

    /**
     * Unsticks the element
     * @private
     */
    var _unstick = function(){
        //console.log('undock');
        _isDocked = false;
        dojo.style(_snappingElement,{'top':'auto'});
        dojo.removeClass(_snappingElement,'docked');
    };

    var _makeItStickOrUnstick = function(){
            _rhsPos = dojo.position(_rhsElem);
        // console.log('_makeItStickOrUnstick',_rhsPos.y,_snappingPos,_isDocked);

            //If the viewport width is less that the main page min width then don't do any of the snapping/ docking business.
            if ((_rhsPos.y <= _snappingPos) && (_viewportSize.w > _mainPageMin) ) {
                if (!_isDocked){
                _stick();
                }
            } else {
                if (_isDocked){
                _unstick();
                }
            }
    };

    /**
     * Caches values that are commonly used, but may also changed
     * @private
     */
    var _calculateSnappingPositions = function(){
        /* Store the RHS snapping positions. These can sometimes be replaced
         * via JS.BookingSlot.
         */
        _rhsStartPos = dojo.position(_rhsElem);
        _snapStartPos = dojo.position(_snappingElement);
        _snappingPos = _rhsStartPos.y-(_snapStartPos.y-_config.floatingHeader.headerHeight-15); // 15px for the space at the top of RHS.
        // console.log('_calculateSnappingPositions',_rhsStartPos.y,_snapStartPos.y,_snappingPos,_config.floatingHeader.headerHeight);
    };

    /**
     * Gets the scrollTop position of the scrollable trolley element.
     * @return Number The scrollTop value for the scrollable trolley element.
     */
    this.getScrollTop = function(){
        return _trolleyScrollElem.scrollTop;
    };

    /**
     * Gets the scrollTop position of the scrollable trolley element.
     * @param pos New scrollTop value for the scrollable trolley element.
     */
    this.setScrollTop = function(pos){
        _trolleyScrollElem.scrollTop = pos;
    };

    /**
     * Resizes the mini trolley to fit in the space available
     * @param {Object} options An object containing configuration options
     */
    this.resizeMiniTrolley = function(opt){

        /**
         * Don't continue if no mini trolley is present
         */
        if (!_viewportSize) return;

        /**
         * Other functions may change the RHS layout so check if they need to recache trolleyElements and/or the snapping positions
         */
        if (opt) {
            if (opt.recacheTrolleyElements == true) {
                _cacheTrolleyElements();
            }
            if (opt.recalculateSnappingPositions == true) {
                _calculateSnappingPositions();
            }
        }

        //////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////
        // Can this calculation be done at any time, or could it be
        // cached and updated when the browser is resized?
        //////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////

        // Get the space available for the snapped element to fit in
        var spaceAvailable = _viewportSize.h - _config.floatingHeader.headerHeight - _config.checkoutWalkBar.checkoutWalkbarHeight;

        // Get the current dimensions of the mini trolley scrolling element
        var trolleyScrollElemPos = dojo.position(_trolleyScrollElem);
        // Get dimensions of Snapping Element. CAN THIS BE CACHED??
        var snapPos = dojo.position(_snappingElement);
        // Calculate the height of the mini trolley scrolling element
        var miniTrolleyScrollHeight = spaceAvailable - (snapPos.h - _trolleyScrollElem.offsetHeight /*trolleyScrollElemPos.h*/);
        /*console.log(['***Resize***',
                'spaceAvailable:' + spaceAvailable,
                'trolleyScrollElemPos.h:' + trolleyScrollElemPos.h,
                'miniTrolleyScrollHeight:' + miniTrolleyScrollHeight,
                'IE7:' + _trolleyScrollElem.offsetHeight]);*/

        // We have an extra div that wraps the scrollable trolley content. We use this to check the height of the actual trolley contents
        var _scrollWrapPos = dojo.position(_scrollWrap);
        /* Test the height of the trolley content versus the height that we would set the scrolling
         * element to and see if we need to manually set a height.
         */
        if (_scrollWrapPos.h > miniTrolleyScrollHeight) {
            dojo.style(_trolleyScrollElem,{'height':miniTrolleyScrollHeight + 'px'});
        }
        else if (_scrollWrapPos.h < miniTrolleyScrollHeight) {
            dojo.style(_trolleyScrollElem,{'height':'auto'});
        }
        /*
         * At certain browser sizes we were getting an issue where the trolley wouldn't dock
         * when scrolling. It would just jump to the top of the page.
         * We discovered this was happening when the page content was shorter than the RHS.
         * To get around this we are setting a min height on the page wrapper which is equal to the RHS
         * once the trolley has been resized.
         * This ensures that the browser scrollbar doesn't vanish and cause glitches.
         * */
        _rhsPos = dojo.position(_rhsElem);

        dojo.style(_pageWrapper,{'minHeight':_rhsPos.h + 'px'});

        //////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////
        // TRY USING offsetHeight INSTEAD OF HEIGHT FROM dojo.position
        //////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////
    };

    _init();
}

/**
 * Handles any links specified as external, setting them to open in a new
 * window and to add some accessibly hidden text at the end of the link.
 */
JS.ExternalLinks = function(){
    var _externalLinks = dojo.query('a[rel="external"],a[rel="externalButton"]');

    // Counting backwards to improve performance
    for (i=_externalLinks.length;i--;){
        dojo.place('<span class="access"> (opens in a new window/tab)</span>',_externalLinks[i]);
        dojo.connect(_externalLinks[i],'onclick',function(e){
            // Don't open the link in new window if it is our conversion tool popup
            if (this.id != "conversionCalc"){
                window.open(dojo.attr(this,'href'));
                e.preventDefault();
            }
        });
    }
}

JS.isIe6 = function(){
    return ((window.XMLHttpRequest == undefined) && (ActiveXObject != undefined));
}

/**
 * Handles elements that are meant to stick in position once the page has scrolled past a certain point.
 * @param options {Object} Configuration options for the object
 */
JS.StickyElement = function(options){
    /* Not using floating elements if in IE6.
     * Also not using on iOS or Android devices as the pinch/zoom functionality messes up positions
     * on elements with position:fixed.
     *
     * ToDo:
     *   Try using position:sticky!
     *   Add a position at which the element stops sticking
     */
    if (JS.isIe6() || dojo.isIos || JS.IsAndroid()) return false;

    /**
     * Config options
     * @type Object
     * @private
     */
    var _config = {
        floatingHeader: {},
        floatingHeaderHeightAdjustment: 0,
        containerId: 'auxiliary',
        snappingElemId: 'miniTrolleyDock',
        snappingTriggerElemId: 'miniTrolleyDock',
        stickyClass: 'docked',
        afterInit: false,
        afterStick: false,
        afterUnstick: false,
        afterWidthBelowMin: false,
        afterWidthAboveMin: false,
        afterBrowserResized: false
    };

    /**
    * Used instead of 'this' in certain functions
    * @type Object
    * @private
    */
    var _self = this;

    /**
     * Stores the whether the element is stuck in position or not
     */
    var _isStuck = false;

    /**
     * Stores the element that will be "snapped" into a fixed position
     */
    var _snappingElem;

    /**
     * Stores the element whose position triggers the snapping
     */
    var _snappingTriggerElem;

    /**
     * Stores the container element
     */
    var _containerElem;

    /**
     * Stores the starting position of the container
     */
    var _containerStartPos;

    /**
     * Stores the starting position of the snapped element
     */
    var _snapStartPos;

    /**
     * Stores the position at which the snapping element should snap
     */
    var _snappingPos;

    /**
     * Stores the main page element's min width
     */
    var _mainPageMin;

    /**
     * Stores the viewport dimensions
     */
    var _viewportSize;

    /**
     * Stores the header height value, including any adjustments
     */
    var _floatingHeaderHeight;

    /**
     * Stores the header height, including any adjustments
     */
    var _floatingHeaderHeightAdjustment = 0;

    /**
     * Sticks the element into position
     * @private
     */
    var _stick = function(){
        // console.log('stick');
        _isStuck = true;
        dojo.style(_snappingElem,{'top':_floatingHeaderHeight + 'px'});
        dojo.addClass(_snappingElem,_config.stickyClass);
        /* If we've been given a function to run after sticking, call it and pass it the
         * snapping element, as it may need it.
         */
        if (_config.afterStick !== false)
            _config.afterStick(_snappingElem);
    };

    /**
     * Unsticks the element
     * @private
     */
    var _unstick = function(){
        // console.log('unstick');
        _isStuck = false;
        dojo.style(_snappingElem,{'top':'auto'});
        dojo.removeClass(_snappingElem,_config.stickyClass);
        /* If we've been given a function to run after unsticking, call it and pass it the
         * snapping element, as it may need it.
         */
        if (_config.afterUnstick !== false)
            _config.afterUnstick(_snappingElem);
    };

    /**
     * Caches values that are commonly used, but may also changed
     * @private
     */
    var _calculateSnappingPositions = function(){
        /* Store the snapping positions. These can sometimes be replaced
         * via JS.BookingSlot.
         */
        _containerStartPos = dojo.position(_containerElem);
        _snapStartPos = dojo.position(_snappingTriggerElem);
        _snappingPos = _containerStartPos.y-(_snapStartPos.y-_floatingHeaderHeight);
    };

    /**
     * Gets and caches the viewport size
     * @private
     */
    var _cacheViewportSize = function(){
        _viewportSize = JS.getViewportSize();
    };

    /**
     * Gets and caches the minimum width of the main div container on the page
     * @private
     */
    var _cachePageMinWidth = function(){
        var mainPage = dojo.byId('page');

        _mainPageMin = dojo.style(mainPage,'minWidth') + dojo.style(mainPage,'paddingLeft') + dojo.style(mainPage,'paddingRight');
    };

    /**
     * Gets and caches the elements that are snapped and are used to trigger the snapping.
     * Public because we sometimes update these elements on the page.
     * @private
     */
    var _cacheSnappingElements = function(){
        // Get the container element
        _containerElem = dojo.byId(_config.containerId);
        // Get the element that will be snapped to
        _snappingElem = dojo.byId(_config.snappingElemId);
        // Get the element whose position will trigger the snapping
        _snappingTriggerElem = dojo.byId(_config.snappingTriggerElemId);
    };

    /**
     * Decides based on the position of elements whether to make the element stick or unstick/
     * @private
     */
    var _makeItStickOrUnstick = function(){
        var containerPos = dojo.position(_containerElem);

        //If the viewport width is less that the main page min width then don't do any of the snapping/ docking business.
        if ((containerPos.y <= _snappingPos) && (_viewportSize.w > _mainPageMin)) {
            if (!_isStuck){
                _stick();
            }
        } else {
            if (_isStuck){
                _unstick();
            }
        }
    };

    /**
     * Sets a value for adjusting the header height calculation.
     * @param {Number} height The height to adjust the calculation by.
     */
    this.setFloatingHeaderHeightAdjustment = function(height){
        _floatingHeaderHeightAdjustment = height;
        _setFloatingHeaderHeight();
    }

    /**
     * Sets a value representing the height of the floating header, plus any adjustments
     * for this instance.
     * @private
     */
    var _setFloatingHeaderHeight = function(){
        _floatingHeaderHeight = _config.floatingHeader.headerHeight + _floatingHeaderHeightAdjustment;
    };

    /**
     * Resets the sticky element. Used when we have replaced the sticky element with another
     * element or an updated version of itself.
     */
    this.resetStickyElement = function(){
        // Reset the flag for whether the element is stuck in position
        _isStuck = false;

        _cacheSnappingElements();

        _makeItStickOrUnstick();

        // If we've been given a function to run after initialising, call it.
        if (_config.afterInit !== false)
            _config.afterInit(_snappingElem);
    };

    /**
     * Returns the height of the sticky element.
     * @return {Number} The height of the sticky element.
     */
    this.getStickyElementHeight = function(){
        var stickyElementPostion = dojo.position(_snappingElem);
        return stickyElementPostion.h;
    };

    /**
     * Initialises the object.
     * @private
     */
    var _init = function(){
        // Mix in our options
        if (options)
            _config = JS.mixin(_config,options);

        _cacheSnappingElements();

        // Make we we have an element to snap to
        if (!_snappingElem || !_snappingTriggerElem) return;

        _self.setFloatingHeaderHeightAdjustment(_config.floatingHeaderHeightAdjustment);

        // Get the starting and snapping positions of elements
        _calculateSnappingPositions();

        _cacheViewportSize();

        _cachePageMinWidth();

        // Make sure the viewport size gets updated if/when the browser is resized
        dojo.connect(window,'onresize',function(){
            _cacheViewportSize();

            //Check to see if min width is greater than viewport if it is don't snap or dock
            if (_mainPageMin > _viewportSize.w) {
                _unstick();
            } else {

            }

            if (_config.afterBrowserResized !== false)
                _config.afterBrowserResized(_snappingElem);
        });

        _makeItStickOrUnstick();

        // Bind to the onscroll event
        dojo.connect(window,'onscroll',_makeItStickOrUnstick);

        // If we've been given a function to run after initialising, call it.
        if (_config.afterInit !== false)
            _config.afterInit(_snappingElem);
    };

    _init();
}

/**
 * Creates a floating header for the Delivery Slot table.
 */
JS.FloatingSlotTableHeader = function(options){

    /**
     * Config options
     * @type Object
     * @private
     */
    var _config = {
        hiddenClass: 'hidden',
        duplicateTableSummary: 'Assistive technology users can ignore this, as this table repeats the delivery slot table headings and is purely for visual purposes.',
        elementForAdjustingHeightId: ''
    };

    if (options)
        _config = JS.mixin(_config,options);

    /**
     * Stores the Delivery Slot Table
     * @private
     */
    var _slotTable;

    /**
     * Stores the copy of the Delivery Slot Table
     * @private
     */
    var _duplicateTable;

    /**
     * Stores the instance of JS.StickyElement used.
     * @private
     */
    var _slotStickyElement;

    /**
     * Sets the width of the table header based on the width of the original
     * table.
     * @param {Object} slotTableHead The element being stuck/unstuck, in this
     *                 case the table header.
     * @private
     */
    var _setTableHeaderWidth = function(slotTableHead){
        // Grab the dimensions of the table
        var slotTablePos = dojo.position(_slotTable);
        // Set the width of the table header
        dojo.style(slotTableHead,{'width':slotTablePos.w+'px'});
    }

    /**
     * Function to run after the floating header is initialised.
     * @param {Object} slotTableHead The element being stuck/unstuck, in this
     *                 case the table heading.
     * @private
     */
    var _afterInit = function(slotTableHead){
        // Hide the table heading
        dojo.addClass(slotTableHead,_config.hiddenClass);
    }

    /**
     * Function to run after the floating header is "stuck"
     * @param {Object} slotTableHead The element being stuck, in this case
     *                 the table heading.
     * @private
     */
    var _afterStick = function(slotTableHead){
        _setTableHeaderWidth(slotTableHead);
        // Unhide the table heading
        dojo.removeClass(slotTableHead,_config.hiddenClass);
    }

    /**
     * Function to run after the floating header is "unstuck"
     * @param {Object} slotTableHead The element being unstuck, in this case
     *                 the table heading.
     * @private
     */
    var _afterUnstick = function(slotTableHead){
        // Hide the table heading
        dojo.addClass(slotTableHead,_config.hiddenClass);
    }

    /**
     * Function to run after the browser is resized
     * @param {Object} slotTableHead The element being unstuck, in this case
     *                 the table heading.
     * @private
     */
    var _afterBrowserResized = function(slotTableHead){
        _setTableHeaderWidth(slotTableHead);
    }

    /**
     * Creates a copy of the Delivery Slot Table header
     * @private
     */
    var _copyTableHeader = function(){
        var i,
            originalTableHeader,
            duplicateTableHeader,
            duplicateTableAttributes;

        // Get the original slot table header
        originalTableHeader = dojo.byId('deliverySlotsHeader');

        // Make a copy of the slot table header
        duplicateTableHeader = dojo.clone(originalTableHeader);

        // Remove the IDs so there are no conflicts
        duplicateTableHeader.id = '';
        duplicateTableHeadingCells = dojo.query('th',duplicateTableHeader);
        for (i=duplicateTableHeadingCells.length;i--;){
            duplicateTableHeadingCells[i].id = '';
        }

        // Create a new table for copy to go into
        duplicateTableAttributes = {
            'aria-hidden':'true',
            'class':_slotTable.className,
            'id':'deliverySlotsFloating',
            'summary':_config.duplicateTableSummary
        };
        _duplicateTable = dojo.create('table',duplicateTableAttributes);

        // Place the slot table header into the new table
        dojo.place(duplicateTableHeader,_duplicateTable);

        // Place the new table after the original slot booking table
        dojo.place(_duplicateTable,_slotTable,'after');
    };

    /**
     * Caches the table we are working with and makes a copy of its header.
     * @returns true if the tables are successfully setup, otherwise returns false.
     * @private
     */
    var _setupTables = function(){
        // Cache the Delivery Slot Table
        _slotTable = document.getElementById('deliverySlots');

        // If it couldn't be found, then get out!
        if (!_slotTable)
            return false;

        _copyTableHeader();

        return true;
    }

    /**
     * Used for resetting our tables and JS.StickyElement object when the elements
     * have been replaced.
     */
    this.reset = function(){
        // Destroy the previous copy of the table
        dojo.destroy(_duplicateTable);

        // If the tables are not set up successfully, then get out!
        if (!_setupTables())
            return false;

        // Reset our JS.StickyElement object
        _slotStickyElement.resetStickyElement();
    };

    /**
     * Initialises our object
     */
    var _init = function(){
        var element,
            elHeight = 0;

        // If the tables are not set up successfully, then get out!
        if (!_setupTables())
            return false;

        // Get element we will use to adjust height by
        element = dojo.byId(_config.elementForAdjustingHeightId);

        // Get height of element.
        if (element){
            elHeight = dojo.marginBox(element).h;
        }

        // Create an instance of Sticky Element and return it
        _slotStickyElement = new JS.StickyElement(
            {
                containerId:'content',
                snappingElemId:'deliverySlotsFloating',
                snappingTriggerElemId: 'deliverySlotsHeader',
                stickyClass: 'deliverySlotsFloating',
                floatingHeader:JS.objects.floatingHeader,
                floatingHeaderHeightAdjustment:elHeight,
                afterInit:_afterInit,
                afterStick:_afterStick,
                afterUnstick:_afterUnstick,
                afterBrowserResized:_afterBrowserResized
            }
        );
    };

    _init();
}

/**
 * Gets the dimensions of the viewport.
 * @return Object Contains the width and height of the viewport.
 */
JS.getViewportSize = function(){
    var viewportWidth,
        viewportHeight;

    if (typeof window.innerWidth != 'undefined'){
        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        viewportWidth = window.innerWidth,
        viewportHeight = document.documentElement.clientHeight // We need client height here as we don't want to include scrollbars in the height value
    } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        viewportWidth = document.documentElement.clientWidth,
        viewportHeight = document.documentElement.clientHeight
    } else {
        // older versions of IE
        viewportWidth = document.getElementsByTagName('body')[0].clientWidth,
        viewportHeight = document.getElementsByTagName('body')[0].clientHeight
    }

    return {
        w:viewportWidth,
        h:viewportHeight
    };
}

/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version 2.1.3-pre
 */
JS.bgiframe = function(s,options) {
    if(!JS.isIe6()) return false;

    s = JS.mixin(s,{
        top     : 'auto', // auto == .currentStyle.borderTopWidth
        left    : 'auto', // auto == .currentStyle.borderLeftWidth
        width   : 'auto', // auto == offsetWidth
        height  : 'auto', // auto == offsetHeight
        opacity : true,
        src     : 'javascript:false;'
    });
    var html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
                   'style="display:block;position:absolute;z-index:-1;'+
                       (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
                       'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
                       'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
                       'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
                       'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
                '"/>';

    var _bgiframeElem = document.createElement(html);
    dojo.place(_bgiframeElem,s,'last');
    return _bgiframeElem;
}
function prop(n) {
    return n && n.constructor === Number ? n + 'px' : n;
}


/**
 * Checking support for HTML5 Placeholder attribute on input elements
 */
JS.Placeholder = function() {

    // check if placeholder is supported by browser
    if (JS.isPlaceholderSupported() == true) {
        return;
    } else if (JS.isPlaceholderSupported() == false) {

        // find all inputs / textareas on page with placeholder attribute
        var inputs = dojo.query('input[placeholder], textarea[placeholder]');

        // for each found element, add a value the same as intended placeholder
        dojo.forEach(inputs, function(input){

            // set value variable to equal placeholder attribute value
            var placeholderValue = dojo.attr(input, 'placeholder');

            // if value is empty by default
            if (input.value == '') {

                // set value to the placeholder value
                input.value = placeholderValue;

            }

            // on element focus clear the value only if is placeholder value
            dojo.connect(input, 'onfocus', function() {
                if (input.value == placeholderValue) {
                    input.value = '';
                }
            });

            // on leaving the element replace value only if empty
            dojo.connect(input, 'onblur', function() {
                if (input.value == '') {
                    input.value = placeholderValue;
                }
            });
        });
    }
}

JS.isPlaceholderSupported = function() {
    return 'placeholder' in document.createElement('input');
}

/**
 * Checks if GM site is running
 *      Params;
 *       - url: file on site to test
 *       - function to run on success
 */
JS.siteRunningCheck = function(host,fileURL) {
    dojo.xhrGet({
        url: host+fileURL,
        handleAs:"text",
        timeout: 10000,
        load: function() {
            var elem = dojo.query('.GMSiteDown');
            if (elem) { elem.removeClass('GMSiteDown') }

        }
    });

}


/**
 * Bright Tagger - used for customer tracking
 * No parameters needed.
 * @Param brightTagStAccount sets the account number
 * These are set in brightTagger.jspf
 */
JS.brightTagger = function() {
    if(typeof brightTagStAccount !== 'undefined') {
            var tagjs = document.createElement('script');
            var s = document.getElementsByTagName('script')[0];
        tagjs.async = true;
            tagjs.src = '//s.btstatic.com/tag.js#site='+brightTagStAccount;
        s.parentNode.insertBefore(tagjs, s);
    }
}
/**
 * Posts a single set of substititue data
 * @param fileUrl is the name of the file data is being sent to.
 *
 */
JS.updateSubstitutePreference = function(fileURL) {
    // post ajax data
    var updateSubstitutePreference = function(fileURL,substituteObj,elem)  { // (url,collection,element)
        dojo.xhrPost({
            url:fileURL,
            content: substituteObj,
            handleAs:'text',
            timeout: 5000,
            load: function() {
                // on success remove disabled attribute
                elem.disabled = '';
            },
            error: function() {
                //console.log("Ajax failed to load")
            }
        });
    }
    // binds click event to element
    dojo.query('.substitutes input[type=checkbox]').connect('onclick', function() {
          // disable checkbox until process has completed
          this.disabled = 'disabled';
          // get the elements from parent 'form'
          var formValues = dojo.query(this).parents('form')[0];
          // populate object from 'form' collection
          var substituteObj = dojo.formToObject(formValues);
          // append checkbox status to object - true
          substituteObj['substitute'] = dojo.attr(this, "checked");
          // if checkbox status false - remove
          if (!substituteObj.substitute) {
              delete substituteObj.substitute;
          }
          // Discard URL as not required
          delete substituteObj.URL;
          // call ajax junction
          updateSubstitutePreference(fileURL,substituteObj,this);
    });
}

/**
 * CheckoutWalkPage control to support ie6
 */
JS.positionWalkBar = function() {
    /**
    * Used instead of 'this' in certain functions
    * @type Object
    * @private
    */
    var _self = this;

    /**
     * Allows other objects, etc. to pick up the height of the walkbar
     * @type Numeric
     */
    this.checkoutWalkbarHeight = 0;

    // calculate dimensions
    var init = function() {
        var checkoutWalkBar = document.getElementById('checkoutWalkContainer');
        if (!checkoutWalkBar) return;

        var scrollTop = document.documentElement.scrollTop;
        var scrHeight = document.getElementsByTagName('html')[0].offsetHeight;

        _self.checkoutWalkbarHeight = checkoutWalkBar.offsetHeight;

        if(JS.isIe6()) {
            // set style rules for IE6 only
            checkoutWalkBar.style.position = 'absolute';
            checkoutWalkBar.style.width = 101.5+'%';
            checkoutWalkBar.style.top = (scrHeight - _self.checkoutWalkbarHeight + scrollTop)+'px';//-barHeight;
        }

    };
    window.onscroll = function() {
        init();
    };
    window.onresize = function(){
        init();
    }

    init();

}


/**
 * HideBlockedContent
 * Hide content that is being blocked by the user's network admin e.g. 'Facebook Like' iframe
 * The network admin's blocked content page can look ugly and break the layout so we want to check if the user can access the content first
 * We check to see if we can fetch the favicon of the potentially blocked site before setting the content on our pages to be visible
 *
 * @param elem the element that we are hiding until sure the user can access the content
 * @param imgSrc the path to the favicon on the potentially blocked site
 *
 */
JS.HideBlockedContent = function(elem, imgSrc){
    var icon = new Image();
    var blockableContent = dojo.query(elem);
    var favicon = imgSrc;
    icon.onload = function() {
        for(i=0, bl=blockableContent.length; i<bl; ++i){
            blockableContent[i].style.display = "block";
        }
    };
    icon.src = favicon + "?" + Math.random();
}

/**
 * setAttribute
 * Accessibility -to inject aria state values
 * or any other attribute
 *  *
 */
JS.setAttr = function(elem, role, val){
    elem.setAttribute(role, val);
};
/**
 * Checks for support of the @supports CSS rule and then tests for support of the
 * rule provided.
 * @param rule {String} The CSS rule to test.
 * @return {Boolean} Whether the rule is supported or not.
 */
JS.SupportsCSSRule = function(rule){
    // Check for support of CSS.supports
    if (window.CSS && window.CSS.supports){
        return window.CSS.supports(rule);
    // Opera 12.1 uses a differnt syntax
    } else if (window.supportsCSS){
        return window.supportsCSS(rule);
    } else {
        return false;
    }
}

/**
 * Used to keep tabbing contained within a specified element.
 * @param container {Object} Container that we are controlling the tabbing for.
 * @param options {Object} Configuration options for the object.
 */
JS.TabControl = function(container,options){
    /**
     * Stores configuration options for the object
     * @type Object
     * @private
     */
    var _config = {
        elementSelector: 'a,input:not([type="hidden"]),select,textarea,button'
    }

    /**
     * Stores the tabable elements
     * @private
     */
    var _tabableElems;

    /**
     * Stores the first tabable element
     * @private
     */
    var _firstTabableElem;

    /**
     * Stores the last tabable element
     * @private
     */
    var _lastTabableElem;

    /**
     * Initialises the object.
     * @private
     */
    var _init = function(){
        if (!container)
            return false;

        // Mix in our options
        if (options)
            _config = new JS.mixin(_config,options);

        // Handle keyboard controls. Presumes there is at least 1 link in the tooltip.
        dojo.connect(container,'onkeydown',null,function(e){
            // If Tab key was pressed
            if (e.keyCode==9){
                // If Shift + Tab was pressed
                if (e.shiftKey){
                    // If this happened on the first link in the tooltip
                    if (e.target==_firstTabableElem){
                        e.preventDefault();
                        // Send focus to the last tooltip link
                        _lastTabableElem.focus();
                    }
                } else {
                    // If this happened on the last link in the tooltip
                    if (e.target==_lastTabableElem){
                        e.preventDefault();
                        // Send focus to the first tooltip link
                        _firstTabableElem.focus();
                    }
                }
            }
        });
    }

    /**
     * Caches the tabable elements in the container.
     * @private
     */
    this.cache = function(){
        // Get all the tabable elements in the container.
        _tabableElems = dojo.query(_config.elementSelector,container);

        // Get the number of links
        var tabableElemsLength = _tabableElems.length;

        // Cache the first and last links in the tooltip
        if (tabableElemsLength > 0){
            _firstTabableElem = _tabableElems[0];
            _lastTabableElem = _tabableElems[tabableElemsLength-1];
        }
    }

    /**
     * Resets the first and last tabable elements
     * @private
     */
    this.reset = function(){
        // Reset the first and last tooltip links
        _firstTabableElem = _lastTabableElem = {};
    }

    /**
     * Gets the first tabable element in the container.
     * @return {Object} The first tabable element in the container.
     */
    this.getFirstElem = function(){
        return _firstTabableElem;
    }

    _init();
}

/**
 * Handles the overlay on the confirmation section.
 */
JS.AutoOrderOverlay = function(){
    //cache variables
    var lightBoxElem,lightBoxElemHref,
    ajaxUrl,urlQueryObject,_overlay;

     //get the lightbox element;
    _overlay = new JS.Overlay();
   lightBoxElem= dojo.query('.lightBox');


    var _processStep = function(url,requestData,method, pageID) {
        var ajaxOptions = {
            url:url,
            content:requestData,
            handleAs:'json',
            load:function(data){
                if(data.stepHTML.length){
                    var html=data.stepHTML[0];
                    //put the callback response data HTML content to be used for the overlay
                    _overlay.show(html,dojo.byId(pageID));
                }
            },
            error : function(response, ioArgs) {
                console.log(response);
            },
            handle: function(){
                //Button to disabled
                var confirmSubscriptionBtn = dojo.byId('confirmSubscriptionBtn');
                JS.CheckboxConfirmation(confirmSubscriptionBtn);
            }
        };
        //Call the Dojo GET Method
        dojo.xhrGet(ajaxOptions);
    }

    // Listen for clicks on lighbox element and also check it exists
    if(lightBoxElem !=null){
        dojo.query('.lightBox').connect('onclick',function(e){
            e.preventDefault();
            lightBoxElemHref=  this.getAttribute('href');
            ajaxUrl = lightBoxElemHref.split('?',2);
            lightBoxId = this.getAttribute('id');
            urlQueryObject = dojo.queryToObject(ajaxUrl[1]);
            urlQueryObject.isAjax = 'true';
            _processStep(ajaxUrl[0],urlQueryObject,'GET',lightBoxId);
        });
    }
}

/**
 * Creates a T&C Checkbox confirmation and overlay button confirmation check function button.
 */

JS.CheckboxConfirmation = function(buttonId,IsBtnDisabled) {
    //cache variables
    var confirmSubscriptionBtn,lightBoxAgreementBtn,lightBoxAgreementDiscountBtn,staffDiscountCheckBox,termsAndConditionCheckBox,lightBoxAgreementDiscountBtn;
    //checkbox for the terms and condition
    termsAndConditionCheckBox = dojo.byId('termsAndConditionInput');
    //checkbox for the staff discount terms and condition
    staffDiscountCheckBox = dojo.byId('staffDiscountCheckBox');

    //Form checkbox input element
    agreementInputElems = dojo.query('.agreement');

    //Light Box Agreement Button - Staff Discount Terms and Condition
    lightBoxAgreementDiscountBtn= dojo.byId('lightBoxAgreementDiscountBtn');

    //Light Box Agreement Button - Terms and Condition
    lightBoxAgreementBtn = dojo.byId('lightBoxAgreementBtn');


    var _init= function() {
        //set to false on page function call
        var agreementCheckers=false;


        var _buttonToggler = function() {
            var agreementArr = [];
            //Add to the arrary of agreement if there more than one checkboxes
            for (var i = 0; i < agreementInputElems.length; i++ ){
                if (agreementInputElems[i].checked){
                    agreementArr.push(true);
                }
                else{
                    agreementArr.push(false);
                }
            }

            //Function to compare that all the arrary values are true or false; needs some re-working
            function arrChecker (array){
                var i, j, n;
                n = array.length;
                for (i=0; i<n; i++) {
                    for (j=i+1; j<n; j++) {
                        if (array[i] == true && array[j]== true){ agreementCheckers=true;}
                        else{agreementCheckers=false;}
                    }
                }
            }

            //see if the Arrary agreementInputElems has more than one element; if yes call the checkers function else toggle the single element on the page
            if(agreementArr.length > 1){
                arrChecker(agreementArr);
            }
            else{
                agreementInputElems[0].checked ? agreementCheckers=true :agreementCheckers=false
            }
            //Enable and disable the confirmation button when checkboxes are checked
            if(agreementCheckers){
                buttonId.disabled= false;
            }
            else {
                buttonId.disabled= true;
            }
        }


        //check if the dom element is present
        if(agreementInputElems.length >= 1){
            agreementInputElems.onclick(function(e) {
                _buttonToggler();
            });
        }

        if (lightBoxAgreementBtn !=null) {
            dojo.connect(lightBoxAgreementBtn,'onclick', function(e) {
                //make a check on the terms and condition agreement checkBox
                termsAndConditionCheckBox.checked=true;
                _buttonToggler();
            });
        }

        if (lightBoxAgreementDiscountBtn !=null) {
            dojo.connect(lightBoxAgreementDiscountBtn,'onclick', function(e) {
                //make a check on the staff discount agreement checkBox
                staffDiscountCheckBox.checked=true;
                _buttonToggler();
            });
        }

    }
    if(buttonId !=null && IsBtnDisabled){
        // Button disable
        buttonId.disabled= true;
    }
    _init();
}

/**
 * Creates a floating progress bar.
 */
JS.FloatingProgressBar = function(){
    /**
     * Stores the Delivery Slot Table
     * @private
     */
    var _progressBarContainer;

    /**
     * Sets the width of the progress bar based on the width of its container.
     * @param {Object} progressBar The element being stuck/unstuck, in this
     *                 case the progress bar.
     * @private
     */
    var _setProgressBarWidth = function(progressBar){
        // Grab the dimensions of the table
        var progressBarPos = dojo.position(_progressBarContainer);
        // Set the width of the table header
        dojo.style(progressBar,{'width':progressBarPos.w+'px'});
    }

    /**
     * Resets the width of the progress bar.
     * @param {Object} progressBar The element being stuck/unstuck, in this
     *                 case the progress bar.
     * @private
     */
    var _resetProgressBarWidth = function(progressBar){
        // Set the width of the table header
        dojo.style(progressBar,{'width':''});
    }

    /**
     * Sets the height of the progress bar container so that there is no page
     * jump when it snaps into place.
     * @private
     */
    var _setProgressBarContainerHeight = function(){
        // Grab the dimensions of the table
        var progressBarPos = dojo.position(_progressBarContainer);
        // Set the height based on its starting height
        dojo.style(_progressBarContainer,{'height':progressBarPos.h+'px'});
    }

    /**
     * Function to run after the floating header is "stuck"
     * @param {Object} progressBar The element being stuck, in this case
     *                 the progress bar.
     * @private
     */
    var _afterStick = function(progressBar){
        _setProgressBarWidth(progressBar);
    }

    /**
     * Function to run after the floating header is "unstuck"
     * @param {Object} progressBar The element being unstuck, in this case
     *                 the progress bar.
     * @private
     */
    var _afterUnstick = function(progressBar){
        _resetProgressBarWidth(progressBar);
    }

    /**
     * Function to run after the browser is resized
     * @param {Object} progressBar The element being unstuck, in this case
     *                 the progress bar.
     * @private
     */
    var _afterBrowserResized = function(progressBar){
        _setProgressBarWidth(progressBar);
    }

    /**
     * Initialises our object
     */
    var _init = function(){
        // Cache the Delivery Slot Table
        _progressBarContainer = document.getElementById('subscriptionCheckoutNav');

        // If it couldn't be found, then get out!
        if (!_progressBarContainer)
            return false;

        _setProgressBarContainerHeight();

        // Create an instance of Sticky Element and return it
        return new JS.StickyElement(
            {
                containerId:'content',
                snappingElemId:'subscriptionCheckoutSteps',
                snappingTriggerElemId:'subscriptionCheckoutSteps',
                stickyClass:'fixedProgressBar',
                floatingHeader:JS.objects.floatingHeader,
                afterStick:_afterStick,
                afterUnstick:_afterUnstick,
                afterBrowserResized:_afterBrowserResized
            }
        );
    }

    return _init();
}
JS.FloatingEspot = function(){
    //Get slotSteps height
    var _element = dojo.byId('subscriptionCheckoutNav'),
        _elmHeight = dojo.position(_element).h;

    _init = function(){

        new JS.StickyElement({
            containerId:'auxiliary',
            snappingElemId:'deliverySlotPricing',
            snappingTriggerElemId: 'deliverySlotPricing',
            stickyClass: 'stuckEspot',
            floatingHeader:JS.objects.floatingHeader,
            floatingHeaderHeightAdjustment:_elmHeight
        });
    }
    _init();
}

/**
 * Creates steps for a subscribtion service sign up form
 * @param steps [{Object Array}] - Array of objects each one being a step in the process.
 * @param options {Object} - Configuration options for the object
 * ToDo: Manage events so that we don't use up too much memory or create leaks.
 */
JS.SubscriptionProcess = function(steps, options) {
    'use strict';

    /**
     * Stores configuration options for the object
     * @type Object
     * @private
     */
    var _config = {
        progressBarId: 'subscriptionCheckoutNav',
        progressBarObject: false,
        pleaseWaitOverlayHtml: '<div class="pleaseWaitOverlay"><p>Sorry for the wait. This will only take a moment</p></div>',
        afterSetup: false
    };

    /**
     * Stores the progress bar element
     * @private
     */
    var _progressBarElem;

    /**
     * Stores the index for the step we are currently on.
     * @private
     */
    var _currentStepIndex = 0;

    /**
     * Stores the submit button that was clicked to submit the for.
     * Only needed for steps where multipleSubmitButtons = true.
     * @private
     */
    var _submitButtonClickedElem;

     /**
     * Stores a instance of the overlay to be displayed between ajax calls.
     * @private
     */
    var _pleaseWaitOverlay;

    /**
     * Stores an instance of the AjaxErrorMessage object
     */
    var _errMsg;

    /**
     * display a error message if ajax fails
     * @private
     * ToDo: Use JS.ErrorMessageHandler instead
     */
    var AjaxErrorMessage = function(){
        this.show = function(msg){
            var message = "Sorry! We couldn't process your request.";
            dojo.place('<div class="errorMessage" id="ajaxErrorMessage"><ul><li>'+ message +'</li></ul></div>', dojo.byId('deliveryAddressStep'), "first");
        };
        this.hide = function(){
            var messageContainer = dojo.byId('ajaxErrorMessage');
            if(messageContainer){
                dojo.destroy(messageContainer);
            }
        };
        this.clearServerSideError = function(){
            var messageArea = dojo.byId('messageArea');
            if(messageArea){
                dojo.destroy(messageArea);
            }
        }
    };

    /**
     * Caches the containers for each step.
     * @private
     */
    var _cacheStepContainers = function(){
        var i = 0,
            il = steps.length;

        // Loop through steps and set events
        for(;i<il;i++) {
            // Cache the step container
            steps[i].stepContainer = dojo.byId(steps[i].stepContainerId);
            _setupStep(i);
        };
    }

    /**
     * Handles the submission of the form on a step.
     * @param stepForm {Object} Element for the form we are submitting.
     * @private
     */
    var _stepFormSubmit = function(stepForm){

        // Get the form values into an object and adjust for AJAX
        var stepFormObject = dojo.formToObject(stepForm);

        stepFormObject.isAjax = 'true';

        /* If we've got the button that was clicked, add its details to the form object
         * so we can pass it into the request.
         */
        if (_submitButtonClickedElem){
            stepFormObject[_submitButtonClickedElem.name] = _submitButtonClickedElem.value;
        }

        _processStep(stepForm.action,stepFormObject,'POST');
    };

    /**
     * Handles the clicking of the edit link for a step.
     * @param editStepLink {Object} Element for edit step link.
     * @private
     */
    var _editStepLinkClick = function(editStepLink){
        var ajaxUrl = editStepLink.href.split('?',2),
            editStepQueryObject = dojo.queryToObject(ajaxUrl[1]);

        // Build the data to send to the server
        editStepQueryObject.isAjax = 'true';

        //Assign the page url to the object
        editStepQueryObject.currentPageUrl = ajaxUrl[0];

        // Make the AJAX call
        _processStep(ajaxUrl[0],editStepQueryObject,'GET');
    };

    /**
     * Sets up an individual step.
     * @param stepIndex {Number} The array index of the step we are setting up.
     * @private
     */
    var _setupStep = function(stepIndex){
        var currentStep = steps[stepIndex],
            stepFormId = currentStep.stepFormId,
            stepFormIdArray = [],
            stepForm,
            editStepLink,
            submitButtons,
            deliveryWeekChoice,
            slotRadioButtons,
            i,
            il;

        // Get and bind click event to edit step link
        if (currentStep.editStepLinkId){
            editStepLink = dojo.byId(currentStep.editStepLinkId);

            if (editStepLink) {
                dojo.connect(editStepLink,'onclick',function(e){
                    e.preventDefault();

                    if (typeof currentStep.beforeStepLinkClick === 'undefined'){
                        _editStepLinkClick(this);
                    } else {
                        currentStep.beforeStepLinkClick(_editStepLinkClick, this, _currentStepIndex);
                    }
                });
            }
        }

        // Get and bind events for the form if it exists
        if (stepFormId){
            if (typeof stepFormId === 'string'){
                stepFormIdArray.push(stepFormId);
            } else {
                stepFormIdArray = stepFormId;
            }

            for (i=0,il=stepFormIdArray.length;i<il;i++){
                stepForm = dojo.byId(stepFormIdArray[i]);

            if (stepForm) {
                // Check if this section can have multiple submit buttons that do different things.
                if (currentStep.multipleSubmitButtons) {
                    // Get and bind click event to any submit buttons
                    submitButtons = dojo.query('input[type=submit]',stepForm);
                    submitButtons.connect('onclick',function(e){
                        _submitButtonClickedElem = this;
                    });
                }

                // Listen for submit event on the form
                dojo.connect(stepForm,'onsubmit',function(e){
                    e.preventDefault();
                    _stepFormSubmit(this);
                });
            }
        }
        }

        /* Call the callback afterSetupStep function for this step, passing through
         * any values and functions that may be of use to the callback function.
         */
        if (typeof currentStep.afterSetupStep != 'undefined') {
            currentStep.afterSetupStep({
                stepFormSubmit: _stepFormSubmit,
                stepForm: stepForm,
                editStepLinkClick: _editStepLinkClick
            });
        }
    };

    /**
     * Updates the content of a step.
     * @param stepIndex {Number} The array index of the step we are updating.
     * @param stepContent {String} The new content for the step.
     * @private
     */
    var _updateStepContent = function(stepIndex,stepContent){
        if (stepContent) {
        dojo.place(stepContent,steps[stepIndex].stepContainer,'only');
        } else {
            steps[stepIndex].stepContainer.innerHTML = '';
        }
    }

    /**
     * Tears down a step.
     * @param stepIndex {Number} The array index of the step we are tearing down.
     * @private
     */
    var _tearDownStep = function(stepIndex){
        var currentStep = steps[stepIndex];
        if (typeof currentStep.tearDown !== 'undefined') {
            currentStep.tearDown();
        }
    }

    /**
     * Updates the content of the progress bar.
     * @param progressBarContent {String} The new content for the progress bar.
     * @private
     */
    var _updateProgressBar = function(progressBarContent){
        var progressBarObject = _config.progressBarObject;
        dojo.place(progressBarContent,_progressBarElem,'only');

        // Make sure we re-cache the elements in our Progress Bar object
        if (progressBarObject){
            progressBarObject.resetStickyElement();
        }
    }

    /**
     * Function to send form data to server via ajax.
     * @param url {String} The URL we're sending the request to.
     * @param requestData {Object} The data we're sending with the request.
     * @param method {String} The method (GET or POST) we're using to send the request.
     * @private
     */
    var _processStep = function(url,requestData,method) {
        //If a error was previously displayed, remove it
        _errMsg.hide();
        //clear and refresh previous JSON errors on the page if it exist.
        _errMsg.clearServerSideError();

        //Show ajax overlay
        _pleaseWaitOverlay.show(_config.pleaseWaitOverlayHtml);

        var ajaxOptions = {
            url:url,
            content:requestData,
            handleAs:'json',
            load:function(data){

                var stepHTML = data.stepHTML,
                    currentStepIndex = data.currentStep-1,
                    i=0,
                    il=stepHTML.length,
                    scrollPositionAdjustment = 0,
                    progressBarObject = _config.progressBarObject;

                if (typeof data.error != 'undefined'){
                    // Handle any errors returned
                    //console.log(data.error);
                } else {
                    _tearDownStep(_currentStepIndex);

                    _currentStepIndex = currentStepIndex;

                    // Handle successfully returned data
                    for (;i<il;i++){
                        _updateStepContent(i,stepHTML[i]);
                        _setupStep(i);
                    }

                    // Update the progress bar
                    _updateProgressBar(data.progressBarHTML);

                    // Scroll to and focus onthe current step
                    scrollPositionAdjustment = progressBarObject.getStickyElementHeight();
                    JS.SmoothScroll(steps[currentStepIndex].stepContainerId, true, scrollPositionAdjustment);

                    // Reset what submit button was clicked.
                    _submitButtonClickedElem = null;

                    if (_config.afterSetup) {
                        _config.afterSetup();
                    }
                }
            },
            error : function(response, ioArgs) {
                _errMsg.show(response.message);
            },
            handle: function() {
                //Remove the ajax spinner overlay
                _pleaseWaitOverlay.hide();
            }
        };

        // Send the form via AJAX
        if (method==='POST'){
            dojo.xhrPost(ajaxOptions);
        } else {
            dojo.xhrGet(ajaxOptions);
        }

    }
    /**
     * Initialises the object.
     * @private
     */
    var _init = function() {
        var currentStep = 0,
            stepsLength = steps.length;

        // Mixing the config options
        if (options)
            _config = JS.mixin(_config,options);

        // If we have been provided with the current step number in the page,
        // then set the step number for this instance to that number.
        if (typeof __subscriptionCurrentStep__ !== 'undefined')
            _currentStepIndex = __subscriptionCurrentStep__ - 1;

        //Create a new error message object.
        _errMsg = new AjaxErrorMessage();

        _pleaseWaitOverlay = new JS.Overlay({
            overlayBoxId: 'pleaseWaitOverlayBox',
            overlayBoxClass: 'pleaseWaitOverlayBox',
            pageOverlayId: 'pleaseWaitPageOverlay',
            pageOverlayClass: 'pleaseWaitPageOverlay',
            clickToClose: false
        },true);

        // Cache the progress bar
        _progressBarElem = dojo.byId(_config.progressBarId);

        _cacheStepContainers();
    }

    _init();
};

/**
 * Object for selecting the radio button that corresponds to the button
 * clicked. Used on Auto Order and also has it's own module for Savers.
 */
JS.ChooseList = function(options){
    /**
     * Stores configuration options for the object
     * @type Object
     * @private
     */
    var _config = {
        formId: 'PaymentForm',
        checkboxIdPrefix: 'listOfPaymentInstructions',
        buttonIdPrefix: 'useCard'
    }

    /**
     * Stores the policy container element
     * @private
     */
    var _formElem;

    /**
     * Stores the card buttons
     * @private
     */
    var _buttonElems;

    /**
     * Handles when the customer clicks on the button.
     * @param e {Object} Event handler
     * @private
     */
    var _buttonClick = function(e){
        var checkboxId = _config.checkboxIdPrefix,buttonID,
            checkboxElem;

        buttonId = this.id;

        // Build the ID for the checkbox that relates to the button that was clicked
        checkboxId += buttonId.substr(_config.buttonIdPrefix.length);

        // Get the checkbox
        checkboxElem = dojo.byId(checkboxId);

        // Check the checkbox
        if(checkboxElem !=null) {
            checkboxElem.checked = true;
        }
    };

    /**
     * Initialises the object.
     * @private
     */
    var _init = function(){
        // Mixing the config options
        if (options)
            _config = JS.mixin(_config,options);

        // Get the policy container element
        _formElem = dojo.byId(_config.formId);

        // Make sure we've got the form
        if (!_formElem) return;

        // Get the submit buttons
        _buttonElems = dojo.query('input[type=submit]',_formElem);

        // Bind event to handle when the button is clicked
        _buttonElems.connect('onclick',_buttonClick);
    };

    _init();
};


/**
 * Function that sets up and handles
 * the bag charge overlay
 */
JS.BagChargeOverlay = function(options){

    /**
     * Stores configuration options for the object
     * @type Object
     * @private
     */
    var _config = {
        bagChargeLinkId: 'showBagChargeInfo',
        bagChargeInfoId: 'bagChargeInfo'
    }

    /**
     * Stores the overlay
     * @type Object
     * @private
     */
    var _bagChargeOverlay;

    /**
     * Function to initialise the object
     * @type function
     * @private
     */
    var init = function(){

        // Mixing the config options
        if (options)
            _config = new JS.mixin(_config,options);

        _bagChargeOverlay = new JS.Overlay();

        dojo.connect(dojo.byId(_config.bagChargeLinkId),"click",function(e){
            // prevents default link execution
            e.preventDefault();
            _bagChargeOverlay.show(_config.bagChargeInfoId);
        });
    };

    init();

}



/**
 * Function loads up the data for the Scene7 image code
 */
JS.SetupScene7 = function(_scene7Data,productImageHolder){
    productImageHolder.innerHTML = "<span class='s7viewerMessage'>" + _scene7Data.instructionText + "<span>";
    dojo.addClass(productImageHolder,'s7viewer'); // Give the div for holding the image the class for Scene7 styling
    JS.DoScene7(_scene7Data.name,_scene7Data.path);
}

/**
 * Function loads up the Scene7 image code
 */
JS.DoScene7 = function(GMimageNumber,GMimagePath) {
    var imageOne = "sainsburys/" + GMimageNumber + "_1";    // Add additional prefix and suffix that the Scene7 server expects
    var flyoutViewer = new s7viewers.FlyoutViewer({
        "containerId":"productImageHolder",
        "params":{
            "asset":imageOne,
            "serverurl":GMimagePath
        }
    });
    flyoutViewer.setParams("FlyoutZoomView.zoomfactor=5&FlyoutZoomView.tip=0"); // Zoomfactor of 5.  Timed default Scene7 hover instruction message disabled.
    flyoutViewer.init();
}



/**
 * CreateScriptTag
 * This will create a script tag and append it to the end of the body tag.
 * Used for scripts that could potentially block the page if written directly in the JSP
 *
 * @param url [array] The urls needed for src attributes
 */
JS.CreateScriptTag = function(url) {
    /**
     * Stores the new script tag
     */
    var _scriptTag = "";

    for (var i=0, urlLength = url.length; i < urlLength; i++) {

        // Create new script tag
        _scriptTag = document.createElement('script');

        //set the src atribute to the url that has been passed
        _scriptTag.setAttribute('src',url[i]);

        // Add tag to bottom of the document before closing body tag
        document.body.appendChild(_scriptTag);

    }
}

/**
 * Function loads up the data for the Scene7 image code
 */
JS.Scene7ImageViewer = function(){

    /**
     * Function initialises and checks whether Scene7 is needed
     */
    var init = function(){
        // Load the GOL image
        var productImageObj = dojo.byId('productImageID');

        // Was http://s7d1.scene7.com/s7viewers/html5/js/FlyoutViewer.js successfully called?
        if (typeof s7viewers != 'undefined') {
            // If IE8 or lower, remove the jsHide class that was put on the GOL image, thereby revealing it.
            if (dojo.isIE && dojo.isIE <= 8){
                dojo.removeClass(productImageObj,'jsHide');
            }
            else {
                //call Scene7 code if page is for a GM product and browser is not IE8 or lower
                if (typeof JS.objects.scene7Data != 'undefined') {
                    var productImageHolder = dojo.byId('productImageHolder');
                    _setupScene7(JS.objects.scene7Data,productImageHolder);
                }
            }
        }
        // Call to Scene7 FlyoutViewer failed, therefore reveal the default hidden GOL image
        else {dojo.removeClass(productImageObj,'jsHide');}
    }

    /**
     * Function loads up the data for the Scene7 image code and then plots it
     */
    var _setupScene7 = function(_scene7Data,_productImageHolder){
        // The "Hover to zoom" message
        _productImageHolder.innerHTML = "<span class='s7viewerMessage'>" + _scene7Data.instructionText + "<span>";
        // Give the div for holding the image the class for Scene7 styling
        dojo.addClass(_productImageHolder,'s7viewer');
        // Add additional prefix and suffix that the Scene7 server expects
        var imageOne = "sainsburys/" + _scene7Data.name + "_1";
        // Our instance of the Scene7 code, loaded with the parameters of image name and folder
        var flyoutViewer = new s7viewers.FlyoutViewer({
            "containerId":"productImageHolder",
            "params":{
                "asset":imageOne,
                "serverurl":_scene7Data.path
            }
        });
        // Zoomfactor of 5.  Timed default Scene7 hover instruction message disabled.
        flyoutViewer.setParams("FlyoutZoomView.zoomfactor=5&FlyoutZoomView.tip=0");
        flyoutViewer.init();
    }

    init();
}

/**
 * Handles the dynamic display of error messages on a page.
 * @param options {Object} Configuration options for the filter.
*/
JS.ErrorMessageHandler = function(options){
    /**
     * Stores configuration options for the maps
     * @type Object
     * @private
     */
    var _config = {
        messageContainerId: 'errorMessage'
    }

    /**
     * Stores the element that contains our messages.
     * @private
     */
    var _messageContainerElem;

    /**
     * Shows the error message content that it receives.
     * @param messageContent {String} The HTML to be displayed inside the container.
     */
    this.show = function(messageContent){
        if (!_messageContainerElem || !messageContent) return false;

        // Add the error message content to the container
        _messageContainerElem.innerHTML = messageContent;

        // Reveal the message container
        dojo.setStyle(_messageContainerElem, 'display', '');

        /* Set the tabIndex so we can focus on the error container and tab from
         * its position, as it is unlikely to be a tabbable element.
         */
        _messageContainerElem.tabIndex = -1;

        // Scroll to and give focus to the error container
        JS.SmoothScroll(_messageContainerElem.id,true);
    };

    this.clear = function(){
        if (!_messageContainerElem) return false;

        // Clear the content from the container
        _messageContainerElem.innerHTML = '';

        // Hide the message container
        dojo.setStyle(_messageContainerElem, 'display', 'none');
    };

    /**
     * Initialises the object.
     * @private
     */
    var _init = function(){
        if (options)
            _config = JS.mixin(_config,options);

        _messageContainerElem = dojo.byId(_config.messageContainerId);

        if(_messageContainerElem){
            dojo.query('.errorMessage a').on('click',function(e){
                //Get Anchor from href
                var anchorURL = this.getAttribute('href').replace('#','');

                //pass anchor to SmoothScroll
                JS.SmoothScroll(anchorURL,true);

                e.preventDefault();
            });
        }
    };
    _init();
};

/**
 * IsAndroid
 * Dojo's Android detection isn't very reliable so using David Walsh's detect Android
 * script http://davidwalsh.name/detect-android
 */
JS.IsAndroid = function() {
    var _ua = navigator.userAgent.toLowerCase();
    return (_ua.indexOf('android') > -1);
};

/**
 * Sets the text for the title of the page.
 * @param pageTitle {String} The text we are changing the title to.
 */
JS.setPageTitle = function(pageTitle){
    // HTML needs to be decoded in case there are HTML entities.
    document.title = dojox.html.entities.decode(pageTitle);
};

JS.setupAutoOrderSubscriptionProcess = function(){
    var _subscriptionProcessOverlay;

    var _clearTextButton;

    /**
     * Flag for whether we are creating an Auto Order ro editing.
     * @private
     */
    var _createMode = true;

    var _changeDeliveryAddressOverlayHtml =
        '<div class="overlayHeader"><a class="closeLink closeOverlay" href="#">Close</a><h2>Are you sure you want to change your address?</h2></div>' +
        '<div class="overlayBody">' +
            '<p class="shortParagraph">If you change your address you will need to start your Regular Shop list again.</p>' +
        '</div>' +
        '<div class="overlayFooter">' +
            '<ul class="actionButtons">' +
            '<li><button class="button closeOverlay">Don\'t Change</button></li>' +
            '<li><button class="button" id="proceedToChange">Change</button></li>' +
            '</ul>' +
        '</div>';

    var _changeSlotOverlayHtml =
        '<div class="overlayHeader"><a class="closeLink closeOverlay" href="#">Close</a><h2>Are you sure you want to change your delivery time?</h2></div>' +
        '<div class="overlayBody">' +
            '<p class="shortParagraph">If you change your delivery time you will need to start your Regular Shop list again.</p>' +
        '</div>' +
        '<div class="overlayFooter">' +
            '<ul class="actionButtons">' +
            '<li><button class="button closeOverlay" type="button">Don\'t Change</button></li>' +
            '<li><button class="button" id="proceedToChange" type="button">Change</button></li>' +
            '</ul>' +
        '</div>';

    var _afterSetup = function(){
        JS.objects.tooltips.clear();
        JS.objects.tooltips.add('#content .tipLink');
    };

    var _afterDeliveryAddressSetup = function(utils){
        var chooseListObj = new JS.ChooseList({
            formId: 'deliveryAddress',
            checkboxIdPrefix: 'selectAddressRadio',
            buttonIdPrefix: 'selectAddressButton'
        });
    };

    var _selectSlotStepSteup = function(utils){
        var autoOrderStickyespot = new JS.FloatingEspot();
        JS.objects.fixedSlotTableHeader = new JS.FloatingSlotTableHeader({elementForAdjustingHeightId:'subscriptionCheckoutSteps'});
        JS.objects.slotTimeFilter.reset();

        var slotRadioButtons = dojo.query('.deliverySlots');
        dojo.query(slotRadioButtons).delegate("td", "onclick", function(e){
            e.preventDefault();
            var input = this.getElementsByTagName('INPUT')[0];

            if(typeof input != 'undefined'){
                input.checked = true;

                utils.stepFormSubmit(utils.stepForm);
            }
        });

        var deliveryWeekChoice = dojo.query('.deliveryWeekChoice a');
        deliveryWeekChoice.connect('onclick',function(e){
            var splitUrl,
                deliveryWeekQueryObject,
                stepFormObject;

            e.preventDefault();

            splitUrl = this.href.split('?',2);

            /* Convert the step form and the delivery week link into objects so we can
             * easily read and assign values.
             */
            deliveryWeekQueryObject = dojo.queryToObject(splitUrl[1]);
            stepFormObject = dojo.formToObject(utils.stepForm);

            // Get the subscriptionFrequency and append it to deliveryWeekQueryObject
            deliveryWeekQueryObject.subscriptionFrequency = stepFormObject.subscriptionFrequency;

            // Join it all back together to create a new URL for the delivery week link
            this.href = splitUrl[0] + '?' + dojo.objectToQuery(deliveryWeekQueryObject);

            utils.editStepLinkClick(this);
        });

    };

    var _itemStepSetup = function(utils){
        var paginationSubmit = new JS.AutoSubmit('#orderBy, #pageSize, #aoProductShowOptionsForm input[type=radio]');

        _clearTextButton.init();
    };

    var _itemStepTearDown = function(utils){
        _clearTextButton.tearDown();
    };

    var _paymentStepSetup = function(utils){
        var chooseListObj = new JS.ChooseList({
            formId: 'PaymentForm',
            checkboxIdPrefix: 'paymentCardRadio',
            buttonIdPrefix: 'paymentCardButton'
        });
    };

    var _confirmationStepSetup = function(utils){
        var buttonElem = dojo.byId('confirmSubscriptionBtn');
        var IsBtnDisabled = true;
        JS.objects.checkboxConfirmation = new JS.CheckboxConfirmation(buttonElem,IsBtnDisabled);
        // create overlay instance only when the lightbox Link exist
        if(dojo.byId('termsAndConditionLink') !=null){
            JS.objects.autoOrderOverlay = new JS.AutoOrderOverlay();
        };
    };

    var _auxiliarySetup = function(){
        var espot = dojo.byId('deliverySlotPricing');
        if(espot != null){
            if(dojo.byId('SubscriptionSlotDetailsEditTable') != null){
                dojo.byId('deliverySlotPricing').style.marginTop = '744px';
            }
        }
        JS.objects.autoOrderStickyespot = new JS.FloatingEspot();
        JS.objects.floatingTrolley.tearDown();
        JS.objects.floatingTrolley.reset();
        JS.objects.addSubscriptionObj.cacheElements();
        JS.objects.addSubscriptionObj.setAddToSubscriptionEvents();
    };

    /**
     * Opens an overlay to confirm whether the customer wants to change their
     * delivery options, as doing so will clear the items in their Auto Order.
     * @param {Function} callback Function to run when we are done.
     * @param {Element} link The link that was clicked. You will need to pass
     *                       this into the callback function.
     * @param {Number} currentStepIndex The index of the current step we are on.
     * @private
     */
    var _beforeChangeDeliveryStepsLinkClick = function(callback, link, currentStepIndex, overlayHtml){
        var changeButton;

        /* If we have come from the step where we add products or after that step,
         * then we use an overlay to warn the customer that if they go back to
         * change any delivery details then they will lose the products they have
         * added.
         * We only do this when we are creating an auto order, so check if we are
         * in "create mode".
         */
        if (_createMode && currentStepIndex >= 2){
            // Display the overlay
            _subscriptionProcessOverlay.show(overlayHtml,link);

            // Bind event to go ahead with changing delivery details
            changeButton = dojo.byId('proceedToChange');
            dojo.connect(changeButton, 'click', function(){
                _subscriptionProcessOverlay.hide();
                callback(link);
            });
        } else {
            callback(link);
        }
    };

    /**
     * Code to run before we do any AJAX calls for clicking on the 'Change' link
     * for the Your Delivery Address section.
     * @param {Function} callback Function to run when we are done.
     * @param {Element} link The link that was clicked. This is used with the
     *                       callback function.
     * @param {Number} currentStepIndex The index of the current step we are on.
     * @private
     */
    var _beforeDeliveryAddressStepLinkClick = function(callback, link, currentStepIndex){
        _beforeChangeDeliveryStepsLinkClick(callback, link, currentStepIndex, _changeDeliveryAddressOverlayHtml);
    };

    /**
     * Code to run before we do any AJAX calls for clicking on the 'Change' link
     * for the Select a Slot section.
     * @param {Function} callback Function to run when we are done.
     * @param {Element} link The link that was clicked. This is used with the
     *                       callback function.
     * @param {Number} currentStepIndex The index of the current step we are on.
     * @private
     */
    var _beforeSlotStepLinkClick = function(callback, link, currentStepIndex){
        _beforeChangeDeliveryStepsLinkClick(callback, link, currentStepIndex, _changeSlotOverlayHtml);
    };

    var _init = function(){
        /**
         * Subscription process steps
         * @type {Array}
         */
        var subscriptionProcessSteps = [
            {
                stepContainerId: 'deliveryAddressStep',
                stepFormId: 'deliveryAddress',
                editStepLinkId: 'editDeliveryAddressStep',
                beforeStepLinkClick: _beforeDeliveryAddressStepLinkClick,
                afterSetupStep: _afterDeliveryAddressSetup
            },
            {
                stepContainerId: 'selectSlotStep',
                stepFormId: 'SlotDateForm',
                editStepLinkId: 'editSlotStep',
                multipleSubmitButtons: true,
                beforeStepLinkClick: _beforeSlotStepLinkClick,
                afterSetupStep: _selectSlotStepSteup
            },
            {
                stepContainerId: 'selectItemsStep',
                stepFormId: ['aboutItemForm1','aboutItemForm2'],
                editStepLinkId: 'editSubcriptionItemStep',
                afterSetupStep:_itemStepSetup,
                tearDown: _itemStepTearDown
            },
            {
                stepContainerId: 'paymentStep',
                stepFormId: 'PaymentForm',
                editStepLinkId: 'editPaymentStep',
                afterSetupStep:_paymentStepSetup
            },
            {
                stepContainerId: 'confirmationStep',
                afterSetupStep: _confirmationStepSetup
            },
            {
                //Floating espot step
                stepContainerId:'auxiliary',
                afterSetupStep: _auxiliarySetup
            }
        ];

        _subscriptionProcessOverlay = new JS.Overlay({
            overlayBoxId: 'subscriptionOverlayBox',
            pageOverlayId: 'subscriptionPageOverlay'
        });
        _clearTextButton = new JS.setupClearTextButton('subscriptionSearch','subscriptionClearSearch');

        if (typeof __subscriptionCreateMode__ !== 'undefined'){
            _createMode = __subscriptionCreateMode__;
        }

        return new JS.SubscriptionProcess(subscriptionProcessSteps,
            {
                progressBarObject: JS.objects.autoOrderFixedProgressBar,
                afterSetup: _afterSetup
            }
        );
    };
    _init();
};

JS.whatTagWasClicked = function(e){
    var evt=window.event || e,
        targetElem = evt.target;

    if (!targetElem) //if event obj doesn't support e.target, presume it does e.srcElement
        targetElem=evt.srcElement; //extend obj with custom e.target prop

    return targetElem;
};


/**
 * Switch between the add container and the subscribe container
 */
JS.AddAndSubscribeTabs = function(){

    var _self = this;

    /**
     * If there is a promo class added change the colour of the subscribe tab to orange
     */
    var _addClassToPromoTabs = function(){
        var _promoTab;
        var _promoTab = dojo.query('.promoAdded');
        var i;
        var _li;
        for(i=0;i<_promoTab.length;i++){
            if(_promoTab[i]){
                _li = _promoTab.children('.last');
                _li.addClass('promoTab');
              _promoTab.parent().query('.addSubscribeAndsaveContainer .pricingAndTrolleyOptions .addToSubscriptionContainer ').addClass('promoTab');
            }
        }
    };


    /**
     * Swaps the class of the active container
     * @param string hashName. The name of the container to switch

     */
    var _redrawProductRow = function(childElem){
        if (JS.objects.gridView) {

            var childNodeList = dojo.query(childElem);

            var parentContainer = childNodeList.parents('.' + JS.objects.gridView.getBlockClass());

            if (parentContainer.length > 0)
                JS.objects.gridView.redrawSingleRow(parentContainer[0]);
        }

    }

    var _switchTabsContainer = function(hashName){
        var tabContentContainer = document.getElementById(hashName);
        var tabContentsParent = tabContentContainer.parentNode;
        var containerChildren = dojo.query(".priceTabContainer", tabContentsParent);
        var i;

        for(i=0;i<containerChildren.length;i++){
            if(dojo.hasClass(containerChildren[i],'activeContainer')){
                dojo.removeClass(containerChildren[i], 'activeContainer');
                dojo.addClass(tabContentContainer,'activeContainer');
            }
        }
        // Hide CrossSell if the subscribe tab is clicked
        var additionItem = 'additionalItems_' + hashName.split('_')[1];
        var crossSell = document.getElementById(additionItem);
        if(crossSell != null){
            if(hashName.split('_')[0] === 'subscribe'){
                dojo.addClass(crossSell,'hideCrossSell');
            } else{
                dojo.removeClass(crossSell,'hideCrossSell');
            }
        }

    }
    /**
     * Swaps the class of the active tab
     * @param string hashName. The name of the container
     * @param string elem. The name of the container to switch

     */
    var promoBoolean = false;
    var _switchTabs = function(hashName,elem){

        var container = elem.parentNode.parentNode;
        var tabs = dojo.query(container).children();
        var i;
        var clickedTab = dojo.byId(hashName);


        for(i=0;i<tabs.length;i++){
           if(dojo.hasClass(tabs[i],'currentTab')){
                dojo.removeClass(tabs[i],'currentTab');
                dojo.addClass(elem.parentNode,'currentTab');
           }
           //Check if the promo tab has a class and add this exta class to change the colour
          if(dojo.hasClass(tabs[1], "currentTab")){
            dojo.addClass(tabs[1],'currentTabPromo');
            promoBoolean = true;
           } else {
             dojo.removeClass(tabs[1],'currentTabPromo');
             promoBoolean = false;
           }
        }
         _addBackgroundColorToSubscribeTab( elem );
    }

    /**
     * Add a class that will add a background image the same
     * colour as the subscribe tab so the orange extends to the bottom of the tabs
     */
    var _addBackgroundColorToSubscribeTab = function( elem ){
        var gridItem;
        if(dojo.hasClass(elem.parentNode.parentNode,'promoAdded')){
            gridItem = dojo.query(elem).closest(dojo.query('.gridItem'))[0];
            if(typeof gridItem == 'undefined') return;
            if(promoBoolean){
                dojo.addClass(gridItem,'subscribeTabActive');
            } else {
                dojo.removeClass(gridItem,'subscribeTabActive');
            }
        }

    };


    /**
     * [_getHashName description]
     * @param  event handler event. The event trigger by the onclick
     * @return tag string. The name of the tab that was clicked
     */
    var _getHashName = function(tab){
        //var tab = JS.whatTagWasClicked(event);

        var tag = tab.replace('#','');

        return tag;
    }

    this.cacheBuildBind = function(){
          _addClassToPromoTabs();
        dojo.query('.addToTrolleytab a').connect('onclick',function(event) {
            // Test if this is the current tab
            event.preventDefault();

            var hashName = _getHashName(this.getAttribute("id"));
           // //Switch tab container
            _switchTabsContainer(hashName);
           // //Switch tabs
            _switchTabs(hashName,this);

            _redrawProductRow(this);

            //return false;
        });

    };
    var _init = function(){

        _self.cacheBuildBind();
    };

    _init();
};

/**
 * Takes an element and returns the coordinates it needs for it to be positioned
 * in relation to another element on the page. This assumes that the element being
 * positioned is at the root of the document.
 * @param  {Object} elementToPosition    The element that we want to position.
 * @param  {Object} referenceElement     The element we want to position in
 *                                       relation to.
 * @param  {String} positioning          Where the element will be positioned in
 *                                       relation to referenceElement. This can
 *                                       be either 'top', 'bottom', 'left' or
 *                                       'right'.
 * @param  {Object} options              Configuration options for the function.
 * @return {Object}                      Returns the following positional information
 *                                       for the element:
 *                                       leftPos The left position for the element.
 *                                       topPos The top position for the element.
 *                                       w The width of the element.
 *                                       h The height of the element.
 *                                       horizontalAdjustment How much we needed to
 *                                       adjust the horizontal position in order to
 *                                       keep the element in the viewport.
 */
JS.positionElement = function(elementToPosition,referenceElement,positioning,options){
    'use strict';

    var _config = {
        leftBuffer: 9,
        rightBuffer: 20
    }

    /**
     * Calculates the left position required for centering the element horizontally based on the
     * position and width of the reference element.
     * @param {Number} referenceElemXPosition The X position of the reference element.
     * @param {Number} referenceElemWidth The width of the reference element.
     * @param {Number} elemWidth The width of the element.
     * @return {Number} The left position for the element to be positioned at.
     */
    var _getHorizontallyCenteredPosition = function(referenceElemXPosition,referenceElemWidth,elemWidth){
        return (referenceElemXPosition - (elemWidth / 2)) + (referenceElemWidth / 2);
    };

    /**
     * Calculates the top position required for centering the element vertically based on the
     * position and height of the reference element.
     * @param {Number} referenceElemYPosition The Y position of the reference element.
     * @param {Number} referenceElemHeight The height of the reference element.
     * @param {Number} elemHeight The height of the element.
     * @return {Number} The top position for the element to be positioned at.
     */
    var _getVerticallyCenteredPosition = function(referenceElemYPosition,referenceElemHeight,elemHeight){
        return (referenceElemYPosition - (elemHeight / 2) + (referenceElemHeight / 2));
    };

    /**
     * Tests for whether the element will be positioned off the page, and adjusts the left
     * position accordingly.
     * @param  {Number} elementWidth    The width of the element.
     * @param  {Number} currentLeftVal  The current left position of the element.
     * @return {Object}                 Returns the following:
     *                                  leftVal The left position for the element to be
     *                                  position at.
     *                                  horizontalAdjustment How much the element has had to
     *                                  be shifted in order to be visible onthe page.
     */
    var _adjustHorizontalPositionForViewport = function(elementWidth,currentLeftVal){
        var viewportSize = JS.getViewportSize(),
            newLeftVal = currentLeftVal,
            viewportWidth,
            elementRightEdge,
            xPositionDifference,
            tooltipArrowPos;

        // Get the viewport width (-20 to take account of scrollbars and to give a little breathing room on the right-hand side)
        viewportWidth = viewportSize.w - _config.rightBuffer;

        // Get the x-position of the right edge of the element
        elementRightEdge = currentLeftVal + elementWidth;

        // If the x position of the right edge of the element is greater than the width of the viewport
        // we will need to reduce the x position to keep the element from cropping
        if (elementRightEdge > viewportWidth) {
            // Store the difference between the element's right x-position and the viewport's width
            xPositionDifference = elementRightEdge - viewportWidth;

            // Calculate the new left position for the element
            newLeftVal = currentLeftVal - xPositionDifference;

        } else if (currentLeftVal < _config.leftBuffer) {
            xPositionDifference = currentLeftVal - _config.leftBuffer;

            newLeftVal = _config.leftBuffer;
        }

        return {
            'leftVal': newLeftVal,
            'horizontalAdjustment': xPositionDifference
        };
    };

    var _calculateElementPosition = function(){
        var horizontalAdjustment = 0,
            elementPositionInfo,
            referenceElementPositionInfo,
            adjustmentData,
            leftVal,
            oldLeftVal,
            topVal;

        // Gets the position info (which contains dimensions) of the element we want to position
        elementPositionInfo = dojo.position(elementToPosition);
        referenceElementPositionInfo = dojo.position(referenceElement,true);

        // Sets the position of the element
        switch (positioning){
            case 'left':
                leftVal = referenceElementPositionInfo.x - elementPositionInfo.w;
                topVal = _getVerticallyCenteredPosition(referenceElementPositionInfo.y,referenceElementPositionInfo.h,elementPositionInfo.h);
                break;
            case 'top':
                oldLeftVal = leftVal;
                leftVal = _getHorizontallyCenteredPosition(referenceElementPositionInfo.x,referenceElementPositionInfo.w,elementPositionInfo.w);
                adjustmentData = _adjustHorizontalPositionForViewport(elementPositionInfo.w,leftVal);
                leftVal = adjustmentData.leftVal;
                horizontalAdjustment = adjustmentData.horizontalAdjustment;
                topVal = referenceElementPositionInfo.y - elementPositionInfo.h;
                break;
            case 'bottom':
                leftVal = _getHorizontallyCenteredPosition(referenceElementPositionInfo.x,referenceElementPositionInfo.w,elementPositionInfo.w);
                adjustmentData = _adjustHorizontalPositionForViewport(elementPositionInfo.w,leftVal);
                leftVal = adjustmentData.leftVal;
                horizontalAdjustment = adjustmentData.horizontalAdjustment;
                topVal = referenceElementPositionInfo.y + referenceElementPositionInfo.h;
                break;
            case 'middle':
                leftVal = referenceElementPositionInfo.x;
                topVal = _getVerticallyCenteredPosition(referenceElementPositionInfo.y,referenceElementPositionInfo.h,elementPositionInfo.h);
                break;
            default:
                leftVal = referenceElementPositionInfo.x + referenceElementPositionInfo.w;
                topVal = _getVerticallyCenteredPosition(referenceElementPositionInfo.y,referenceElementPositionInfo.h,elementPositionInfo.h);
                break;
        }

        return {

            'leftVal': leftVal,
            'topVal': topVal,
            'w': elementPositionInfo.w,
            'h': elementPositionInfo.h,
            'horizontalAdjustment': horizontalAdjustment
        };
    };

    if (options)
        _config = JS.mixin(_config,options);

    return _calculateElementPosition();
};

/**
 * Displays a tour of the page the customer is on, with each step pointing to
 * different elements on the page so as to inform the customer of what each
 * element is for.
 * @param  {Array} tourStep    Array of objects containing options for each
 *                             step in the tour.
 */
JS.PageTour = function(tourStep){
    'use strict'

    var _config = {
        markup:'<div class="tourArrow" id="tourArrow"><span class="arrow"></span></div>'
                +'<div id="tourContainer" class="tourContainer">'
                + '<a href="#" id="closeTour" class="closeTour"><span>Close</span></a>'
                +'<div id="tourInnerContent" class="tourInnerContent"></div>'
                +'<div class="tourPagination"> <a href="#" id="previousStep" class="previousStep previousInactive"><span>previous</span></a>  <span id="tourCounter" class="tourCounter"></span> <a href="#" id="nextStep" class="nextStep"><span>next</span></a></div>'
                +'</div>'
    };

    var arr = [];

    var _tourContent;

    var _tourContainer;

    var _tourArrow;

    var _previousStep;

    var _nextStep;

    var _closeTour;

    var _tabController;

    var maxCount;

    var areaOverlay;

    var count = 0;

    var _tourCounter;

    var _tourCoordinates;

    var _tourArrowCoordinates;

    /**
     * Checks if the reference elements pointed to by each step exist, and
     * builds an array of IDs for those that do.
     * @private
     */
    var _checkIfIdsExist = function(){
        var i=0,
            il=tourStep.length;

        for(;i<il;i++){
            if(document.getElementById(tourStep[i].referenceElement)){
                arr.push(tourStep[i].espotId);
            }
        }
    };

    /**
     * Moves to the previous step of the tour.
     * @param {Object} e Event object
     * @private
     */
    var _previous = function(e){
        if(count > 0){
            count --;
            _insertContent();
            _activeInactiveButton();
        }
        e.preventDefault();
    };

    /**
     * Moves to the next step of the tour.
     * @param {Object} e Event object
     * @private
     */
    var _next = function(e){
        if(count < maxCount -1){
            count ++;
            _insertContent();
            _activeInactiveButton();
        }
        e.preventDefault();
    };

    /**
     * Close the tour.
     * @param {Object} e Event object
     */
    var _close = function(e){
        areaOverlay.hide();
        dojo.addClass(_tourContainer,'hideTour');
        _tourArrow.style.display = 'none';
        e.preventDefault();
    };

    /**
     * adds and removes classes from the tour buttons to show 'active & inactive' states.
     */
    var _activeInactiveButton = function(){
        if(count >= 1){
            dojo.removeClass(_previousStep,'previousInactive');
        } else {
            dojo.addClass(_previousStep,'previousInactive');
        }

        if(count === maxCount -1){
            dojo.addClass(_nextStep,'nextInactive');
           _bindLastClick();
        } else {
            dojo.removeClass(_nextStep,'nextInactive');
        }
    };

    /**
     * append eSpot content into tour
     */
    var _insertContent = function(){
        _tourContent.innerHTML = document.getElementById(arr[count]).innerHTML;
        _tourCounter.innerHTML = count + 1 + ' / ' + maxCount;
        _position();
    };

    /**
     * Postion the tour container
     * @private
     */
    var _position = function(){
        var counter;

        // AntJ - Looks like this was done for when a step is missing.
        if (arr[count] != tourStep[count].espotId) {
            counter = count +1;
        } else {
            counter = count;
        }

        _boxSize(counter);

        //Get coordinates for the tour container
        _tourCoordinates = JS.positionElement(_tourContainer,tourStep[counter].referenceElement,tourStep[counter].positioning);

        //Get coordernates for arrow container
        _tourArrowCoordinates = JS.positionElement(_tourArrow,tourStep[counter].referenceElement, tourStep[counter].arrowPosition );

        //position tour arrow if it has coordinates
        if(tourStep[counter].arrowPosition === null){
            _tourArrow.style.visibility = 'hidden';
            _tourArrow.style.top = _tourCoordinates.topVal +'px';
            _tourArrow.style.left =_tourCoordinates.leftVal +'px'
        } else {
            _tourArrow.style.visibility = 'visible';
            _tourArrow.style.top = _tourArrowCoordinates.topVal +'px';
            _tourArrow.style.left = _tourArrowCoordinates.leftVal +'px';
        }

        //Remove previous styles
        _tourContainer.style.left = _tourCoordinates.leftVal +'px';
        _tourContainer.style.top = _tourCoordinates.topVal +'px';
    };

    /**
     * The close button doesn't seem to work so I've rebound it
     */
    var _bindLastClick = function(){
        var _closeTourBtn = dojo.query('.closeTourBtn', _tourContent);
        _closeTourBtn.connect('click',function(){
            _close(e);
        });
    };

    /**
     * resize the box to the specified width
     */
    var _boxSize = function(counter){
        if(tourStep[counter].boxWidth === null){
            _tourContainer.style.width = 'auto';
        } else {
            _tourContainer.style.width = tourStep[counter].boxWidth;
        }
    };

    /**
     * Caches the elements used by this object.
     * @private
     */
    var _cacheElements = function(){
        _tourContent = document.getElementById('tourInnerContent');
        _previousStep = document.getElementById('previousStep');
        _nextStep = document.getElementById('nextStep');
        _closeTour = document.getElementById('closeTour');
        _tourCounter = document.getElementById('tourCounter');
        _tourContainer = document.getElementById('tourContainer');
        _tourArrow = document.getElementById('tourArrow');
    };

    /**
     * Binds events for this object.
     * @private
     */
    var _bindEvents = function(){
        dojo.connect(_previousStep, 'click', _previous);
        dojo.connect(_nextStep, 'click', _next);
        dojo.connect(_closeTour, 'click', _close);

        // Handle keyboard controls.
        dojo.connect(_tourContainer,'onkeydown',null,function(e){
            // Close the tour when ESC is hit
            if (e.keyCode==27){
                _close(e);
            }
        });

        dojo.connect(window, "onresize", _position);
    }

    var _init = function(){
        _checkIfIdsExist();

        maxCount = arr.length;

        //Create a overlay
        areaOverlay = new JS.AreaOverlay({
            overlayClass: 'tourOverlay',
            overlayId:'tourOverlay',
            areaId:'viewSubscriptionDisplay'
        },true);

        areaOverlay.show();

        //Load markup into dom
        if(!dojo.place(_config.markup,document.body,'last')) return;

        _cacheElements();

        _tabController = new JS.TabControl(_tourContainer,{elementSelector:'a'});

        _insertContent();

        _bindEvents();

        _tabController.cache();

        // Give the tour container focus for keyboard users
        _tourContainer.tabIndex = -1;
        _tourContainer.focus();
     }

    //Initilise!
    _init();
};

/**
 * Takes a node list and binds an event to each item using dojo.connect and
 * returns the handles.
 * @param {Array} nodeList List of elements to bind the event to.
 * @param {String} eventName The name of the event we are listening for.
 * @param {Function} handler The function that handles the event.
 * @return {Array} An array of dojo.connect handles.
 */
JS.multiConnect = function(nodeList, eventName, handler){
    var handles = [],
        i=0,
        il=nodeList.length;

    if (il > 0){
        for (;i<il;i++){
            handles.push(
                dojo.connect(nodeList[i],eventName,handler)
            );
        }
    }

    return handles;
};

/**
 * Takes an array of dojo.connect handles and disconnects them.
 * @param {Array} handles Array of dojo.connect handles.
 * @return {Array} An empty array.
 */
JS.multiDisconnect = function(handles){
    var i=0,
        il=handles.length;

    if (il > 0){
        for (;i<il;i++){
            dojo.disconnect(handles[i]);
        }

        // Empty the array of handles
        handles.length = 0;
    }

    return handles;
};

/**
 * Looks after the voucher list module used on the voucher page.
 */
JS.VoucherList = function(){
    'use strict';

    /**
     * Config options for the object.
     * @type {Object}
     */
    var _config = {
        genericVoucherListContainerId: 'manualVoucherList',
        removeVoucherClass: 'removeVoucher',
        useVoucherClass: 'useVoucher',
        voucherListItemIdPrefix: 'voucherListItem',
        deleteVoucherClass: 'deleteVoucher',
        deleteVoucherIdPrefix: 'deleteVoucher',
        deleteVoucherConfirmPanelIdPrefix : 'deleteVoucherConfirmPanel',
        deleteVoucherCancelClass : 'deleteVoucherCancel',
        confirmDeleteVoucherClass: 'deleteVoucherConfirmBtn',
        showConfirmPanelClass: 'showConfirmDeletePanel'
    };

    var _self = this;

    var _voucherWalletListContainer;

    var _genericVoucherListContainer;

    var _checkoutSummaryContainer;

    var _spinnerOverlay;

    var _linkClickedId = '';

    /**
     * Stores current page URL
     */
    var _currentPageURL = window.location.href;

    /**
     * Bind events for the object.
     * @private
     */
    var _bindEvents = function(){
        // Listen for when a customer wants to use/remove a voucher from the voucher wallet.
        dojo.connect(_voucherWalletListContainer,'click',_voucherClickHandler);

        // Listen for when a customer wants to delete a generic voucher.
        dojo.connect(_genericVoucherListContainer, 'click', _voucherClickHandler);
    };

    /**
     * Cache elements for the object.
     * @private
     */
    var _cacheElements = function(){
        _voucherWalletListContainer = dojo.byId('walletVoucherList');
        _genericVoucherListContainer = dojo.byId(_config.genericVoucherListContainerId);
        _checkoutSummaryContainer = dojo.byId('checkoutOrderSummary');
    };

    /**
     * Handles any clicks on vouchers in either the wallet or generic voucher list.
     * @param  {Object} e Event object
     * @private
     */
    var _voucherClickHandler = function(e){
        var elementClicked,
            voucherUseUrl;

        // Find out which element was clicked
        elementClicked = JS.whatTagWasClicked(e);

        // We are only interested in an Anchor element being clicked
        if (elementClicked.tagName === 'A'){
            // If the customer has chosen to apply or remove a voucher in their wallet
            if (dojo.hasClass(elementClicked,_config.removeVoucherClass) || dojo.hasClass(elementClicked,_config.useVoucherClass)){
                e.preventDefault();

                // Record the ID for the link so we can return to it when the content is refreshed.
                _linkClickedId = elementClicked.id;

                // Put the edited URL back together and send
                voucherUseUrl = _createAjaxVoucherDisplayUrl(elementClicked.href);
                _sendVoucherUse(voucherUseUrl);
            }

            // If this was the delete voucher link
            if (dojo.hasClass(elementClicked, _config.deleteVoucherClass)){
                e.preventDefault();
                _confirmDelete(elementClicked);
            }

            // If this was the Cancel link on the delete confirmation box
            if (dojo.hasClass(elementClicked, _config.deleteVoucherCancelClass)){
                e.preventDefault();
                _cancelDelete(elementClicked);
            }

            // If this was the Delete link on the delete confirmation box
            if (dojo.hasClass(elementClicked, _config.confirmDeleteVoucherClass)){
                e.preventDefault();

                // Put the edited URL back together and send
                voucherUseUrl = _createAjaxVoucherDisplayUrl(elementClicked.href);
                _sendVoucherUse(voucherUseUrl);
            }
        }
    };

    /**
     * Take a URL with a query string and manipulates it so that it can be used
     * to make an AJAX request to update and display the voucher info.
     * @param  {String} url The URL we are going to manipulate.
     * @return {String} The URL for making an AJAX request to update and display
     *                  the voucher info.
     */
    var _createAjaxVoucherDisplayUrl = function(url){
        var splitUrl = url.split('?',2),
            queryData = dojo.queryToObject(splitUrl[1]);

        // Change what view should be returned by the command
        queryData.VIEW = 'AjaxEnclosedApplyVoucherView';
        queryData.URL = 'AjaxEnclosedApplyVoucherView';

        // Put the edited URL back together and return it
        return splitUrl[0] + '?' + dojo.objectToQuery(queryData);
    };

    var _getVoucherListItemElem = function(voucherId){
        return dojo.byId(_config.voucherListItemIdPrefix + voucherId);
    };

    /**
     * Displays a panel asking the customer to confirm if they want to delete the
     * voucher.
     * @param  {Element} elementClicked The element that was clicked to trigger the
     *                                  deletion of the voucher.
     * @private
     */
    var _confirmDelete = function(elementClicked){
        var elementClickedId = elementClicked.id,
            voucherId = elementClickedId.replace(_config.deleteVoucherIdPrefix, ''),
            confirmPanelId = elementClickedId.replace(_config.deleteVoucherIdPrefix, _config.deleteVoucherConfirmPanelIdPrefix),
            confirmPanelElem = dojo.byId(confirmPanelId),
            voucherListItemElem = _getVoucherListItemElem(voucherId);

        dojo.addClass(voucherListItemElem, _config.showConfirmPanelClass);

        // #a11y - Give focus to the Confirm Delete panel for keyboard users.
        confirmPanelElem.tabIndex = -1;
        confirmPanelElem.focus();
    };

    /**
     * Cancels the deletion of the voucher.
     * @param  {Element} elementClicked The element that was clicked to cancel the
     *                                  deletion of the voucher.
     * @private
     */
    var _cancelDelete = function(elementClicked){
        var deleteButtonId = elementClicked.hash.replace('#',''),
            deleteButtonElem = dojo.byId(deleteButtonId),
            voucherId = deleteButtonId.replace(_config.deleteVoucherIdPrefix,''),
            voucherListItemElem = _getVoucherListItemElem(voucherId);

        dojo.removeClass(voucherListItemElem, _config.showConfirmPanelClass);

        // #a11y - Give focus back to the delete button for keyboard users.
        deleteButtonElem.focus();
    };

    /**
     * Sends a request to update whether we are using a voucher.
     * @param  {String} url The URL for sending the use voucher request.
     * @return {[type]}
     */
    var _sendVoucherUse = function(url){
        _spinnerOverlay.show();

        dojo.xhrGet({
            url: url,
            preventCache: true,
            handleAs: 'json',
            load: function(data, ioArgs){
                if (data.error){
                    if (data.error === 'PageRefreshRequired') {
                        window.location.assign(_currentPageURL);
                    } else {
                        JS.objects.ErrorMessage.show(data.error);
                    }
                } else {
                    _self.updateVoucherWalletList(data.voucherWalletListHtml);

                    _self.updateGenericVoucherList(data.genericVoucherListHtml);

                    _self.updateCheckoutSummary(data.checkoutSummaryHtml);

                    _self.updateMaximumVoucherValue(data);

                    JS.objects.ErrorMessage.clear();

                    _giveFocusToLinkClicked();
                }
                _spinnerOverlay.hide();
            },
            error: function(err, ioArgs){
                //console.log('An unexpected error occurred: ' + error);
                JS.objects.ErrorMessage.clear();

                _giveFocusToLinkClicked();

                _spinnerOverlay.hide();
            }
        });
    };

    /**
     * Give focus back to the element we clicked on to apply a voucher.
     * @private
     */
    var _giveFocusToLinkClicked = function(){
        var linkToFocusOn = dojo.byId(_linkClickedId);

        if (linkToFocusOn) linkToFocusOn.focus();
    };

    /**
     * Updates the voucher wallet list on the page.
     * @param  {String} voucherListHtml The HTML for displaying the voucher wallet list.
     */
    this.updateVoucherWalletList = function(voucherListHtml){
        _voucherWalletListContainer.innerHTML = voucherListHtml;
    };

    /**
     * Updates the generic voucher list on the page.
     * @param  {String} voucherListHtml The HTML for displaying the generic voucher list.
     */
    this.updateGenericVoucherList = function(voucherListHtml){
        _genericVoucherListContainer.innerHTML = voucherListHtml;
    };

    /**
     * Updates the checkout summary in the RHS of the page.
     * @param  {String} checkoutSummaryHtml The HTML for displaying the checkout summary.
     */
    this.updateCheckoutSummary = function(checkoutSummaryHtml){
        _checkoutSummaryContainer.innerHTML = checkoutSummaryHtml;
    };

    /**
     * Update maximum nectar voucher value
     */
    this.updateMaximumVoucherValue = function(response) {
        var nectarBalanceDetailsElem = dojo.byId('nectarBalanceDetails'),
            maxVoucherValueHiddenVar = dojo.byId('maxVoucherAmountHiddenVar');

        if (nectarBalanceDetailsElem){
            JS.objects.nectarConversion.updateNectarBalanceDetails(response.nectarBalanceHtml);

            //disable enable nectar form
            JS.objects.nectarConversion.enableDisableNectarForm(response.formSectionDisabledForNectar);
        }

        if(maxVoucherValueHiddenVar) {
            maxVoucherValueHiddenVar.value = response.maxNectarVoucherValue;
        }
    };

    /**
     * Initialises the object.
     * @private
     */
    var _init = function(){
        _cacheElements();
        _bindEvents();
        _spinnerOverlay = new JS.AreaOverlay({
            overlayClass: 'ajaxSpinner',
            overlayId: 'ajaxSpinner',
            areaId: 'yourVouchersSection'
        },true);
    };

    _init();
};

/**
 * Handles submission of the Add Voucher form via AJAX.
 */
JS.AddVoucherForm = function(){
    'use strict';

    var _self = this;

    var _voucherForm;

    var _genericVoucherListContainer;

    var _voucherWalletListContainer;

    var _checkoutSummaryContainer;

    var _voucherCodeFieldElem;

    var _spinnerOverlay;

    var _hasVoucherSubTitleElem;

    var _noWalletVouchersMessage;

    /**
     * Stores current page URL
     */
    var _currentPageURL = window.location.href;

    /**
     * Bind events for the object.
     * @private
     */
    var _bindEvents = function(){
        // Listen for when customer wants to use/remove a voucher
        dojo.connect(_voucherForm,'submit',_voucherFormSubmitHandler);
    };

    /**
     * Cache elements for the object.
     * @private
     */
    var _cacheElements = function(){
        _voucherForm = dojo.byId('addVoucherForm');
        _genericVoucherListContainer = dojo.byId('manualVoucherList');
        _checkoutSummaryContainer = dojo.byId('checkoutOrderSummary');
        _voucherWalletListContainer = dojo.byId('walletVoucherList');
        _voucherCodeFieldElem = dojo.byId('voucherNo');
        _noWalletVouchersMessage = dojo.byId('noWalletVouchersMessage');
        _hasVoucherSubTitleElem = dojo.byId('hasVoucherSubTitle');

    };

    /**
     * Handles the submission of the add voucher form.
     * @param  {Object} e Event object
     * @private
     */
    var _voucherFormSubmitHandler = function(e){
        var addVoucherData,
            addVoucherUrl;

        e.preventDefault();

        // Edit the form data so we get the correct view returned
        addVoucherData = dojo.formToObject(_voucherForm);
        addVoucherData.VIEW = 'AjaxEnclosedAddGenericVoucherView';
        addVoucherData.URL = 'AjaxEnclosedAddGenericVoucherView';

        // Put the edited URL back together and send
        addVoucherUrl = _voucherForm.action + '?' + dojo.objectToQuery(addVoucherData);
        _sendAddVoucher(addVoucherUrl);
    };

    /**
     * Sends a request to add a voucher.
     * @param  {String} url The URL for sending the use voucher request.
     * @private
     */
    var _sendAddVoucher = function(url){
        _spinnerOverlay.show();

        dojo.xhrGet({
            url: url,
            preventCache: true,
            handleAs: 'json',
            load: function(data, ioArgs){
                if (data.error){
                    if (data.error === 'PageRefreshRequired') {
                        window.location.assign(_currentPageURL);
                    } else {
                        JS.objects.ErrorMessage.show(data.error);
                    }
                } else {
                    _self.updateVoucherList(data.voucherListHtml);

                    _self.updateVoucherWalletList(data.voucherWalletListHtml);

                    _self.updateCheckoutSummary(data.checkoutSummaryHtml);

                    _self.updateManageVoucherSubtitle();

                    JS.objects.voucherList.updateMaximumVoucherValue(data);

                    JS.objects.ErrorMessage.clear();

                    if (_voucherCodeFieldElem){
                        _voucherCodeFieldElem.value = '';
                    }
                }
                _spinnerOverlay.hide();
            },
            error: function(err, ioArgs){
                //console.log('An unexpected error occurred: ' + error);
                JS.objects.ErrorMessage.clear();

                _spinnerOverlay.hide();
            }
        });
    };

    /**
     * Updates the generic voucher list on the page.
     * @param  {String} voucherListHtml The HTML for displaying the voucher list.
     */
    this.updateVoucherList = function(voucherListHtml){
        _genericVoucherListContainer.innerHTML = voucherListHtml;
    };

    /**
     * Updates the voucher wallet list on the page.
     * @param  {String} voucherWalletListHtml The HTML for displaying the voucher list.
     */
    this.updateVoucherWalletList = function(voucherWalletListHtml){
        _voucherWalletListContainer.innerHTML = voucherWalletListHtml;
    };

    /**
     * Updates the checkout summary in the RHS of the page.
     * @param  {String} checkoutSummaryHtml The HTML for displaying the checkout summary.
     */
    this.updateCheckoutSummary = function(checkoutSummaryHtml){
        _checkoutSummaryContainer.innerHTML = checkoutSummaryHtml;
    };

    /**
     * Update manage voucher sub title
     */
    this.updateManageVoucherSubtitle = function() {
        if (_hasVoucherSubTitleElem){
            dojo.removeClass(_hasVoucherSubTitleElem,'hidden');
        }

        if (_noWalletVouchersMessage){
            dojo.addClass(_noWalletVouchersMessage,'hidden');
        }
    };

    /**
     * Initialises the object.
     * @private
     */
    var _init = function(){
        _cacheElements();
        _bindEvents();
        _spinnerOverlay = new JS.AreaOverlay({
            overlayClass: 'ajaxSpinner',
            overlayId: 'ajaxSpinner2',
            areaId: 'yourVouchersSection'
        },true);
    };

    _init();
};

/**
 * Nectar validation and conversion
 *
 * @param {Object} options to pass
 */
JS.NectarConversion = function(options) {
    'use strict';

    /**
     * Configuration
     */
    var _config = {
        viewUrl: 'AjaxConvertNectarPointsConfirmationView',
        confirmNectarPointsView: 'AjaxConvertNectarPointsView',
        voucherAmountTxt : 'voucherAmountTxt', // voucherAmountTxt Id
        nectarPointsValue: 'nectarPointsValue',
        nectarConvertBtn: 'nectarConvertBtn', // nectarConvertBtn Id
        nectarConvertConfirmFormId: 'confirmConvertNectarPoints',
        nectarBalanceDetailsId: 'nectarBalanceDetails',
        formId: 'convertNectarPoints',
        voucherListId: 'walletVoucherList',
        checkoutSummaryId: 'checkoutOrderSummary',
        pleaseWaitOverlayHtml: '<div class="pleaseWaitOverlay"><p>Sorry for the wait. This will only take a moment</p></div>',
        basePoundConversion: basePoundConversion,
        basePoundAmount : basePoundAmount,
        xComregTimesWithinConvertLimit: 99
    };


    var _self = this;

    /**
     * Stores form validator object
     */
    var _formValidator;

    /**
     * Stores the error message handler object
     */
    var _errorMessageHandler;

    /**
     * Stores the error message handler
     * @type Object
     * @private
     */
    var _inlineErrorMessageHandler;

    /**
     * Nectar Point Value
     */
    var _nectarPointsValue;

    /**
     * Voucher Amount
     */
    var _voucherAmountTxt;

    /**
     * Nectar convert button
     */
    var _nectarConvertBtn;

    /**
     * Overlay
     */
    var _overlay;

     /**
     * Stores a instance of the overlay to be displayed when trying to create a nectar voucher.
     * @private
     */
    var _pleaseWaitOverlay;

    /**
     * Stores the form for confirmaing the conversion of Nectar points into vouchers.
     */
    var _nectarConvertConfirmForm;

    /**
     * Stores the event handler for the confirm conversion form.
     */
    var _nectarConvertConfirmHandler;

    /**
     * Stores the element contain info about the customer's nectar balance.
     */
    var _nectarBalanceDetailsElem;

    /**
     * Spinning Overlay
     */
    var _spinnerOverlay;

    /**
     * Stores container for the voucher wallet list
     */
    var _voucherListContainer;

    /**
     * Stores container for the checkout summary on the RHS
     */
    var _checkoutSummaryContainer;

    /**
     * Stores current page URL
     */
    var _currentPageURL = window.location.href;

    /**
     * Cache elements
     */
    var _cacheElements = function() {
        _nectarPointsValue = dojo.byId(_config.nectarPointsValue);
        _voucherAmountTxt = dojo.byId(_config.voucherAmountTxt);
        _nectarConvertBtn = dojo.byId(_config.nectarConvertBtn);
        _voucherListContainer = dojo.byId(_config.voucherListId);
        _checkoutSummaryContainer = dojo.byId(_config.checkoutSummaryId);
        _nectarBalanceDetailsElem = dojo.byId(_config.nectarBalanceDetailsId);
        _overlay = new JS.Overlay();
        _spinnerOverlay = new JS.AreaOverlay({
            overlayClass: 'ajaxSpinner',
            overlayId: 'ajaxSpinner2',
            areaId: 'nectarOverlay'
        },true);

        _pleaseWaitOverlay = new JS.Overlay({
            overlayBoxId: 'pleaseWaitOverlayBox',
            overlayBoxClass: 'pleaseWaitOverlayBox',
            pageOverlayId: 'pleaseWaitPageOverlay',
            pageOverlayClass: 'pleaseWaitPageOverlay',
            clickToClose: false
        },true);
    };

    /**
     * Checks if voucherAmount is multiple of basePoundConversion
     *
     * @param {Number} voucherAmount
     * @param {Numner} basePoundConversion
     * @return {Boolean} true|false
     */
    var _isMultipleOf = function(voucherAmount, basePoundConversion) {
        var reminder = voucherAmount % basePoundConversion;
        if(reminder === 0) {
            return true;
        }

        return false;
    };

    /**
     * Checks if voucherAmount is beyond the convertable limit
     *
     * @param {Number} voucherAmount
     * @return {Boolean} true|false
     */
    var _isBeyondConvertableLimit = function(voucherAmount) {
        var maximumAllowed =_config.xComregTimesWithinConvertLimit * _config.basePoundConversion;

        if(voucherAmount > maximumAllowed) {
            return true;
        }

        return false;
    }

    /**
     * Check if the voucher amount entered is valid or not.
     *
     * @param {Number} voucherAmount to check for validation
     * @return {Boolean} true|false
     */
    var _isValid = function(voucherAmount) {
        if (voucherAmount <= 0) {
            return false;
        } else if(_isBeyondConvertableLimit(voucherAmount)) {
            return false;
        } else if(!_isMultipleOf(voucherAmount, _config.basePoundConversion)) {
            return false;
        }

        return true;
    };

    /**
     * Calculates Nectar points
     *
     * @return {Number} Nectar points after calculation
     */
    var _calculateNectarPoints = function() {
        var nectarPoints = 0;
        var voucherAmount = Number(_voucherAmountTxt.value) || 0;

        if(_isValid(voucherAmount)) {
            nectarPoints = (voucherAmount / _config.basePoundConversion) * _config.basePoundAmount;
        }

        return nectarPoints;
    };

    /**
     * Display calculated nectar points in element
     * @param {Number} point The points value to display.
     * @private
     */
    var _updateNectarPoints = function(points) {
        _nectarPointsValue.innerHTML = points;
    };

    /**
     * Display ajax error message above point input field
     * @param {String} error from ajax response.
     * @private
     */
    var _showNectarAjaxError = function(error) {
        _inlineErrorMessageHandler.show(error);
        var pointsInputField = dojo.query('.nectarConversionField')[0];

        dojo.addClass(pointsInputField, 'error');
    };

    /**
     * Clear ajax error message above point input field
     * @param {String} error from ajax response.
     * @private
     */
    var _hideNectarAjaxError = function() {
        _inlineErrorMessageHandler.clear();
        var pointsInputField = dojo.query('.nectarConversionField')[0];

        if(dojo.hasClass(pointsInputField, 'error')) dojo.removeClass(pointsInputField, 'error');
    };

    /**
     * Submits the Nectar points conversion form via AJAX.
     * @param  {Object} formElem The form we are going to submit.
     * @private
     */
    var _submitConversionForm = function(formElem) {
        var formObject;
        _hideNectarAjaxError();
        _spinnerOverlay.show();
        formObject = dojo.formToObject(formElem);
        formObject.URL = _config.viewUrl;
        formObject.errorViewName = _config.viewUrl;

        // Do AJAX call to get the matching list
        dojo.xhrGet({
            url: formElem.action,
            content: formObject,
            preventCache: true,
            handleAs:"json",
            timeout: 10000,
            load: function(response, ioArgs) {
                if (response.error){
                    if (response.error === 'PageRefreshRequired') {
                        window.location.assign(_currentPageURL);
                    } else {
                        _showNectarAjaxError(response.error);
                        _spinnerOverlay.hide();
                    }
                } else {
                    _overlay.show(response.overlayHtml, _nectarConvertBtn, _unbindOverlayEvents);
                    _spinnerOverlay.hide();

                    _bindOverlayEvents();
                }
            },
            error: function(err, ioArgs) {
                _spinnerOverlay.hide();
            }
        });
    };

    /**
     * Binds the events for this object.
     * @private
     */
    var _bindEvents = function() {
        // bind key up to voucher amount text box
        dojo.connect(_voucherAmountTxt, 'keyup', function(e){
            var calculatedNectarPoints = _calculateNectarPoints();
            _updateNectarPoints(calculatedNectarPoints);
        });
    };

    /**
     * Binds events for when the confirm conversion overlay is displayed.
     * @private
     */
    var _bindOverlayEvents = function(){
        _nectarConvertConfirmForm = dojo.byId(_config.nectarConvertConfirmFormId);
        _nectarConvertConfirmHandler = dojo.connect(_nectarConvertConfirmForm,'submit', function(e){
            e.preventDefault();
            _overlay.hide();
            _pleaseWaitOverlay.show(_config.pleaseWaitOverlayHtml);
            _submitConvertConfirmation(this);
        });
    };

    /**
     * Unbinds events for the confirm conversion overlay.
     * @private
     */
    var _unbindOverlayEvents = function(){
        dojo.disconnect(_nectarConvertConfirmHandler);
    };

    /**
     * Updates the voucher list on the page.
     * @param  {String} voucherListHtml The HTML for displaying the voucher list.
     * @private
     */
    var _updateVoucherList = function(voucherListHtml){
        _voucherListContainer.innerHTML = voucherListHtml;
    };

    /**
     * Updates the nectar balance details for the customer.
     * @param  {String} nectarBalanceHtml The HTML for displaying the nectar balance.
     *
     */
    this.updateNectarBalanceDetails = function(nectarBalanceHtml){
        _nectarBalanceDetailsElem.innerHTML = nectarBalanceHtml;
    };

    /**
     * Enables or disables the nectar form
     * @param  {boolean} formSectionDisabledForNectar The flag to disabled
     */
    this.enableDisableNectarForm = function(formSectionDisabledForNectar) {
        var voucherAmountTxt = dojo.byId("voucherAmountTxt"),
            nectarConvertBtn = dojo.byId("nectarConvertBtn");

        if(voucherAmountTxt && nectarConvertBtn) {

            if(formSectionDisabledForNectar) {

                dojo.attr(voucherAmountTxt, 'disabled', 'disabled');

                dojo.attr(nectarConvertBtn, 'disabled', 'disabled');

            } else {

                if (dojo.hasAttr(voucherAmountTxt, 'disabled')) dojo.removeAttr(voucherAmountTxt, 'disabled');
                if (dojo.hasAttr(nectarConvertBtn, 'disabled')) dojo.removeAttr(nectarConvertBtn, 'disabled');

            }
        }
    }

    /**
     * Updates the checkout summary in the RHS of the page.
     * @param  {String} checkoutSummaryHtml The HTML for displaying the checkout summary.
     * @private
     */
    var _updateCheckoutSummary = function(checkoutSummaryHtml){
        _checkoutSummaryContainer.innerHTML = checkoutSummaryHtml;
    };

    /**
     * Submits the form (via AJAX) for confirming the customer wants to convert their
     * Nectar Points.
     * @param  {Object} formElem The form we are going to submit.
     * @private
     */
    var _submitConvertConfirmation = function(formElem){
        var formObject;

        formObject = dojo.formToObject(formElem);
        formObject.URL = _config.confirmNectarPointsView;
        formObject.errorViewName = _config.confirmNectarPointsView;

        // Do AJAX call to get the matching list
        dojo.xhrGet({
            url: formElem.action,
            content: formObject,
            preventCache: true,
            handleAs:"json",
            timeout: 30000,
            load: function(response, ioArgs) {
                if (response.error){
                    if (response.error === 'PageRefreshRequired') {
                        window.location.assign(_currentPageURL);
                    } else {
                        _errorMessageHandler.show(response.error);
                        _self.updateNectarBalanceDetails(response.nectarBalanceHtml);
                    }

                } else {
                    _updateVoucherList(response.voucherListHtml);

                    _self.updateNectarBalanceDetails(response.nectarBalanceHtml);

                    _self.enableDisableNectarForm(response.formSectionDisabledForNectar);

                    _updateCheckoutSummary(response.checkoutSummaryHtml);

                    JS.objects.voucherList.updateMaximumVoucherValue(response);

                    // Scroll to and give focus to the vouchers container.
                    // Would prefer it if it went to the voucher that was just created.
                    JS.SmoothScroll('yourVouchersSection',true);

                    // Make sure we clear the Nectar voucher amount field and the nectar points.
                    _voucherAmountTxt.value = '';
                    _updateNectarPoints(0);
                }
                _pleaseWaitOverlay.hide();
            },
            error: function(err, ioArgs) {
                _pleaseWaitOverlay.hide();
            }
        });
    };

    /**
     * Initialize the NectarConversion object
     * @private
     */
    var _init = function () {
        if (options) {
            _config = JS.mixin(_config, options);
        }

        _cacheElements();
        _bindEvents();

        /* Create an error message handler for the inline validation errors displayed by
         * the voucher amount field.
         */
        _errorMessageHandler = JS.objects.ErrorMessage;

        JS.objects.InlineErrorMessage = new JS.ErrorMessageHandler({
            messageContainerId:'nectarConversionError'
        });
        _inlineErrorMessageHandler = JS.objects.InlineErrorMessage;

        // Create an instance of the Form Validator so we can validate the conversion form.
        _formValidator = new JS.FormValidator(
            _config.formId,
            'nectarConversionError',
            __nectarConversionRuleset,
            {
                jumpListErrorHtmlStart: '<div class="errorText">',
                jumpListErrorHtmlFinish: '</div>',
                jumpListItemErrorHtmlStart: '<p>',
                jumpListItemErrorHtmlFinish: '</p>',
                populateErrorContainer: true,
                scrollToTopOfPage: false,
                showInlineErrors: false,
                afterValidationFail: function(){
                    _errorMessageHandler.clear();
                },
                afterValidationSuccess: function(form,evt){
                    _errorMessageHandler.clear();
                    _submitConversionForm(form);
                    evt.preventDefault();
                }
            }
        );
    }

    /**
     * Call initialization
     */
    _init();
};

/**
 * Used to safely focus on an element without causing problems on iOS devices.
 * The issue is that if you programatically focus on a submit button, the user
 * can no longer tap on that button.
 * http://stackoverflow.com/questions/28233745/ios-8-jquery-submit-button-focus-bug
 * @param  {Element} elemToFocus The element we want to give focus to.
 */
JS.safeFocus = function(elemToFocus){
    elemToFocus.focus();

    if (dojo.isIos && elemToFocus.tagName === 'INPUT' && elemToFocus.type === 'submit'){
        /* Blurring the element makes it tappable again, and doesn't seem to lose the
         * keyboards tab position.
         */
        elemToFocus.blur();
    }
};

// Add JS class to HTML tag as it's faster than putting it on the BODY tag when the DOM is ready.
// Using a self executing function to avoid poluting the global namespace.
(function(){
    var htmlElement = document.documentElement;
    // Get rid of the noJs class
    htmlElement.className = htmlElement.className.replace(/\bnoJs\b/,'');
    // Add a js class
    htmlElement.className += ' js';
})();

/**
 * On Load
 */
require(['dojo/ready','dojo/_base/fx','dojo/fx/easing','NodeList-traverse','dojox/NodeList/delegate','dojo/hash','dojox/html/entities'],function(ready, fx, easing){
    ready(function(){
        // Added as this doesn't always seem to get done when the page loads
        JS.objects.easing = easing;

        sainsburys = new JS.base.init();
    });
});

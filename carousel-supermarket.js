/**
 * CarouselScroller - function to display a long list of products/content within a limited width window.
 * Clicking on the left and right arrows moves the content sideways.
 * Content needs to be wrapped in two DIVs, the outer with class of 'carouselWrapper' and is referenced by its unique ID.
 * The inner DIV has a class of 'carouselInner'.
*/
JS.CarouselScroller = function(options) {

    /**
    * Stores configuration options
    * @type Object
    * @private
    */
    var _config = {
        leftPos: 0,
        wrapperID: "temp",
        contentTarget: "temp2",
        elementWidth: 215,
        marginGap: 13
    };

    /**
     * Stores the DIV that is the Wrapper.
     * @type Object
     * @private
     */
    var _wrapperElem;

    /**
     * Stores the content that is within the Wrapper.
     * @type Object
     * @private
     */
    var _contentElem;

    /**
     * Stores the anchor element for the 'Left Arrow' link.
     * @type Object
     * @private
     */
    var _anchorLeftElem;

    /**
     * Stores the anchor element for the 'Right Arrow' link.
     * @type Object
     * @private
     */
    var _anchorRightElem;

    /**
     * Stores the onclick event handler for the Left Arrow
     * @type Object
     * @private
     */
    var _scrollerHandlerLeft;

    /**
     * Stores the onclick event handler for the Right Arrow.
     * @type Object
     * @private
     */
    var _scrollerHandlerRight;

    /**
     * Stores the width of the visible carousel, to know how much to jump the carousel sideways.
     * @type Object
     * @private
     */
    var _jumpDistance;

    /**
     * Stores the width of the content.
     * @type Object
     * @private
     */
    var _contentWidth = 0;

    /**
     * Stores the first element within a carousel - destined to be the subject of focus
     * @type Object
     * @private
     */
    var _firstCarouselElem;

    /**
     * Stores all the focusable elements within a carousel
     * @type Object
     * @private
     */
    var _focusableCarouselElem;

    /**
     * Stores the flag for whether the wrapper DIV is on focus
     * @type Object
     * @private
     */
    var _wrapperFocusFlag = false;
    
    /**
     * Stores the horizontal offset of the carousel within its wrapper
     * @type Object
     * @private
     */
    var _contentOffset;

    /**
     * Stores the event handler for the changing of the browser width.
     * @type Object
     * @private
     */
    var _browserWidthHandler;

    /**
     * Stores the number of products that the user can see. Usually 3 or 4.
     * @type Object
     * @private
     */
    var _elementsInViewCount;

    /**
     * Stores the total number of products in the carousel.
     * @type Object
     * @private
     */
    var _nodesCount;

    /**
     * Stores the limit that the carousel can move to the left.
     * @type Object
     * @private
     */
    var _endStop;
    
    /**
     * Stores the HTML that holds the pagination.
     * @type Object
     * @private
     */
    var _paginationElem;

    /**
     * Stores the number of pagination 'pages'.
     * @type Object
     * @private
     */
    var _paginationPageCount;


    /**
     * Stores the event handler that waits for the CSS3 transition animation to finish.
     * @type Object
     * @private
     */
    var _animationHandler;


    var _init = function (){
        if (options) 
            {_config = JS.mixin(_config,options);}

        // Pick up the content wrapper
        _wrapperElem = dojo.byId(_config.wrapperID);

        // Locate the content of the carousel, usually a UL.
        _contentElem = dojo.byId(_config.contentTarget);
        
        if (_wrapperElem && _contentElem) {
    
            // Insert the left and right arrows into the carousel 
            _anchorRightElem = dojo.place('<a class="shifters shifterRight" title="" aria-label="" href="#"><span class="access">Scroll left</span></a>', _wrapperElem, "first");
            _anchorLeftElem = dojo.place('<a class="shifters shifterOff" title="" aria-label="" href="#"><span class="access">Scroll right</span></a>', _wrapperElem, "first");
            _paginationElem = dojo.place('<span class="paginationHolder">0 of 0</span>', _anchorLeftElem, "after");

            
            // Add the on click event for the left and right arrows
            _addClickEventLeft(_anchorLeftElem);
            _addClickEventRight(_anchorRightElem);
            
            
            // React to focus on the carousel wrapper, allow reactions to the Enter, ESC and arrow keys
            _enterKeyWaiter(_wrapperElem);


            // Product count
            _nodesCount = dojo.query('.gridItem',_contentElem);
            
            // If there are not enough products to scroll, then disable the right arrow
            if (_nodesCount.length < 4) {
                dojo.addClass(_anchorRightElem,'shifterOff');
            }

            
    
            // Set the content width dependent on number of elements/nodes
            _contentWidth = _nodesCount.length * _config.elementWidth;
            _contentElem.style.width = _contentWidth + 'px';
            //console.log("_contentWidth A=" + _contentWidth);//!!
            
            // Find the width of the visible carousel and listen out for browser width changes
            _elementsInViewCount = _jumpDistanceCalculation(_wrapperElem,_contentWidth);
            _browserWidthEvent(_wrapperElem,_contentWidth);
            
            // Pagination calculation and display
            _paginationPageCount = Math.ceil(_nodesCount.length / _elementsInViewCount);
            //console.log("_elementsInViewCount=" + _elementsInViewCount);//!!
            //console.log("_nodesCount.length=" + _nodesCount.length);//!!
            //console.log("_paginationPageCount=" + _paginationPageCount);//!!
            if (_paginationPageCount > 0) {
                _paginationElem = dojo.place('<span class="paginationHolder">1 of ' + _paginationPageCount +  '</span>', _paginationElem, "replace");
            }
        }
        else {
            console.log(_config.contentTarget + " (_contentElem) not found!!");
            console.log(_config.wrapperID + " (_wrapperElem) not found!!");
        }
        
    };

    
    /**
     * Listens out for if and when the user changes the width of the browser
     * thereby effecting the width of the visible carousel and the number of products
     * that one click will shift
     * @private
     */
    var _browserWidthEvent = function (_wrapperElem,_contentWidth){
        // If an event handler exists, then unbind it
        if (_browserWidthHandler)
            {dojo.disconnect(_browserWidthHandler);}
        
        // Get initial value
        //return _jumpDistanceCalculation(_wrapperElem,_contentWidth);

        // Bind the width change event
        _browserWidthHandler = dojo.connect(window,'onresize', function(e) {
            return _jumpDistanceCalculation(_wrapperElem,_contentWidth);
        });
    };


    /**
     * Reaction to changes to the width of the browser
     * How many products are in view?
     * Should an arrow be disabled?
     * How far should an arrow click move the carousel? 
     * @private
     */
    var _jumpDistanceCalculation = function (_wrapperElem,_contentWidth){
        // How far should an arrow click move the carousel? 
        _jumpDistance = dojo.style(_wrapperElem,'width') + _config.marginGap;
        
        // Calculate how many products are in view 
        _elementsInViewCount = parseInt(_jumpDistance / _config.elementWidth, 10);
        //console.log("_elementsInViewCount=" + _elementsInViewCount);//!!
        
        // With a change in the browser width, we need to record a new offset
        _contentOffset = _carouselOffset(_wrapperElem,_contentElem);
        
        // Calculate new endStop
        _endStop = -1 * (_contentWidth - _jumpDistance);
        
        //console.log("_contentWidth=" + _contentWidth);//!!
        //console.log("_jumpDistance=" + _jumpDistance);//!!

        //console.log("_config.leftPos=" + _config.leftPos);//!!
        //console.log("_endStop=" + _endStop);//!!

        // If there are not enough products to justify a carousel movement, disable the right arrow
        if (_config.leftPos < _endStop ){
            dojo.addClass(_anchorRightElem,'shifterOff');
        }
        else {
            dojo.removeClass(_anchorRightElem,'shifterOff');
        }

        // Update the pagination
        _paginationUpdate(_wrapperElem,_contentElem);

        return _elementsInViewCount;
    };

    
    /**
     * Adds the click event for the left arrow
     * @private
     */
    var _addClickEventLeft = function (scroller){
        // If an event handler exists, then unbind it
        if (_scrollerHandlerLeft)
            {dojo.disconnect(_scrollerHandlerLeft);}
        
        // Bind the onclick event to the Left Arrow 
        _scrollerHandlerLeft = dojo.connect(scroller,'onclick', function(e) {
            e.preventDefault();
            _carouselJumpRight(scroller);
        });
    };

    
    /**
     * Adds the click event for the right arrow
     * @private
     */
    var _addClickEventRight = function (scroller){
        // If an event handler exists, then unbind it
        if (_scrollerHandlerRight)
            {dojo.disconnect(_scrollerHandlerRight);}
        
        // Bind the onclick event to the Right arrow link
        _scrollerHandlerRight = dojo.connect(scroller,'onclick', function(e) {
            e.preventDefault();
            _carouselJumpLeft(scroller);
        });
    };

    
    /**
     * Cause the carousel to jump to the left
     * @private
     */
    var _carouselJumpLeft = function (scroller){
        if (dojo.attr(scroller,'class')=="shifters shifterRight") {
            
            // Get the latest offset position
            _contentOffset = _carouselOffset(_wrapperElem,_contentElem);

            //console.log("_jumpDistance=" + _jumpDistance);//!!
            
            //console.log("_contentOffset=" + _contentOffset);//!!
            //_config.leftPos = _config.leftPos - _jumpDistance;

            // Apply the jump distance
            _config.leftPos = _contentOffset - _jumpDistance;

            //console.log("_config.leftPos before=" + _config.leftPos);//!!

            // Make sure the new offset is a multiple of the product width.
            _config.leftPos = (Math.round(_config.leftPos / _config.elementWidth)) * _config.elementWidth;

            //console.log("_config.leftPos after =" + _config.leftPos);//!!

            // Shift the carousel
            _contentElem.style.marginLeft = _config.leftPos + 'px';

            // Remove the disabled look from the left arrow
            //if (_config.leftPos < 0) {
                dojo.removeClass(_anchorLeftElem,'shifterOff');
            //}
            
            // Update the pagination
            _afterTransitionPaginationUpdate(_wrapperElem,_contentElem);

        }

        // At extreme end of carousel, cause relevant arrow to be disabled
        _endStop = -1 * (_contentWidth - _jumpDistance);
        if (_config.leftPos < _endStop ){
            dojo.addClass(_anchorRightElem,'shifterOff');
        }
    };

    
    /**
     * Cause the carousel to jump to the right
     * @private
     */
    var _carouselJumpRight = function (scroller){
        if (dojo.attr(scroller,'class')=="shifters") {
            
            // Get the latest offset position
            _contentOffset = _carouselOffset(_wrapperElem,_contentElem);
            
            // Apply the jump distance
            //_config.leftPos = _config.leftPos + _jumpDistance;
            _config.leftPos = _contentOffset + _jumpDistance;

            //console.log("_config.leftPos before=" + _config.leftPos);//!!

            // Make sure the new offset is a multiple of the product width.
            _config.leftPos = (Math.round(_config.leftPos / _config.elementWidth)) * _config.elementWidth;

            //console.log("_config.leftPos after =" + _config.leftPos);//!!


            // Stop carousel going too far 
            if (_config.leftPos > 0) {_config.leftPos = 0;}

            // Shift the carousel
            _contentElem.style.marginLeft = _config.leftPos + 'px';

            // Remove the disabled look from the left arrow
            dojo.removeClass(_anchorRightElem,'shifterOff');

            // Update the pagination
            _afterTransitionPaginationUpdate(_wrapperElem,_contentElem);
        }
        
        // At extreme end of carousel, cause relevant arrow to be disabled
        if (_config.leftPos < 0) {
            dojo.removeClass(_anchorLeftElem,'shifterOff');
        }
        else if (_config.leftPos >= 0) {
            dojo.addClass(_anchorLeftElem,'shifterOff');
        }
    };

    /**
     * Upon jumping or moving - update the pagination 
     * @private
     */
    var _afterTransitionPaginationUpdate = function (_wrapperElem,_contentElem){
        // If an event handler exists, then unbind it
        if (_animationHandler)
            {dojo.disconnect(_animationHandler);}
    
        // Wait for animation/transistion to end before updating the pagination
        _animationHandler = dojo.connect(_contentElem,"transitionend", function(){
            _paginationUpdate(_wrapperElem,_contentElem);
        });
    };

    /**
     * Update the pagination 
     * @private
     */
    var _paginationUpdate = function (_wrapperElem,_contentElem){
        //console.log("Transistion end");//!!
        _contentOffset = _carouselOffset(_wrapperElem,_contentElem);
        //console.log("_contentOffset=" + _contentOffset);//!!

        if (!isNaN(_contentOffset)) {
            // Update the pagination
            //var pagPage = parseInt((_contentOffset + _jumpDistance) / _jumpDistance,10);
            var pagPage = Math.round(-1*(_contentOffset - _jumpDistance) / _jumpDistance);
            //console.log("pagPage=" + pagPage);//!!
            _paginationPageCount = Math.ceil(_nodesCount.length / _elementsInViewCount);
            if (_paginationPageCount < pagPage) {_paginationPageCount = pagPage;}
            //console.log("_paginationPageCount=" + _paginationPageCount);//!!
            //console.log("_paginationElem=" + _paginationElem);//!!
            _paginationElem = dojo.place('<span class="paginationHolder">' + pagPage + ' of ' + _paginationPageCount +  '</span>', _paginationElem , "replace");
            
            //console.log("_jumpDistance=" + _jumpDistance);//!!
            //console.log("_contentOffset=" + _contentOffset);//!!
        }
        else {
            console.log("_contentOffset is not valid");//!!
        }
    };


    /**
     * Reacts to the Enter key being pressed when the carousel wrapper is on focus
     * Thereafter allows reaction to the Escape and Left and Right Arrow keys
     * @private
     */
    var _enterKeyWaiter = function (targetWrapper){

        // With the focus on the wrapper, allow the arrow keys to move the relevant carousel
        dojo.connect( targetWrapper ,'onfocus',function(event){
            _wrapperFocusFlag = true;
            dojo.connect( targetWrapper ,'onkeypress',function(e){
                if (e.keyCode === 13 && _wrapperFocusFlag) { // Enter key
                    // Send focus to the first text input element within the relevant carousel
                    _firstCarouselElem = dojo.query('li input[type="text"]',targetWrapper);
                    _firstCarouselElem[0].focus();
                }
                if (e.keyCode==27) { // Escape key - focus goes to surrounding wrapper DIV
                    targetWrapper.focus();
                }
                if (e.keyCode==37 && _wrapperFocusFlag) { // Left key - cause carousel to shift
                    _carouselJumpRight(_anchorLeftElem);
                }
                if (e.keyCode==39 && _wrapperFocusFlag) { // Right key - cause carousel to shift
                    _carouselJumpLeft(_anchorRightElem);
                }
            });
        });

        // With the focus having left the wrapper, switch off the focus flag, disabling the arrow keys from moving any carousel
        dojo.connect( targetWrapper ,'onblur',function(event){
            _wrapperFocusFlag = false;
        });

        // Find all the focusable elements within a carousel
        _focusableCarouselElem = dojo.query('li input[type="text"], li a',targetWrapper);

        // React to the user putting the focus on an element within the carousel
        _focusableCarouselElem.connect('onfocus', function(e) {
            _wrapperFocusFlag = false;

            // Now that an item within the carousel has been made the focus, it is possible that the carousel got shifted, therefore need to record new offset
            _contentOffset = _carouselOffset(_wrapperElem,_contentElem);

            // Allow user to escape the carousel
            dojo.connect( targetWrapper ,'onkeypress',function(ee){
                if (ee.keyCode==27) { // Escape key - focus goes to surrounding wrapper DIV
                    targetWrapper.focus();
                }
            });
        });
    };

    /**
     * It is possible that the carousel got shifted, either by use of the arrow keys or by tabbing through the elements.
     * Therefore need to record new offset
     * @private
     */
    var _carouselOffset = function (_wrapperElem,_contentElem){
        //console.log("_wrapperElem=" + _wrapperElem);//!!
        //console.log("_contentElem=" + _contentElem);//!!
        var contentOffset = _contentElem.getBoundingClientRect();
        var wrapperOffset = _wrapperElem.getBoundingClientRect();
        //var leftOffset = wrapperOffset.left - contentOffset.left;
        var leftOffset = contentOffset.left - wrapperOffset.left;
        //console.log("contentOffset.left=" + contentOffset.left);//!!
        //console.log("wrapperOffset.left=" + wrapperOffset.left);//!!
        //console.log("leftOffset=" + leftOffset);//!!
        return leftOffset;
    };

    _init();
};

/**
 * CarouselScroller - function to display a long list of products/content within a limited width window.
 * Clicking on the left and right arrows moves the content sideways.
 * Content needs to be wrapped in two DIVs, the outer with class of 'carouselWrapper' and is referenced by its unique ID.
 * The inner DIV has a class of 'carouselInner'.
*/
MM.CarouselScroller = function(options) {

	/**
	* Stores configuration options
	* @type Object
	* @private
	*/
	var _config = {
		leftPos: 0,
		wrapperID: "temp",
		contentTarget: "temp2",
		elementWidth: 237,
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
	 * @type Number
	 * @private
	 */
	var _jumpDistance;

	/**
	 * Stores the width of the content.
	 * @type Number
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
	 * @type Boolean
	 * @private
	 */
	var _wrapperFocusFlag = false;
	
	/**
	 * Stores the horizontal offset of the carousel within its wrapper
	 * @type Number
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
	 * @type Number
	 * @private
	 */
	var _elementsInViewCount;

	/**
	 * Stores the products in the carousel so that the total number of can be determined.
	 * @type Object
	 * @private
	 */
	var _nodesCount;

	/**
	 * Stores the limit that the carousel can move to the left.
	 * @type Number
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
	 * @type Number
	 * @private
	 */
	var _paginationPageCount;
	
	/**
	 * Stores the current position within the pagination 'pages'.
	 * @type Number
	 * @private
	 */
	var _pagPage;


	/**
	 * Stores the event handler that waits for the CSS3 transition animation to finish.
	 * @type Object
	 * @private
	 */
	var _animationHandler;
	
	/**
	 * An array to stores the left side coordinate for each item.
	 * @type Array
	 * @private
	 */
	var _leftArray = [];
	
	/**
	 * Stores what is the number position of the LI currently sitting in view on the left
	 * @type Number
	 * @private
	 */
	var _currentItemInViewOnLeft = 0;
	
	/**
	 * transition-end name which is dependant on the browser
	 * @type String
	 * @private
	 */
	var _transitionEnd
	
	/**
	 * _moving - a flag that stops mouse clicks on the arrows whilst the carousel is still moving, which stops them having a confusing effect 
	 * @type Boolean
	 * @private
	 */
	var _moving = false;
	
	
	
	/**
	* Figures out which transition-end name to use which is dependant on the browser
	* Credit to https://gist.github.com/tborychowski/9131555
	* @private
	*/
	var _whichTransitionEvent = function (){
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
		  'transition':'transitionend',
		  'OTransition':'oTransitionEnd',
		  'MozTransition':'transitionend',
		  'WebkitTransition':'webkitTransitionEnd',
		  'MsTransition': 'msTransitionEnd'
		}
	
		for(t in transitions){
			if( el.style[t] !== undefined ){
				return transitions[t];
			}
		}
	}

	
	/**
	* Initialises the whole carousel function
	* @private
	*/
	var _init = function (){
		
		// This has been browser specific, needed for reacting to when animations finish
		_transitionEnd = _whichTransitionEvent();
		
		if (options) 
			{_config = MM.mixin(_config,options);}

		// Pick up the content wrapper
		_wrapperElem = dojo.byId(_config.wrapperID);

		// Locate the content of the carousel, usually a UL.
		_contentElem = dojo.byId(_config.contentTarget);
		
		if (_wrapperElem && _contentElem) {
	
			// Insert the left and right arrows into the carousel 
			_anchorRightElem = dojo.place('<a class="shifters shifterRight" title="Shift right" aria-label="Shift right" id="anchorRight" href="#right"><span class="access">Scroll left</span></a>', _wrapperElem, "first");			
			_anchorLeftElem = dojo.place('<a class="shifters shifterOff" title="Shift left" aria-label="Shift left" href="#left"><span class="access">Scroll right</span></a>', _wrapperElem, "first");
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

			// Set the content width dependent on number of elements/nodes, so that the list does not wrap 
			_contentWidth = _nodesCount.length * _config.elementWidth;
			_contentElem.style.width = _contentWidth + 'px';
			
			// Collect the left offset of each LI to its parent UL
			for (var n = 0; n < _nodesCount.length; n++){
				_leftArray[n] = _nodesCount[n].offsetLeft;
			}
			
			
			// Find the width of the visible carousel and listen out for browser width changes
			_elementsInViewCount = _jumpDistanceCalculation(_wrapperElem,_contentWidth);
			_browserWidthEvent(_wrapperElem,_contentWidth);
			
			// Pagination calculation and display
			_paginationPageCount = Math.ceil(_nodesCount.length / _elementsInViewCount);

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
		
		// With a change in the browser width, we need to record a new offset
		_contentOffset = _carouselOffset(_wrapperElem,_contentElem);
		
		// Calculate new endStop
		_endStop = -1 * (_contentWidth - _jumpDistance);

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
			if (_moving) {
				return false
			}
			else {
				_carouselJumpRight(scroller);
			}
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
			if (_moving) {
				return false
			}
			else {
				_carouselJumpLeft(scroller);
			}
		});
	};
	
	/**
	 * Find out what is the number position of the LI currently sitting in view on the left 
	 * @private
	 */
	var _whatsInView = function(){
		// Find out what is the number position of the LI currently sitting in view on the left
		_currentItemInViewOnLeft = Math.abs( Math.round(_config.leftPos / _config.elementWidth));
	}
	
	
	/**
	 * Cause the carousel to jump 
	 * @private
	 */
	var _carouselJump = function(scroller,leftDirection){
		// Get the latest offset position
		_contentOffset = _carouselOffset(_wrapperElem,_contentElem);
		
		// Apply the jump distance
		if (leftDirection) {
			_config.leftPos = _contentOffset - _jumpDistance;}
		else {
			_config.leftPos = _contentOffset + _jumpDistance;
		}

		_whatsInView();
		
		// Get the relevant left position of this LI and apply a suitable offset to the UL
		_config.leftPos = -1 * _leftArray[_currentItemInViewOnLeft];

		// Stop carousel going too far 
		if (_config.leftPos > 0) {_config.leftPos = 0;}

		// Shift the carousel
		_contentElem.style.marginLeft = _config.leftPos + 'px';
		_moving = true;
		
		// Only reset _moving flag once the animation has finished
		_contentElem.addEventListener(_transitionEnd, function(e){
			_moving = false;
		},false);
	};
	
	/**
	 * Cause the carousel to jump to the left
	 * @private
	 */
	var _carouselJumpLeft = function (scroller){
		if (dojo.attr(scroller,'class')=="shifters shifterRight") {
			_carouselJump(scroller,true);
			
			// Update the pagination
			_afterTransitionPaginationUpdate(_wrapperElem,_contentElem);

		}
	};

	
	/**
	 * Cause the carousel to jump to the right
	 * @private
	 */
	var _carouselJumpRight = function (scroller){
		if (dojo.attr(scroller,'class')=="shifters") {
			_carouselJump(scroller,false);

			// Update the pagination
			_afterTransitionPaginationUpdate(_wrapperElem,_contentElem);
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
		_animationHandler = dojo.connect(_contentElem,_transitionEnd, function(){
			_paginationUpdate(_wrapperElem,_contentElem);
		});
	};


	/**
	 * Update the pagination 
	 * @private
	 */
	var _paginationUpdate = function (_wrapperElem,_contentElem){
		_contentOffset = _carouselOffset(_wrapperElem,_contentElem);

		if (!isNaN(_contentOffset)) {
			// Update the pagination
			_pagPage = Math.round(-1*(_contentOffset - _jumpDistance) / _jumpDistance);

			_paginationPageCount = Math.ceil(_nodesCount.length / _elementsInViewCount);
			if (_paginationPageCount < _pagPage) {_paginationPageCount = _pagPage;}

			_paginationElem = dojo.place('<span class="paginationHolder">' + _pagPage + ' of ' + _paginationPageCount +  '</span>', _paginationElem , "replace");
			
			 // At extreme end of carousel, cause relevant arrow to be disabled
			if (_pagPage > 1) {
				dojo.removeClass(_anchorLeftElem,'shifterOff');
			}
			else if (_pagPage == 1) {
				dojo.addClass(_anchorLeftElem,'shifterOff');
			}
			
			if (_pagPage == _paginationPageCount) {
				dojo.addClass(_anchorRightElem,'shifterOff');
			}
			else  {
				dojo.removeClass(_anchorRightElem,'shifterOff');
			}
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
			
			var activeElem = document.activeElement;
			//console.log("activeElem href=" + activeElem);//!!
			activeElem = activeElem.parentNode;
			
			var focusClass = activeElem.className;
			
			if (focusClass == "contractLink") {
			
				var activeParent = _findAncestor(activeElem,"gridItem");
			
				// Now that an item within the carousel has been made the focus, it is possible that the carousel got shifted, therefore need to record new offset
				_contentOffset = _carouselOffset(_wrapperElem,_contentElem);
				

				// What position does the element with focus have within the UL/LI?
				_currentItemInViewOnLeft = Array.prototype.indexOf.call(_contentElem.children, activeParent);
				
				
				// Get the relevant left position of this LI and apply a suitable offset to the UL
				_config.leftPos = -1 * _leftArray[_currentItemInViewOnLeft];
				
				// Shift the carousel
				_contentElem.style.marginLeft = _config.leftPos + 'px';
				
				_afterTransitionPaginationUpdate(_wrapperElem,_contentElem);
			}
			
			// Allow user to escape the carousel
			dojo.connect( targetWrapper ,'onkeypress',function(ee){
				if (ee.keyCode==27) { // Escape key - focus goes to surrounding wrapper DIV
					targetWrapper.focus();
				}
			});
		});
	};
	
	var _findAncestor = function  (el, cls) {
		while ((el = el.parentElement) && !el.classList.contains(cls));
		return el;
	}

	/**
	 * It is possible that the carousel got shifted, either by use of the arrow keys or by tabbing through the elements.
	 * Therefore need to record new offset
	 * @private
	 */
	var _carouselOffset = function (_wrapperElem,_contentElem){
		var contentOffset = _contentElem.getBoundingClientRect();
		var contentOffsetLeft = Math.round(contentOffset.left);
		var wrapperOffset = _wrapperElem.getBoundingClientRect();
		var wrapperOffsetLeft = Math.round(wrapperOffset.left);
		var leftOffset = contentOffsetLeft - wrapperOffsetLeft;
		return leftOffset;
	};

	_init();
};

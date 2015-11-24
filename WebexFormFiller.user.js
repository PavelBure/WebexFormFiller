// ==UserScript==
// @name          Webex Form Filler
// @version       1
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_listValues
// @description   A script to automatically fill in the Webex form since Cisco is apparently incapable of remembering what I types last time
// @include       http://*.webex.com*
// @include       https://*.webex.com*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js

// ==/UserScript==

$( document ).ready(function() {
 
    // Below resets the values
    var reset ; 
    // uncomment the line immediately below to reset values
    // reset = true;
    if(reset) {
        GM_deleteValue('webexYourName');
        GM_deleteValue('webexEmailAddress');
        GM_deleteValue('webexAutoClick');
    }    
    
    // Click delay and message values
    var autoClickDelay = 3000;
    var autoClickDisplay = (Math.floor(autoClickDelay / 100) / 10 ) ; 
    var wffValues = {};
    wffValues.message = [] ;
    wffValues.message[0] = '<b>Webex Form Filler</b><br /><br />Enter your name  and email address - Webex Form Filler will remember what is entered in these fields<br /><br />' ;
    wffValues.message[1] = 'Check this box if you want Webex Form Filler to Auto-Click the "Join" Button (' + autoClickDisplay + ' second delay)<br /><br />';
    wffValues.message[2] = '<input id="wff_autoclick" type="checkbox"  /> Auto-Join Meetings';
    

    $WFF = $('<div id="WFF"></div>')
        .css({
            'width'  : $('#mc-input-screenname').width() + 20, 
            'height' : '200px' ,
            'background-color' : '#f2f2f2' ,
            'font-family' : 'arial' ,
            'font-size' : '8pt' ,
            'line-height' : '15px'
        })
        .html( wffValues.message[0] + wffValues.message[1] + wffValues.message[2])
        .appendTo($('#emailUI > .col-sm-9'));
    
    
    // Check if "Your Name" value exists, if so set the field in the browser
    var yourName = GM_getValue('webexYourName');
    $( '#mc-input-screenname' ).val(yourName);
    
    // Check if "Email Address" value exists, if so set the field in the browser
    var emailAddress = GM_getValue('webexEmailAddress');
    $( '#mc-input-email' ).val(emailAddress);
    
    
    // Enabled the join button    
    $( '#mc-btn-prejoinform' ).removeAttr('disabled').removeClass('disabled');
    
    // If user elects to do so, auto-click the button
    var autoClick = GM_getValue('webexAutoClick');
    if(autoClick) {  $('#wff_autoclick').prop('checked', true); } 
    $( '#mc-btn-prejoinform' ).on('click', function(){ setGmValues(); });
    if(autoClick) { 
        setTimeout(function() { 
            if( $('#wff_autoclick').is(':checked') ) {
                $( '#mc-btn-prejoinform' ).click(); 
            }
        }, autoClickDelay); }
});
    

function setGmValues() {
    // Set the values to remember based off of what's in the form when submmitted
    GM_setValue('webexYourName' , $( '#mc-input-screenname' ).val());
    GM_setValue('webexEmailAddress' , $( '#mc-input-email' ).val());
    GM_setValue('webexAutoClick' , $('#wff_autoclick').is(':checked')  ) ;

}
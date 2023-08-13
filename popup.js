document.addEventListener( 'DOMContentLoaded', async function () {
  'use strict';

  var $options = [].slice.call( document.querySelectorAll( '.option' ) );

  function onUpdate() {
      var state = { action: 'set' };

      $options.forEach( function ( $el ) {
          state[ $el.id ] = $el.checked !== undefined
            ? $el.checked
            : $el.value;
      } );

      chrome.runtime.sendMessage( state );
  }

  async function getAccessKey() {
      const result = await chrome.storage.local.get( [ 'accessKey' ] );
      return result.accessKey || '';
  }

  // Handling for access key input
  var accessKeyInput = document.getElementById( 'accessKey' );
  accessKeyInput.addEventListener( 'input', function () {
      var accessKey = accessKeyInput.value;
      chrome.storage.local.set( { accessKey: accessKeyInput.value } );
      onUpdate(); // Trigger the update function when access key changes
  } );

  accessKeyInput.value = await getAccessKey();
  
  chrome.runtime.sendMessage( { action: 'get' }, function ( response ) {
      $options.forEach( async function ( $el ) {
          var value = response[ $el.id ];

          if ( typeof value === 'boolean' ) {
              $el.checked = value;
          } else {
              if ( $el.id === 'accessKey' ) {
                  value = await getAccessKey();
              } else {
                  value = response[ $el.id ];
              }
              $el.value = value;
          }

          $el.addEventListener( 'change', onUpdate, false );
      } );

      document.body.className = '';
  } );
} );

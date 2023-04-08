/**
 * Copyright 2015, 2016 Ori Livneh <ori@wikimedia.org>
 * Copyright 2022, 2023 Universal Omega <universalomega@wikiforge.net>
 *
 * Licensed under the Apache License, Version 2.0 ( the "License" );
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var debug = {

    // Current state: if true, inject header; if not, do nothing.
    enabled: false,

    // To which backend shall the request go to?
    backend: 'mw1.wikiforge.net',

    // Toggle state.
    toggle: function ( state ) {
        debug.enabled = state;
        debug.updateIcon();
        if ( debug.enabled ) {
            chrome.alarms.create( 'autoOff', { delayInMinutes: 15 } );
        }
    },

    // Dim the toolbar icon when inactive.
    updateIcon: function () {
        if ( debug.enabled ) {
            chrome.action.setBadgeBackgroundColor( { color: '#447ff5' } );
            chrome.action.setBadgeText( { text: 'ON' } );
        } else {
            chrome.action.setBadgeText( { text: '' } );
        }
    },

    // Automatic shutoff.
    onAlarm: function ( alarm ) {
        if ( alarm.name === 'autoOff' ) {
            debug.toggle( false );
        }
    },

    onMessage: function ( request, sender, sendResponse ) {
        if ( request.action === 'set' ) {
            debug.toggle( request.enabled );
            debug.backend = request.backend;
        } else if ( request.action === 'get' ) {
            sendResponse( {
                action: 'state',
                enabled: debug.enabled,
                backend: debug.backend,
            } );
        }

        let requestHeaders = { 
            header: 'X-WikiForge-Debug', 
            operation: debug.enabled ?
                chrome.declarativeNetRequest.HeaderOperation.SET :
                chrome.declarativeNetRequest.HeaderOperation.REMOVE,
            value: debug.backend
        };

        if ( !debug.enabled ) {
            delete requestHeaders['value'];
        }

        chrome.declarativeNetRequest.updateDynamicRules( {
            addRules: [
                {
                    id: 1,
                    priority: 1,
                    action: {
                        type: 'modifyHeaders',
                        requestHeaders: [ requestHeaders ],
                    },
                    condition: {
                        regexFilter: '|http*',
                        resourceTypes: Object.values( chrome.declarativeNetRequest.ResourceType )
                    },
                },
            ],

            removeRuleIds: [1]
        } );
    }
};

chrome.runtime.onMessage.addListener( debug.onMessage );

chrome.alarms.onAlarm.addListener( debug.onAlarm );

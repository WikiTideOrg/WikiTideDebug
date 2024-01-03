/**
 * Copyright 2015, 2016 Ori Livneh <ori@wikimedia.org>
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
(() => {
	'use strict';

	// Equivalent to `mw.config.get( 'wgRequestId' )`. We have to scrape the value
	// from the script source because Chrome extension content scripts do not share
	// an execution environment with other JavaScript code.
	const getRequestId = () => {
		const nodes = document.querySelectorAll('script');
		let match;

		for (const node of nodes) {
			match = /"wgRequestId":\s*"([^"]+)"/.exec(node.innerText);
			if (match) {
				return match[1];
			}
		}
	};

	// Insert an item into the footer menu at the bottom of the page.
	const addFooterPlace = (caption, url) => {
		const a = document.createElement('a');
		a.className = 'noprint';
		a.href = url;
		a.innerText = caption;

		const li = document.createElement('li');
		li.id = `footer-places-${caption.toLowerCase().replace(/\W/g, '-')}`;
		li.appendChild(a);

		const ul = document.querySelector('#footer-places, .footer-places');
		if (ul) {
			ul.appendChild(li);
		}
	};

	chrome.runtime.sendMessage({ action: 'get' }, (response) => {
		let reqId;

		if (!response.enabled || !(response.log || response.profile)) {
			return;
		}

		reqId = getRequestId();
		if (!reqId) {
			return;
		}

		// Additional logic can be added here based on your requirements.

	});

})();

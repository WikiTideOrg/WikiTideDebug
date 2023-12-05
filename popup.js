document.addEventListener('DOMContentLoaded', async () => {
	'use strict';

	const $options = Array.from(document.querySelectorAll('.option'));

	function onUpdate() {
		const state = { action: 'set' };

		$options.forEach(($el) => {
			state[$el.id] = $el.checked !== undefined ? $el.checked : $el.value;
		});

		chrome.runtime.sendMessage(state);
	}

	async function getAccessKey() {
		const { accessKey } = await chrome.storage.local.get(['accessKey']);
		return accessKey || '';
	}

	// Handling for access key input
	const accessKeyInput = document.getElementById('accessKey');
	accessKeyInput.addEventListener('input', () => {
		chrome.storage.local.set({ accessKey: accessKeyInput.value });
		onUpdate(); // Trigger the update function when the access key changes
	});

	accessKeyInput.value = await getAccessKey();

	chrome.runtime.sendMessage({ action: 'get' }, (response) => {
		$options.forEach(async ($el) => {
			let value = response[$el.id];

			if (typeof value === 'boolean') {
				$el.checked = value;
			} else {
				if ($el.id === 'accessKey') {
					value = await getAccessKey();
				}

				$el.value = value;
			}

			$el.addEventListener('change', onUpdate, false);
		});

		document.body.className = '';
	});
});

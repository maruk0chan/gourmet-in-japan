<script lang="ts">
	import ResultTable from '../ResultTable.svelte'
	import areaList from '../json/small_area.json'
	import AutoComplete from 'simple-svelte-autocomplete'

	let selectedAreaObject
	const areaParams = () => selectedAreaObject

	function makeQuery() {
		console.log(selectedAreaObject)
	}
</script>

<h1>Welcome to Gourmet in Japan</h1>
<p>Select some conditions to filter out the restaurants you are looking for 😉</p>
<label for="area">Choose areas (<b><u>ONLY THE FIRST 5</u></b> selections will be applied):</label>
<AutoComplete
	multiple="true"
	delay="500"
	items={areaList}
	bind:selectedItem={selectedAreaObject}
	orderableSelection="true"
	labelFieldName="ja"
	valueFieldName="id"
	labelFunction={(area) => area.ja + ' ' + area.en}
	keywordsFunction={(area) => area.ja + ' ' + area.en + ' ' + area.hg + ' ' + area.kk}
/>
<button on:click={makeQuery}>Search</button>
<ResultTable />

<style>
</style>

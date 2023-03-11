<script lang="ts">
	import ResultTable from '../ResultTable.svelte'
	import areaList from '../json/small_area.json'
	import queryMap from '../json/query_map.json'
	import sampleList from '../json/sample_data.json'
	import AutoComplete from 'simple-svelte-autocomplete'
	import axios from 'axios'

	let gourmetData
	let selectedAreaObject
	let selectedAreaId
	let selectedBudgetId
	console.log(
		sampleList.results.shop.map(({ open, close }) => {
			return { open, close }
		})
	)
	async function makeQuery() {
		const maxSelections = 5
		const smallAreaParams = () => {
			const copy = [...selectedAreaId]
			return copy.splice(0, maxSelections).toString()
		}
		const baseUrl = 'https://webservice.recruit.co.jp/hotpepper'
		const keyParam = 'bfa93fda871977e1'
		const formatParam = 'json'
		const budgetParam = selectedBudgetId
		try {
			const response = await axios.get(`
			${baseUrl}/gourmet/v1/?
			key=${keyParam}&
			format=${formatParam}&
			small_area=${smallAreaParams()}&
			budget=${budgetParam}&

			`)

			const {
				results: { shop },
			} = sampleList

			const shopHours = shop.map(({ open, close }) => ({ open, close }))

			gourmetData = response.data
			console.log(gourmetData.results)
		} catch (error) {
			console.error(error)
		}
	}

	const budgetOptions = queryMap.budget.options
	const countOptions = queryMap.count.options

	function handleBudgetSelect(event) {
		console.log(event.target.value)
		selectedBudgetId = event.target.value
	}

	const availableFilters = gourmetData
</script>

<h1>Welcome to Gourmet in Japan</h1>
<p>Select some conditions to filter out the restaurants you are looking for 😉</p>
<button on:click={makeQuery}>Search</button>
<div>
	<label for="area">Choose areas (<b><u>ONLY the FIRST 5</u></b> selections will be applied and you can also <b><u>DRAG</u></b> to change the orders):</label>
	<AutoComplete
		multiple="true"
		delay="500"
		orderableSelection="true"
		items={areaList}
		bind:selectedItem={selectedAreaObject}
		bind:value={selectedAreaId}
		labelFieldName="ja"
		valueFieldName="id"
		labelFunction={(area) => area.ja + ' ' + area.en}
		keywordsFunction={(area) => area.ja + ' ' + area.en + ' ' + area.hg + ' ' + area.kk}
	/>
</div>
<div>
	<label for="budget">Budget</label>
	<select id="budget-select" on:change={handleBudgetSelect}>
		{#each budgetOptions as budgetOption}
			<option value={budgetOption.code}>{budgetOption.name}</option>
		{/each}
	</select>
</div>
<div>
	<label for="count">Results per page</label>
	<select id="count-select" on:change={handleCountSelect}>
		{#each countOptions as countOption}
			<option value={countOption}>{countOption}</option>
		{/each}
	</select>
</div>

{#if gourmetData}
	<div>Total no. of results: {gourmetData.results.results_available}</div>
	<div>No. of results shown: {gourmetData.results.results_returned}</div>
{:else}
	<div>Total no. of results: 0</div>
	<div>No. of results shown: 0</div>
{/if}

<table>
	<thead>
		<tr>
			<th>name</th>
			<th>station_name</th>
			<th>budget</th>
			<th>genre</th>
			<th>url</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th>name</th>
			<th>station_name</th>
			<th>budget</th>
			<th>genre</th>
			<th>url</th>
		</tr>
	</tbody>
</table>
<!-- {#if data}
    {#each data as item}
      <div>{item.name}</div>
    {/each}
  {:else}
    <p>Loading data...</p>
  {/if} -->

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
	let selectedBudgetObject
	let selectedBudgetId
	let selectedCount
	let shopList
	const columns = ['station_name', 'genre', 'budget', 'open', 'close', 'capacity']

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
			count=${selectedCount}npm 
			`)

			gourmetData = response.data
			console.log(gourmetData.results)
			shopList = gourmetData.results.shop.map(({ station_name, ...rest }) => {
				const { genre, budget, open, close, capacity } = rest
				return { station_name, genre, budget, open, close, capacity }
			})
			console.log(copy)
		} catch (error) {
			console.error(error)
		}
	}

	const budgetOptions = queryMap.budget.options
	const countOptions = queryMap.count.options

	function handleBudgetSelect(event) {
		selectedBudgetId = event.target.value
	}
	function handleCountSelect(event) {
		selectedCount = event.target.value
	}

	const availableFilters = gourmetData
</script>

<div class="search-container">
	<h1 class="heading">Welcome to Gourmet in Japan</h1>
	<p>This is an web application to help you find the restaurants that meet your search condition. 😉</p>
	<p>Select some conditions to filter out the restaurants you are looking for</p>
	<div>For multiple selections, <b><u>ONLY the FIRST 5</u></b> selections will be applied and you can also <b><u>DRAG</u></b> to change the orders</div>
	<div class="filter-container">
		<div class="filter">
			<label for="area">Choose areas</label>
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
		<div class="filter">
			<label for="budget">Budget (¥)</label>
			<AutoComplete multiple="true" readonly={true} items={budgetOptions} bind:selectedItem={selectedBudgetObject} bind:value={selectedBudgetId} labelFieldName="name" valueFieldName="code" />
		</div>
		<div class="filter">
			<label for="count">Results per page</label>
			<select id="count-select" on:change={handleCountSelect}>
				{#each countOptions as countOption}
					<option value={countOption}>{countOption}</option>
				{/each}
			</select>
		</div>
		<div class="submit-panel">
			<button class="search-button" on:click={makeQuery}>Search</button>
		</div>
	</div>
</div>
<div class="result-container">
	<div class="result-stat">
		{#if gourmetData}
			<div>Total no. of results: {gourmetData.results.results_available}</div>
			<div>No. of results shown below: {gourmetData.results.results_returned}</div>
		{:else}
			<div>Total no. of results: 0</div>
			<div>No. of results shown below: 0</div>
		{/if}
	</div>
	<table>
		<thead>
			<tr>
				{#each columns as column}
					<th>{column}</th>
				{/each}
			</tr>
		</thead>
		{#if shopList}
			<tbody>
				{#each shopList as shop}
					<tr>
						{#each columns as column}
							{#if ['genre', 'budget'].includes(column)}
								<th>{shop[column].name}</th>
							{:else}
								<th>{shop[column]}</th>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		{/if}
	</table>
</div>

<style lang="sass">
	.heading
		text-align: center
	.search-container
		max-width: 1000px
		padding: 0 50px
		margin: 0 auto
	.filter-container
		margin-top: 50px
		.filter
			display: flex
			flex-direction: column
			margin: 0 auto
			max-width: 600px
		.filter + .filter 
			margin-top: 20px
	.submit-panel
		display: flex
		justify-content: center
	.result-stat
		margin-top: 20px
	.search-button
		margin-top: 20px
	.result-container
		padding: 0 50px
		max-width: initial
</style>

<script lang="ts">
	export const prerender = true

	import ResultTable from '../ResultTable.svelte'
	import areaList from '../json/small_area.json'
	import queryMap from '../json/query_map.json'
	import { onMount } from 'svelte'
	import AutoComplete from 'simple-svelte-autocomplete'
	import axios from 'axios'

	let gourmetData
	let selectedAreaObject = [
		{
			id: 'X005',
			ja: '銀座',
			en: 'Ginza',
			rm: 'Ginza',
			hg: 'ぎんざ',
			kk: 'ギンザ',
		},
		{
			id: 'X025',
			ja: '築地',
			en: 'Tsukiji',
			rm: 'Tsukiji',
			hg: 'つきじ',
			kk: 'ツキジ',
		},
	]
	let selectedAreaId = 'testId'
	let selectedBudgetObject = [
		{
			code: 'B004',
			name: '5001～7000円',
		},
		{
			code: 'B005',
			name: '7001～10000円',
		},
	]
	let selectedBudgetId = 'testId'
	let selectedCount = '20'
	let selectedCapacity = '50'
	let shopList
	const columns = ['name_kana', 'station_name', 'genre', 'budget', 'open', 'close', 'capacity']
	const jpAreaList = areaList.map((area) => area.ja)
	const enAreaList = areaList.map((area) => area.en)
	const handleCapacityInput = (e) => {
		selectedCapacity = e.target.value
	}

	const budgetOptions = queryMap.budget.options
	const countOptions = queryMap.count.options

	const availableFilters = gourmetData

	const genreMap = {
		居酒屋: 'Izakaya (Japanese style pub)',
		'ダイニングバー・バル': 'Dining Bar / Bar',
		創作料理: 'Creative Cuisine',
		和食: 'Japanese Cuisine',
		洋食: 'Western Cuisine',
		'イタリアン・フレンチ': 'Italian/French',
		中華: 'Chinese Cuisine',
		'焼肉・ホルモン': 'Yakiniku/Hormone',
		韓国料理: 'Korean Cuisine',
		'アジア・エスニック料理': 'Asian/Ethnic Cuisine',
		各国料理: 'International Cuisine',
		'カラオケ・パーティ': 'Karaoke/Party',
		'バー・カクテル': 'Bar/Cocktails',
		ラーメン: 'Ramen',
		'お好み焼き・もんじゃ': 'Okonomiyaki/Monja',
		'カフェ・スイーツ': 'Cafes/Sweets',
		その他グルメ: 'Other gourmet',
	}

	const translateMap = {
		ビルに準ずる: 'Same as building',
		年末年始: 'Year-end and New Year holidays',
		'※年中無休': 'Open all year round',
		年中無休: 'Open all year round',
		無休: 'None',
		不定休日あり: 'Not regular',
		不定休: 'Not regular',
		定休日なし: 'No regular holidays',
		'土、日、祝日': 'Sat, Sun, P.H.',
		無: 'None',
		なし: 'None',
		祝前日: 'the day before P.H.',
		祝日: 'P.H.',
		祝: 'P.H.',
		月: 'Mon',
		火: 'Tue',
		水: 'Wed',
		木: 'Thu',
		金: 'Fri',
		土: 'Sat',
		日: 'Sun',
		翌: 'Next',
		料理: 'Meal',
		ドリンク: 'Drink',
	}

	async function makeQuery() {
		console.log(selectedAreaObject, selectedBudgetObject)
		const maxSelections = 5
		const smallAreaParams = () => {
			const copy = [...selectedAreaId]
			return copy.splice(0, maxSelections).toString()
		}
		const baseUrl = 'https://webservice.recruit.co.jp/hotpepper'
		const keyParam = 'bfa93fda871977e1'
		const formatParam = 'json'
		const budgetParam = selectedBudgetId
		const capacityParam = selectedCapacity
		try {
			const response = await axios.get(`
			${baseUrl}/gourmet/v1/?
			key=${keyParam}&
			format=${formatParam}&
			small_area=${smallAreaParams()}&
			budget=${budgetParam}&
			count=${selectedCount}&
			party_capacity=${selectedCapacity}&
			`)

			gourmetData = response.data
			console.log(gourmetData.results)
			shopList = gourmetData.results.shop.map(({ ...rest }) => {
				const { budget, capacity } = rest
				let { name_kana, station_name, genre, open, close } = rest // need translation

				// station name
				const targetIndex = jpAreaList.indexOf(station_name)
				station_name = `${enAreaList[targetIndex]}`
				// genre
				genre.name = genreMap[genre.name]
				// opening time
				for (const [ja, en] of Object.entries(translateMap)) {
					const regex = new RegExp(ja, 'g')
					open = open.replace(regex, en)
				}
				// close
				if (!!translateMap[close]) {
					close = translateMap[close]
					// } else {
					// 	for (const [ja, en] of Object.entries(translateMap)) {
					// 		const regex = new RegExp(ja, 'g')
					// 		close = close.replace(regex, en)
					// 	}
				}
				return { name_kana, station_name, genre, budget, open, close, capacity }
			})
			console.log(copy)
		} catch (error) {
			console.error(error)
		}
	}

	// window.onload = function(){
	// 	console.log('loaded')
	// }
</script>

<div class="search-container">
	<h1 class="heading">Welcome to Gourmet in Japan</h1>
	<p>
		This is an web application to help you find the restaurants that meet your search condition. 😉
	</p>
	<p>Select some conditions to filter out the restaurants you are looking for</p>
	<p>The following default example shows you if you wanna find:</p>
	<div class="indentation">
		<p>1. <b><u>Ginza</u></b> or <b><u>Tsukiji</u></b></p>
		<p>2. Budget <b><u>¥5,001 - ¥10,000</u></b></p>
		<p>3. Showing the first <b><u>20</u></b> results of total results</p>
		<p>4. Restaurants that have party capacity over <b><u>50</u></b></p>
		<p>
			*For multiple selections, <b><u>ONLY the FIRST 5</u></b> selections will be applied and you can
			also <b><u>DRAG</u></b> to change the orders
		</p>
	</div>
	<div class="filter-container">
		<div class="filter">
			<label for="area">Choose areas* (e.g. Ginza, Asakusa)</label>
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
			<label for="budget">Budget (¥)*</label>
			<AutoComplete
				multiple="true"
				readonly={true}
				items={budgetOptions}
				bind:selectedItem={selectedBudgetObject}
				bind:value={selectedBudgetId}
				labelFieldName="name"
				valueFieldName="code"
			/>
		</div>
		<div class="filter">
			<label for="count">Showing no. of results</label>
			<AutoComplete readonly={true} items={countOptions} bind:selectedItem={selectedCount}>
				<div slot="no-results">Please choose from the list.</div>
			</AutoComplete>
		</div>
		<div class="filter">
			<label for="capacity">Party Capacity (more than)</label>
			<input
				class="capacity"
				type="number"
				on:input={handleCapacityInput}
				bind:value={selectedCapacity}
			/>
		</div>
		<div class="submit-panel">
			<button class="search-button" on:click={makeQuery}>Search</button>
		</div>
	</div>
</div>
<ResultTable {gourmetData} {columns} {shopList} />

<style lang="sass">
	body
		background-image: url('../fuji-bg.jpg')
	.heading
		text-align: center
	.indentation
		padding-left: 20px
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
			.capacity
				height: 2em
		.filter + .filter 
			margin-top: 20px
	.submit-panel
		display: flex
		justify-content: center
	.result-stat
		margin-top: 20px
	.search-button
		margin-top: 20px
</style>

<script lang="ts">
	import ResultTable from '../ResultTable.svelte'
	import testData from '../json/test.json'

	let name = ''

	const handleInput = (event: Event) => {
		const target = event.target as HTMLInputElement
		name = target.value
	}
</script>

<h1>Welcome to Gourmet in Japan</h1>
<p>Select some conditions to filter out the restaurants you are looking for 😉</p>
<input type="text" on:input={handleInput} />
<ResultTable />

<style>
</style>

<script>
	export let gourmetData
	export let shopList
	export let columns
</script>

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
  .result-container
    padding: 0 50px
    max-width: initial
</style>

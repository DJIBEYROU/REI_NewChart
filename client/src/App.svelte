<script>
  import { onMount } from 'svelte';
  import StackedAreaChart from './lib/StackedAreaChart.svelte';
  import LineChart from './lib/LineChart.svelte';
  import TimeSlider from './lib/TimeSlider.svelte';

  let dailyData = []
  let monthlyData = []
  let regions = ['japan', 'tokyo', 'hokkaido', 'tohuku', 'chubu', 'hokuriku', 'kansai', 'chugoku', 'shikoku', 'kyushu'];
  let selectedRegion = 'japan';
  let startDate = '2024-04-01';
  let endDate = '2024-04-15';
  let aggregationLevel = 'hourly'; // Default aggregation for full date range
  let loading = false;
  
  // This will store the full date range for the slider
  let fullDateRange = [];
  let allDates = []; // Store all dates for reuse
  
  async function fetchData() {
    loading = true;
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        region: selectedRegion,
        aggregation: aggregationLevel,
      });

      const response = await fetch(`http://localhost:3000/api/data?${params}`);
      const result = await response.json();
      dailyData = JSON.parse(result.type.daily)
      monthlyData = JSON.parse(result.categorized.monthly)
      console.log(dailyData, monthlyData)
      if (regions.length > 0 && !selectedRegion) {
        selectedRegion = regions[0];
      }
      
      // Set up the full date range for the slider
      if (fullDateRange.length === 0) {
        // Create a fixed date range regardless of the data
        const minDate = new Date('2022-01-01');
        const maxDate = new Date('2024-12-31');
        
        // Create an array of dates between min and max (e.g., monthly increments)
        const tempDates = [];
        let currentDate = new Date(minDate);
        
        while (currentDate <= maxDate) {
          tempDates.push(new Date(currentDate));
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        fullDateRange = tempDates;
      }
      
      // Still store actual data dates separately if needed
      if (dailyData.length > 0) {
        allDates = dailyData.map(d => new Date(d.date));
        allDates.sort((a, b) => a - b);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      loading = false;
    }
  }

  onMount(fetchData);

  $: {
    // Refetch when these values change
    if (selectedRegion || startDate || endDate) {
      fetchData();
    }
  }

  function handleOptionChange(event) {
    selectedRegion = event.target.value;
  }
  
  function handleDateRangeChange(event) {
    const { startDate: newStartDate, endDate: newEndDate, aggregationLevel: newAggregationLevel } = event.detail;
    startDate = newStartDate;
    endDate = newEndDate;
    aggregationLevel = newAggregationLevel;
    console.log(`Date range changed: ${startDate} to ${endDate} with aggregation: ${aggregationLevel}`);
    // The reactive statement above will trigger a data fetch
  }
</script>

<main>
  {#if monthlyData.length > 0}
  <div class='header'>
    <div class='title' style="margin-left: 20px;">
    </div>
    <div class='panel'>
      <div class='dropdown'>
        <select value={selectedRegion} on:change={handleOptionChange}>
          {#each regions as option}
          <option value={option}>{option}</option>
          {/each}
        </select>
        <span class="caret"></span>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <div class='left'>
      {#if dailyData.length > 0}
        <StackedAreaChart data={dailyData} aggregationLevel={aggregationLevel} />
        {:else}
          <div>Loading...</div>
        {/if}
    </div>
    <div class='right'>
      {#if monthlyData.length > 0}
        <LineChart data={monthlyData} />
      {:else}
        <div>Loading...</div>
      {/if}
    </div>
  </div>
  
  <!-- Time Slider Component -->
  <div class="timeslider-wrapper">
    {#if fullDateRange.length > 0}
      <TimeSlider 
        fullDateRange={fullDateRange}
        {startDate}
        {endDate}
        on:dateRangeChange={handleDateRangeChange}
      />
    {/if}
  </div>
  
  {:else}
  <div class="wrapper">Loading...</div>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }

  .header {
    display: flex;
    justify-content: space-between;
    width: 80%;
    height: 50px;
  }

  .panel { 
    display: flex;
  }

  .wrapper {
    display: flex;
    width: 90%;
    height: 75vh; /* Reduced to make room for slider */
  }
  
  .timeslider-wrapper {
    width: 90%;
    margin-top: 20px;
    height: 100px;
  }

  .left {
    width: 75%;
    height: 100%;
  }

  .right {
    width: 25%;
    height: 100%;
  }

  .buttons {
    display: flex;
    margin: 0 20px;
    width: auto;
  }

  .buttons div {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: none;
    background-color: #d3d3d3;
    color: #696969;
    transition: background-color 0.3s ease;
    border-radius: 10px;
    margin: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 48px;
  }
  
  .buttons div:hover {
    background-color: #C0C0C0;
  }
  
  .buttons div.active {
    background-color: #000;
    color: #fff;
  }

  .buttons h3 {
    text-align: center;
    font-size: 1em;
  }
  
  .dropdown {
    position: relative;
    display: inline-block;
    display: flex;
    padding: 8px 12px;
    cursor: pointer;
    background-color: #fff;
    color: black;
    border: 2px solid black;
    border-radius: 10px;
    height: 26px;
  } 
  
  .dropdown select {
    height: 100%;
    font-family: Avenir;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
    border: none;
    outline: none;
    text-align: center;
    font-size: 1.2em;
    margin: 0px 16px;
  }

  .caret {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 5px 0 5px;
    border-color: black transparent transparent transparent;
    pointer-events: none;
    margin-left: 8px
  }
</style>
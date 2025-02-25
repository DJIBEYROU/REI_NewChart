<script>
  import { onMount, afterUpdate } from 'svelte';
  import { sum, max } from 'd3-array';
  import { scaleOrdinal, scaleLinear, scaleTime } from "d3-scale";
  import { area, stack } from "d3-shape";
  import AxisX from "./AxisX.svelte";
  import AxisY from "./AxisY.svelte";
  import Legend from "./Legend.svelte";
  import HoverEvents from "./HoverEvents.svelte";
  import Tooltip from "./Tooltip.svelte";
  import { fade } from "svelte/transition";
  import { renewables, non_renewables, colors } from './consts.js'

  export let data, aggregationLevel
  
  const colorScale = scaleOrdinal()
    .domain(Object.keys(colors)) 
    .range(Object.values(colors))

  const margin = { top: 40, right: 30, bottom: 30, left: 60 };
  let div
  let height = 520;
  let width = 600;

  let innerHeight = height - margin.top - margin.bottom;
  let innerWidth = width - margin.left - margin.right;

  $: clickedItem = null
  $: hoveredDate = null
  $: xPos = 0

  onMount(() => {
    updateChartSize()
  })

  afterUpdate(() => {
    updateChartSize()
  })

  function updateChartSize() {
    if (div) {
      width = div.clientWidth
      innerWidth = width - margin.left - margin.right
      height = div.clientHeight
      innerHeight = height - margin.top - margin.bottom
    }
  }

  function sortEnergyTypesByTotal(data) {
    // Get all energy types (excluding date and region)
    const energyTypes = Object.keys(data[0] || {}).filter(
      key => key !== 'date' && key !== 'region'
    );
    
    // Calculate total value for each energy type
    const energyTotals = {};
    energyTypes.forEach(energyType => {
      energyTotals[energyType] = data.reduce((total, entry) => 
        total + (entry[energyType] || 0), 0);
    });
    
    // Sort energy types by total value (descending)
    return energyTypes.sort((a, b) => energyTotals[b] - energyTotals[a]);
  }

  $: stackKeys = sortEnergyTypesByTotal(data);

  $: legendData = stackKeys.map(d => {
    return {
      color: colorScale(d),
      text: d,
      total: sum(data.map(el => el[d]))
    }
  })

  $: legendData.sort((a,b) => b.total - a.total)

  $: stackKeysSorted = legendData.map(d => d.text)

  $: legendData_renewable = legendData.filter(d => renewables.indexOf(d.text) !== -1)
  $: legendData_nonrenewable = legendData.filter(d => non_renewables.indexOf(d.text) !== -1)

  $: yScale = scaleLinear()
  .domain([
    0, 
    // Add 10% buffer to the maximum
    max(data, d => 
      stackKeys.reduce((sum, key) => sum + (d[key] || 0), 0)
    ) * 1.1
  ])
  .range([innerHeight, 0]);

  $: xScale = scaleTime()
    .domain([new Date(data[0]['date']), new Date(data[data.length-1]['date'])])
    .range([0, innerWidth]);

  $: stackedData = stack()
    .keys(stackKeysSorted)(data)

  $: areaFunc = area()
    .x(d => xScale(new Date(d.data.date)))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]));

    $: hoveredData = hoveredDate ? findClosestDataPoint(data, hoveredDate, aggregationLevel) : null;

  // Add this function to your component
  function findClosestDataPoint(data, hoveredTimestamp, aggregationLevel) {
    if (!data.length) return null;
    
    return data.reduce((closest, current) => {
      const currentDate = new Date(current.date);
      const currentTimestamp = currentDate.getTime();
      const closestDate = closest ? new Date(closest.date) : null;
      const closestTimestamp = closestDate ? closestDate.getTime() : null;
      
      // First entry or exact match
      if (!closest || currentTimestamp === hoveredTimestamp) {
        return current;
      }
      
      // For different aggregation levels, adjust how we determine "closest"
      if (aggregationLevel === 'hourly') {
        // For hourly data, simple timestamp difference is appropriate
        if (Math.abs(currentTimestamp - hoveredTimestamp) < Math.abs(closestTimestamp - hoveredTimestamp)) {
          return current;
        }
      } 
      else if (aggregationLevel === 'daily') {
        // For daily data, compare day boundaries
        const hoveredDay = new Date(hoveredTimestamp).setHours(0, 0, 0, 0);
        const currentDay = new Date(currentDate).setHours(0, 0, 0, 0);
        const closestDay = new Date(closestDate).setHours(0, 0, 0, 0);
        
        if (Math.abs(currentDay - hoveredDay) < Math.abs(closestDay - hoveredDay)) {
          return current;
        }
      }
      else if (aggregationLevel === 'weekly') {
        // For weekly data, find the closest week start
        const hoveredWeekStart = getWeekStart(new Date(hoveredTimestamp));
        const currentWeekStart = getWeekStart(currentDate);
        const closestWeekStart = getWeekStart(closestDate);
        
        if (Math.abs(currentWeekStart.getTime() - hoveredWeekStart.getTime()) < 
            Math.abs(closestWeekStart.getTime() - hoveredWeekStart.getTime())) {
          return current;
        }
      }
      else if (aggregationLevel === 'monthly') {
        // For monthly data, compare month and year
        const hoveredDate = new Date(hoveredTimestamp);
        const hoveredMonth = hoveredDate.getMonth();
        const hoveredYear = hoveredDate.getFullYear();
        
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const closestMonth = closestDate.getMonth();
        const closestYear = closestDate.getFullYear();
        
        // Calculate "distance" in months
        const hoveredTotalMonths = (hoveredYear * 12) + hoveredMonth;
        const currentTotalMonths = (currentYear * 12) + currentMonth;
        const closestTotalMonths = (closestYear * 12) + closestMonth;
        
        if (Math.abs(currentTotalMonths - hoveredTotalMonths) < 
            Math.abs(closestTotalMonths - hoveredTotalMonths)) {
          return current;
        }
      }
      
      return closest;
    }, null);
  }

  // Helper function to get the start of a week (Sunday)
  function getWeekStart(date) {
    const result = new Date(date);
    const day = result.getDay(); // 0 = Sunday, 1 = Monday, etc.
    result.setDate(result.getDate() - day); // Go back to the previous Sunday
    result.setHours(0, 0, 0, 0); // Reset time to start of day
    return result;
  }
</script>

<div style='height: 220px'>
  <div><span style='font-size: 0.7em; margin-left: 20px;'>Click on a legend item to highlight the fuel source. Double-click on any item to un-highlight.</span></div>
  <Legend legendData={legendData_renewable} title="Renewables" bind:clicked={clickedItem}/>
  <Legend legendData={legendData_nonrenewable} title="Non-renewables" bind:clicked={clickedItem}/>
</div>

<div class="chart-container" bind:this={div}>
  <svg
    {width}
    {height}
  >
    <g transform="translate({margin.left} {margin.top})">
      <AxisX
        height={innerHeight}
        width={innerWidth} 
        interval={aggregationLevel}
        {xScale}
      />
      <AxisY
        width={innerWidth} 
        {yScale} 
        ticks={yScale.ticks(6)}
        title='Power Generation Value (in GWh)'
      />
      {#each stackedData as d, index}
        <path
          transition:fade
          d={areaFunc(d)}
          stroke={colorScale(d.key)}
          fill={colorScale(d.key)}
          stroke-width="1"
          opacity={clickedItem
          ? clickedItem === d.key 
            ? 1
            : 0.2
          : 1}
        />
      {/each}
      <HoverEvents
        width={innerWidth}
        height={innerHeight}
        {xScale}
        {margin}
        bind:hoveredDate
        bind:xPos
      />
    </g>
  </svg>
  {#if hoveredDate && hoveredData}
    <Tooltip data={hoveredData} x={xPos} {colorScale} {width} />
  {/if}
</div>

<style>
  .chart-container {
    position: relative;
    width: 100%;
    height: 67%;
  }
</style>

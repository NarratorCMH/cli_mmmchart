<h1 align="center">
	<br>
	<br>
	<img width="340" src="media/logo.png" alt="cli_mmmchart">
	<br>
	<br>
	<br>
</h1>

---

> Three simple charts in your terminal with node.js!

`name: cli_mmmchart`   `Latest version: 0.3.2`   `dependencies: chalk_v5.4.1`   `module size: 13KB`



## Install

```shell
npm install cli_mmmchart
```

IMPORTANT: cli_mmmchart is ESM. Note that traditional Windows command lines, such as cmd.exe, have weak support for ANSI escape sequences, so displaying the cli_mmmchart on the default terminal in windows operating systems may not work particularly well



## Usage

code representation of chart data

```js
let data = {
  tableName: "fill in the name of the form here.",
  yAxis: "meaning of the Y-axis.",
  description:
    "fill in a description of the form here.",
  table: [
    { value: 1054, xAxis: "apples" },	//Fill in the form here for each record value
    { value: 2044, xAxis: "bananas" },
    { value: 3023, xAxis: "oranges" },
	...
  ],
};
```

*Note that negative values are allowed for LineChart and BarChart, but not for PieChart*



### PieChart

**example**

```js
import { drawPieChart } from "cli_mmmchart";

let data = {
  tableName: "Fruit",
  yAxis: "Number proportion",
  description:
    "This is a demonstration program that mainly shows you the proportion of fruit drawn with pie charts.",
  table: [
    { value: 1054, xAxis: "apples" },
    { value: 2044, xAxis: "bananas" },
    { value: 3023, xAxis: "oranges" },
    { value: 2045, xAxis: "persimmons" },
    { value: 6500, xAxis: "coconuts" },
  ],
};

drawPieChart(data)
```

**output**

<img src=".\media\PieChart.png" alt="PieChart" style="zoom:87%;" />

**API**

`drawPieChart(<data>, <maxLength>, <perLineNum>)`

`<data>`: *Source drawing data*

`<maxLength>`: *Maximum chart width (unit: characters, Select according to the width of your command line window), default is 90 characters wide*

`<perLineNum>`: *The number of chart markers displayed per row, which defaults to 3*



### BarChart

**example**

```js
import { drawBarChart } from "cli_mmmchart";

let data = {
  tableName: "Blender Performance Test",
  yAxis: "score",
  description:
    "This is a demonstration program, mainly in the form of a bar chart to show the performance of several cpus in Blender software performance tests.",
  table: [
    { value: 73, xAxis: "R7 9800X3D" },
    { value: 58, xAxis: "R7 7800X3D" },
    { value: 142, xAxis: "R9 9950X" },
    { value: 580, xAxis: "this is an outlier" },
    { value: 75, xAxis: "R7 9700X" },
    { value: 132, xAxis: "Ultra 9 285K" },
  ],
};

drawBarChart(data, 60, "linear", false, 145);
```

**output**

<img src=".\media\BarChart.png" alt="BarChart" style="zoom:87%;" />

**API**

`drawBarChart(<data>, <maxLength>, <method>, <singularValueDeletion>, <upperLimit>)`

`<data>`: *Source drawing data*

`<maxLength>`: *Maximum chart width (unit: characters, Select according to the width of your command line window), default is 90 characters wide*

`<method>`: *Non-linearization method, optional values are ["`Linear`", "`log`", "`sqrt`"], default is "`linear`"*. The purpose of setting this parameter is to make the chart display more balanced, which will not compress the proportion of other records displayed on the chart because one record value is too large. Setting nonlinearization can compress the values of all records in a range to show the difference between each record value evenly

`<singularValueDeletion>`:*`true or false`, Whether to ignore singular values when drawing [to exclude the impact of excessively large or small data on the chart], default is `False`, Values flagged as exceptions by the algorithm will appear in blue*

`<upperLimit>`: *Sets an upper limit for the y-values of the chart; entries exceeding this limit will be compressed to the limit value and additionally annotated, Records that exceed the upper limit will be shown in red*



### LineChart

**example**

```js
import { drawLineChart } from "cli_mmmchart";

let data = {
  tableName: "xxx Daily Average Price",
  yAxis: "Average Price",
  description:
    "This is a demonstration program, mainly in the form of a line chart to show the daily average price of xxx from 2024-01-21 to 2024-02-01.",
  table: [
    { value: 150.25, xAxis: "2024-01-21" },
    { value: 110.5, xAxis: "2024-01-22" },
    { value: 60.75, xAxis: "2024-01-23" },
    { value: 900.0, xAxis: "2024-01-24" },
    { value: 10.3, xAxis: "2024-01-25" },
    { value: -20.2, xAxis: "2024-01-26" },
    { value: -80.65, xAxis: "2024-01-27" },
    { value: 3.21, xAxis: "2024-01-28" },
    { value: 110.2, xAxis: "2024-01-29" },
    { value: 42.1, xAxis: "2024-01-30" },
    { value: -60.43, xAxis: "2024-01-31" },
    { value: 0.34, xAxis: "2024-02-01" },
  ],
};

drawLineChart(data, 60, "sqrt", false, 160);
```

**output**

<img src=".\media\LineChart.png" alt="LineChart" style="zoom:87%;" />

**API**

`drawLineChart(<data>, <maxLength>, <method>, <singularValueDeletion>, <upperLimit>)`

`<data>`: *Source drawing data*

`<maxLength>`: *Maximum chart width (unit: characters, Select according to the width of your command line window), default is 90 characters wide*

`<method>`: *Non-linearization method, optional values are ["`Linear`", "`log`", "`sqrt`"], default is "`linear`"*. The purpose of setting this parameter is to make the chart display more balanced, which will not compress the proportion of other records displayed on the chart because one record value is too large. Setting nonlinearization can compress the values of all records in a range to show the difference between each record value evenly

`<singularValueDeletion>`:*`true or false`, Whether to ignore singular values when drawing [to exclude the impact of excessively large or small data on the chart], default is `False`, Values flagged as exceptions by the algorithm will appear in blue*

`<upperLimit>`: *Sets an upper limit for the y-values of the chart; entries exceeding this limit will be compressed to the limit value and additionally annotated, Records that exceed the upper limit will be shown in red*



## Related

- [chalk](https://github.com/chalk/chalk/) Terminal string styling done right

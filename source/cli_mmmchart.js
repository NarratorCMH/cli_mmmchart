import chalk from "chalk";

let data = {
  tableName: "Cext01",
  yAxis: "RMB",
  description:
    "This is a description, and it should not break words or end with punctuation.",
  table: [
    { value: 1054, xAxis: "条目1" },
    { value: 2044, xAxis: "条目2" },
    { value: 3023, xAxis: "条目3" },
    { value: 2045, xAxis: "条目4" },
    { value: 6500, xAxis: "条目1" },
    { value: 1032, xAxis: "条目2" },
    { value: 0, xAxis: "条目3" },
    { value: 1500, xAxis: "条目4" },
    { value: 11290, xAxis: "条目4" },
    { value: 1490, xAxis: "条目4" },
  ],
};

const findAndReplaceOutliers = (data) => {
  const values = data.table.map((item) => item.value);

  const sortedValues = [...values].sort((a, b) => a - b);
  const Q1 = sortedValues[Math.floor(sortedValues.length * 0.25)];
  const Q3 = sortedValues[Math.floor(sortedValues.length * 0.75)];
  const IQR = Q3 - Q1;

  const lowerThreshold = Q1 - 1.5 * IQR;
  const upperThreshold = Q3 + 1.5 * IQR;

  const median = sortedValues[Math.floor(sortedValues.length / 2)];
  const outliersIndices = [];

  data.table.forEach((item, index) => {
    if (item.value < lowerThreshold || item.value > upperThreshold) {
      outliersIndices.push(index);
      item.value = median;
    }
  });

  return outliersIndices;
};

const getRandomColor = (diff = 1) => {
  // A predefined set of comfortable RGB colors
  const colors = [
    [72, 202, 228], // Bright cyan-blue
    [255, 107, 107], // Coral red
    [46, 196, 182], // Mint blue
    [255, 159, 67], // Vibrant orange
    [155, 105, 245], // Violet blue
    [255, 209, 102], // Sunshine yellow
    [240, 101, 149], // Rose pink
    [0, 168, 181], // Deep sea blue
    [255, 94, 98], // Bright red
    [123, 237, 159], // Fresh green
    [255, 138, 101], // Orange-red
    [147, 112, 219], // Medium purple
    [255, 193, 7], // Golden yellow
    [0, 188, 212], // Sky blue
    [255, 87, 34], // Dark orange
    [156, 204, 101], // Grass green
    [233, 30, 99], // Magenta
    [63, 81, 181], // Dark blue
    [255, 152, 0], // Orange
    [205, 220, 57], // Lemon green
  ];

  if (diff > colors.length) {
    throw new Error("drawPie Error: Cannot exceed 20 categories");
  }

  if (diff === 1) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  if (diff > 1) {
    const maxDiff = Math.min(diff, colors.length);
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    return colors.slice(0, maxDiff);
  }
  return [];
};

const nonlinearCompression = (num, method) => {
  switch (method) {
    case "log":
      return Math.log(num + 2);

    case "sqrt":
      return Math.sqrt(num + 1);

    case "linear":
      return num;

    default:
      throw new Error(`Unsupported nonlinear method: ${method}`);
  }
};

const calculateMeanPlusTwoStdDev = (data, method) => {
  const values = data.table.map((item) => item.value);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);
  let num = method == "log" ? 1.6 : 2;
  return mean + stdDev * num;
};

const calculatePercentages = (data) => {
  const hasNegativeValue = data.table.some((item) => item.value < 0);
  if (hasNegativeValue) {
    throw new Error("drawPie Error: Some values in the table are less than 0.");
  }
  const totalValue = data.table.reduce((sum, item) => sum + item.value, 0);
  const percentages = [];
  const xAxis = [];
  data.table.forEach((item) => {
    const percentage = ((item.value / totalValue) * 100).toFixed(2);
    percentages.push(parseFloat(percentage));
    xAxis.push(item.xAxis);
  });

  return { percentages, xAxis };
};

const splitDescription = (text, maxLen) => {
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + " " + word).length <= maxLen) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
};

const description = (data, maxLength, flag) => {
  let str = "│";
  if (flag) {
    str = str.padStart(flag);
  }
  if (data.description) {
    console.log(str + " Description:");
    const lines = splitDescription(data.description, Math.round(maxLength));

    lines.forEach((line) => {
      console.log(str + "   " + chalk.rgb(180, 180, 180)(line));
    });
  }
};

/**
 * Draws a corresponding bar chart based on the parameters input by the user.
 *
 * @param {object} datas - Source drawing data
 * @param {number} maxLength - Maximum chart width (unit: characters), default is 60 characters wide
 * @param {string} method - Non-linearization method, optional values are ["Linear", "log", "sqrt"], default is "linear"
 * @param {boolean} singularValueDeletion - Whether to ignore singular values when drawing [to exclude the impact of excessively large or small data on the chart], default is False
 * @param {number} upperLimit - Sets an upper limit for the y-values of the chart; entries exceeding this limit will be compressed to the limit value and additionally annotated
 */
export const drawBarChart = (
  datas = {},
  maxLength = 60,
  method = "linear",
  singularValueDeletion = false,
  upperLimit
) => {
  let data = structuredClone(datas);
  let wrongIndex;
  if (singularValueDeletion) {
    wrongIndex = findAndReplaceOutliers(data);
  }
  const minValue = Math.min(...data.table.map((item) => item.value));
  if (minValue < 0) {
    data.table.forEach((item) => {
      item.value = item.value - minValue;
    });
  }
  console.log(
    "┬ " +
      chalk.bold(data.tableName) +
      chalk.white(" [y-axis => " + data.yAxis + "]")
  );

  description(data, maxLength);
  let maxValue;
  if (upperLimit) {
    if (minValue < 0) {
      upperLimit = upperLimit - minValue;
    }
    maxValue = nonlinearCompression(upperLimit, method);
  } else {
    maxValue = nonlinearCompression(
      calculateMeanPlusTwoStdDev(data, method),
      method
    );
  }

  console.log("│");
  data.table.forEach((item, index) => {
    let eleValue = nonlinearCompression(item.value, method);
    let maxFlag = upperLimit ? item.value > upperLimit : false;
    let barLength = maxFlag
      ? Math.round(maxLength * 1.1)
      : Math.round((eleValue / maxValue) * maxLength);
    // barLength = Math.max(barLength, 1);
    let wrongColor;
    if (wrongIndex) {
      if (wrongIndex.includes(index)) {
        barLength = 0;
        item.xAxis = item.xAxis + " (Singular Value)";
        item.value = datas.table[index].value;
        wrongColor = [28, 90, 177];
      }
    }
    const [r, g, b] = getRandomColor();
    let innerBar = maxFlag ? "▩" : " ";
    const bar = chalk.bgRgb(r, g, b).rgb(33, 33, 33)(
      innerBar.repeat(barLength)
    );
    let value = minValue < 0 ? item.value + minValue : item.value;
    let [aa, bb, cc] = value < 0 ? [56, 218, 38] : [222, 222, 222];
    [aa, bb, cc] = maxFlag ? [228, 20, 20] : [aa, bb, cc];
    if (wrongColor) {
      [aa, bb, cc] = wrongColor;
    }
    console.log(
      "│" +
        bar +
        "  " +
        chalk.rgb(aa, bb, cc)(value.toFixed(2) + " | " + item.xAxis)
    );
    console.log("│");
  });
};

/**
 * Based on the input parameters, it draws the corresponding pie chart.
 *
 * @param {object} datas - Source drawing data
 * @param {number} maxLength - Maximum chart width (unit: characters), default is 90 characters wide
 * @param {number} perLineNum - The number of chart markers displayed per row, which defaults to 3
 */
export const drawPieChart = (datas = {}, maxLength = 90, perLineNum = 3) => {
  let data = structuredClone(datas);
  console.log(
    "┬ " +
      chalk.bold(data.tableName) +
      chalk.white(" [pie => " + data.yAxis + "]")
  );
  description(data, maxLength);
  console.log("│");
  let colors = getRandomColor(data.table.length);
  let perobg = calculatePercentages(data);
  let barArr = [];
  perobg.percentages.forEach((item, index) => {
    let bar = chalk.bgRgb(
      colors[index][0],
      colors[index][1],
      colors[index][2]
    )(" ".repeat(Math.round((item / 100) * maxLength)));
    barArr.push(bar);
  });
  const result = barArr.reduce((acc, str) => acc + str, "");
  console.log("│" + result);
  console.log("│");
  let axisArr = [];
  let xAxismaxLength = perobg.xAxis.reduce(
    (max, str) => Math.max(max, str.length),
    0
  );
  colors.forEach((item, index) => {
    let innervalue = perobg.percentages[index].toFixed(2);
    let str = innervalue < 10 ? " " : "";
    let x =
      chalk.bgRgb(item[0], item[1], item[2]).rgb(33, 33, 33)(
        " " + str + innervalue + "% "
      ) +
      " " +
      chalk.rgb(
        item[0],
        item[1],
        item[2]
      )(perobg.xAxis[index].padEnd(xAxismaxLength));
    axisArr.push(x);
  });
  const resultAxis = axisArr
    .reduce((acc, item, index) => {
      if (index % perLineNum === 0) {
        acc.push([]);
      }
      acc[acc.length - 1].push(item);
      return acc;
    }, [])
    .map((group) => group.join(" "));

  resultAxis.forEach((line) => console.log("│" + line));
  console.log("│");
};

/**
 * Draws a corresponding line chart based on the parameters input by the user.
 *
 * @param {object} datas - Source drawing data
 * @param {number} maxLength - Maximum chart width (unit: characters), default is 60 characters wide
 * @param {string} method - Non-linearization method, optional values are ["Linear", "log", "sqrt"], default is "linear"
 * @param {boolean} singularValueDeletion - Whether to ignore singular values when drawing [to exclude the impact of excessively large or small data on the chart], default is False
 * @param {number} upperLimit - Sets an upper limit for the y-values of the chart; entries exceeding this limit will be compressed to the limit value and additionally annotated
 */
export const drawLineChart = (
  datas = {},
  maxLength = 60,
  method = "linear",
  singularValueDeletion = false,
  upperLimit
) => {
  let data = structuredClone(datas);
  let wrongIndex;
  if (singularValueDeletion) {
    wrongIndex = findAndReplaceOutliers(data);
  }
  const minValue = Math.min(...data.table.map((item) => item.value));
  if (minValue < 0) {
    data.table.forEach((item) => {
      item.value = item.value - minValue;
    });
  }
  let perobg = calculatePercentages(data);
  let xAxismaxLength = perobg.xAxis.reduce(
    (max, str) => Math.max(max, str.length),
    0
  );
  console.log(
    "┬ ".padStart(xAxismaxLength + 2) +
      chalk.bold(data.tableName) +
      chalk.white(" [y-axis => " + data.yAxis + "]")
  );

  description(data, maxLength, xAxismaxLength + 1);
  let maxValue;
  if (upperLimit) {
    if (minValue < 0) {
      upperLimit = upperLimit - minValue;
    }
    maxValue = nonlinearCompression(upperLimit, method);
  } else {
    maxValue = nonlinearCompression(
      calculateMeanPlusTwoStdDev(data, method),
      method
    );
  }

  console.log("│".padStart(xAxismaxLength + 1));
  data.table.forEach((item, index) => {
    let eleValue = nonlinearCompression(item.value, method);
    let maxFlag = upperLimit ? item.value > upperLimit : false;
    let barLength = maxFlag
      ? Math.round(maxLength * 1.1)
      : Math.round((eleValue / maxValue) * maxLength);
    // barLength = Math.max(barLength, 1);
    let wrongColor;
    if (wrongIndex) {
      if (wrongIndex.includes(index)) {
        barLength = 0;
        item.value = datas.table[index].value;
        wrongColor = [28, 90, 177];
      }
    }
    const [r, g, b] = [222, 222, 222];
    let innerBar = maxFlag ? "▩" : "-";
    const bar = chalk.bgRgb(r, g, b).rgb(33, 33, 33)(
      innerBar.repeat(barLength)
    );
    let value = minValue < 0 ? item.value + minValue : item.value;
    let [aa, bb, cc] =
      item.value + minValue < 0 ? [56, 218, 38] : [222, 222, 222];
    [aa, bb, cc] = maxFlag ? [228, 20, 20] : [aa, bb, cc];
    if (wrongColor) {
      [aa, bb, cc] = wrongColor;
    }
    let pack = wrongColor ? chalk.rgb(aa, bb, cc)(" (Singular Value)") : "";
    console.log(
      item.xAxis.padStart(xAxismaxLength) +
        "│" +
        bar +
        "  " +
        chalk.rgb(aa, bb, cc)(value.toFixed(2)) +
        pack
    );
  });
  console.log("│".padStart(xAxismaxLength + 1));
};

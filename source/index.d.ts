declare module 'cli_mmmchart' {
  /**
   * Type definition of data table items
   */
  interface TableItem {
    xAxis: string; 
    value: number; 
  }

  /**
   * Type definition of data source
   */
  interface DataSource {
    tableName: string; 
    yAxis: string;
    description: string; 
    table: TableItem[]; 
  }

/**
 * Draws a corresponding bar chart based on the parameters input by the user.
 *
 * @param {object} datas - Source drawing data
 * @param {number} maxLength - Maximum chart width (unit: characters), default is 60 characters wide
 * @param {string} method - Non-linearization method, optional values are ["Linear", "log", "sqrt"], default is "linear"
 * @param {boolean} singularValueDeletion - Whether to ignore singular values when drawing [to exclude the impact of excessively large or small data on the chart], default is False
 * @param {number} upperLimit - Sets an upper limit for the y-values of the chart; entries exceeding this limit will be compressed to the limit value and additionally annotated
 */
  export function drawBarChart(
    datas?: DataSource,
    maxLength?: number,
    method?: "Linear" | "log" | "sqrt",
    singularValueDeletion?: boolean,
    upperLimit?: number
    ): void;
    
/**
 * Based on the input parameters, it draws the corresponding pie chart.
 *
 * @param {object} datas - Source drawing data
 * @param {number} maxLength - Maximum chart width (unit: characters), default is 90 characters wide
 * @param {number} perLineNum - The number of chart markers displayed per row, which defaults to 3
 */
  export function drawPieChart(
    datas?: DataSource,
    maxLength?: number,
    perLineNum?: number
  ): void;

/**
 * Draws a corresponding line chart based on the parameters input by the user.
 *
 * @param {object} datas - Source drawing data
 * @param {number} maxLength - Maximum chart width (unit: characters), default is 60 characters wide
 * @param {string} method - Non-linearization method, optional values are ["Linear", "log", "sqrt"], default is "linear"
 * @param {boolean} singularValueDeletion - Whether to ignore singular values when drawing [to exclude the impact of excessively large or small data on the chart], default is False
 * @param {number} upperLimit - Sets an upper limit for the y-values of the chart; entries exceeding this limit will be compressed to the limit value and additionally annotated
 */
  export function drawLineChart(
    datas?: DataSource,
    maxLength?: number,
    method?: "Linear" | "log" | "sqrt",
    singularValueDeletion?: boolean,
    upperLimit?: number
  ): void;
}
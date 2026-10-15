// ApexCharts draws with SVG measurements jsdom cannot do. This stand-in records what each chart
// was given, so tests can check the series, labels and categories.
const React = require('react');

function Chart({ type, series, options }) {
  return React.createElement('div', {
    'data-testid': 'chart',
    'data-type': type,
    'data-title': options?.title?.text,
    'data-series': JSON.stringify(series),
    'data-labels': JSON.stringify(options?.labels ?? null),
    'data-categories': JSON.stringify(options?.xaxis?.categories ?? null),
  });
}

module.exports = Chart;

import React, { useState, useEffect } from 'react';
import { csv } from 'd3';
import { ticks } from 'd3-array';
import { Group } from '@visx/group';
import { Circle } from '@visx/shape';
import { scaleTime } from '@visx/scale';
import { TooltipWithBounds, withTooltip } from '@visx/tooltip';
import './App.css';

const width = 800;
const height = 100;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

function App({ tooltipOpen, tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip }) {
  const [xDomain, setXDomain] = useState([new Date('2018-01-01'), new Date('2024-01-01')]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await csv(process.env.PUBLIC_URL + './all_events.csv');
      setEvents(
        data.map((d) => ({
          x: new Date(d.date),
          y: 0,
          category: d.category,
          title: d.title,
        }))
      );
    };
    fetchEvents();
  }, []);

  const xScale = scaleTime({
    domain: xDomain,
    range: [margin.left, width - margin.right],
  });
  
  const moveTimeWindow = (direction) => {
    const moveByDays = 30;
    const movedDomain = xDomain.map((date) => {
      const newDate = new Date(date.valueOf());
      newDate.setDate(date.getDate() + direction * moveByDays);
      return newDate;
    });
    setXDomain(movedDomain);
  };
  
  const onWheel = (event) => {
    event.preventDefault();

    const zoomFactor = 1 - event.deltaY * 0.001;
    const pointerX = event.clientX;
    const pointerDate = xScale.invert(pointerX - margin.left);

    const newXDomain = xDomain.map((date) => {
        const newDate = new Date(pointerDate.valueOf() + (date.valueOf() - pointerDate.valueOf()) * zoomFactor);
      return newDate;
    });

    setXDomain(newXDomain);
  };

  const pointColor = (category) => {
    return category === 'A' ? 'blue' : 'red';
  };

  const pointOffset = (category) => {
    return category === 'A' ? 3.0 : -3.0;
  };

  return (
    <div className="App" onWheel={onWheel}>
      <button onClick={() => moveTimeWindow(-1)}>Move Left</button>
      <button onClick={() => moveTimeWindow(1)}>Move Right</button>
      <svg width={width} height={height}>
        <Group top={margin.top}>
          <line x1={margin.left} y1={height / 2} x2={width - margin.right} y2={height / 2} stroke="black" strokeWidth={2} />
          {ticks(xDomain[0], xDomain[1], xDomain[1].getFullYear() - xDomain[0].getFullYear()).map((d, i) => {
            const x = xScale(new Date(d));
            const year = new Date(d).toLocaleDateString();
            return (
              <g key={i}>
              <line x1={x} y1={height / 2} x2={x} y2={height / 2 + 5} stroke="black" strokeWidth={1} />
              <text x={x} y={height / 2 + 20} textAnchor="middle" fontSize={10}>
                 {year}
              </text>
               </g>
            );
          })};
          {events.map((event, index) => (
            <g key={index}>
              <Circle
                cx={xScale(event.x)}
                cy={(height / 2) + pointOffset(event.category)}
                r={6}
                fill={pointColor(event.category)}
                onMouseMove={(event) => {
                  const circle = event.target;
                  showTooltip({
                    tooltipData: circle.getAttribute('data-tip'),
                    tooltipLeft: event.clientX,
                    tooltipTop: event.clientY,
                  });
                }}
                onMouseOut={hideTooltip}
                data-tip={event.title}
              />
            </g>
          ))}
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipWithBounds left={tooltipLeft} top={tooltipTop}>
          {tooltipData}
        </TooltipWithBounds>
      )}
    </div>
  );
}

export default withTooltip(App);


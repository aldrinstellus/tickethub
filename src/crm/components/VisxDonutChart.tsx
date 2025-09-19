import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Group } from "@visx/group";
import { Pie } from "@visx/shape";

export type DonutDatum = { label: string; value: number; color?: string };

export default function VisxDonutChart({ data, width = 300, height = 300, innerRadius = 60 }: { data: DonutDatum[]; width?: number; height?: number; innerRadius?: number; }) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 10;

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <svg width={width} height={height}>
        <Group top={centerY} left={centerX}>
          <Pie
            data={data}
            pieValue={(d) => d.value}
            outerRadius={radius}
            innerRadius={innerRadius}
            padAngle={0.02}
          >
            {({ arcs, path }) => (
              <g>
                {arcs.map((arc, i) => (
                  <path key={`arc-${i}`} d={path(arc)} fill={data[i].color ?? "#8884d8"} stroke="#fff" />
                ))}
              </g>
            )}
          </Pie>
        </Group>
      </svg>
      <Stack spacing={1}>
        {data.map((d, i) => (
          <Stack direction="row" spacing={1} key={i} sx={{ alignItems: "center" }}>
            <span style={{ width: 12, height: 12, background: d.color ?? "#8884d8", display: "inline-block", borderRadius: 2 }} />
            <Typography variant="body2">{d.label}</Typography>
            <Typography variant="caption" color="text.secondary">{d.value}%</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

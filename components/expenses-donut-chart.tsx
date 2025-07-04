"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface ExpensesDonutChartProps {
  data?: Array<{
    name: string
    amount: number
    color: string
  }>
}

export function ExpensesDonutChart({ data = [] }: ExpensesDonutChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Sample data
    const chartData = data && data.length > 0 ? {
      labels: data.map(item => item.name),
      datasets: [
        {
          data: data.map(item => item.amount),
          backgroundColor: data.map((item, index) => {
            // Cores padrão se não houver cor definida
            const defaultColors = [
              "rgba(74, 222, 128, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(168, 85, 247, 0.8)",
              "rgba(251, 146, 60, 0.8)",
              "rgba(148, 163, 184, 0.8)",
              "rgba(239, 68, 68, 0.8)",
            ];
            
            if (item.color?.includes('green')) return "rgba(74, 222, 128, 0.8)";
            if (item.color?.includes('blue')) return "rgba(59, 130, 246, 0.8)";
            if (item.color?.includes('purple')) return "rgba(168, 85, 247, 0.8)";
            if (item.color?.includes('orange')) return "rgba(251, 146, 60, 0.8)";
            if (item.color?.includes('red')) return "rgba(239, 68, 68, 0.8)";
            if (item.color?.includes('yellow')) return "rgba(251, 191, 36, 0.8)";
            if (item.color?.includes('pink')) return "rgba(236, 72, 153, 0.8)";
            if (item.color?.includes('cyan')) return "rgba(34, 211, 238, 0.8)";
            
            return defaultColors[index % defaultColors.length];
          }),
          borderColor: data.map((item, index) => {
            const defaultColors = [
              "rgba(74, 222, 128, 1)",
              "rgba(59, 130, 246, 1)",
              "rgba(168, 85, 247, 1)",
              "rgba(251, 146, 60, 1)",
              "rgba(148, 163, 184, 1)",
              "rgba(239, 68, 68, 1)",
            ];
            
            if (item.color?.includes('green')) return "rgba(74, 222, 128, 1)";
            if (item.color?.includes('blue')) return "rgba(59, 130, 246, 1)";
            if (item.color?.includes('purple')) return "rgba(168, 85, 247, 1)";
            if (item.color?.includes('orange')) return "rgba(251, 146, 60, 1)";
            if (item.color?.includes('red')) return "rgba(239, 68, 68, 1)";
            if (item.color?.includes('yellow')) return "rgba(251, 191, 36, 1)";
            if (item.color?.includes('pink')) return "rgba(236, 72, 153, 1)";
            if (item.color?.includes('cyan')) return "rgba(34, 211, 238, 1)";
            
            return defaultColors[index % defaultColors.length];
          }),
          borderWidth: 1,
        },
      ],
    } : {
      labels: ["Sem dados"],
      datasets: [
        {
          data: [1],
          backgroundColor: ["rgba(148, 163, 184, 0.3)"],
          borderColor: ["rgba(148, 163, 184, 0.5)"],
          borderWidth: 1,
        },
      ],
    };

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "rgba(75, 85, 99, 0.3)",
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            callbacks: {
              label: (context) => {
                let label = context.label || ""
                if (label) {
                  label += ": "
                }
                if (context.parsed !== null) {
                  label += new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(context.parsed)
                }
                return label
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="h-[150px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

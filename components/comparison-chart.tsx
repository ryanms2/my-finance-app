"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface ComparisonChartProps {
  data?: {
    current: Record<string, number>;
    previous: Record<string, number>;
  } | null;
}

export function ComparisonChart({ data }: ComparisonChartProps) {
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

    // Preparar dados do gráfico
    let labels: string[] = [];
    let currentMonthData: number[] = [];
    let previousMonthData: number[] = [];

    if (data) {
      // Usar dados reais
      const days = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
      labels = days;
      
      currentMonthData = days.map(day => data.current[day] || 0);
      previousMonthData = days.map(day => data.previous[day] || 0);
    } else {
      // Dados vazios
      labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
      currentMonthData = Array(30).fill(0);
      previousMonthData = Array(30).fill(0);
    }

    // Create gradients
    const currentGradient = ctx.createLinearGradient(0, 0, 0, 400)
    currentGradient.addColorStop(0, "rgba(168, 85, 247, 0.3)")
    currentGradient.addColorStop(1, "rgba(168, 85, 247, 0)")

    const previousGradient = ctx.createLinearGradient(0, 0, 0, 400)
    previousGradient.addColorStop(0, "rgba(107, 114, 128, 0.3)")
    previousGradient.addColorStop(1, "rgba(107, 114, 128, 0)")

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Mês Atual",
            data: currentMonthData,
            borderColor: "rgba(168, 85, 247, 1)",
            backgroundColor: currentGradient,
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointBackgroundColor: "rgba(168, 85, 247, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 1,
          },
          {
            label: "Mês Anterior",
            data: previousMonthData,
            borderColor: "rgba(107, 114, 128, 1)",
            backgroundColor: previousGradient,
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointBackgroundColor: "rgba(107, 114, 128, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#9ca3af",
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "rgba(75, 85, 99, 0.3)",
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || ""
                if (label) {
                  label += ": "
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(context.parsed.y)
                }
                return label
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: "#9ca3af",
              font: {
                size: 11,
              },
              maxTicksLimit: 10,
            },
          },
          y: {
            grid: {
              color: "rgba(75, 85, 99, 0.1)",
            },
            border: {
              display: false,
            },
            ticks: {
              color: "#9ca3af",
              font: {
                size: 11,
              },
              callback: (value) => {
                return "R$ " + value
              },
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
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
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

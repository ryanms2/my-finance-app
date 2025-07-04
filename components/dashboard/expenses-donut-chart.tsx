"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function ExpensesDonutChart() {
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
    const data = {
      labels: ["Alimentação", "Transporte", "Entretenimento", "Moradia", "Outros"],
      datasets: [
        {
          data: [350, 120, 80, 950, 375],
          backgroundColor: [
            "rgba(74, 222, 128, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(251, 146, 60, 0.8)",
            "rgba(148, 163, 184, 0.8)",
          ],
          borderColor: [
            "rgba(74, 222, 128, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(168, 85, 247, 1)",
            "rgba(251, 146, 60, 1)",
            "rgba(148, 163, 184, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: data,
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
  }, [])

  return (
    <div className="h-[150px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

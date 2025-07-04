"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface MonthlyChartData {
  month: string;
  income: number;
  expenses: number;
}

interface MonthlySpendingChartProps {
  data: MonthlyChartData[] | null;
}

export function MonthlySpendingChart({ data }: MonthlySpendingChartProps) {
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

    // Usar dados reais ou dados padrão
    const chartData = data && data.length > 0 ? data : [
      { month: "Jan", income: 3200, expenses: 1600 },
      { month: "Fev", income: 3300, expenses: 1700 },
      { month: "Mar", income: 3400, expenses: 1750 },
      { month: "Abr", income: 3450, expenses: 1800 },
      { month: "Mai", income: 3500, expenses: 1850 },
      { month: "Jun", income: 3500, expenses: 1875 }
    ];

    const labels = chartData.map(item => item.month);
    const incomeData = chartData.map(item => item.income);
    const expensesData = chartData.map(item => item.expenses);

    // Create gradient for income
    const incomeGradient = ctx.createLinearGradient(0, 0, 0, 400)
    incomeGradient.addColorStop(0, "rgba(107, 114, 128, 0.3)")
    incomeGradient.addColorStop(1, "rgba(107, 114, 128, 0)")

    // Create gradient for expenses
    const expensesGradient = ctx.createLinearGradient(0, 0, 0, 400)
    expensesGradient.addColorStop(0, "rgba(153, 27, 27, 0.3)")
    expensesGradient.addColorStop(1, "rgba(153, 27, 27, 0)")

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Receitas",
            data: incomeData,
            borderColor: "rgba(107, 114, 128, 1)",
            backgroundColor: incomeGradient,
            fill: true,
            tension: 0.4,
            pointRadius: window.innerWidth < 768 ? 2 : 4,
            pointBackgroundColor: "rgba(107, 114, 128, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: window.innerWidth < 768 ? 1 : 2,
          },
          {
            label: "Despesas",
            data: expensesData,
            borderColor: "rgba(153, 27, 27, 1)",
            backgroundColor: expensesGradient,
            fill: true,
            tension: 0.4,
            pointRadius: window.innerWidth < 768 ? 2 : 4,
            pointBackgroundColor: "rgba(153, 27, 27, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: window.innerWidth < 768 ? 1 : 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "rgba(75, 85, 99, 0.3)",
            borderWidth: 1,
            padding: window.innerWidth < 768 ? 6 : 10,
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
              // drawBorder removed because it's not a valid property
            },
            ticks: {
              color: "#9ca3af",
              font: {
                size: window.innerWidth < 768 ? 10 : 12,
              },
            },
          },
          y: {
            grid: {
              color: "rgba(75, 85, 99, 0.1)",
            },
            ticks: {
              color: "#9ca3af",
              font: {
                size: window.innerWidth < 768 ? 10 : 12,
              },
              callback: (value) => {
                if (window.innerWidth < 768) {
                  return value
                }
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

    // Handle resize
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
      if (chartRef.current) {
        const newCtx = chartRef.current.getContext("2d")
        if (newCtx) {
          // Recreate chart with updated options for the new screen size
          // This is a simplified version - you would need to recreate the chart with updated options
          chartInstance.current = new Chart(newCtx, {
            type: "line",
            data: {
              labels,
              datasets: [
                {
                  label: "Receitas",
                  data: incomeData,
                  borderColor: "rgba(107, 114, 128, 1)",
                  backgroundColor: incomeGradient,
                  fill: true,
                  tension: 0.4,
                  pointRadius: window.innerWidth < 768 ? 2 : 4,
                  pointBackgroundColor: "rgba(107, 114, 128, 1)",
                  pointBorderColor: "#fff",
                  pointBorderWidth: window.innerWidth < 768 ? 1 : 2,
                },
                {
                  label: "Despesas",
                  data: expensesData,
                  borderColor: "rgba(153, 27, 27, 1)",
                  backgroundColor: expensesGradient,
                  fill: true,
                  tension: 0.4,
                  pointRadius: window.innerWidth < 768 ? 2 : 4,
                  pointBackgroundColor: "rgba(153, 27, 27, 1)",
                  pointBorderColor: "#fff",
                  pointBorderWidth: window.innerWidth < 768 ? 1 : 2,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  mode: "index",
                  intersect: false,
                  backgroundColor: "rgba(17, 24, 39, 0.8)",
                  titleColor: "#fff",
                  bodyColor: "#fff",
                  borderColor: "rgba(75, 85, 99, 0.3)",
                  borderWidth: 1,
                  padding: window.innerWidth < 768 ? 6 : 10,
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
                  ticks: {
                    color: "#9ca3af",
                    font: {
                      size: window.innerWidth < 768 ? 10 : 12,
                    },
                  },
                },
                y: {
                  grid: {
                    color: "rgba(75, 85, 99, 0.1)",
                  },
                  ticks: {
                    color: "#9ca3af",
                    font: {
                      size: window.innerWidth < 768 ? 10 : 12,
                    },
                    callback: (value: any) => {
                      if (window.innerWidth < 768) {
                        return value
                      }
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
        }
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="h-[200px] sm:h-[250px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

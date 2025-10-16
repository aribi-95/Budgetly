import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const generateColors = (num) => {
    const palette = [
        "#BAE1FF",
        "#FFFFBA",
        "#FFB3BA",
        "#FFDFBA",
        "#BAFFC9",
        "#D7BAFF",
        "#FFBAF2",
        "#BAFFD9",
        "#FFD9BA",
        "#FFE0BA",
        "#BAE7FF",
        "#D6BAFF",
        "#FFBAAA",
        "#BAFFFE",
        "#FFE0BA",
        "#FFC9BA",
        "#BAFFBA",
        "#E0BAFF",
    ];
    return Array.from({ length: num }, (_, i) => palette[i % palette.length]);
};

const ExpensesChart = ({ summary, loading }) => {
    const { data, colors } = useMemo(() => {
        const categories = summary?.categories || [];
        const colors = generateColors(categories.length);
        const data = {
            labels: categories.map((c) => c.category),
            datasets: [
                {
                    data: categories.map((c) => c.total),
                    backgroundColor: colors,
                    borderWidth: 1,
                },
            ],
        };
        return { data, colors };
    }, [summary]);

    if (loading) return <div className="spinner-border" role="status"></div>;

    const options = {
        plugins: { legend: { display: false } },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="expenses-chart-container my-4">
            <div className="chart" style={{ minHeight: "250px" }}>
                <Doughnut data={data} options={options} />
            </div>
            <div className="legend mt-3 mt-md-0">
                {summary?.categories?.map((c, idx) => (
                    <div
                        key={c.category}
                        className="legend-item d-flex align-items-center mb-1"
                    >
                        <span
                            className="color-box me-2"
                            style={{ backgroundColor: colors[idx] }}
                        ></span>
                        <span>
                            {c.category}: {c.total}€
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExpensesChart;

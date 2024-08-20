import { ECOption } from "@/app/types/chart-type";

export const oxyGaugeOption: ECOption = {
  series: [
    {
      type: "gauge",
      startAngle: 180,
      endAngle: 0,
      center: ["50%", "75%"],
      radius: "90%",
      min: 0,
      max: 160,
      splitNumber: 8,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            [0.25, "#FF6E76"],
            [0.5, "#FDDD60"],
            [1, "#7CFFB2"],
          ],
        },
      },
      pointer: {
        icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
        length: "12%",
        width: 20,
        offsetCenter: [0, "-60%"],
        itemStyle: {
          color: "auto",
        },
      },
      axisTick: {
        length: 12,
        lineStyle: {
          color: "auto",
          width: 2,
        },
      },
      splitLine: {
        length: 20,
        lineStyle: {
          color: "auto",
          width: 5,
        },
      },
      axisLabel: {
        color: "#464646",
        fontSize: 20,
        distance: -60,
        rotate: "tangential",
        formatter: function (value: number) {
          if (value === 0.875) {
            return "Full";
          } else if (value === 0.625) {
            return "Re-Order";
          } else if (value === 0.375) {
            return "Critical";
          }
          return "";
        },
      },
      title: {
        offsetCenter: [0, "-10%"],
        fontSize: 20,
      },
      detail: {
        fontSize: 30,
        offsetCenter: [0, "-35%"],
        valueAnimation: true,
        formatter: (value: any) => {
          return Math.round(value * 100) + "";
        },
        color: "inherit",
      },
      data: [
        {
          value: 0.1,
          name: "Oxygen",
        },
      ],
    },
  ],
};

export const n2GaugeOption: ECOption = {
  series: [
    {
      type: "gauge",
      startAngle: 180,
      endAngle: 0,
      center: ["50%", "75%"],
      radius: "90%",
      min: 0,
      max: 140,
      splitNumber: 8,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            [0.25, "#FF6E76"],
            [0.5, "#FDDD60"],
            [1, "#7CFFB2"],
          ],
        },
      },
      pointer: {
        icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
        length: "12%",
        width: 20,
        offsetCenter: [0, "-60%"],
        itemStyle: {
          color: "auto",
        },
      },
      axisTick: {
        length: 12,
        lineStyle: {
          color: "auto",
          width: 2,
        },
      },
      splitLine: {
        length: 20,
        lineStyle: {
          color: "auto",
          width: 5,
        },
      },
      axisLabel: {
        color: "#464646",
        fontSize: 20,
        distance: -60,
        rotate: "tangential",
        formatter: function (value: number) {
          if (value === 0.875) {
            return "Full";
          } else if (value === 0.625) {
            return "Re-Order";
          } else if (value === 0.375) {
            return "Critical";
          }
          return "";
        },
      },
      title: {
        offsetCenter: [0, "-10%"],
        fontSize: 20,
      },
      detail: {
        fontSize: 30,
        offsetCenter: [0, "-35%"],
        valueAnimation: true,
        formatter: (value: any) => {
          return Math.round(value * 100) + "";
        },
        color: "inherit",
      },
      data: [
        {
          value: 50,
          name: "Oxygen",
        },
      ],
    },
  ],
};

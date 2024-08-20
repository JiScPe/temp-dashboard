import { ECOption } from "@/app/types/chart-type";

function checkName(name: string) {
  if (name.toLocaleUpperCase().includes("LOX")) {
    return "Oxygen";
  } else {
    return "Nitrogen";
  }
}

export function getGaugeOption(
  value: number,
  name: string,
  alarmLevel: string
): ECOption {
  const seriesValue: number = value;
  const fullLv: number = parseInt(alarmLevel.split(" ")[1]);
  const reorderLv = parseInt(alarmLevel.split(" ")[3]);
  const criticalLv = parseInt(alarmLevel.split(" ")[5]);
  const gaugeData = [{
    
  }]
  const option:ECOption = {
    series: [
      {
        type: 'gauge',
        anchor: {
          show: true,
          showAbove: true,
          size: 18,
          itemStyle: {
            color: '#FAC858'
          }
        },
        pointer: {
          icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
          width: 8,
          length: '80%',
          offsetCenter: [0, '8%']
        },
        progress: {
          show: true,
          overlap: true,
          roundCap: true
        },
        axisLine: {
          roundCap: true
        },
        data: gaugeData,
        title: {
          fontSize: 14
        },
        detail: {
          width: 40,
          height: 14,
          fontSize: 14,
          color: '#fff',
          backgroundColor: 'inherit',
          borderRadius: 3,
          formatter: '{value}%'
        }
      }
    ]
  };

  return option;
}

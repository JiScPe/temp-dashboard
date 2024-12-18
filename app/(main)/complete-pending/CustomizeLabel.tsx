import React, { PureComponent } from "react";

class CustomizeLabel extends PureComponent {
  render() {
    const { x, y, value }: any = this.props;
    return (
      <text x={x} y={y} dy={-10} fill={"#cbd5e1"} fontSize={12} textAnchor="middle">
        {value.toFixed(2)}%
      </text>
    );
  }
}

export default CustomizeLabel;

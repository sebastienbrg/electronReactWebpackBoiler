import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage, Layer, Rect, Text} from 'react-konva'
import Konva from 'konva';
import Background from "./background"

const MainStage = (props: any) => {
  const {width,height} = props;

  return <Stage width={width} height={height}>
  <Background width={width-2} height={height-2}/>
  <Layer>
  </Layer>
  </Stage>;
};

export default MainStage;

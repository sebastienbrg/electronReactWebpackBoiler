import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage, Layer, Rect, Text} from 'react-konva'
import Konva from 'konva';
import Background from "./background"
import NameTag from "./components/nametag"
import LandingArea from "./components/landingarea"

const MainStage = (props: any) => {
  const {width,height} = props;
  const [landingarea, setLandingArea] = React.useState(null);

  return <Stage width={width} height={height}>
  <Background width={width-2} height={height-2} key={"bg"} />
  <Layer key={"fg"}>
    <LandingArea
      x={width - 100} y={height-50}
      setRectRef={(rectRef : any) => {
        console.log("ReactRef is set");
        setLandingArea(rectRef);
      }}
      />
    <NameTag  x={20} y={20}  name={"Nano"} key={"nt"} landingarea={landingarea}/>
  </Layer>
  </Stage>;
};

export default MainStage;

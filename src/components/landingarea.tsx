import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage, Layer, Rect, Text, Circle, Group} from 'react-konva'
import Konva from 'konva';

const LandingArea = (props: any) => {
  const rectRef = React.useRef(null);

  React.useEffect(() => {
    const bla : any = (rectRef.current as any);
    if(bla != null){
      props.setRectRef(bla);
    }
  }, [rectRef.current])

  return <Rect
    x={props.x}
    y={props.y}
    width={100}
    height={50}
    fill={"#FF0"}
    ref={rectRef}
    />

}

export default LandingArea;

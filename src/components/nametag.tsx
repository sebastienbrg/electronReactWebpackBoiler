import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage, Layer, Rect, Text, Circle, Group} from 'react-konva'
import Konva from 'konva';


interface NameTagProps {
  x:number,
  y:number,
  name: string,
  landingarea: any
}
const NameTag = (props : NameTagProps) => {
  const {x,y,name, landingarea} = props;
  const rectRef = React.useRef(null);
  const current : any = (rectRef.current as any);
  return (
    <Group
      draggable={true}
      onDragEnd={() => {
        if(current != null && landingarea != null){
          console.log("Dropping")
          current.to({
            x:props.x,
            y:props.y,
            duration: .2
          })
        } else {
          console.log("Not dropping")
        }
      }}
    >
      <Rect
        x={0}
        y={0}
        width={100}
        height={50}
        fill={"#FF0"}
        ref={rectRef}
      />
      <Text
        x={0}
        y={0}
        width={100}
        height={current==null? 50 : current.height}
        text={name}
        stroke={"#000"}
        align= {'center'}
        verticalAlign={'middle'}
      />
      </Group>
    );
};

export default NameTag;

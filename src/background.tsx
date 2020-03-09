import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage, Layer, Rect, Text, Circle} from 'react-konva'
import Konva from 'konva';

const Buble = (props: any) => {
  const me = React.useRef(null);
  const duration = 600 + Math.random()*500;
  let animTimeout : any = null;
  const animateTo = (x : number, y: number) => {
    (me as any).current.to({
        x,
        y,
        easing:Konva.Easings['EaseInOut'],
        duration:duration/1000
    });
    animTimeout = setTimeout(animate, duration+300);
  };
  const animate = () => {
    if(me === null )
      return;
    if(me.current == null)
      return;

      animateTo(Math.random() * props.sceneW,
                Math.random() * props.sceneH);
  };
   React.useEffect( animate
   , [me.current]);
  return <Circle
   {...props}
   radius={5}
   fill={"red"}
   ref={me}
   onClick={(e) => {


   }}
   />
};

const Background = (props : any) => {
  const {width,height} = props;
  const addBubles = () =>{
    const bubles = [];
    for (let i = 0; i < 10; ++i){
      bubles.push(<Buble
        x={i*10 + 25}
        y={i*13 + i+25}
        sceneW={width}
        sceneH={height}
        key={"bub"+i}
        />)
    }
    return bubles;
  }
  return (<Layer>
  <Rect width={width} height={height}
  fill={"#AAF"}
  />
  {addBubles()}
  </Layer>)
}

export default Background;

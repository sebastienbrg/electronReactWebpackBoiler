import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NameTag from "./name-tag"
import MainStage from "./mainstage"

ReactDOM.render(
  <div>
  <MainStage
      width={800}
      height={600}
  />
  </div>,
 document.getElementById('root'));

/* eslint-disable */
// eslint-disable-next-line
import React from "react" // eslint-disable-line
import {observer} from "mobx-react" // eslint-disable-line
import Circle from "./Circle" // eslint-disable-line

@observer
export default class AppList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {warning: []}
  }

  setMade(num, e) {
    this.props.store.circleList[num-1].makes = e.target.value
    if (this.props.store.circleList[num-1].shots) {
      if (this.props.store.circleList[num-1].makes > this.props.store.circleList[num-1].shots) {
        let index = this.state.warning.indexOf(num)
        if (index < 0) {
          let newArray = this.state.warning.concat(num)
          this.setState({warning: newArray})
        }
      }
      else {
        let index = this.state.warning.indexOf(num)
        if (index > -1) {
          this.state.warning.splice(index, 1)
        }
      }
    }
  }

  setTotal(num, e) {
    this.props.store.circleList[num-1].shots = e.target.value
    if (this.props.store.circleList[num-1].makes > this.props.store.circleList[num-1].shots) {
      let index = this.state.warning.indexOf(num)
      if (index < 0) {
        let newArray = this.state.warning.concat(num)
        this.setState({warning: newArray})
      }
    } else {
      let index = this.state.warning.indexOf(num)
      if (index > -1) {
        this.state.warning.splice(index, 1)
      }
    }
  }




  render() {
    const { circleList } = this.props.store;

    //const todoList = filteredTodos.map((todo, i) => (<li key={todo.id}><input type="checkbox" value={todo.complete } onChange={this.toggleComplete.bind(this, todo)} checked={todo.complete}/>{todo.value} </li>));




    return (
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-3 numbers">
                  <div className="row">
                    <div className="col-md-12">
                      <font style={{color: "dimgrey", width: "40px", margin: "0px 10px"}}>Shots Made</font><font style={{color: "dimgrey", width: "40px"}}>Shots Taken</font>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      &nbsp;1.<input type="text" inputMode="numeric" name="1-made" onChange={this.setMade.bind(this, 1)}/>
                      <input type="text" inputMode="numeric" name="1-total" onChange={this.setTotal.bind(this, 1)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      &nbsp;2.<input type="text" inputMode="numeric" name="2-made" onChange={this.setMade.bind(this, 2)}/>
                      <input type="text" inputMode="numeric" name="2-total" onChange={this.setTotal.bind(this, 2)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      &nbsp;3.<input type="text" inputMode="numeric" name="3-made" onChange={this.setMade.bind(this, 3)}/>
                      <input type="text" inputMode="numeric" name="3-total" onChange={this.setTotal.bind(this, 3)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      &nbsp;4.<input type="text" inputMode="numeric" name="4-made" onChange={this.setMade.bind(this, 4)}/>
                      <input type="text" inputMode="numeric" name="4-total" onChange={this.setTotal.bind(this, 4)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      &nbsp;5.<input type="text" inputMode="numeric" name="5-made" onChange={this.setMade.bind(this, 5)}/>
                      <input type="text" inputMode="numeric" name="5-total" onChange={this.setTotal.bind(this, 5)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      &nbsp;6.<input type="text" inputMode="numeric" name="6-made" onChange={this.setMade.bind(this, 6)}/>
                      <input type="text" inputMode="numeric" name="6-total" onChange={this.setTotal.bind(this, 6)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      &nbsp;7.<input type="text" inputMode="numeric" name="7-made" onChange={this.setMade.bind(this, 7)}/>
                      <input type="text" inputMode="numeric" name="7-total" onChange={this.setTotal.bind(this, 7)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      &nbsp;8.<input type="text" inputMode="numeric" name="8-made" onChange={this.setMade.bind(this, 8)}/>
                      <input type="text" inputMode="numeric" name="8-total" onChange={this.setTotal.bind(this, 8)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      &nbsp;9.<input type="text" inputMode="numeric" name="9-made" onChange={this.setMade.bind(this, 9)}/>
                      <input type="text" inputMode="numeric" name="9-total" onChange={this.setTotal.bind(this, 9)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      10.<input type="text" inputMode="numeric" name="10-made" onChange={this.setMade.bind(this, 10)}/>
                      <input type="text" inputMode="numeric" name="10-total" onChange={this.setTotal.bind(this, 10)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      11.<input type="text" inputMode="numeric" name="11-made" onChange={this.setMade.bind(this, 11)}/>
                      <input type="text" inputMode="numeric" name="11-total" onChange={this.setTotal.bind(this, 11)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      12.<input type="text" inputMode="numeric" name="12-made" onChange={this.setMade.bind(this, 12)}/>
                      <input type="text" inputMode="numeric" name="12-total" onChange={this.setTotal.bind(this, 12)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      13.<input type="text" inputMode="numeric" name="13-made" onChange={this.setMade.bind(this, 13)}/>
                      <input type="text" inputMode="numeric" name="13-total" onChange={this.setTotal.bind(this, 13)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      14.<input type="text" inputMode="numeric" name="14-made" onChange={this.setMade.bind(this, 14)}/>
                      <input type="text" inputMode="numeric" name="14-total" onChange={this.setTotal.bind(this, 14)}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      {(this.state.warning.length > 0) ? this.state.warning.map((key, i) => {return (<div>Number {key} has more shots than misses</div>)}) : null}
                    </div>
                  </div>
                </div>
                <div className="col-md-9">

                  <div>
                    <img src ="../shotAccuracyTemplate.png" width ="893" height ="604" alt="Basketball Court" />
                    <div id="pre-block">
                    </div>
                    <Circle shots={this.props.store.circleList[0].shots} made={this.props.store.circleList[0].makes} x={410} y={507} num={1}/>
                    <Circle shots={this.props.store.circleList[1].shots} made={this.props.store.circleList[1].makes} x={265} y={515} num={2}/>
                    <Circle shots={this.props.store.circleList[2].shots} made={this.props.store.circleList[2].makes} x={410} y={355} num={3}/>
                    <Circle shots={this.props.store.circleList[3].shots} made={this.props.store.circleList[3].makes} x={545} y={515} num={4}/>
                    <Circle shots={this.props.store.circleList[4].shots} made={this.props.store.circleList[4].makes} x={680} y={515} num={5}/>
                    <Circle shots={this.props.store.circleList[5].shots} made={this.props.store.circleList[5].makes} x={580} y={331} num={6}/>
                    <Circle shots={this.props.store.circleList[6].shots} made={this.props.store.circleList[6].makes} x={410} y={262} num={7}/>
                    <Circle shots={this.props.store.circleList[7].shots} made={this.props.store.circleList[7].makes} x={235} y={331} num={8}/>
                    <Circle shots={this.props.store.circleList[8].shots} made={this.props.store.circleList[8].makes} x={139} y={515} num={9}/>
                    <Circle shots={this.props.store.circleList[9].shots} made={this.props.store.circleList[9].makes} x={25} y={419} num={10}/>
                    <Circle shots={this.props.store.circleList[10].shots} made={this.props.store.circleList[10].makes} x={154} y={245} num={11}/>
                    <Circle shots={this.props.store.circleList[11].shots} made={this.props.store.circleList[11].makes} x={410} y={166} num={12}/>
                    <Circle shots={this.props.store.circleList[12].shots} made={this.props.store.circleList[12].makes} x={660} y={245} num={13}/>
                    <Circle shots={this.props.store.circleList[13].shots} made={this.props.store.circleList[13].makes} x={782} y={419} num={14}/>
                    <div style={{breakAfter: 'always'}}></div>
                  </div>
                  <div>
                    <div id="gap" style={{height: '210px'}}></div>
                    <img src ="../pointEfficiencyTemplate.png" width ="893" height ="604" alt="Basketball Court" />

                    <Circle shots={this.props.store.circleList[0].shots} made={this.props.store.circleList[0].makes} eff={true} x={410} y={507+800} num={1}/>
                    <Circle shots={this.props.store.circleList[1].shots} made={this.props.store.circleList[1].makes} eff={true} x={265} y={515+800} num={2}/>
                    <Circle shots={this.props.store.circleList[2].shots} made={this.props.store.circleList[2].makes} eff={true} x={410} y={355+800} num={3}/>
                    <Circle shots={this.props.store.circleList[3].shots} made={this.props.store.circleList[3].makes} eff={true} x={545} y={515+800} num={4}/>
                    <Circle shots={this.props.store.circleList[4].shots} made={this.props.store.circleList[4].makes} eff={true} x={680} y={515+800} num={5}/>
                    <Circle shots={this.props.store.circleList[5].shots} made={this.props.store.circleList[5].makes} eff={true} x={580} y={331+800} num={6}/>
                    <Circle shots={this.props.store.circleList[6].shots} made={this.props.store.circleList[6].makes} eff={true} x={410} y={262+800} num={7}/>
                    <Circle shots={this.props.store.circleList[7].shots} made={this.props.store.circleList[7].makes} eff={true} x={235} y={331+800} num={8}/>
                    <Circle shots={this.props.store.circleList[8].shots} made={this.props.store.circleList[8].makes} eff={true} x={139} y={515+800} num={9}/>
                    <Circle shots={this.props.store.circleList[9].shots} made={this.props.store.circleList[9].makes} eff={true} x={25} y={419+800} num={10}/>
                    <Circle shots={this.props.store.circleList[10].shots} made={this.props.store.circleList[10].makes} eff={true} x={154} y={245+800} num={11}/>
                    <Circle shots={this.props.store.circleList[11].shots} made={this.props.store.circleList[11].makes} eff={true} x={410} y={166+800} num={12}/>
                    <Circle shots={this.props.store.circleList[12].shots} made={this.props.store.circleList[12].makes} eff={true} x={660} y={245+800} num={13}/>
                    <Circle shots={this.props.store.circleList[13].shots} made={this.props.store.circleList[13].makes} eff={true} x={782} y={419+800} num={14}/>
                  </div>
                  <div className="row">
                    <div className="col-md-12 numbers">
                      <div style={{height: '20px'}}></div>
                      <button className="btn btn-default" type="button"
                      onClick={() => {window.print();}}
                      >Print This Page</button>
                    </div>
                  </div>
                </div>

            </div>
          </div>
          )
  }
}

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Breadcrumb } from 'antd';
import Table from '../component/tableComponent'
import Analityc from '../component/analytic'


export default function BasicExample() {
  return (
    <Router>
      <div>
        <Breadcrumb>
    <Breadcrumb.Item><Link style={{fontSize : '20px'}} to="/currencies">Currencies</Link></Breadcrumb.Item>
    <Breadcrumb.Item><Link style={{fontSize : '20px'}} to="/analysis/example.com">Analysis</Link></Breadcrumb.Item>
  </Breadcrumb>
        <hr />
        <Switch>
          <Route exact path="/Currencies" component={Table} />
          <Route path="/analysis/:url" component={Analityc} />
        </Switch>
      </div>
    </Router>
  );
}


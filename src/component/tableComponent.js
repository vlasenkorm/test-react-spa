import React from 'react';
import { Table, message } from 'antd';

const columns = [
  {
    title: 'Code',
    dataIndex: 'code',
    sorter: true,
    render: name => `${name}`,
    width: '20%',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    width: '20%',
    sorter: true,
  },
  {
    title: 'Rate Float',
    dataIndex: 'rate_float',
  },
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    render: row => <div>{row}</div>,
  },
];

class TableComponent extends React.Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
  };

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination })
    let timerId = setInterval(() => this.fetch({ pagination }), 10000);
  }

  componentWillUnmount(){
    clearInterval(this.timerId);
  }
  

  fetch = async (params = {}) => {
    this.setState({ loading: true });
     try {
      const data = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
      const bpiData = await data.json()
      message.success('Successfully load data');
      this.setState({
        loading: false,
        data: Object.values(bpiData.bpi),
      });
     } catch (error) {
      console.error(error)
      message.error(`Fail fetch data ${error}`);
     }
  };

  render() {
    const { data, pagination, loading } = this.state;
    return (
      <Table
        columns={columns}
        rowKey={record => record.code}
        dataSource={data}
        pagination={pagination}
        loading={loading}
      />
    );
  }
}


export default TableComponent;
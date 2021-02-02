import React from 'react';
import { List, Typography, Divider } from 'antd';
import { JSDOM } from 'jsdom'

function mode(arr) {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length
    - arr.filter(v => v === b).length
  ).pop();
}

function getDomDepthLevel(root = document.documentElement) {
  let pathInfo = {
      route: [],
      level: 0
  };

  for (let i = 0, j = root.children.length; i < j; i++) {
      const curNodePathInfo = getDomDepthLevel(root.children[i]);
      if (curNodePathInfo.level > pathInfo.level) {
          pathInfo = curNodePathInfo;
      }
  }
  pathInfo.route.unshift(root);
  pathInfo.level += 1;
  return pathInfo;
}

class Analytic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      proxyurl: "https://cors-anywhere.herokuapp.com/",
      listUniqueTags: [],
      mostUsedTag: '',
      theLongestPath: {}
    };
  }

  getDom(url) {
    fetch("https://cors-anywhere.herokuapp.com/" + url)
      .then(response => response.text())
      .then(contents => {
        // console.log(contents)
        const frag = JSDOM.fragment(contents);
        console.log(frag.querySelector("title").textContent);
        
        this.setState({
          listUniqueTags: this.uniqueTags(frag),
          mostUsedTag: this.mostUsedTag(frag),
          theLongestPath: this.theLongestPath(frag)
        })
        return contents
      })
      .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
  }

  getListTags(frag) {
    const listTags = []

    frag.childNodes.forEach(element => {
      if (element.tagName) listTags.push(element.tagName)
    })

    return listTags
  }

  uniqueTags(frag) {
    const listTags = this.getListTags(frag)
    return [...new Set(listTags)]
  }
  mostUsedTag(frag) {
    const listTags = this.getListTags(frag)
    return mode(listTags);
  }
  theLongestPath(frag) {
    return getDomDepthLevel(frag);
  }

  componentDidMount() {
    if (this.props.match.params.url) this.setState({ url: this.props.match.params.url })
    this.getDom(this.props.match.params.url)
  }

  render() {

    return (
      <div >
        <Typography.Title level={2}>Curr URL :  {this.state.url}</Typography.Title>
        <List
          header={<Typography.Title level={2}>UniqueTags</Typography.Title>}
          bordered
          dataSource={this.state.listUniqueTags}
          renderItem={item => (
            <List.Item>
              <Typography.Text mark>[Tag]</Typography.Text> {item}
            </List.Item>
          )}
        />
        <Typography.Title level={2}>Most Used Tag :  {this.state.mostUsedTag}</Typography.Title>
        <Divider/>
        <Typography.Title level={2}>Longest Path :  {this.state.theLongestPath.level} level</Typography.Title>
      </div>
    );
  }
}

export default Analytic;
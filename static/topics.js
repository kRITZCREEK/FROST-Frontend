import {Panel} from 'react-bootstrap'
import React from 'react'

var Topic = React.createClass({
  handleClick: function() {
    var event = new CustomEvent('clickTopic',
                                { 'detail': this.props.topic });
    this.props.emit(event);
  },
  handleDragStart: function(e) {
    var event = new CustomEvent('dragStartTopic',
                                { 'detail': this.props.topic});
    e.dataTransfer.setData('text/plain', 'F**k Firefox');
    this.props.emit(event);
  },
  handleDragEnd: function() {
    var event = new CustomEvent('dragEndTopic',
                                { 'detail': this.props.topic});
    this.props.emit(event);
  },
  render: function(){
    return (
    <div className={"topic draggable"}
      onClick={this.handleClick}
      draggable="true"
      onDragStart={this.handleDragStart}
      onDragEnd={this.handleDragEnd}>
        <div className="description"> Thema: {this.props.topic.topicDescription}</div>
        <div className="typ"> Typ: {this.props.topic.topicTyp}</div>
    </div>
    );
  }
});

var Topics = React.createClass({
  emit: function(event){
    this.getDOMNode().dispatchEvent(event);
  },
  render: function(){
    var topics = this.props.topics
      .map(function(topic){
        return (
            <Topic topic={topic} key={topic.topicDescription} emit={this.emit} />
        );
      }, this);
    return (
        <Panel id="topicsContainer" header="Themen" bsStyle="primary">
        <div id="topic">
          {topics}
        </div>
        </Panel>
    );
  }
});

export default Topics
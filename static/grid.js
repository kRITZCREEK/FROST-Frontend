import React from 'react'
import {Table, Button, ModalTrigger, Modal, Input} from 'react-bootstrap'
import moment from 'moment'
import _ from 'lodash'

var AddRoomModal = React.createClass({
  handleClick: function() {
    var event = new CustomEvent('addRoom',
                                {
                                  'detail': {
                                    name: $('#nameInput').val(),
                                    capacity: parseInt($('#capacityInput').val())
                                  }
                                });
    this.props.emit(event);
    this.props.onRequestHide();
  },
  render: function() {
    return (
        <Modal {...this.props} title="New Room" animation={true}>
          <div className="modal-body">
            <form role="form">
              <div className="form-group">
                <Input type="text" label="Room" id="nameInput"/>
              </div>
              <div className="form-group">
                <Input type="number" label="Capacity" id="capacityInput"> </Input>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <Button onClick={this.props.onRequestHide}>Close</Button>
            <Button bsStyle="success" onClick={this.handleClick}>Add</Button>
          </div>
        </Modal>
    );
  }
});

var OpenAddRoomModal = React.createClass({
  render: function (){
    return (
        <ModalTrigger modal={<AddRoomModal {...this.props}/>}>
          <Button className="btn-block" bsStyle="success">New Room</Button>
        </ModalTrigger>
    );
  }
});

var AddBlockModal = React.createClass({
  getInitialState: function() {
    return {
      start: {
        hours: 0, minutes: 0
      },
      end: {
        hours: 0, minutes: 0
      }};
  },
  componentDidMount: function() {
    var self = this;
    var start = $('#start');
    start.datetimepicker({
      format: 'LT',
      stepping: 15
    });

    start.on('dp.change', function(event) {
      self.setState(
        {
          start: {
            hours: event.date.hours(),
            minutes: event.date.minutes()
          }
        });
    });

    var end = $('#end');
    end.datetimepicker({
      format: 'LT',
      stepping: 15
    });

    end.on('dp.change', function(event) {
      self.setState(
        {
          end: {
            hours: event.date.hours(),
            minutes: event.date.minutes()
          }
        });
    });

  },
  handleClick: function() {
    var event = new CustomEvent('addBlock',
                                {
                                  'detail': {
                                    'description': $('#descriptionInput').val(),
                                    'startHours': this.state.start.hours,
                                    'startMinutes': this.state.start.minutes,
                                    'endHours': this.state.end.hours,
                                    'endMinutes': this.state.end.minutes
                                  }
                                });
    this.props.emit(event);
    this.props.onRequestHide();
  },
  render: function() {
    return (
        <Modal {...this.props} title="New Block" animation={true}>
          <div className="modal-body">
            <form role="form">
              <div className="form-group">
                <Input type="text" label="Description" id="descriptionInput"/>
                <label htmlFor="start">Start</label>
                <div className='input-group date' id="start">
                    <Input type='text' className="form-control" />
                    <span className="input-group-addon">
                      <span className="glyphicon glyphicon-time"></span>
                    </span>
                </div>
                <label htmlFor="end">End</label>
                <div className='input-group date' id="end">
                  <Input type='text' className="form-control" />
                  <span className="input-group-addon">
                    <span className="glyphicon glyphicon-time"></span>
                  </span>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <Button onClick={this.props.onRequestHide}>Close</Button>
            <Button bsStyle="success" onClick={this.handleClick}>Add</Button>
          </div>
        </Modal>
    );
  }
});

var OpenAddBlockModal = React.createClass({
  render: function (){
    return (
        <ModalTrigger modal={<AddBlockModal {...this.props}/>}>
          <Button className="btn-block" bsStyle="success">New Block</Button>
        </ModalTrigger>
    );
  }
});

var Tableheader = React.createClass({
  handleDelete: function(block) {
    var event = new CustomEvent('deleteBlock', {'detail': block});
    this.props.emit(event);
  },
  render: function(){
    var ths = this.props.blocks
      .map(function(block){
        var timeStart = moment(block.startHours + ':' + block.startMinutes,
         'HH:mm').format('LT');
        var timeEnd = moment(block.endHours + ':' + block.endMinutes,
         'HH:mm').format('LT');
        return (
            <th key={block.description}>
            <div>
              <div>
                {block.description}
              </div>
              <div>
                {timeStart + ' - ' + timeEnd}
              </div>
            </div>
            <span className="glyphicon glyphicon-trash"
            onClick={this.handleDelete.bind(this, block)}></span>
            </th>
        );
      }, this);
    return (
      <thead>
        <tr>
        <th></th>
        {ths}
        <th><OpenAddBlockModal emit={this.props.emit}/></th>
      </tr>
    </thead>
    );
  }
});

var Tablebody = React.createClass({
  render: function(){
    var blocks = this.props.blocks;
    var rows = _.zip(this.props.rooms, this.props.grid)
      .map(function(row){
        var room = _.head(row);
        return (
            <Tablerow room={room} blocks={blocks} row={_.tail(row)[0]}
              key={room.name} emit={this.props.emit}></Tablerow>
        );
      }, this);
    return (
        <tbody>
        {rows}
        <tr>
          <td>
            <OpenAddRoomModal emit={this.props.emit}/>
          </td>
        </tr>
      </tbody>
    );
  }
});

var Tablerow = React.createClass({
  handleDelete: function(){
    var event = new CustomEvent('deleteRoom', {'detail': this.props.room});
    this.props.emit(event);
  },
  render: function(){
    var topics = _.zip(this.props.blocks, this.props.row)
          .map(function(zip){
            var block = zip[0];
            var topic = zip[1];
            return (
                <Tablecell key={block.start} room={this.props.room}
                 block={block} topic={topic} emit={this.props.emit} />
            );
      }, this);
    return (
      <tr>
        <td>
          {this.props.room.name}
          <span className="glyphicon glyphicon-trash"
          onClick={this.handleDelete}>
          </span>
        </td>
        {topics}
      </tr>
    );
  }
});

var Tablecell = React.createClass({
  getInitialState: function(){
    return {dragOver: false};
  },
  handleDragStart: function(e) {
    var event = new CustomEvent('dragStartGridTopic',
                                {'detail': this.props.topic.value0});
    e.dataTransfer.setData('text/plain', 'F**k Firefox');
    this.props.emit(event);
  },
  handleDragEnd: function() {
    var event = new CustomEvent('dragEndGridTopic',
                                {'detail': this.props.topic.value0});
    this.props.emit(event);
  },
  handleDragEnter: function(){
    this.setState({dragOver: true});
  },
  handleDragLeave: function(){
    this.setState({dragOver: false});
    var event = new CustomEvent('dragLeaveSlot');
    this.props.emit(event);
  },
  handleDragOver: function(){
    var event = new CustomEvent('dragOverSlot',
                                {'detail': { 'room': this.props.room,
                                             'block': this.props.block }});
    this.props.emit(event);
  },
  render: function(){
    var topic = this.props.topic.value0;
    var highlight = this.state.dragOver;
    if(topic){
      return (
        <td>
        <div className={highlight ? 'tabletopic highlight draggable' : 'tabletopic draggable'}
          draggable={'true'}
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          onDragOver={this.handleDragOver} >
            {topic.description}
        </div>
        </td>
      );
    }else{
    return (
      <td
        className={highlight ? 'highlight' : ''}
        draggable={'false'}
        onDragEnd={this.handleDragEnd}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
      />
    );
    }
  }
});

var Grid = React.createClass({
  emit: function(event){
    this.getDOMNode().dispatchEvent(event);
  },
  render: function(){
    return (
        <Table striped bordered condensed id='gridContainer'>
          <Tableheader blocks={this.props.blocks} emit={this.emit}/>
          <Tablebody {...this.props} emit={this.emit}/>
        </Table>
    );
  }
});

export default Grid

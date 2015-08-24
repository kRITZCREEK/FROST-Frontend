import React from 'react';
import Tablecell from 'babel!./Tablecell.js';

import _ from 'lodash';

var Tablerow = React.createClass({
    handleDelete() {
        this.props.emit(
            new CustomEvent('deleteRoom', {
                'detail': this.props.room
            })
        );
    },
    render() {
        var topics = _.zip(this.props.blocks, this.props.row)
                .map(([block, topic]) =>
                     <Tablecell block={block} emit={this.props.emit} key={block.start} room={this.props.room} topic={topic} />
                    );
        return (
                <tr>
                <td>
                {this.props.room.name}
                <i className="close icon" onClick={this.handleDelete} />
                </td>
                {topics}
            </tr>
        );
    }
});

export default Tablerow;
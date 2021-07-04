import React, { Fragment } from 'react';
import { format } from 'timeago.js';
import ReactEmoji from 'react-emoji';

const Message = ({ message, owner }) => {
  return (
    <Fragment>
      <div className={owner ? 'd-flex justify-content-end' : 'd-flex justify-content-start'}>
        <div className={owner ? 'msg_cotainer' : 'msg_cotainer_send'}>{ReactEmoji.emojify(message.text)}</div>
      </div>
      <span className={owner ? 'msg_time_send ' : 'msg_time'}>{format(message.createdAt)}</span>
    </Fragment>
  );
};

export default Message;

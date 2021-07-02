import React, { Fragment } from 'react';
import {format} from 'timeago.js'

const Message = ({message,owner}) => {
  return (
    <Fragment>
        <div className={owner ? "d-flex justify-content-end mb-4":"d-flex justify-content-start mb-4"}>
        <div className={owner ? "msg_cotainer" : "msg_cotainer_send"}>
            {message.text}
            <span className="msg_time mt-1">{format(message.createdAt)}</span>
        </div>
        </div>      
    </Fragment>
  );
};

export default Message;

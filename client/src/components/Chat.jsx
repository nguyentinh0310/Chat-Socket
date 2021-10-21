import { AuthContext } from 'app/contexts/AuthContext';
import { URL_SOCKET } from 'app/contexts/contants';
import axios from 'axios';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import ListUser from './ListUser';
import Message from './Message';

const Chat = () => {
  const {
    authState: { user },
    logout,
  } = useContext(AuthContext);

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userAnother, setUserAnother] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState('');
  const scrollRef = useRef();

  const handleLogOut = () => logout();
  // Bắt đầu kết nối tới socket
  const socket = useRef();

  useEffect(() => {
    socket.current = io(URL_SOCKET);
    // nhận lại danh sách tin nhắn  từ phía server
    socket.current.on('get_message', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  // list ra danh sách tin nhắn và nhận sự thay đổi khi có tin nhắn mới tới trong phòng chat hiện tại
  //  [...prev, arrivalMessage]) list ra tin nhắn cũ và mới
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  //socket nhận sự thay đổi từ user
  useEffect(() => {
    // client gửi sự kiện 'add_user' với userId hiện tại cho server
    socket.current.emit('add_user', user._id);
    //  client nhận lại danh sách user đang onl
    socket.current.on('get_users', (users) => {
      console.log(users);
    });
  }, [user]);

  // lấy ra danh sách cuộc hội thoại nhận sự thay đổi từ user._id
  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get(`/api/conversation/` + user._id);
        setConversations(response.data);
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    };
    getConversation();
  }, [user._id]);

  // lấy ra nhưng message thoại nhận sự thay đổi từ currentChat
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(`/api/message/` + currentChat?._id);
        setMessages(response.data);
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    };
    getMessage();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    // nếu giá trị rỗng ko đc phép gửi
    if (!content) {
      return;
    }

    const message = {
      sender: user._id,
      text: content,
      conversationId: currentChat._id,
    };

    // lọc ra người nhận tương ứng trong cuộc trò chuyện hiện tại
    const receiverId = currentChat.members.find((member) => member !== user._id);
    // gửi tin nhắn cho phía server và nhận lại ở phía đối phương
    socket.current.emit('send_message', {
      senderId: user._id,
      receiverId,
      text: content,
    });
    try {
      const response = await axios.post(`/api/message`, message);
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      const content = newMessage.trim();
      // nếu giá trị rỗng ko đc phép gửi
      if (!content) {
        return;
      }
      const message = {
        sender: user._id,
        text: content,
        conversationId: currentChat._id,
      };

      // lọc ra người nhận tương ứng trong cuộc trò chuyện hiện tại
      const receiverId = currentChat.members.find((member) => member !== user._id);
      // gửi tin nhắn cho phía server và nhận lại ở phía đối phương
      socket.current.emit('send_message', {
        senderId: user._id,
        receiverId,
        text: content,
      });

      try {
        const response = await axios.post(`/api/message`, message);
        setMessages([...messages, response.data]);
        setNewMessage('');
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    }
  };
  // scrollbar
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // hàm thực hiện chức năng lấy ra bạn đang chat nhận sự thay đổi từ phòng chat hiện tại và user
  useEffect(() => {
    const getUserAnother = async () => {
      try {
        const friendId = currentChat?.members.find((m) => m !== user._id);
        console.log(friendId, 'friendId');
        if (friendId) {
          const response = await axios.get(`/api/auth?userId=` + friendId);
          setUserAnother(response.data)
        }
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    };
    getUserAnother();
  }, [currentChat, user._id]);


  return (
    <Fragment>
      <div className="container-fluid h-100">
        <div className="row justify-content-center h-100">
          <div className="col-md-4 col-xl-3 chat">
            <div className="card mb-sm-3 mb-md-0 contacts_card">
              <div className="card-header">
                <div className="d-flex bd-highlight">
                  <div className="img_cont">
                    <img src={user.avatar} className="rounded-circle user_img" alt="avatar" />
                    <span className="online_icon"></span>
                  </div>
                  <div className="user_info">
                    <span>{user.fullname}</span>
                  </div>
                </div>
                <div className="input-group mt-3">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control search"
                    name=""
                  />
                  <div className="input-group-prepend">
                    <span className="input-group-text search_btn">
                      <i className="fas fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-body contacts_body">
                <ul className="contacts">
                  {conversations.map((conversation) => (
                    <div onClick={() => setCurrentChat(conversation)} key={conversation._id}>
                      <ListUser conversation={conversation} currentUser={user} />
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-8 col-xl-6 chat">
            <div className="card">
              {currentChat ? (
                <Fragment>
                  <div className="card-header msg_head">
                    <div className="d-flex bd-highlight">
                      <div className="img_cont">
                        <img src={userAnother?.avatar} className="rounded-circle user_img" alt="" />
                      </div>
                      <div className="user_info">
                        <span>{userAnother?.fullname}</span>
                      </div>
                      <div className="video_cam">
                        <span>
                          <i className="fas fa-video"></i>
                        </span>
                        <span>
                          <i className="fas fa-phone"></i>
                        </span>
                      </div>
                    </div>
                    <span id="action_menu_btn" onClick={handleLogOut}>
                      <i className="fas fa-sign-out-alt"></i>
                    </span>
                  </div>

                  <div className="card-body msg_card_body">
                    {messages.map((message) => (
                      <div ref={scrollRef} key={message._id}>
                        <Message key={message._id} message={message} owner={message.sender === user._id} />
                      </div>
                    ))}
                  </div>

                  <div className="card-footer">
                    <div className="input-group">
                      <div className="input-group-append">
                        <span className="input-group-text attach_btn">
                          <i className="fas fa-paperclip"></i>
                        </span>
                      </div>
                      <input
                        placeholder="Type your message..."
                        className="form-control type_msg"
                        name="newMessage"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                      <div className="input-group-append">
                        <span className="input-group-text send_btn" onClick={handleSubmit}>
                          <i className="fas fa-location-arrow"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className="card-header msg_head">
                    <span id="action_menu_btn" onClick={handleLogOut}>
                      <i className="fas fa-sign-out-alt"></i>
                    </span>
                  </div>

                  <div className="alert alert-info alert-dismissible fade show mt-4" role="alert">
                    Mời chọn cuộc hội thoại
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Chat;

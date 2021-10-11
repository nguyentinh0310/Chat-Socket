import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ListUser = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        // tìm nhưng userId trong cuộc hội thoại khác với userid hiện tại
        const friendId = conversation.members.find((member) => member !== currentUser._id);
        // lấy ra danh sách user nhận sự thay đổi từ currentUser,conversation
        const response = await axios.get(`/api/auth?userId=` + friendId);
        setUser(response.data);
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    };
    getUser();
  }, [currentUser, conversation]);


  return (
    <li className="active">
      <div className="d-flex bd-highlight">
        <div className="img_cont">
          <img src={user?.avatar} className="rounded-circle user_img" alt="avatar" />
        </div>
        <div className="user_info">
          <span>{user?.fullname}</span>
        </div>
      </div>
    </li>
  );
};

export default ListUser;

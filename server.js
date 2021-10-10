require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const path = require("path");

const app = express();
const router = require('./router');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(router);

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentails: true,
  },
});

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('Can not to mongodb!');
      console.error(err);
    } else {
      console.log('Connected to MongoDB!');
    }
  }
);

let users = [];

// hàm thêm user
const addUser = (userId, socketId) => {
  // check user có online không và thêm vào mảng users
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

// hàm xóa user
const removeUser = (socketId) => {
  // gán biến nhận sự thay đổi
  users = users.filter((user) => user.socketId !== socketId);
};
//  lấy user
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// Mở socket
io.on('connection', (socket) => {
  console.log(`Có người vừa kết nối, socketID: ${socket.id}`);

  // lấy userId và socketId từ user
  // nhận sự kiện từ client = socket.on
  socket.on('add_user', (userId) => {
    addUser(userId, socket.id);
    // gửi lại danh sách tất cả user đang online cho client
    io.emit('get_users', users);
  });

  // gửi và lấy ra message
  // nhận message gồm { senderId, receiverId, text }
  socket.on('send_message', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    // sau khi nhận tin nhắn thì lấy lại tin nhắn cho đối phương
    // Gửi tin nhắn riêng cho socket đó qua socketId
    if (user) {
      io.to(user.socketId).emit('get_message', {
        senderId,
        text,
      });
    }
  });

  //ngắt kết nốt với socket
  socket.on('disconnect', () => {
    console.log('Disconnected!');
    // loại bỏ di user chứa (socketId) khi ngắt kết nôi
    removeUser(socket.id);
    // gửi lại danh sách tất cả user đang online cho client
    io.emit('get_users', users);
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 9000;

http.listen(PORT, () => {
  console.log(`Sever is running port at`, PORT);
});

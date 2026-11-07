const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static(path.join(__dirname, 'public')));

// Menyimpan data room: { roomCode: { teacherId, status, players: { socketId: playerObj } } }
const rooms = {};

// Generator kode kelas unik (6 karakter acak)
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

io.on('connection', (socket) => {
  console.log(`[+ Connected] ID: ${socket.id}`);

  // 1. GURU BUAT RUANGAN KELAS
  socket.on('createRoom', () => {
    let roomCode = generateRoomCode();
    while (rooms[roomCode]) {
      roomCode = generateRoomCode();
    }

    rooms[roomCode] = {
      teacherId: socket.id,
      status: 'waiting', // 'waiting' atau 'playing'
      players: {}
    };

    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.isTeacher = true;

    socket.emit('roomCreated', roomCode);
    console.log(`[Room Created] Kode: ${roomCode} oleh Guru (${socket.id})`);
  });

  // 2. SISWA BERGABUNG DENGAN KODE KELAS
  socket.on('joinRoom', ({ name, roomCode }) => {
    const code = roomCode.toUpperCase().trim();
    const room = rooms[code];

    if (!room) {
      return socket.emit('errorMsg', 'Kode kelas tidak ditemukan! Periksa kembali kode dari gurumu.');
    }

    if (room.status === 'playing') {
      return socket.emit('errorMsg', 'Permainan di kelas ini sudah dimulai.');
    }

    socket.join(code);
    socket.roomCode = code;
    socket.isTeacher = false;

    const newPlayer = {
      id: socket.id,
      name: name || `Siswa-${socket.id.substring(0, 4)}`,
      score: 0,
      x: (Math.random() - 0.5) * 8,
      y: 0,
      z: (Math.random() - 0.5) * 8,
      rotationY: 0,
      color: Math.floor(Math.random() * 16777215)
    };

    room.players[socket.id] = newPlayer;

    // Sampaikan konfirmasi ke siswa
    socket.emit('joinedSuccess', { roomCode: code, players: room.players, myId: socket.id });

    // Informasikan ke seluruh anggota ruangan (termasuk guru)
    io.to(code).emit('playerJoinedRoom', newPlayer);
    console.log(`[Student Joined] ${newPlayer.name} masuk ke Room ${code}`);
  });

  // 3. GURU MEMULAI GAME SERENTAK
  socket.on('startGame', () => {
    const code = socket.roomCode;
    const room = rooms[code];

    if (room && socket.isTeacher) {
      room.status = 'playing';
      io.to(code).emit('gameStarted');
      console.log(`[Game Started] Permainan dimulai di Room ${code}`);
    }
  });

  // 4. SINKRONISASI POSISI PEMAIN REAL-TIME
  socket.on('playerMovement', (posData) => {
    const code = socket.roomCode;
    const room = rooms[code];

    if (room && room.players[socket.id]) {
      const p = room.players[socket.id];
      p.x = posData.x;
      p.y = posData.y;
      p.z = posData.z;
      p.rotationY = posData.rotationY;

      // Broadcast koordinat terbaru ke seluruh pemain lain dalam room
      socket.to(code).emit('playerMoved', p);
    }
  });

  // 5. UPDATE SKOR KUIS
  socket.on('updateScore', (scoreData) => {
    const code = socket.roomCode;
    const room = rooms[code];

    if (room && room.players[socket.id]) {
      room.players[socket.id].score += scoreData.addedScore;
      io.to(code).emit('leaderboardUpdate', Object.values(room.players));
    }
  });

  // 6. PENANGANAN KONEKSI TERPUTUS
  socket.on('disconnect', () => {
    const code = socket.roomCode;
    if (code && rooms[code]) {
      if (socket.isTeacher) {
        io.to(code).emit('errorMsg', 'Guru terputus. Ruangan kelas ditutup.');
        delete rooms[code];
      } else {
        delete rooms[code].players[socket.id];
        io.to(code).emit('playerLeft', socket.id);
      }
    }
    console.log(`[- Disconnected] ID: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server ZuperVerse Matematika SD berjalan pada http://localhost:${PORT}`);
});

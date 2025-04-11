import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3367d6;
  }
`;

const CreateRoomButton = styled(Button)`
  background-color: #34a853;

  &:hover {
    background-color: #2e8b57;
  }
`;

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = uuidv4().substring(0, 8);
    navigate(`/room/${newRoomId}`);
  };

  return (
    <HomeContainer>
      <h2>Join a Canvas Chatroom</h2>
      <Form onSubmit={handleJoinRoom}>
        <Input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
        />
        <Button type="submit">Join Room</Button>
      </Form>
      <p>OR</p>
      <CreateRoomButton onClick={handleCreateRoom}>
        Create New Room
      </CreateRoomButton>
    </HomeContainer>
  );
};

export default Home;

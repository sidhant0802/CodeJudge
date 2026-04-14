import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { SocketProvider } from './context/SocketContext';
// Add import at top
import Leaderboard from './Components/Leaderboard';

// Add route inside <Routes></Routes>
import Profile from './Components/Profile';
import ProfileSettings from './Components/ProfileSettings';
import Userlist from './Components/Userlist';
import Friends from './Components/Friends';
import UpdateUser from './Components/UpdateUser';

import RegisterPage from './Components/RegisterPage';
import Register from './Components/Register';
import Login from './Components/Login';

import ChangePassword from './Components/ChangePassword';
import VerifyOTP from './Components/VerifyOTP';
import ForgotPassword from './Components/ForgotPassword';

import Homepage from './Components/Homepage';

import ProblemSet from './Components/ProblemSet';
import ProblemDescription from './Components/ProblemDescription';
import UpdateProblem from './Components/UpdateProblem';
import CreateProblem from './Components/CreateProblem';

import TestcasesSet from './Components/TestcasesSet';
import TestcaseDescription from './Components/TestcaseDescription';
import CreateTestcase from './Components/CreateTestcase';
import UpdateTestcase from './Components/UpdateTestcase';

import SubmissionsByHandle from './Components/SubmissionsByHandle';
import SubmissionsByPID from './Components/SubmissionsByPID';
import Submissions from './Components/Submissions';

// Blog imports
import Blogs from './Components/Blogs';
import BlogDetail from './Components/BlogDetail';
import CreateBlog from './Components/CreateBlog';

// Compete imports
import CompeteLobby from './Components/compete/CompeteLobby';
import BattleArena from './Components/compete/BattleArena';

// Chat imports
import Chat from './Components/Chat';
import ChatList from './Components/ChatList';

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/Leaderboard" element={<Leaderboard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/VerifyOTP/:id" element={<VerifyOTP />} />
          <Route path="/ChangePassword/:id/:id1" element={<ChangePassword />} />

          <Route path="/homepage" element={<Homepage />} />

          <Route path="/Profile/:id" element={<Profile />} />
          <Route path="/ProfileSettings/:id" element={<ProfileSettings />} />
          <Route path="/Friends" element={<Friends />} />
          <Route path="/Userlist" element={<Userlist />} />

          <Route path="/UpdateUser/:id" element={<UpdateUser />} />

          <Route path="/ProblemSet" element={<ProblemSet />} />
          <Route path="/ProblemDescription/:id" element={<ProblemDescription />} />
          <Route path="/CreateProblem" element={<CreateProblem />} />
          <Route path="/UpdateProblem/:id" element={<UpdateProblem />} />

          <Route path="/TestcasesSet/:id" element={<TestcasesSet />} />
          <Route path="/TestcaseDescription/:id" element={<TestcaseDescription />} />
          <Route path="/CreateTestcase/:id" element={<CreateTestcase />} />
          <Route path="/UpdateTestcase/:id1/:id" element={<UpdateTestcase />} />

          <Route path="/SubmissionsByPID/:id" element={<SubmissionsByPID />} />
          <Route path="/SubmissionsByHandle" element={<SubmissionsByHandle />} />
          <Route path="/Submissions/:filterField/:filterValue" element={<Submissions />} />

          {/* Blog Routes */}
          <Route path="/Blogs" element={<Blogs />} />
          <Route path="/Blogs/:id" element={<BlogDetail />} />
          <Route path="/CreateBlog" element={<CreateBlog />} />
          <Route path="/EditBlog/:id" element={<CreateBlog />} />

          {/* Compete Routes */}
          <Route path="/Compete" element={<CompeteLobby />} />
          <Route path="/Compete/Battle/:roomId" element={<BattleArena />} />

          {/* Chat Routes */}
          <Route path="/ChatList" element={<ChatList />} />
          <Route path="/chat/:userhandle" element={<Chat />} />

        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
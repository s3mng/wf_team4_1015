import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;

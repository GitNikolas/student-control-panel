import './styles/index.css';
import { BrowserRouter, Routes, Route } from "react-router";
import { Main } from "../pages/Main";
import { Student } from "../pages/Student/ui";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { Header } from "../widgets/Header/ui";

function App() {

  return (
      <BrowserRouter>
          <Layout style={{ minHeight: '100vh' }}>
              <Header />
              <Content style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', width: '100%' }}>
                  <Routes>
                      <Route path="/" element={<Main />} />
                      <Route path="/students/:id" element={<Student />} />
                  </Routes>
              </Content>
          </Layout>
      </BrowserRouter>
  )
}

export default App

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Page from './routes/page/index.tsx'
import UploadImage from './routes/uploadImage/index.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Page />}></Route>
        <Route path='/uploadImage' element={<UploadImage />}></Route>
      </Routes>
    </Router>
  </React.StrictMode>,
)

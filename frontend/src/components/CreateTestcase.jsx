// import React, {useState} from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// axios.defaults.withCredentials = true;
// import Navbar from './Navbar';
// import { API_BASE_URL } from './config';

// import { useNavigate } from 'react-router-dom';

// function CreateTestcase(){
//     const {id:PID}=useParams();
//     // console.log("PID is ",PID);
//     const navigate = useNavigate();
//     const[formData,setData]=useState({
//         TestcaseName:"",
//         PID:PID,
//         Input:"",
//         Solution:"",
//     });
//     const handleChange= (e)=>{

//         const{name,value}=e.target;
//         setData((prevData)=>({
//             ...prevData,
//             [name]: value
//         }));
//     };
    
//     const handleSubmit= async(e)=>{
//         e.preventDefault();
//         try{
//             const response= await axios.post(`${API_BASE_URL}/api/tests/create`,formData);
//             alert(`Success: ${response.data.message}`);
//             // console.log(formData);
//             navigate(`/TestcaseDescription/${response.data.testcase._id}`);
//         }
//         catch(error){
//             console.log("error in submitting while creating testcase");
//             if (error.response) {
//                 console.error('Response data:', error.response.data);
//                 console.error('Response status:', error.response.status);
//                 console.error('Response headers:', error.response.headers);
//                 alert(`Error: ${error.response.data.message}`); // Include server error response in alert message
//               } 
//               else if (error.request) {
//                 console.error('Request data:', error.request);
//               } 
//               else {
//                 console.error('Error message:', error.message);
//               }
//             // console.log(error);
//             // console.log(formData);
//             // alert("An error occured. please try again.");
//         }
//     };

// return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
//         <Navbar />
//         <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Create a New Test</h2>
            
//             <div className="mb-4">
//                 <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2" htmlFor="TestcaseName">
//                     Test Name:
//                 </label>
//                 <input
//                     className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                     id="TestcaseName"
//                     type="text"
//                     name="TestcaseName"
//                     value={formData.TestcaseName}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
//             <div className="mb-4">
//                 <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2" htmlFor="Input">
//                     Input:
//                 </label>
//                 <textarea
//                     className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                     id="Input"
                    
//                     name="Input"
//                     value={formData.Input}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
//             <div className="mb-4">
//                 <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2" htmlFor="Solution">
//                     Solution:
//                 </label>
//                 <textarea
//                     className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                     id="Solution"
//                     name="Solution"
//                     value={formData.Solution}
//                     onChange={handleChange}
//                     required
//                 />
//             </div>
//             <div className="flex items-center justify-between">
//                 <button
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                     type="submit"
//                 >
//                     Create
//                 </button>
//             </div>
//         </form>
//     </div>
// );
// }
// export default CreateTestcase;









import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
import Navbar from './Navbar';
import { API_BASE_URL } from './config';

const inputStyle = {
  background: '#0d1117',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#c9d1d9',
  borderRadius: 10,
  padding: '10px 14px',
  fontSize: 14,
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

function StyledInput({ ...props }) {
  return (
    <input {...props} style={inputStyle}
      onFocus={e => { e.target.style.borderColor = 'rgba(97,175,239,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(97,175,239,0.08)'; }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
  );
}

function StyledTextarea({ rows = 4, ...props }) {
  return (
    <textarea rows={rows} {...props} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, fontFamily: "'Fira Code', 'Fira Mono', monospace" }}
      onFocus={e => { e.target.style.borderColor = 'rgba(97,175,239,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(97,175,239,0.08)'; }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold" style={{ color: '#c9d1d9' }}>{label}</label>
        {hint && <span className="text-xs" style={{ color: '#4a5568' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export default function CreateTestcase() {
  const { id: PID } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setData] = useState({
    TestcaseName: '',
    PID: PID,
    Input: '',
    Solution: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/tests/create`, formData);
      alert(`Success: ${response.data.message}`);
      navigate(`/TestcaseDescription/${response.data.testcase._id}`);
    } catch (error) {
      if (error.response) alert(`Error: ${error.response.data}`);
      else alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* Static bg glows */}
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          {/* Page header */}
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#61afef' }}>
              CodeJudge · Admin
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              Create Testcase
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
              Adding testcase for problem{' '}
              <span className="font-mono font-bold" style={{ color: '#61afef' }}>{PID}</span>
            </p>
          </div>

          {/* Form card */}
          <form onSubmit={handleSubmit}>
            <div className="rounded-2xl border overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>

              {/* Card header */}
              <div className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#10b981' }} />
                <span className="text-sm font-semibold" style={{ color: '#8b9ab0' }}>Testcase Details</span>
              </div>

              <div className="p-6 flex flex-col gap-5">

                {/* Test Name */}
                <Field label="Test Name" hint="Used for identification">
                  <StyledInput
                    type="text" name="TestcaseName"
                    value={formData.TestcaseName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Sample Test 1" />
                </Field>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

                {/* Input / Solution side by side on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Input" hint="Raw input data">
                    <StyledTextarea
                      rows={8} name="Input"
                      value={formData.Input}
                      onChange={handleChange}
                      required
                      placeholder={"e.g.\n2\n3 5"} />
                  </Field>

                  <Field label="Expected Output" hint="Exact expected output">
                    <StyledTextarea
                      rows={8} name="Solution"
                      value={formData.Solution}
                      onChange={handleChange}
                      required
                      placeholder={"e.g.\n8"} />
                  </Field>
                </div>

                {/* Preview strip */}
                {(formData.Input || formData.Solution) && (
                  <div className="rounded-xl p-4 border"
                    style={{ borderColor: 'rgba(97,175,239,0.15)', background: 'rgba(97,175,239,0.04)' }}>
                    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#61afef' }}>Preview</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs mb-1" style={{ color: '#4a5568' }}>Input</p>
                        <pre className="text-xs whitespace-pre-wrap break-all" style={{ color: '#98c379', fontFamily: 'monospace' }}>
                          {formData.Input || '—'}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs mb-1" style={{ color: '#4a5568' }}>Output</p>
                        <pre className="text-xs whitespace-pre-wrap break-all" style={{ color: '#e5c07b', fontFamily: 'monospace' }}>
                          {formData.Solution || '—'}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t flex items-center justify-between gap-4"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
                <button type="button" onClick={() => navigate(-1)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-105"
                  style={{ color: '#8b9ab0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  ← Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="px-7 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}>
                  {loading ? 'Creating…' : '+ Create Testcase'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
import React, { useState, useEffect } from 'react';
import './TestCaseModal.css';
import axios from "./axios";

const TestCaseModal = ({ testCase, scenarioId, onClose, projectId, moduleId, testCasei,onSave, mode = 'view' }) => {
  const [editedCase, setEditedCase] = useState(testCase || {
    testCaseId: '',
    caseType: '',
    description: '',
    expectedResult: '',
    testCaseData: '',
    steps: '',
    results: [],
    scenarioId: scenarioId,
    projectId: projectId,
    moduleId: moduleId
  });

  const [newResult, setNewResult] = useState({
    testRegion: '',
    testStatus: '',
    comments: '',
    reference: '',
    bugReferenceId: '',
    bugPriority: '',
    testCaseId :testCasei,
  });

  const handleAddResult = () => {
    const updatedResults = [...(editedCase.results || []), {
      ...newResult,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
      })
    }];
    
    setEditedCase({
      ...editedCase,
      results: updatedResults
    });

    setNewResult({
      testRegion: '',
      testStatus: '',
      comments: '',
      reference: '',
      bugReferenceId: '',
      bugPriority: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(editedCase);

    try {
      console.log("started creating");
      const response = await axios.post("/createTestCase", editedCase);
      console.log("From Backend: " + response.data.msg);

      if (response.data.msg === "TestCase Created Successfully") {
        window.location.reload();
      }

      onClose();
    } catch (err) {
      console.error("Error creating test case:", err);
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);

  // Handle the file change event
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check if the file is an image or video
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setSelectedFile(file);
        setFileType(file.type.startsWith('image/') ? 'image' : 'video');
        
        // Update reference and referenceType state for the file
        setNewResult({
          ...newResult,
          reference: file.name,
          referenceType: file.type.startsWith('image/') ? 'image' : 'video',
        });
      } else {
        alert('Please select a valid image or video file');
      }
    }
  };

  // Function to render preview of the selected image/video
  const renderFilePreview = () => {
    if (!selectedFile) return null;

    if (fileType === 'image') {
      return <img src={URL.createObjectURL(selectedFile)} alt="preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />;
    }

    if (fileType === 'video') {
      return (
        <video controls style={{ maxWidth: '100%', maxHeight: '200px' }}>
          <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
          Your browser does not support the video tag.
        </video>
      );
    }
  };
  
  const handleupdatecase = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    // Append the form data
    formData.append('testRegion', newResult.testRegion);
    formData.append('testStatus', newResult.testStatus);
    formData.append('comments', newResult.comments);
    formData.append('bugReferenceId', newResult.bugReferenceId);
    formData.append('bugPriority', newResult.bugPriority);
    formData.append('testCaseId',testCasei);
    formData.append('scenarioId',scenarioId);
    formData.append('projectId',projectId);
    formData.append('moduleId',moduleId);

    // Append the file if available
    if (selectedFile) {
      formData.append('reference', newResult.reference);
    }
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
   
    try {
      console.log(newResult.testRegion)
      console.log("testcaseid ....: "+testCasei)
      const response = await axios.post('/updatedTestCase', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(response.data); 
     if(response.data.msg === "TestRun updated successfully"){
      window.location.reload();
     }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  useEffect(() => {
    console.log("Backend Response:", testCase); // Check the structure of testCase or response data
  }, [testCase]);

  if (isAddMode) {
    return (
      <div className="modal-overlay">
        <div className="add-modal-content">
          <div className="modal-header">
            <h2>Add New Case</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Test Case ID</label>
                <input
                  type="text"
                  placeholder="Enter the Test case ID"
                  value={editedCase.testCaseId}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    testCaseId: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Test Case Type</label>
                <select
                  value={editedCase.caseType}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    caseType: e.target.value
                  })}
                >
                  <option value="">Choose the Test case Type</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Test Case Description</label>
              <textarea
                placeholder="Enter the Test case description"
                value={editedCase.description}
                onChange={(e) => setEditedCase({
                  ...editedCase,
                  description: e.target.value
                })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expected Result</label>
                <textarea
                  placeholder="Enter the Expected Result"
                  value={editedCase.expectedResult}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    expectedResult: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Test Case Data</label>
                <textarea
                  placeholder="Enter the test case data"
                  value={editedCase.testCaseData}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    testCaseData: e.target.value
                  })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Steps</label>
              <textarea
                placeholder="Enter the steps to Test"
                value={editedCase.steps}
                onChange={(e) => setEditedCase({
                  ...editedCase,
                  steps: e.target.value
                })}
              />
            </div>

            <div className="add-case-actions">
            <button className="cancel-case-submit" onClick={onClose}>Cancel</button>
              <button type="submit" className="add-case-submit">
                <span>+</span> Add Case
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
        <button className="close-button" onClick={onClose}>×</button>
          <h2>{isAddMode ? 'Add New Case' : 'Test Case Details'}</h2>
         
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="test-details-section">
              <div className="form-row">
                <div className="form-group">
                  <label>Test Case ID</label>
                  <input
                    type="text"
                    placeholder="Enter the Test case ID"
                    value={editedCase.testCaseId || ''}
                    onChange={(e) => setEditedCase({
                      ...editedCase,
                      testCaseId: e.target.value
                    })}
                    disabled={isViewMode}
                  />
                </div>
                <div className="form-group">
                  <label>Test Case Type</label>
                  <select
                    value={editedCase.caseType || ''}
                    onChange={(e) => setEditedCase({
                      ...editedCase,
                      caseType: e.target.value
                    })}
                    disabled={isViewMode}
                  >
                    <option value="">Choose the Test case Type</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Test Case Description</label>
                <textarea
                  placeholder="Enter the Test case description"
                  value={editedCase.description || ''}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    description: e.target.value
                  })}
                  disabled={isViewMode}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expected Result</label>
                  <textarea
                    placeholder="Enter the Expected Result"
                    value={editedCase.expectedResult || ''}
                    onChange={(e) => setEditedCase({
                      ...editedCase,
                      expectedResult: e.target.value
                    })}
                    disabled={isViewMode}
                  />
                </div>
                <div className="form-group">
                  <label>Test Case Data</label>
                  <textarea
                    placeholder="Enter the test case data"
                    value={editedCase.testCaseData || ''}
                    onChange={(e) => setEditedCase({
                      ...editedCase,
                      testCaseData: e.target.value
                    })}
                    disabled={isViewMode}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Steps</label>
                <textarea
                  placeholder="Enter the steps to Test"
                  value={editedCase.steps || ''}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    steps: e.target.value
                  })}
                  disabled={isViewMode}
                />
              </div>

              {!isAddMode && (
                <div className="results-section">
                  <h3>Results</h3>
                  {(editedCase.results || []).map((result, index) => (
                    <div key={index} className="result-item">
                      <div className="result-header">
                        <div className="tester-info">
                          <span>{result.testedBy}</span>
                          <span className="date">{result.date}</span>
                        </div>
                      </div>
                      <div className="result-form">
      <div className="form-row">
        <div className="form-group">
          <label>Test Region</label>
          <select
            value={newResult.testRegion}
            onChange={(e) => setNewResult({ ...newResult, testRegion: e.target.value })}
          >
            <option>Choose the Test Region</option>
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
          </select>
        </div>
        <div className="form-group">
          <label>Test Status</label>
          <select
            value={newResult.testStatus}
            onChange={(e) => setNewResult({ ...newResult, testStatus: e.target.value })}
          >
            <option>Choose the Test Status</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Comments</label>
        <textarea
          placeholder="Enter the Test Comments"
          value={newResult.comments}
          onChange={(e) => setNewResult({ ...newResult, comments: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Reference (Image/Video)</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange} // Handle the file change event
        />
        {newResult.reference && (
          <p>Selected file: {newResult.reference}</p>
        )}
      </div>

      {selectedFile && (
        <div className="file-preview">
          <p>Preview: {selectedFile.name}</p>
          {selectedFile.type.startsWith('video/') && (
            <video controls>
              <source src={URL.createObjectURL(selectedFile)} />
              Your browser does not support the video tag.
            </video>
          )}
          {selectedFile.type.startsWith('image/') && (
            <img src={URL.createObjectURL(selectedFile)} alt="preview" width="100%" />
          )}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>Bug Reference ID</label>
          <input
            type="text"
            placeholder="Enter the Bug Ref ID"
            value={newResult.bugReferenceId}
            onChange={(e) => setNewResult({ ...newResult, bugReferenceId: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Bug Priority</label>
          <select
            value={newResult.bugPriority}
            onChange={(e) => setNewResult({ ...newResult, bugPriority: e.target.value })}
          >
            <option>Choose the Bug Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button onClick={handleupdatecase}>Submit</button>
      </div>
    </div>
                    </div>
                  ))}

                  {(isEditMode || isViewMode) && (
                    <div className="add-result-form">
                      {/* <div className="form-row">
                        <div className="form-group">
                          <label>Test Region</label>
                          <select
                            value={newResult.testRegion}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              testRegion: e.target.value
                            })}
                          >
                            <option>Choose the Test Region</option>
                            <option value="Production">Production</option>
                            <option value="Staging">Staging</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Test Status</label>
                          <select
                            value={newResult.testStatus}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              testStatus: e.target.value
                            })}
                          >
                            <option>Choose the Test Status</option>
                            <option value="Pass">Pass</option>
                            <option value="Fail">Fail</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Comments</label>
                        <textarea 
                          placeholder="Enter the Test Region"
                          value={newResult.comments}
                          onChange={(e) => setNewResult({
                            ...newResult,
                            comments: e.target.value
                          })}
                        />
                      </div> */}

                      {/* <div className="form-group">
                        <label>Reference</label>
                        <div className="reference-input">
                          <input 
                            type="text" 
                            placeholder="Image or Video"
                            value={newResult.reference}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              reference: e.target.value
                            })}
                          />
                          <button type="button" className="attach-btn">📎</button>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Bug Reference ID</label>
                          <input 
                            type="text"
                            placeholder="Enter the Bug Ref ID"
                            value={newResult.bugReferenceId}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              bugReferenceId: e.target.value
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Bug Priority</label>
                          <select
                            value={newResult.bugPriority}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              bugPriority: e.target.value
                            })}
                          >
                            <option>Choose the Bug Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                      </div> */}
                     {/* <button onClick={handleupdatecase}>Submit</button> */}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-actions">
              {(isEditMode || isViewMode) && (
                <button 
                  type="button" 
                  className="add-result-btn"
                  onClick={handleAddResult}
                >
                  + Add Result
                </button>
              )}
              <button 
                type="submit" 
                className="submit-btn"
              >
                {isAddMode ? 'Add Case' : 'Edit Case'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestCaseModal;

import React, { useState, useEffect } from 'react';
import './TestCaseModal.css';
import axios from "./axios";
import { toast } from 'react-toastify';

const TestCaseModal = ({ testCase, scenarioId, onClose, genId, projectId, moduleId, testCasei, onSave, mode = 'view' }) => {

  const [editedCase, setEditedCase] = useState(testCase || {
    testCaseId: '',
    caseType: '',
    testCaseDescription: '',
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
    testCaseId: testCasei,
  });

  const [isResultAdded, setIsResultAdded] = useState(false); // 🔹 New state to toggle button visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAddResult = () => {
    const updatedResults = [
      ...(editedCase.results || []),
      {
        ...newResult,
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: '2-digit',
          year: 'numeric'
        })
      }
    ];

    setEditedCase({
      ...editedCase,
      results: updatedResults
    });

    // Clear form fields
    setNewResult({
      testRegion: '',
      testStatus: '',
      comments: '',
      reference: '',
      bugReferenceId: '',
      bugPriority: '',
      testCaseId: testCasei,
    });

    // 🔹 Hide the button after result is added
    setIsResultAdded(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(editedCase);
    editedCase.testCaseId = genId;
    try {
      console.log("started creating");
      const response = await axios.post("/createTestCase", editedCase);
      console.log(editedCase);
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
  // const renderFilePreview = () => {
  //   if (!selectedFile) return null;

  //   if (fileType === 'image') {
  //     return <img src={URL.createObjectURL(selectedFile)} alt="preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />;
  //   }

  //   if (fileType === 'video') {
  //     return (
  //       <video controls style={{ maxWidth: '100%', maxHeight: '200px' }}>
  //         <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
  //         Your browser does not support the video tag.
  //       </video>
  //     );
  //   }
  // };

  const userData = JSON.parse(localStorage.getItem('user')) || {
    Name: 'User',
    Email: 'user@example.com',
    Role: 'User'
  };

  const handleupdatecase = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (newResult.testStatus === "Fail") {
      if (!newResult.bugReferenceId || !newResult.bugPriority) {
        alert("Bug Reference ID and Bug Priority are required when the test fails.");
        return;
      }
    }
    const formData = new FormData();

    // Append the form data
    formData.append('testRegion', newResult.testRegion);
    formData.append('testStatus', newResult.testStatus);
    formData.append('comments', newResult.comments);
    formData.append('bugReferenceId', newResult.bugReferenceId);
    formData.append('bugPriority', newResult.bugPriority);
    formData.append('testCaseId', testCasei);
    formData.append('scenarioId', scenarioId);
    formData.append('projectId', projectId);
    formData.append('moduleId', moduleId);

    // Append the file if available
    if (selectedFile) {
      formData.append('reference', selectedFile);
    }
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      console.log(formData);

      const response = await axios.post('/updatedTestCase', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(response.data);
      if (response.data.msg === "TestRun updated successfully") {
        window.location.reload();
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };


  const handleEditClick = async (updatedCase) => {
    try {
      console.log(updatedCase);
      const response = await axios.put('/updateTestCase', { updatedCase });

      if (response.data.msg === "Test case updated successfully") {
        // Show success message
        toast.success(response.data.msg);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating test case:", error);
    }
  };


  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  useEffect(() => {
    if (
      newResult.testStatus !== "Fail" &&
      (newResult.bugReferenceId || newResult.bugPriority)
    ) {
      setNewResult((prev) => ({
        ...prev,
        bugReferenceId: null,
        bugPriority: null,
      }));
    }
  }, [newResult.testStatus]);

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
                <label>Test Case ID <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  placeholder="Enter the Test case ID"
                  value={genId}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Test Case Type <span style={{ color: 'red' }}>*</span></label>
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
              <label>Test Case Description <span style={{ color: 'red' }}>*</span></label>
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
                Add Case
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
          <h2>
            {isAddMode ? 'Add New Case' : 'Test Case Details'}

            <button
              className="close-btn"
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-350px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#000',
                lineHeight: '1'
              }}
            >
              ×
            </button>

          </h2>
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
                    onChange={(e) =>
                      setEditedCase({ ...editedCase, testCaseId: e.target.value })
                    }
                    disabled
                    style={{
                      width: '85%',
                      padding: '12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '3px',
                      fontSize: '14px',
                      height: '10px',
                      backgroundColor: isViewMode ? '#f5f5f5' : 'white',
                      cursor: isViewMode ? 'not-allowed' : 'text'
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Test Case Type</label>
                  <select
                    value={editedCase.caseType || ''}
                    onChange={(e) =>
                      setEditedCase({ ...editedCase, caseType: e.target.value })
                    }
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
                  value={editedCase.testCaseDescription || ''}
                  onChange={(e) =>
                    setEditedCase({ ...editedCase, testCaseDescription: e.target.value })
                  }
                  disabled={isViewMode}
                  style={{
                    width: '95%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '3px',
                    fontSize: '14px',
                    height: '100px',
                    backgroundColor: isViewMode ? '#f5f5f5' : 'white',
                    cursor: isViewMode ? 'not-allowed' : 'text'
                  }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expected Result</label>
                  <textarea
                    placeholder="Enter the Expected Result"
                    value={editedCase.expectedResult || ''}
                    onChange={(e) =>
                      setEditedCase({ ...editedCase, expectedResult: e.target.value })
                    }
                    disabled={isViewMode}
                  />
                </div>
                <div className="form-group">
                  <label>Test Case Data</label>
                  <textarea
                    placeholder="Enter the test case data"
                    value={editedCase.testCaseData || ''}
                    onChange={(e) =>
                      setEditedCase({ ...editedCase, testCaseData: e.target.value })
                    }
                    disabled={isViewMode}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Steps</label>
                <textarea
                  placeholder="Enter the steps to Test"
                  value={editedCase.steps || ''}
                  onChange={(e) =>
                    setEditedCase({ ...editedCase, steps: e.target.value })
                  }
                  disabled={isViewMode}
                />
              </div>

              {!isAddMode && isResultAdded && (
                <div className="results-section">
                  <h3 style={{ textAlign: 'center' }}>RESULT</h3>
                  {(editedCase.results || []).map((result, index) => (
                    <div key={index} className="result-item">
                      <div className="result-header">
                        <div className="tester-info">
                          <span>TestedBy : {userData.Name}</span>
                          <span className="date">
                            Date & Time: {new Date().toLocaleString()}
                          </span>
                        </div>
                      </div>



                      <div className="result-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Test Region <span style={{ color: 'red' }}>*</span></label>
                            <select
                              value={newResult.testRegion}
                              onChange={(e) =>
                                setNewResult({ ...newResult, testRegion: e.target.value })
                              }
                            >
                              <option>Choose the Test Region</option>
                              <option value="Sprint">Sprint</option>
                              <option value="Staging">Staging</option>
                              <option value="UAT">UAT</option>
                              <option value="Live">Live</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Test Status <span style={{ color: 'red' }}>*</span></label>
                            <select value={newResult.testStatus} onChange={(e) =>
                              setNewResult({ ...newResult, testStatus: e.target.value })
                            }>
                              <option value="">Choose the Test Status</option>
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
                            onChange={(e) =>
                              setNewResult({ ...newResult, comments: e.target.value })
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label>Reference (Image/Video)</label>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                          />
                          {newResult.reference && <p>Selected file: {newResult.reference}</p>}
                        </div>

                        {selectedFile && (
                          <div className="file-preview">
                            <p>Preview: {selectedFile.name}</p>
                            {selectedFile.type.startsWith('video/') ? (
                              <video controls>
                                <source src={URL.createObjectURL(selectedFile)} />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <img src={URL.createObjectURL(selectedFile)} alt="preview" width="100%" />
                            )}
                            <button
                              type="button"
                              className="clear-file-btn"
                              onClick={() => {
                                setSelectedFile(null);
                                setNewResult({ ...newResult, reference: '' });
                                document.querySelector('input[type="file"]').value = ''; // Clear the file input field
                              }}
                              style={{
                                backgroundColor: '#f44336',
                                borderRadius: '4px',
                                border: 'none',
                                color: 'white',
                                fontSize: '16px',
                                cursor: 'pointer',
                                marginTop: '10px',
                                width: '100px',
                              }}
                            >
                              Clear File
                            </button>
                          </div>
                        )}

                        {newResult.testStatus === "Fail" ? (
                          <div className="form-row">
                            <div className="form-group">
                              <label>Bug Reference ID <span style={{ color: 'red' }}>*</span></label>
                              <input
                                type="text"
                                placeholder="Enter the Bug Ref ID"
                                value={newResult.bugReferenceId || ''}
                                onChange={(e) =>
                                  setNewResult({ ...newResult, bugReferenceId: e.target.value })
                                }
                              />
                            </div>

                            <div className="form-group">
                              <label>Bug Priority <span style={{ color: 'red' }}>*</span></label>
                              <select
                                value={newResult.bugPriority || ''}
                                onChange={(e) =>
                                  setNewResult({ ...newResult, bugPriority: e.target.value })
                                }
                              >
                                <option value="">Choose the Bug Priority</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                              </select>
                            </div>
                          </div>
                        ) : (
                          (() => {
                            // ✅ Reset bug fields ONLY if needed
                            if (
                              newResult.bugReferenceId !== null ||
                              newResult.bugPriority !== null
                            ) {
                              setNewResult({
                                ...newResult,
                                bugReferenceId: null,
                                bugPriority: null,
                              });
                            }
                            return null;
                          })()
                        )}


                        <button
                          type="button"
                          style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            width: "100px",
                            height: "30px",
                            border: "none",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto", // Centers the button horizontally
                            cursor: "pointer"
                          }}
                          onClick={(e) => {
                            if (newResult.testStatus === "Fail") {
                              if (
                                !newResult.bugReferenceId?.trim() ||
                                !newResult.bugPriority?.trim()
                              ) {
                                alert("Bug Reference ID and Bug Priority are required for failed status.");
                                return;
                              }
                            }
                            handleupdatecase(e);
                          }}
                        >
                          Submit
                        </button>


                      </div>
                    </div>
                  ))}
                </div>

              )}
            </div>
            <div className="modal-actions">
              {isViewMode && (
                <>
                  {!isResultAdded && (
                    <button
                      type="button"
                      style={{
                        height: "35px",
                        background: "#277dd8",
                        border: "1px solid #ddd",
                        width: "115px",
                        borderRadius: "20px",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        cursor: "pointer"
                      }}
                      onClick={handleAddResult}
                    >
                      Add Result
                    </button>

                  )}


                  <button
                    type="button"
                    style={{
                      height: "35px",
                      background: "grey",
                      border: "1px solid #ddd",
                      width: "115px",
                      borderRadius: "20px",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      cursor: "pointer"
                    }}
                    onClick={() => onSave({ ...testCase, mode: 'edit' })}
                  >
                    Cancel
                  </button>
                </>
              )}
              <div className="modal-actions">


                {isEditMode && (
                  <>
                    <button
                      type="button"
                      className="save-btn"
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "10px 20px",
                        cursor: "pointer",
                        marginRight: "10px"
                      }}
                      onClick={() => handleEditClick(editedCase)}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={onClose}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "10px 20px",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>


            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestCaseModal;
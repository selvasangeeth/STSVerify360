from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama
import re
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Configure logging
logging.basicConfig(filename='testgen_debug.log', level=logging.DEBUG)

def generate_test_cases(requirement_text):
    """Generate test cases using optimized prompting and validation"""
    
    expert_prompt = f"""
    **Role**: Senior QA Engineer specializing in security and compliance testing
    **Task**: Generate comprehensive test scenarios for the given requirement.

    **Requirement Document**:
    {requirement_text}

    **Output Format**:
    ```markdown
    ### Module: [Module Name]
    - **Test Scenario**: [Scenario Description]
      - **Test Case ID**: TC-[XX] 
      - **Priority**: P0 (Critical)/P1 (High)/P2 (Medium)
      - **Preconditions**: 
      - **Test Steps**:
        1. 
        2. 
      - **Expected Results**:
      - **Security Impact**: [High/Medium/Low]
      - **Edge Cases Covered**:
      - **Compliance Checks**:
    ```
    """
    
    try:
        response = ollama.generate(model='llama3.2:1b', prompt=expert_prompt)
        logging.debug(f"Ollama raw response: {response}")

        output = response.get("response")  # Extract AI response

        if not output:
            return {"error": "Invalid response from AI"}

    except Exception as e:
        logging.critical(f"AI generation failed: {str(e)}")
        return {"error": f"AI generation failed: {str(e)}"}
    
    return {"test_cases": output}

# Flask route for generating test cases
@app.route('/generate-test-cases', methods=['POST'])
def generate():
    data = request.json
    requirement_text = data.get("requirement_text")

    if not requirement_text:
        return jsonify({"error": "Requirement text is required"}), 400

    result = generate_test_cases(requirement_text)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5001, debug=True)

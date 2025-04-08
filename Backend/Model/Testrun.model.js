const mongoose = require("mongoose");

const testRunSchema = mongoose.Schema({

    timestamp: {
        type: Date,
        default: Date.now()
    },
    taskId: {
        type: String,
        required: true
    },
    subTaskId: {
        type: String,
        required: true
    },
    testScenario: {
        type: String,
        required: true
    },
    testedBy: {
        type: String,
        required: true
    },
    testRegion: {
        type: String,
        required: true
    },
    testedCasePassedCount: {
        type: Number,
        
    },
    testStatus: {
        type: String,
        required: true
    },
    testCaseName: {
        type: String,
        required: true
    },
    reference: {
        type: String,

    },
    testDescription: {
        type: String,
        required: true
    },
    caseType: {
        type: String,
        required: true
    },
    testCaseCreatedBy: {
        type: String,
        required: true
    },
    bugReferenceId: {
        type: String,


    },
    bugPriority: {
        type: String,

    },
    comments: {
        type: String,

    },
    expectedResult: {
        type: String,
       
    },
    testCaseData: {
        type: String,
        
    },
    steps: {
        type: String,
        
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },

    testCaseCreatedAt: {
        type: Date,
    }
});

module.exports = mongoose.model("Testrun", testRunSchema);

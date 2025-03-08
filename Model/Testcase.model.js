const TestCaseSchema = new mongoose.Schema({
    testCaseName :{
        type :String,
        required :true,
    },
    testCaseId :{
        type :String,
        required :true,
    },
    caseType :{
        type :String,
        required :true

    },
    status :{
        type : String,
        required :true

    },
    scenario :{
         type :mongoose.Schema.Types.ObjectId,
         ref : "scenario"
    },
    createdBy :{
         type :mongoose.Schema.Types.ObjectId,
         ref : "user"
    },
    testCaseDescription : {
        type :String,
        required :true

    },
    testedBy : [
        {
          testerName: {
            type: "string",
          },
          testDate: {
            type: "Date", 
            value: new Date().toISOString() 
          }
        }
      ]
},{timestamps:true});

module.exports = mongoose.model('Testcase',TestCaseSchema);



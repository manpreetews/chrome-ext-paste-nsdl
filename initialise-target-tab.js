function inspect(object) {
  return JSON.stringify(object);
}

function TitledWindow() {
}

TitledWindow.prototype = {
  public: {getPageDetails: true, setWindowTitle: true}, 
  
  getPageDetails: function(request, returnValue) {
    console.log("getPageDetails ...");
    var title = $("title").text();
    console.log("title from jquery = " + inspect(title));
    returnValue({title: title, url: window.location.href});
  }, 
  
  setWindowTitle: function(request, returnValue) {
    console.log("setWindowTitle ...");
    // $("title").text(request.title);
    // $("#dob").val(request.title);
    pasteValues(request.title);
    returnValue({title: $("title").text()}); // return updated title
  }, 
  
  toString: function() {
    return "[TitledWindow " + window.location.href + "]";
  }
};

var titledWindow = new TitledWindow();

function handleTitleWindowRequests() {
  chrome.runtime.onMessage.addListener(function(request, sender, handleResult) {
    console.log("runtime message " + inspect(request));
    var method = request.$method;
    if(titledWindow.public[method]) {
      titledWindow[method](request, handleResult);
      return true;
    }
  });
}

function createPopupWindowViaChromeRuntime() {
  chrome.runtime.sendMessage({type: "openPopupWindow"}, 
                             function(response) {
                               console.log("chromeWindowsCreate, response = " + inspect(response));
                             });
}

function createTitleEditorWindow() {
  var popupWindow = window.open('extension/popup.html','test-popup',
                                'width=600,height=400,top=300,left=300,menubar=0,' + 
                                'status=0,scrollbars=0,location=0,toolbar=0,resizable=1');
  console.log("popupWindow = " + popupWindow);
}

function initialise() {
  if (window.chrome && window.chrome.runtime) {
    console.log("Initialising target tab for chrome extension");
    handleTitleWindowRequests();
    createPopupWindowViaChromeRuntime();
  }
}

initialise();





function pasteValues(valuesForPasting){
  // alert("valuesForPasting: "+valuesForPasting);
  // var jsonValue = {"cat_applicant":"Individual","f_name":"manoj","m_name":"","l_name":"kumar","name_card":"manoj kumar","faf_name":"bhushan","fam_name":"","fal_name":"kumar","opaMotherLastName":"","opaMotherFirstName":"","opaMotherMiddleName":"","dob":"27/12/2021","tel_num_isdcode":"091","tel_num_stdcode":"12121","tel_num":"9855518207","email_id":"mksahni82@gmail.com","add_comm":"INDIAN","name_aadhaar":"manoj kumar","check_aadhaar_eid":"A","eid_num":"","eid_tmst":"","ra_add":"Please Select","proof_id":"AADHAAR Card issued by the Unique Identification Authority of India","proof_add":"AADHAAR Card issued by the Unique Identification Authority of India","proof_dob":"AADHAAR Card issued by the Unique Identification Authority of India","area_code":"nwr","ao_type":"w","range_code":"114","ao_num":"01","aadhaarNo":"658926614771","user_state":"26","gender":"Male"};
  const jsonValue = JSON.parse(valuesForPasting);
  // var myObject = {'name':'Sherlock', 'address':'221b Bakerstreet','city': 'London'}

  var count = Object.keys(jsonValue).length;
  // alert(count);

  console.log("qqq - qwerty  111");
        
  // ele_key = "add_comm";
  // console.log("qqq - Key - "+ele_key);
  
  // text = jsonValue.add_comm;
  // console.log("qqq - Value - "+text);

  // element =  document.getElementsByName(ele_key)[0];
  // ele = element.getElementsByTagName("option");
  //       for (var i=0; i<ele.length;i++) {
  //         // console.log("SIM "+ele[i].childNodes[0].nodeValue.trim()+" === "+text.trim());
  //           if (ele[i].childNodes[0].nodeValue.trim() === text.trim()){
  //               // console.log("---> "+i+" - "+ele[i].childNodes[0].nodeValue+""+`${value}`);
  //               // console.log(i);
  //               // console.log("\n");
  //               element.selectedIndex = i;
  //           }
  //       }
        
  // console.log('qqq - end');
  // setTimeout(function(){
      for (const [key, value] of Object.entries(jsonValue)) {
        var element = ""; 
        element =  document.getElementsByName(`${key}`)[0];
        if (typeof(element) != 'undefined' && element != null)
        {
          ele_key = `${key}`;
          if ((ele_key =="add_comm") || (ele_key =="proof_id") || (ele_key =="proof_add") ) {
            console.log("Key - "+ele_key);
            text = `${value}`;
            ele = element.getElementsByTagName("option");
            for (var i=0; i<ele.length;i++) {
              // console.log("SIM "+ele[i].childNodes[0].nodeValue.trim()+" === "+text.trim());
                if (ele[i].childNodes[0].nodeValue.trim() === text.trim()){
                    console.log("---> "+i+" - "+ele[i].childNodes[0].nodeValue+""+`${value}`);
                    console.log(i);
                    console.log("\n");
                    element.selectedIndex = i;
                }
            }
          }else if((ele_key =="check_aadhaar_eid") || (ele_key =="user_state") || (ele_key == "cat_applicant")){
            element.value = `${value}`;
          }else if((ele_key =="proof_dob") || (ele_key == "proof_id") || (ele_key == "gender")){
            element.value = " "+`${value}`;
          } else {
            element.value = `${value}`.toUpperCase();
          }
        }
      }
    // },5000);
}
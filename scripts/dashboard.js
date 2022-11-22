import {gCourses, gDegree} from "../data/dummyCourses.js";

const gModal = document.getElementById("infoModal");
const gModalContent = document.getElementById("modal-content");
const gModalData = document.querySelector(".tq-modal-data");

var gCoursesData, gDegreeData;
const gStorage = window.localStorage;

//Window onload to initialize storage from dummyCourses.js
//Conditional statement to make sure storage will be initialized one time only
//The goal is user will be able to edit courses and when they reload, storage still have their courses which they edited
window.onload = () => {
  if (!gStorage["degreeData"] && !gStorage["coursesData"]) {
    gStorage.setItem("degreeData", JSON.stringify(gDegree));
    gStorage.setItem("coursesData", JSON.stringify(gCourses));
  } else {
    gCoursesData = JSON.parse(gStorage.getItem("coursesData"));
    gDegreeData = JSON.parse(gStorage.getItem("degreeData"));
  }
};

$(document).ready(function () {
  const degreeYear = JSON.parse(gStorage.getItem("degreeData"));
  
  //Initializing the degree name to drop down menu at side bar
  degreeYear.map((degree) => {
    return $("#cSideNav-dropdown").append(
      `<a class="dropdown-item" href="#">${degree.Name}</a>`
    );
  });

  const saveEditedCourseBtn = $("#saveEditCourseModalBtn");
  saveEditedCourse(saveEditedCourseBtn);

  //Direct to home page
  $("#cHomeBtn").click(function () {
    window.location.href = "../pages/DashBoard.html";
  });

  //Log out
  $("#cLogOutBtn").click(function () {
    const admin = JSON.parse(gStorage.getItem("admin"));
    if (admin.remember) {
      window.location.assign("../pages/LogIn.html");
    } else {
      gStorage.removeItem("admin");
      window.location.assign("../pages/LogIn.html");
    }
  });

  $("#saveAddDegreeModalBtn").click(function () {
    addDegree();
  });

  //Binding dropdown button at side bar
  dropDownItemEventBinding();

  //Binding edit degree button at side bar
  $("#cEditDegreeBtn").click(function () {
    showSelectDegreePanel();
  });

  //Show list of course item
  $("#cEditCoursesBtn").click(function () {
    showCourseList();
  });

  //Reset add degree course modal on hidden
  $("#addDegreeCourseModal").on("hidden.bs.modal", function () {
    const modalBody = $(this)
      .children()
      .children()
      .children("div.modal-body")
      .html("");
    modalBody.append(`<div>
    <p class="m-0">Choose course to add from course list</p>
    <div class="input-group flex-nowrap">
      <div class="input-group-prepend">
        <span class="input-group-text" id="addon-wrapping">Course</span>
      </div>
      <input type="text" id="cFilterInputDegreeCourseModal" class="form-control" placeholder="ID or NAME" >
    </div>

    <ul class="list-group my-2" style="height: 200px; overflow:scroll; overflow-x: hidden;" id="cAddDegreeCourseList">
      
    </ul>
  </div>
  <form>
     <div class="form-group">
        <label for="YearInput">Year</label>
        <select id="YearInput"  style="text-align: start;" class="form-control degree-course-input-val">
           <option selected>Choose table year to add</option>
        </select>
     </div>
     
     <div class="form-group form-check form-check-inline">
        <input class="form-check-input degree-course-input-val" type="radio" name="InputcourseSemester"  value="Fall">
        <label class="form-check-label" for="inlineRadio1">Fall</label>
      </div>

      <div class="form-group form-check form-check-inline">
        <input class="form-check-input degree-course-input-val" type="radio" name="InputcourseSemester" value="Spring">
        <label class="form-check-label" for="inlineRadio2">Spring</label>
      </div>

      
  </form>`);
  });

  //Reset add degree modal on hidden
  $("#addDegreeModal").on("hidden.bs.modal", function () {
    const modalBody = $(this)
      .children()
      .children()
      .children("div.modal-body")
      .html("");
    modalBody.append(`<form>
    <div class="row">
       <div class="form-group col">
          <label for="courseID">College Name</label>
          <input type="text" class="form-control degree-input-val" style="text-align: start;" id="Colleges">
       </div>
    </div>
    <div class="row">
       <div class="form-group col">
          <label for="courseName">Degree Name</label>
          <input type="text" class="form-control degree-input-val" style="text-align: start;" id="Name">
       </div>
    </div>
    <div class="row">
       <div class="form-group col">
          <label for="courseName">Degree Type</label>
          <input type="text" class="form-control degree-input-val" style="text-align: start;" id="Type">
       </div>
    </div>
 </form>`);
  });

  //Reset edit course modal on hidden
  $("#editCourseModal").on("hidden.bs.modal", function () {
    const modalBody = $(this)
      .children()
      .children()
      .children("div.modal-body")
      .html("");
    modalBody.append(`
    <form>
       <div class="row">
         <div class="form-group col-3">
           <label for="courseID">Course No</label>
           <input type="text" class="form-control course-input-val" disabled style="text-align: start;" id="courseID">
         </div>

         <div class="form-group col-9">
           <label for="courseName">Course Name</label>
           <input type="text" class="form-control course-input-val" style="text-align: start;" id="courseName">
         </div>
       </div>

       <div class="row">
         <div class="form-group col-4">
           <label for="courseCreditHours">Credit Hours</label>
           <input type="number" min="0" class="form-control course-input-val" style="text-align: start;" id="courseCreditHours">
         </div>

         <div class="form-group col-4">
           <label for="courseCreditHours">Lab Hours</label>
           <input type="number" min="0" class="form-control course-input-val" style="text-align: start;" id="courseLabHours">
         </div>

         <div class="form-group col-4">
           <label for="courseCreditHours">Lecture Hours</label>
           <input type="number" min="0" class="form-control course-input-val" style="text-align: start;" id="courseLectureHours">
         </div>
       </div>
       
       <div class="row">
         <div class="form-group col">
           <label for="coursePrerequisite">Course Prerequisite</label>
           <textarea type="text" class="form-control course-input-val" style="text-align: start;" id="coursePrerequisite"></textarea>
         </div>              
       </div>

       <div class="row">
         <div class="form-group col">
           <label for="courseDescription">Course Description</label>
           <textarea type="text" class="form-control course-input-val" style="text-align: start;" id="courseDescription"></textarea>
         </div>              
       </div>

       <div class="row">
         <div class="form-group col">
           <label for="courseNote">Course Note</label>
           <textarea type="text" class="form-control course-input-val" style="text-align: start;" id="courseNote"></textarea>
         </div>              
       </div>

       <div class="row">
         <div class="form-group col-6">
           <label for="courseCoreCategory">Course Corecategory</label>
           <input type="text" class="form-control course-input-val" style="text-align: start;" id="courseCoreCategory">
        </div>
       
        <div class="form-group col-6">
         <label for="courseCorequisite">Course Corequisite</label>
         <input type="text" class="form-control course-input-val" style="text-align: start;" id="courseCorequisite">
       </div>
       </div>
       
       <div class="row">
         <div class="form-group col-6">
           Course Repeatability
           <div>
             <div class="form-group form-check form-check-inline">
               <input class="form-check-input course-input-val" type="radio" name="courseRepeatability" id="inlineRadio1" value="true">
               <label class="form-check-label" for="inlineRadio1">True</label>
             </div>

             <div class="form-group form-check form-check-inline">
               <input class="form-check-input course-input-val" type="radio" name="courseRepeatability" id="inlineRadio2" value="false">
               <label class="form-check-label" for="inlineRadio2">False</label>
             </div>
           </div>
           
         </div>

         <div class="form-group col-6">
           Course Additional Fee
           <div>
             <div class="form-group form-check form-check-inline">
               <input class="form-check-input course-input-val" type="radio" name="courseAdditionalFee" id="inlineRadio3" value="true">
               <label class="form-check-label" for="inlineRadio1">True</label>
             </div>

             <div class="form-group form-check form-check-inline">
               <input class="form-check-input course-input-val" type="radio" name="courseAdditionalFee" id="inlineRadio4" value="false">
               <label class="form-check-label" for="inlineRadio2">False</label>
             </div>
           </div>                       
         </div>
       </div>
    </form>`);
  });

  //Reset add course modal on hidden
  $("#addCourseModal").on("hidden.bs.modal", function () {
    const modalBody = $(this)
      .children()
      .children()
      .children("div.modal-body")
      .html("");
    modalBody.append(`
                  <form>
                    <div class="row">
                      <div class="form-group col-3">
                        <label for="courseID">Course No</label>
                        <input type="text" class="form-control add-course-input-val" style="text-align: start;" id="addCourseID">
                      </div>
  
                      <div class="form-group col-9">
                        <label for="courseName">Course Name</label>
                        <input type="text" class="form-control add-course-input-val" style="text-align: start;" id="addCourseName">
                      </div>
                    </div>

                    <div class="row">
                      <div class="form-group col-4">
                        <label for="courseCreditHours">Credit Hours</label>
                        <input type="number" min="0" class="form-control add-course-input-val" style="text-align: start;" id="addCourseCreditHours">
                      </div>

                      <div class="form-group col-4">
                        <label for="courseCreditHours">Lab Hours</label>
                        <input type="number" min="0" class="form-control add-course-input-val" style="text-align: start;" id="addCourseLabHours">
                      </div>

                      <div class="form-group col-4">
                        <label for="courseCreditHours">Lecture Hours</label>
                        <input type="number" min="0" class="form-control add-course-input-val" style="text-align: start;" id="addCourseLectureHours">
                      </div>
                    </div>
                    
                    <div class="row">
                      <div class="form-group col">
                        <label for="coursePrerequisite">Course Prerequisite</label>
                        <textarea type="text" class="form-control add-course-input-val" style="text-align: start;" id="addCoursePrerequisite"></textarea>
                      </div>              
                    </div>

                    <div class="row">
                      <div class="form-group col">
                        <label for="courseDescription">Course Description</label>
                        <textarea type="text" class="form-control add-course-input-val" style="text-align: start;" id="addCourseDescription"></textarea>
                      </div>              
                    </div>

                    <div class="row">
                      <div class="form-group col">
                        <label for="courseNote">Course Note</label>
                        <textarea type="text" class="form-control add-course-input-val" style="text-align: start;" id="addCourseNote"></textarea>
                      </div>              
                    </div>

                    <div class="row">
                      <div class="form-group col-6">
                        <label for="courseCoreCategory">Course Corecategory</label>
                        <input type="text" class="form-control add-course-input-val" style="text-align: start;" id="addCourseCoreCategory">
                     </div>
                    
                     <div class="form-group col-6">
                      <label for="courseCorequisite">Course Corequisite</label>
                      <input type="text" class="form-control add-course-input-val" style="text-align: start;" id="addCourseCorequisite">
                    </div>
                    </div>
                    
                    <div class="row">
                      <div class="form-group col-6">
                        Course Repeatability
                        <div>
                          <div class="form-group form-check form-check-inline">
                            <input class="form-check-input add-course-input-val" type="radio" name="courseRepeatability"  value="true">
                            <label class="form-check-label" for="inlineRadio1">True</label>
                          </div>
     
                          <div class="form-group form-check form-check-inline">
                            <input class="form-check-input add-course-input-val" type="radio" name="courseRepeatability" value="false">
                            <label class="form-check-label" for="inlineRadio2">False</label>
                          </div>
                        </div>
                        
                      </div>

                      <div class="form-group col-6">
                        Course Additional Fee
                        <div>
                          <div class="form-group form-check form-check-inline">
                            <input class="form-check-input add-course-input-val" type="radio" name="courseAdditionalFee" value="true">
                            <label class="form-check-label" for="inlineRadio1">True</label>
                          </div>
     
                          <div class="form-group form-check form-check-inline">
                            <input class="form-check-input add-course-input-val" type="radio" name="courseAdditionalFee" value="false">
                            <label class="form-check-label" for="inlineRadio2">False</label>
                          </div>
                        </div>                       
                      </div>

                    </div>
                    
                 </form>`);
  });
});

function showCourseList() {
  $("#cDashContent").html("");

  $("#cDashContent").append(`
  <div class="container-fluid">
    <div class="py-3 w-50 m-auto input-group flex-nowrap">
      <div class="input-group-prepend">
        <span class="input-group-text" id="addon-wrapping">Course</span>
      </div>
      <input type="text" id="cFilterInput" class="form-control" placeholder="ID or NAME" >
      <div class="btn ml-2" id="cAddCourseListBtn" style="background: #202A44; color: white">Add course</div>
    </div>

    <ul class="list-group list-group-flush m-auto " id="cCourseList" style="width: 65%;">
      
    </ul>
  </div>  
  
  `);

  Object.entries(gCoursesData).map(([key, value]) => {
    const vListItem = `
      <li  class="my-1 list-group-item courseList">
        <div class="d-flex justify-content-between align-items-center">
          <div class="cCourseID">
            <span>Course ID</span>
            <span>${key}<i class="ml-2 cCourseInfoBtn fas fa-info-circle"></i></span>
          </div>
          
          <div>
            <span>Course Name</span>
            <span id="list-name">${value.courseName}</span>
          </div>

          <div>
            <span>Hours</span>
            <span style="text-align: right">${value.courseCreditHours}</span>
          </div>

          <div class="d-flex flex-row">
            <i class=" fas fa-edit cCourseEditBtn" data-toggle="modal" data-target="#editCourseModal"></i>
            <i class="cCourseDeleteBtn fas fa-trash"></i>
          </div>
        </div>
        
        
      </li>`;
    return $("#cCourseList").append(vListItem);
  });

  const vFilterInput = $("#cFilterInput");
  filterSearch(vFilterInput);

  const vCourseInfoBtn = $(".cCourseInfoBtn");
  vCourseInfoBtn.each(function () {
    $(this).click(function () {
      const vId = $(this).parent().text();
      const vCourseObj = gCoursesData[vId];
      //Then pass course obj to showModal function
      showModal(vCourseObj);
    });
  });

  const vCourseEditBtn = $(".cCourseEditBtn");
  vCourseEditBtn.each(function () {
    $(this).click(function () {
      const vId = $(this)
        .parent()
        .siblings("div.cCourseID")
        .children("span:nth-child(2)")
        .text();

      const vCourseObj = gCoursesData[vId];

      showEditCoursePanel(vCourseObj);
    });
  });

  const vCourseDeleteBtn = $(".cCourseDeleteBtn");
  vCourseDeleteBtn.each(function () {
    $(this).click(function () {
      const vId = $(this)
        .parent()
        .siblings("div.cCourseID")
        .children("span:nth-child(2)")
        .text();

      const vCourseDataFiltered = Object.entries(gCoursesData).filter(
        function ([key, value]) {
          return key !== vId.trim("");
        }
      );

      updateCourseStorage(Object.fromEntries(vCourseDataFiltered));
      $(this).parents("li.list-group-item").remove();
    });
  });

  const vAddCourseListBtn = $("#cAddCourseListBtn");
  $("#saveAddCourseModalBtn").click(function () {
    showAddCourseListPanel();
  });

  vAddCourseListBtn.click(function () {
    $("#addCourseModal").modal("show");
  });
}

function showAddCourseListPanel() {
  const vInputs = $(".add-course-input-val");
  const vCourseAddedObj = {};

  vInputs.each(function () {
    var type = $(this).prop("type");
    var value = $(this).val();
    var key = $(this).prop("id");

    key = key.substring(3, key.length);
    key = key.charAt(0).toLowerCase() + key.substring(1, key.length);

    if (value !== "") {
      if (type.match(/^(text|textarea)$/)) {
        vCourseAddedObj[key] = value;
      } else if (type === "number") {
        value = $(this).prop("valueAsNumber");
        console.log(value);
        vCourseAddedObj[key] = value;
      } else {
        const checked = $(this).prop("checked");
        if (checked) {
          value === "true"
            ? (vCourseAddedObj[$(this).prop("name")] = checked)
            : (vCourseAddedObj[$(this).prop("name")] = !checked);
        }
      }
    } else {
      vCourseAddedObj[key] = null;
    }
  });

  const isFound = Object.entries(gCoursesData).find(([key, value]) => {
    if (key === vCourseAddedObj.courseID) {
      return true;
    }
    return false;
  });

  if (isFound) {
    alert("The course is existed in the storage! Try again");
  } else {
    confirm("Add course successfully!");
    $("#addCourseModal").modal("hide");
    gCoursesData[vCourseAddedObj.courseID] = vCourseAddedObj;
    $("#saveAddCourseModalBtn").unbind("click");
    updateCourseStorage(gCoursesData);
    showCourseList();
  }
}

function showEditCoursePanel(vCourseObj) {
  Object.entries(vCourseObj).forEach(([key, value]) => {
    if (key.match(/^(courseAdditionalFee|courseRepeatability)$/)) {
      $(`input[name="${key}"][value="${value}"]`).prop("checked", true);
    } else {
      $(`#${key}`).val(value);
    }
  });
  const addFieldEditCourseBtn = $("#addFieldEditCourseModalBtn");
  addFieldEditCourseBtn.click(function () {
    $(".editCourseModal").find("form").children("div:last-child").after();
    $(".editCourseModal").find("form").children("div:last-child").after(`
    <div class="row">
      <div class="form-group col">
          <input type="text" class="extraNameField course-input-val form-control" placeholder="Add field name here!">
      </div>
    </div>
    <div class="row">
      <div class="form-group col">
          <input type="text" class="course-input-val form-control extraValField" placeholder="Add field value here!">
      </div>
    </div>
  `);
    $("#addFieldEditCourseModalBtn").unbind("click");
  });
}

function saveEditedCourse(vSaveBtn) {
  vSaveBtn.click(function () {
    const vInputs = $(".course-input-val");
    const vCourseID = vInputs[0].value.trim("");

    let vCourseObj = {
      courseID: vCourseID,
    };

    vInputs.each(function () {
      let key, value;

      if ($(this).hasClass("extraValField")) {
        const keyName = $(".extraNameField").val();
        key = `course${keyName.charAt(0).toUpperCase() + keyName.slice(1)}`;
        value = $(this).val();
      } else if ($(this).prop("type") === "radio") {
        if ($(this).prop("checked")) {
          key = $(this).attr("name");
          value = $(this).val().toLowerCase() === "true";
        }
      } else {
        key = $(this).attr("id");

        if ($(this).prop("type") === "number") {
          value = $(this).prop("valueAsNumber");
        } else if ($(this).val() === "") {
          value = null;
        } else {
          value = $(this).val();
        }
      }
      vCourseObj[key] = value;
    });

    gCoursesData[vCourseObj.courseID.trim("")] = vCourseObj;
    updateCourseStorage(gCoursesData);
    $("#editCourseModal").modal("hide");
    confirm("Updated succesfully!");
    showCourseList();
  });
}

function filterSearch(vFilterInput) {
  vFilterInput.keyup(function () {
    const inputVal = vFilterInput.val().toLowerCase();
    const listItem = $(".list-group-item");

    listItem.filter(function () {
      const id = $(this)
        .children("div")
        .children("div:first-child")
        .children("span:nth-child(2)")
        .text();
      const name = $(this)
        .children("div")
        .children("div:nth-child(2)")
        .children("span:nth-child(2)")
        .text();
      $(this).toggle(
        id.toLowerCase().indexOf(inputVal) > -1 ||
          name.toLowerCase().indexOf(inputVal) > -1
      );
    });
  });
}

function dropDownItemEventBinding() {
  $(".dropdown-item").click(function () {
    if ($(this).text() === "Add degree") {
      $("#addDegreeModal").modal("show");
    } else {
      const vDegreeName = $(this).text();
      $("#cDashContent").html("");
      const vTableComponent = `
       <div class="table container-fluid p-5" id="cTable" style="overflow:scroll;">
         <div class="text-center m-auto w-75" style="background-size: cover; background-image: url(../assets/img.jfif);">
         </div>
         <table id="cTableContainer" class="m-auto w-75 table table-bordered table-striped">
         </table>
       </div>`;
      $("#cDashContent").append(vTableComponent);
      loadDegree(vDegreeName);
    }
  });
}

function showYear(vYear, vDegreeSelected) {
  $("#cYear").html("");

  const vYearTables = `<table class="pt-4 m-auto table table-striped table-bordered" id="cYear${vYear.Year}Fall">
       <thead style="background: #202A44; color: white">
          <tr>
             <th scope="col" colspan="4">Year ${vYear.Year} - Semester Fall</th>
          </tr>
       </thead>
       <tbody>
          <tr>
             <th scope="col" style="width:150px">No</th>
             <th scope="col" >Name</th>
             <th scope="col" style="width:70px">Hours</th>
             <th scope="col" style="width:20px"></th>
          </tr>
       </tbody>
    </table>
    
    <br>
 
    <table class="m-auto table table-striped table-bordered" id="cYear${vYear.Year}Spring">
       <thead style="background: #202A44; color: white">
          <tr>
             <th scope="col" colspan="4">Year ${vYear.Year} - Semester Spring</th>
          </tr>
       </thead>
       <tbody>
          <tr>
             <th scope="col" style="width:150px">No</th>
             <th scope="col" >Name</th>
             <th scope="col" style="width:70px">Hours</th>
             <th scope="col" style="width:20px"></th>
          </tr>
       </tbody>
    </table>
    `;

  $("#cYear").append(vYearTables);

  //  var yearFound;
  //  gDegreeData.find((year) => {
  //    if (year.Year == vYear) {
  //      yearFound = year;
  //      return true;
  //    }
  //  });

  vYear.CoursesList.map((course) => {
    const {courseID, courseName, courseCreditHours, courseOpt, courseSemester} =
      course;

    const vCourseHTML = `
       <tr>
          <td>${courseID} </td>
          <td>${courseName}</td>
          <td class="text-center">${courseCreditHours}</td>
          <td><i class="fas fa-trash cTableDeleteBtn"></i></td>
       </tr>`;

    if (courseSemester === "Fall") {
      $(`#cYear${vYear.Year}Fall`).append(vCourseHTML);
    } else if (courseSemester === "Spring") {
      $(`#cYear${vYear.Year}Spring:nth-child(3)`).append(vCourseHTML);
    }
  });

  const deleteBtn = $(".cTableDeleteBtn");

  deleteDegreeCourse(deleteBtn, vYear, vDegreeSelected);
}

function showSelectDegreePanel() {
  $("#cDashContent").html("");

  const vDegreeSelectedOption = `
                     <div class="mt-3 w-50">
                        <div >
                           <div>
                              <p class="text-center m-0">Please choose the degree to show</p>
                              <div class="input-group mb-3">
                                 <div class="input-group-prepend">
                                    <label class="input-group-text" for="degreeSelected">Degree</label>
                                 </div>
                                 <select class="custom-select" id="degreeSelected">
                                    <option selected>Choose degree options</option>
                                    ${
                                      gDegreeData &&
                                      gDegreeData.map((degree) => {
                                        return `<option value="${degree.Name}">${degree.Name}</option>`;
                                      })
                                    }
                                 </select>
                              </div>
                           </div>
                        </div>
                        <div></div>
                     </div>`;

  $("#cDashContent").append(vDegreeSelectedOption);

  $("#degreeSelected").change(function () {
    showEditDegreePanel($(this).val());
  });
}

function showEditDegreePanel(vDegreeName) {
  if (vDegreeName === "Choose degree options") {
    $("#cDashContent div:eq(0)").children(0).next().html("");
  } else {
    if (vDegreeName) {
      const vDegreeSelected = gDegreeData.find(
        (degree) => degree.Name === vDegreeName
      );
      const {Colleges, Name, Type, Years} = vDegreeSelected;

      const vEditTableComponent = `<div class="container-fluid p-0 mt-3" id="cEditTable">
           <div class="card m-auto">
              <div class="card-header" style="background: #202A44; color: white">
                 <h4 style="margin: auto 0">Degree information</h4>
              </div>
              <div class="card-body">
                 <h4>${Colleges}</h4>
                 <h5>${Type}, ${Name} </h5>
                 <p>Academic Map 2022-2023</p>
                 <p>Years Number: ${Years.length}</p>
                 
                 <div class="input-group mb-3">
                    <div class="input-group-prepend">
                       <label class="input-group-text" for="cYearSelected">Options</label>
                    </div>
                    <select class="custom-select" id="cYearSelected">
                       <option selected>Choose year option to show...</option>
                       ${Years.map((year) => {
                         return `<option value=${year.Year}>Year ${year.Year}</option>`;
                       })}
                    </select>
                 </div>
                 <hr>
                 <div class="d-flex w-100">
                   <button type="button" class="btn" id="cYearShowBtn" style="background: #202A44; max-width:107px; color: white">Show year</button>
                   <button type="button" class="btn ml-3" id="cAddCourseBtn" data-toggle="modal" data-target="#addDegreeCourseModal" style="width:107px; background: #202A44; color: white">Add course</button>
                   <button type="button" class="btn ml-3" id="cAddYearBtn" data-toggle="modal" data-target="#editModals" style="width:107px; background: #202A44; color: white">Add Year</button>
                   <button type="button" class="btn btn-danger ml-3" id="cDeleteDegreeBtn" data-toggle="modal" style="width:107px; color: white">Delete</button>
                 </div>
              </div>
           </div>
           <br>
           <div class="m-auto" id="cYear"></div>
        </div>`;

      $("#cDashContent div:eq(0)").children(0).next().html("");
      $("#cDashContent div:eq(0)")
        .children(0)
        .next()
        .append(vEditTableComponent);

      //Binding event listener to buttons on edit panel
      $("#cYearShowBtn").click(function () {
        const yearNum = $("#cYearSelected").prop("value");

        if (yearNum === "Choose year option to show...") {
          alert("Please choose year option!");
        } else {
          const vYear = vDegreeSelected.Years.find((year) => {
            if (year.Year === yearNum) {
              return year;
            }
          });
          showYear(vYear, vDegreeSelected);
        }
      });

      $("#cAddCourseBtn").click(function () {
        showAddDegreeCoursePanel(vDegreeSelected);
      });

      $("#cAddYearBtn").click(function () {
        if (confirm("Add year to degree?")) {
          const yearObj = {
            Year: (vDegreeSelected.Years.length + 1).toString(),
            CoursesList: [],
          };

          vDegreeSelected.Years.push(yearObj);
          $("#cYearSelected").append(
            `<option value=${yearObj.Year}>Year ${yearObj.Year}</option>`
          );
          updateDegreeStorage(gDegreeData);
        }
      });

      $("#cDeleteDegreeBtn").click(function () {
        const vDegreeName = vDegreeSelected.Name;
        deleteDegree(vDegreeName);

        showEditDegreePanel();
      });
    }
  }
}

function showAddDegreeCoursePanel(vDegreeSelected) {
  vDegreeSelected.Years.map((year) => {
    return $("#YearInput").append(`<option>Year ${year.Year}</option>`);
  });
  Object.entries(gCoursesData).map(([key, value]) => {
    $(".list-group").append(
      `<li class="list-group-item list-group-item-action degree-course-item" aria-current="true">${value.courseID}</li>`
    );
  });

  $(".degree-course-item").each(function () {
    $(this).click(function () {
      $("li.degree-course-item.active").removeClass("active");
      $(this).addClass("active");
    });
  });

  const vFilterInput = $("#cFilterInputDegreeCourseModal");
  vFilterInput.keyup(function () {
    const inputVal = vFilterInput.val().toLowerCase();
    const listItem = $(".list-group-item");

    listItem.filter(function () {
      const id = $(this).text();
      $(this).toggle(id.toLowerCase().indexOf(inputVal) > -1);
    });
  });

  $("#saveDegreeCourseModalBtn").click(function () {
    saveDegreeCourse(vDegreeSelected);
  });
}

function saveDegreeCourse(vDegreeSelected) {
  const vCourseSelected = $("li.degree-course-item.active").text().trim("");

  var yearSelected, semesterSelected;
  $(".degree-course-input-val").each(function () {
    var type = $(this).prop("type");
    if (type === "select-one") {
      $(this).val() !== "Choose table year to add"
        ? (yearSelected = $(this).val().slice(5))
        : alert("Please choose the year");
    } else {
      var checked = $(this).prop("checked");
      if (checked) {
        semesterSelected = $(this).val();
      }
    }
  });

  const vCourseAddedObj = {
    courseID: vCourseSelected,
    courseCreditHours: gCoursesData[vCourseSelected].courseCreditHours,
    courseName: gCoursesData[vCourseSelected].courseName,
    courseSemester: semesterSelected,
  };

  //check if course exist in storage
  const vYear = vDegreeSelected.Years.find((year) => {
    return year.Year === yearSelected;
  });

  var isFound = vYear.CoursesList.some((course) => {
    if (course.courseID === vCourseAddedObj.courseID) {
      return true;
    }
    return false;
  });

  if (isFound) {
    alert("Course is existed!");
  } else {
    vYear.CoursesList.push(vCourseAddedObj);
    gDegreeData.forEach((degree) => {
      if (degree.Name === vYear.Name) {
        degree = vYear;
      }
    });
    $("#addDegreeCourseModal").modal("hide");
    confirm("Add course successfully!");
    $("#saveDegreeCourseModalBtn").unbind("click");
    updateDegreeStorage(gDegreeData);
    showYear(vYear);
  }
}

function deleteDegreeCourse(vDeleteBtn, vTableYear, vDegreeSelected) {
  vDeleteBtn.click(function () {
    //Update table data
    const vCourseID = $(this).parent().siblings("td").eq(0).text();
    $(this).parent().parent().remove();

    const courseListUpdated = vTableYear.CoursesList.filter((course) => {
      return course.courseID !== vCourseID.trim("");
    });

    vTableYear.CoursesList = courseListUpdated;

    //Update course data
    const vCourseDataArr = Object.entries(gCoursesData);
    const vCourseDataFiltered = vCourseDataArr.filter(function ([key, value]) {
      return key !== vCourseID.trim("");
    });

    gDegreeData.forEach((degree) => {
      if (degree.Name === vDegreeSelected.Name) {
        degree = vDegreeSelected;
      }
    });
    updateDegreeStorage(gDegreeData);
  });
}

function deleteDegree(vDegreeName) {
  const vDegreeData = gDegreeData.filter((degree) => {
    return degree.Name !== vDegreeName;
  });

  updateDegreeStorage(vDegreeData);
  confirm("Deleted degree successfully");
  $("#degreeSelected").children(`option[value="${vDegreeName}"]`).remove();
  showEditDegreePanel();
}

function addDegree() {
  const vInputs = $(".degree-input-val");

  const vDegreeObj = {
    Colleges: "",
    Name: "",
    Type: "",
    Years: [],
  };

  vInputs.each(function () {
    if ($(this).val !== "") {
      var ID = $(this).prop("id");
      vDegreeObj[`${ID}`] = $(this).val();
    }
  });

  //Check if degree exist in storage
  var isFound = gDegreeData.some((degree) => {
    if (degree.Name === vDegreeObj.Name) {
      return true;
    } else {
      return false;
    }
  });

  //if not exist, add degree to storage
  if (isFound) {
    alert("Degree existed, please make another degree!");
  } else {
    gDegreeData.push(vDegreeObj);
    $("#cSideNav-dropdown").append(
      `<a class="dropdown-item" href="#">${vDegreeObj.Name}</a>`
    );
    updateDegreeStorage(gDegreeData);
    dropDownItemEventBinding();
    $("#addDegreeModal").modal("hide");
  }
}

function loadDegree(vDegreeName) {
  if (vDegreeName) {
    const vTables = gDegreeData.find((degree) => degree.Name === vDegreeName);
    const vYearTable = vTables.Years;
    const vMap = document.getElementById("cTableContainer");

    $("#cTable")
      .children(0)
      .html(
        `<div style="color: white; padding: 10px">
         <h2 >${vTables.Colleges}</h2>
         <h3>${vTables.Type}</h3>
         <p class="m-0" style="font-size: 20px">${vDegreeName}</p>
      </div>`
      );

    vMap.innerHTML = "";
    vYearTable.forEach((table) => {
      const {Year, CoursesList} = table; //Destructing pair of [key:value] of each table year object

      var vSemesterTable = "",
        vYearCredits = {Fall: 0, Spring: 0}; //Total credits of each semester of year

      //Init table structure
      vMap.innerHTML += `
              <tbody class="w-100" >
               <tr>
                  <th scope="row" id="year" class="table-dark" style="background: #202A44" rowspan="2";">YEAR ${Year}</th>
                  <th scope="col">Semester 1 Fall</th>
                  <th scope="col">Semester 2 Spring</th>
               </tr>

               <tr>
                  <td>
                     <table  class="cSemesterTable table table-borderless table-hover">
                        <tbody id="tableFall_${Year}">
                        </tbody>
                     </table>
                  </td>

                  <td>
                     <table  class="cSemesterTable w-100 table table-borderless table-hover">
                        <tbody id="tableSpring_${Year}">
                        </tbody>
                     </table>
                  </td>
               </tr>
            </tbody>
            `;

      //Get row of course from year's courses list
      CoursesList.forEach((course) => {
        const {
          courseSemester,
          courseID,
          courseName,
          courseCreditHours,
          coursesOpt,
        } = course;
        var vCourseHTML;

        //Conditional to check type of course and render specific format
        if (courseID.match(/^(CORE|^.{0}$|COSC XXX|)$/)) {
          vCourseHTML = `  <tr>
                  <td>
                     <label for="option">${courseID}</label>
                     <select name="select" class="selected">
                       <option value="">--Choose an option--</option>
                       ${coursesOpt.map((opt) => {
                         return `<option value="${opt}">${opt}</option>`;
                       })}
                     </select>
                     <i class="infoBtn fas fa-info-circle"></i>
                  </td>
                  <td>${courseName}</td>
                  <td>${courseCreditHours}</td>
               </tr>`;
        } else {
          vCourseHTML = `  <tr>
               <td class="course-id">${courseID}</td>
               <td>${courseName}</td>
               <td>${courseCreditHours}</td>
            </tr>`;
        }

        //Get semester credits
        courseSemester === "Fall"
          ? (vYearCredits["Fall"] += courseCreditHours)
          : (vYearCredits["Spring"] += courseCreditHours);

        vSemesterTable = document.getElementById(
          `table${courseSemester}_${Year}`
        );
        vSemesterTable.innerHTML += vCourseHTML;
      });

      //Append semester credits to semester table of year
      Object.entries(vYearCredits).map(([key, value]) => {
        const vSemesterCredits = `<tr class='total'>
                           <td colspan='2'><strong>Semester Hours</strong></td>
                           <td colspan='2'><strong>${value}</strong></td>
                         </tr>`;

        $(`#table${key}_${Year}`)
          .children("tr:last-child")
          .after(vSemesterCredits);
      });
    });

    //Binding course button event on table
    const gCourseBtn = document.querySelectorAll(".course-id");
    gCourseBtn.forEach((btn) =>
      btn.addEventListener("click", function () {
        //Get ID and find course object from storage
        const vId = btn.textContent;
        const vCourseObj = gCoursesData[vId];
        //Then pass course obj to showModal function
        if (vCourseObj === undefined) {
          alert("Course not exist!");
        } else {
          showModal(vCourseObj);
        }
      })
    );

    //Binding info button event on table
    const gInfoBtn = document.querySelectorAll(".infoBtn");
    gInfoBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        const vId = btn.previousElementSibling.value;

        //If user click on information icon, will check if exist (course selected)
        if (!vId) {
          window.alert("Please choose an options");
        } else {
          const vCourseObj = gCoursesData[vId];
          //if exist, pass course object to show modal function
          if (vCourseObj === undefined) {
            alert("Course not exist!");
          } else {
            showModal(vCourseObj);
          }
        }
      });
    });

    //Binding selected button event on table
    const gSelected = document.querySelectorAll(".selected");
    gSelected.forEach((btn) =>
      btn.addEventListener("change", function () {
        //Get the course ID selected from options and find course object from storage
        const vId = btn.options[btn.selectedIndex].value;
        const vCourseObj = gCoursesData[vId];

        //DOM traversal to show the name of course from selected
        btn.parentElement.nextElementSibling.innerHTML = vCourseObj.courseName;
      })
    );
  }
}

function showModal(vCourseObj) {
  gModalData.textContent = "";

  const {
    courseID,
    courseName,
    courseCreditHours,
    courseLabHours,
    courseLectureHours,
  } = vCourseObj;

  let dataElement = `
         <div>
           <h3 id="ID"><strong> ${courseID} <span id="Name" class="modal-value">${courseName}</span> </strong></h3>
         </div>
   
         <div>
           <b >Credit Hours: </b>
           <span id="CreditHours" class="modal-value">${courseCreditHours}</span>
   
           <b style="margin-inline-start: 15px" >Lecture Contact Hours: </b>
           <span id="LectureHours" class="modal-value">${courseLectureHours}</span>
         </div>
   
         <div>
           <b>Lab Contact Hours: </b> 
           <span id="LabHours" class="modal-value">${courseLabHours}</span>
         </div>
   
         <hr>
         
         ${Object.entries(vCourseObj)
           .map(([key, value]) => {
             const keyString = key.toString().substring(6);

             if (
               key.match(
                 /^(courseFormerly|courseCoreCategory|courseDescription|courseCorequisite|coursePrerequisite|courseNote)$/
               ) &&
               value !== null
             ) {
               return `<div>
                       <b>${keyString}: </b>
                       <div id="${keyString}" class="modal-value">${value}</div>
                     </div>`;
             } else if (
               key.match(/^(courseRepeatability|courseAdditionalFee)$/) &&
               typeof value === "boolean"
             ) {
               return `<div>
                       <b>${keyString}: </b>
                       <span id="${keyString}" class="modal-value">${
                 value ? `Yes` : `No`
               }</span>
                     </div>`;
             } else if (
               key.match(
                 /^(?!courseID|courseName|courseCreditHours|courseLectureHours|courseLabHours|undefine).*$/
               ) &&
               value !== null
             ) {
               return `<div>
                       <b>${keyString}: </b>
                       <div id="${keyString}" class="modal-value">${value}</div>
                     </div>`;
             }
           })
           .join("")}`;

  const gCloseBtn = document.getElementById("tq-close-button");
  gCloseBtn.addEventListener("click", function () {
    gModal.style.visibility = "hidden";
    gModalContent.classList.remove("open-modal");
  });

  gModalData.innerHTML += dataElement;
  gModal.style.visibility = "visible";
  gModalContent.classList.add("open-modal");
}

function updateDegreeStorage(vDegreeData) {
  gStorage.setItem("degreeData", JSON.stringify(vDegreeData));
}

function updateCourseStorage(vCourseData) {
  gStorage.setItem("coursesData", JSON.stringify(vCourseData));
}

function parse(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      const { result } = event.target;
      const { errors, data } = Papa.parse(result, { delimiter: ',', header: false });

      if(errors && errors.length) {
        console.log({errors}); 
        reject(errors.map(error => error.message).join(', '));
      } else {
        resolve (data);
      }
    });
    reader.readAsText(file);  
  });
}

function hideImportError() {
  const formatErrorMessageEl = document.querySelector('#format-error-message');
  formatErrorMessageEl.hidden = true;
}

function showImportError(message) {
  const formatErrorsEl = document.querySelector('#format-errors');
  formatErrorsEl.innerText = message;

  const formatErrorMessageEl = document.querySelector('#format-error-message');
  formatErrorMessageEl.hidden = false;
}

function validateRecordFormat(header) {
  return header[0] === 'Last Name' && header[1] === 'First Name' && header[2] === 'Username';
}

/**
 * "Instructors can add users through one of several formats, which also support user names:
 *
 *  • "A User" buser@example.com
 *  • buser@example.com B User
 *  • "User, C" cuser@example.com
 *
 * Email addresses can be enclosed by less than ( < ) or greater than ( > ) symbols, although it is not required.”
 */
function formatStudentRecord(record) {
  const [lname, fname, username] = record;
  //      "Humphrey, David" <david.humphrey@myseneca.ca>
  return `"${lname}, ${fname}" <${username}@myseneca.ca>`;
}

function formatStudentRecords(data) {
  if(!(data && data.length)) {
    showImportError('No records found in parsed data.');
    return;
  }

  // First row are headers, rest are records
  let [ header, ...students ] = data;

  if(!validateRecordFormat(header)) {
    showImportError('Unexpected format in parsed data.');
    return;
  }

  // Remove empty record(s)
  students = students.filter(student => student.length >= 3);

  // Format records for import
  students = students.map(student => formatStudentRecord(student)).join(', ');

  const studentRecordsEl = document.querySelector('#student-records');
  studentRecordsEl.value = students;
}

window.onload = function() {
  const fileEl = document.getElementById('csv-file-input');
  fileEl.addEventListener('change', async (event) => {
    hideImportError();
    const [ csvFile ] = event.target.files;
    try {
      const data = await parse(csvFile);
      formatStudentRecords(data);
    } catch(err) {
      showImportError(err);
    }
  });
};

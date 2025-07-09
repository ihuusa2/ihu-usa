import { Contact, CourseForm, RegisterForm } from '@/Types/Form'

const RegistrationMailTemplate = ({ data }: {
  data: RegisterForm
}) => {
  return (
    `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Registration Details</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f6f6f6;
                color: #333;
                padding: 20px;
            }
            .container {
                background-color: #fff;
                padding: 20px;
                max-width: 600px;
                margin: 0 auto;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            h2 {
                text-align: center;
                color: #4a90e2;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            th, td {
                padding: 8px 10px;
                border-bottom: 1px solid #ddd;
                text-align: left;
            }
            .section-title {
                background-color: #4a90e2;
                color: #fff;
                padding: 10px;
                margin: 20px 0 10px;
                font-size: 16px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Registration Details</h2>
            <table>
                <tr><th>First Name</th><td>${data.firstName}</td></tr>
                <tr><th>Middle Name</th><td>${data.middleName}</td></tr>
                <tr><th>Last Name</th><td>${data.lastName}</td></tr>
                <tr><th>Former/Maiden Name</th><td>${data.formerOrMaidenName}</td></tr>
                <tr><th>Date of Birth</th><td>${data.dateOfBirth}</td></tr>
                <tr><th>Gender</th><td>${data.gender}</td></tr>
                <tr><th>Email Address</th><td>${data.emailAddress}</td></tr>
                <tr><th>Country Code</th><td>${data.countryCode}</td></tr>
                <tr><th>Phone</th><td>${data.phone}</td></tr>
                <tr><th>Address</th><td>${data.address}</td></tr>
                <tr><th>Street Address 2</th><td>${data.streetAddress2}</td></tr>
                <tr><th>City</th><td>${data.city}</td></tr>
                <tr><th>State</th><td>${data.state}</td></tr>
                <tr><th>Country/Region</th><td>${data.countryOrRegion}</td></tr>
                <tr><th>Zip/Postal Code</th><td>${data.zipOrPostalCode}</td></tr>
                <tr><th>Resident</th><td>${data.resident}</td></tr>
                <tr><th>Enrollment Type</th><td>${data.enrollmentType}</td></tr>
                <tr><th>Course Type</th><td>${data.courseType}</td></tr>
                <tr><th>Current Level of Education</th><td>${data.presentLevelOfEducation}</td></tr>
                <tr><th>Graduation Year</th><td>${data.graduationYear}</td></tr>
                <tr><th>How did you hear about IHU?</th><td>${data.howDidYouHearAboutIHU}</td></tr>
                <tr><th>Objectives</th><td>${data.objectives}</td></tr>
                <tr><th>Signature</th><td>${data.signature}</td></tr>
            </table>
            <div class="section-title">Received Documents</div>
            <table>
                <tr><th>Diploma</th><td>${data.recieved.diploma ? 'Yes' : 'No'}</td></tr>
                <tr><th>Home School</th><td>${data.recieved.homeSchool ? 'Yes' : 'No'}</td></tr>
                <tr><th>GED</th><td>${data.recieved.ged ? 'Yes' : 'No'}</td></tr>
                <tr><th>Other</th><td>${data.recieved.other ? 'Yes' : 'No'}</td></tr>
            </table>
        </div>
    </body>
    </html>
    `

  )
}

export const RegistrationMailTemplateForStudent = ({ data }: {
  data: RegisterForm
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Application Received - International Hindu University</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f6f6f6;
          color: #333;
          padding: 20px;
        }
        .container {
          background-color: #fff;
          padding: 24px;
          max-width: 600px;
          margin: 0 auto;
          border: 1px solid #ddd;
          border-radius: 6px;
        }
        h2 {
          color: #4a90e2;
          text-align: center;
        }
        .signature {
          margin-top: 32px;
          font-size: 15px;
          color: #222;
        }
        .contact-info {
          margin-top: 12px;
          font-size: 14px;
          color: #555;
        }
        .footer {
          margin-top: 24px;
          font-size: 13px;
          color: #888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Application Received</h2>
        <p>Dear ${data.firstName} ${data.lastName},</p>
        <p>
          I hope this email finds you well.<br>
          I am writing to acknowledge the receipt of your application to International Hindu University (IHU). We appreciate your interest in furthering your education with us.
        </p>
        <p>
          Your application is now in the process of review by our admissions committee. Once the review is complete, we will provide you with an IHU Registration Number and guide you through the further steps required for registration to your desired course.
        </p>
        <p>
          Please be assured that we are committed to ensuring a smooth and efficient application process for all our prospective students. If you have any questions or require further assistance, please do not hesitate to reach out to us at <a href="mailto:contact@ihu-usa.org">contact@ihu-usa.org</a>
          <br><br>
          or<br><br>
          call <b>+1 (305) 519 6083</b> (USA Office) or <b>+91 8200697461</b> (India Office)
        </p>
        <p>
          Thank you for choosing International Hindu University for your academic pursuits. We look forward to potentially welcoming you into our community and assisting you in achieving your educational goals.
        </p>
        <div class="signature">
          Regards,<br>
          IHU Team,<br>
          International Hindu University
          <div class="contact-info">
            <a href="mailto:contact@ihu-usa.org">contact@ihu-usa.org</a> | <a href="https://www.ihu-usa.org">www.ihu-usa.org</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export const RegistrationNumberMailTemplate = ({ data }: {
  data: RegisterForm
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Welcome to IHU - Registration Number</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f6f6f6;
          color: #333;
          padding: 20px;
        }
        .container {
          background-color: #fff;
          padding: 24px;
          max-width: 600px;
          margin: 0 auto;
          border: 1px solid #ddd;
          border-radius: 6px;
        }
        h2 {
          color: #4a90e2;
          text-align: center;
        }
        .reg-number {
          font-size: 18px;
          color: #222;
          font-weight: bold;
          margin: 18px 0;
        }
        .course-link {
          display: inline-block;
          margin: 16px 0;
          padding: 10px 18px;
          background: #4a90e2;
          color: #fff;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
        }
        .signature {
          margin-top: 32px;
          font-size: 15px;
          color: #222;
        }
        .contact-info {
          margin-top: 12px;
          font-size: 14px;
          color: #555;
        }
        .footer {
          margin-top: 24px;
          font-size: 13px;
          color: #888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Welcome to IHU!</h2>
        <p>Dear ${data?.firstName} ${data?.lastName},</p>
        <p>
          We are thrilled to welcome you to IHU! On behalf of the entire IHU community, we want to extend our warmest greetings and congratulate you on your successful registration.<br>
          We hope this message finds you well. We are writing to confirm the receipt of your application to IHU and provide you with your registration number, an essential piece of information as you continue your journey with IHU.
        </p>
        <div class="reg-number">
          Your Registration Number: <span style="color:#4a90e2;">${data?.registrationNumber}</span>
        </div>
        <p>
          As part of our application process, we have assigned you a unique registration number. This number will serve as your identification throughout your time at IHU, so please keep it safe and readily accessible.
        </p>
        <p>
          With this registration number, kindly click on the following link and select the course you want to learn:
          <br>
          <a class="course-link" href="https://www.ihu-usa.org/Courses/Certification" target="_blank">Course Selection Application</a>
        </p>
        <p>
          Once again, congratulations on becoming a part of the IHU family! We believe that your journey here will be filled with growth, learning, and unforgettable experiences.
        </p>
        <p>
          If you have any questions or require further assistance, please do not hesitate to reach out to us at <a href="mailto:contact@ihu-usa.org">contact@ihu-usa.org</a>
          <br><br>
          or<br><br>
          call <b>+1 (305) 519 6083</b> (USA Office) or <b>+91 8200697461</b> (India Office)
        </p>
        <p>
          Wishing you all the best as you embark on this exciting chapter in your life.
        </p>
        <div class="signature">
          Regards,<br>
          IHU Team,<br>
          International Hindu University
          <div class="contact-info">
            <a href="mailto:contact@ihu-usa.org">contact@ihu-usa.org</a> | <a href="https://www.ihu-usa.org">www.ihu-usa.org</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export const CourseMailTemplate = ({ data, userData }: {
  data: CourseForm[],
  userData: RegisterForm
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Course Registration Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #eef2f7;
      padding: 20px;
      color: #333;
    }
    .container {
      max-width:600px;
      margin: auto;
      background: #fff;
      padding: 24px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    h2 {
      text-align: center;
      color: #2c3e50;
    }
    .course-list {
      margin: 16px 0 24px 0;
      padding-left: 22px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
    }
    .info-table th, .info-table td {
      padding: 8px 10px;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }
    .signature {
      margin-top: 32px;
      font-size: 15px;
      color: #222;
    }
    .contact-info {
      margin-top: 12px;
      font-size: 14px;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Course Registration Confirmation</h2>
    <p>
      Dear ${userData.firstName} ${userData.lastName},
      <br><br>
      Greetings from International Hindu University!<br>
      We are delighted to confirm your successful registration for the following course(s):
    </p>
    <ul class="course-list">
      ${data.map(course => `<li>${course.course}</li>`).join('')}
    </ul>
    <table class="info-table">
      <tr>
        <th>Transaction ID</th>
        <td>${data[0]?.transactionId || 'From Paypal'}</td>
      </tr>
      <tr>
        <th>Date and Time of Payment</th>
        <td>${data[0]?.createdAt || '2025-03-18 05:03:25'}</td>
      </tr>
      <tr>
        <th>Amount Paid</th>
        <td>${data[0]?.price?.amount} ${data[0]?.price?.currency}</td>
      </tr>
    </table>
    <p>
      You will receive a separate email shortly confirming your start date and access to your course material.
    </p>
    <p>
      If you have any questions or require further assistance, please do not hesitate to reach out to us at <a href="mailto:contact@ihu-usa.org">contact@ihu-usa.org</a> or call <b>+1 (305) 519 6083</b> (USA Office) or <b>+91 8200697461</b> (India Office).
    </p>
    <p>
      Once again, congratulations on your course registration, and we look forward to an enriching and rewarding academic experience together.
    </p>
    <div class="signature">
      Regards,<br>
      IHU Team,<br>
      International Hindu University
      <div class="contact-info">
        <a href="mailto:contact@ihu-usa.org">contact@ihu-usa.org</a> | <a href="https://www.ihu-usa.org">www.ihu-usa.org</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export const ContactFormMailTemplate = ({ data }: {
  data: Contact
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Contact Form Submission</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
      color: #333;
      padding: 20px;
    }
    .container {
      background-color: #fff;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    h2 {
      text-align: center;
      color: #4a90e2;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 8px 10px;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }
    .message-section {
      margin-top: 20px;
    }
    .message-label {
      font-weight: bold;
      color: #555;
    }
    .message-content {
      background: #f0f4fa;
      padding: 12px;
      border-radius: 4px;
      margin-top: 6px;
      white-space: pre-line;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Contact Form Submission</h2>
    <table>
      <tr><th>First Name</th><td>${data.firstName}</td></tr>
      <tr><th>Last Name</th><td>${data.lastName}</td></tr>
      <tr><th>Email</th><td>${data.email}</td></tr>
      <tr><th>Phone</th><td>${data.phone}</td></tr>
      <tr><th>Address</th><td>${data.address}</td></tr>
    </table>
    <div class="message-section">
      <div class="message-label">Message:</div>
      <div class="message-content">${data.message}</div>
    </div>
  </div>
</body>
</html>
  `;
}

export default RegistrationMailTemplate
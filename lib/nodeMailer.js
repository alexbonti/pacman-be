var nodemailer = require('nodemailer');
// var hbs = require('handlebars');
// var EmailTemplate = require('../lib/otpVerificationTemplate')
// var AccountTemplate = require('./accountCreationTemplate')
// var ContractTemplate = require('./contractAssignedTemplate')

var transporter = nodemailer.createTransport({
  pool: true,
  port: 587,
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

// var template = hbs.compile(EmailTemplate.htmlPage);
// var accountTemplate = hbs.compile(AccountTemplate.htmlPage);
// var contractTemplate = hbs.compile(ContractTemplate.htmlPage);

var mailOptions = {
  from: '' + process.env.APP_NAME + '<' + process.env.NODEMAILER_USER + '>',
  to: '',
  subject: 'OTP Verification : DO NOT REPLY',
  //html: EmailTemplate.htmlPage
};

var sendMail = function (to, OTP) {
  mailOptions.to = to;
//  mailOptions.html = template({ OTP });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

var accountMailOptions = {
  from: '' + process.env.APP_NAME + '<' + process.env.NODEMAILER_USER + '>',
  to: '',
  subject: "ACCOUNT CREATION : DO NOT REPLY",
  //text: 'This is an automated email to confirm your OTP which is :'
  html: accountTemplate.htmlPage
};

var sendAccountMail = function (to, pass) {
  accountMailOptions.to = to;
  var data = {
    InitialPassword: pass
  }
  console.log(pass)
  //mailOptions.text = mailOptions.text.concat(' ',text);
  accountMailOptions.html = accountTemplate(data);


  transporter.sendMail(accountMailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

var contractMailOptions = {
  from: '' + process.env.APP_NAME + '<' + process.env.NODEMAILER_USER + '>',
  to: '',
  subject: "CONTRACT ASSIGNED : DO NOT REPLY",
  //text: 'This is an automated email to confirm your OTP which is :'
  html: contractTemplate.htmlPage
};

var sendContractMail = function (to,fullName) {
  contractMailOptions.to = to;
  data = {
    name: fullName
  }
  //mailOptions.text = mailOptions.text.concat(' ',text);
  contractMailOptions.html = contractTemplate(data);


  transporter.sendMail(contractMailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendMail: sendMail,
  sendAccountMail: sendAccountMail,
  sendContractMail: sendContractMail
}

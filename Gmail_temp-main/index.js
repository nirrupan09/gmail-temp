let url = `https://gmail.googleapis.com/gmail/v1/users/`;
let scope = "https://mail.google.com/";
let client_id =
  "483228225913-7tmuhk2cicdd85nbo4nboaujmn6lr0sk.apps.googleusercontent.com";

let info_body = document.querySelector(".body-info");
let token_url = "https://accounts.google.com/o/oauth2/token";
let draft_btn = document.querySelector('.draft-btn')
let send_btn = document.querySelector('.send-btn')
let inbox_btn = document.querySelector('.inbox-btn')
let compose_btn = document.querySelector('.compose-btn')


function onSignIn(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
//         console.log("ID: " + profile.getId()); // Don't send this directly to your server!
         let userId = profile.getEmail();

        // The ID token you need to pass to your backend:
        var access_token = googleUser.getAuthResponse(true).access_token;
        console.log("Access Token: " + access_token);
      
let messages = []
async function getData() {
  try{
  let res = await fetch(
    url +
      `${userId}/messages?access_token=${access_token}`
  );
  let data = await res.json();
  console.log(data);
  
  data.messages.forEach((e) => getMessages(e.id))
  } catch(err){
    console.log(err)
  }
}

getData();
  
async function getMessages(id) {
    try {
      let msg = await fetch(
        url + `${userId}/messages/${id}?access_token=${access_token}`
      );
      let msg_res = await msg.json();
      messages.push(msg_res)
    } catch (err) {
      return err;
    }
  }
  
 console.log(messages);
  
  draft_btn.addEventListener('click', displayDataDrafts);
  
 function displayDataDrafts() {
  info_body.innerHTML = "";
  messages.filter((e)=> e.labelIds[0]==="DRAFT").forEach((data) => {
    let msg_row = createTag("div", "row msg_row");
    let msg_ckbx = createTag("div", "col-lg-2 col-sm-4 msg_ckbx");
    msg_ckbx.innerHTML = `<input type="checkbox" id=${data.id}>&nbsp&nbsp
    <i class="fa fa-star-o" aria-hidden="true"></i>`;
    msg_row.setAttribute("style", "border-bottom: 1px solid gray");
    let msg_from = createTag("div", "col-lg-2 col-sm-4 msg_from");
    msg_from.innerText = data.payload.headers[4].value.split('<')[0];
    let msg_body = createTag("div", "col-lg-6 col-sm-12 msg_body");
    msg_body.innerHTML = `<b>${data.payload.headers[3].value}</b> - ${truncate(data.snippet)}`;
    let msg_date = createTag("div", "col-lg-2 col-sm-3 date");
   msg_date.setAttribute("style","font-size:15px")
    let date = new Date(data.payload.headers.find((e)=>e.name === "Date").value);
    let today = new Date();
    let date_time = date.getDate()===today.getDate()?`${
    date.getHours() + 1 > 12 ? date.getHours() + 1 - 12 : date.getHours()
  }:${date.getMinutes()} ${date.getHours() + 1 > 12 ? "PM" : "AM"}`:`Apr ${date.getDate()}`;
    msg_date.innerText = date_time;

    msg_row.append(msg_ckbx, msg_from, msg_body, msg_date);
    info_body.append(msg_row);
  });
  if (info_body.innerHTML !== "") {
    let send_draft = createTag("div", "col-4 mt-2");
    send_draft.innerHTML = `<button class="btn btn-primary btn-sm" onclick="sendDraft()">Send Draft</button>`;
    info_body.append(send_draft);
  }
}

send_btn.addEventListener('click', displayDataSend);
  
function displayDataSend() {
  info_body.innerHTML = "";
  messages.filter((e)=> e.labelIds[0]==="SENT").forEach((data) => {
    let msg_row = createTag("div", "row msg_row");
    let msg_ckbx = createTag("div", "col-lg-1 col-sm-4 msg_ckbx");
    msg_ckbx.innerHTML = `<input type="checkbox" id=${data.id}>&nbsp&nbsp
    <i class="fa fa-star-o" aria-hidden="true"></i>`;
    msg_row.setAttribute("style", "border-bottom: 1px solid gray");
    let msg_from = createTag("div", "col-lg-2 col-sm-4 msg_from");
    msg_from.innerText = data.payload.headers[5].value.split('<')[0];
    let msg_body = createTag("div", "col-lg-7 col-sm-12 msg_body");
    msg_body.innerHTML = `<b>${data.payload.headers[3].value}</b> - ${truncate(data.snippet)}`;
    let msg_date = createTag("div", "col-lg-2 col-sm-3 date");
    msg_date.setAttribute("style","font-size:15px")
    let date = new Date(data.payload.headers.find((e)=>e.name === "Date").value);
    let today = new Date();
    let date_time = date.getDate()===today.getDate()?`${
    date.getHours() + 1 > 12 ? date.getHours() + 1 - 12 : date.getHours()
  }:${date.getMinutes()} ${date.getHours() + 1 > 12 ? "PM" : "AM"}`:`Apr ${date.getDate()}`;
    msg_date.innerText = date_time;
    msg_row.append(msg_ckbx, msg_from, msg_body, msg_date);
    info_body.append(msg_row);
  });
}

inbox_btn.addEventListener('click', displayDataInbox);
  
function displayDataInbox() {
  info_body.innerHTML = "";
  messages.filter((e)=> e.labelIds[2]==="INBOX" && e.labelIds[1]==="CATEGORY_PERSONAL").forEach((data) => {
    let msg_row = createTag("div", "row msg_row");
    let msg_ckbx = createTag("div", "col-lg-2 col-sm-4 msg_ckbx");
    msg_ckbx.innerHTML = `<input type="checkbox" id=${data.id}>&nbsp&nbsp
    <i class="fa fa-star-o" aria-hidden="true"></i>`;
    msg_row.setAttribute("style", "border-bottom: 1px solid gray");
    let msg_from = createTag("div", "col-lg-2 col-sm-4 msg_from");
    msg_from.innerText = data.payload.headers.find((e)=>e.name === "From").value.split('<')[0];
    let msg_body = createTag("div", "col-lg-7 col-sm-12 msg_body");
    msg_body.innerHTML = `<b>${truncate(data.payload.headers.find((e)=>e.name === "Subject").value)}</b> - ${truncate(data.snippet)}`;
    let msg_date = createTag("div", "col-lg-1 col-sm-3 date");
    msg_date.setAttribute("style","font-size:15px")
    let date = new Date(data.payload.headers.find((e)=>e.name === "Date").value);
    let today = new Date();
    let date_time = date.getDate()===today.getDate()?`${
    date.getHours() + 1 > 12 ? date.getHours() + 1 - 12 : date.getHours()
  }:${date.getMinutes()} ${date.getHours() + 1 > 12 ? "PM" : "AM"}`:`Apr ${date.getDate()}`;
    msg_date.innerText = date_time;

    msg_row.append(msg_ckbx, msg_from, msg_body, msg_date);
    info_body.append(msg_row);
  });
}
  
   displayCompose();
  
let composeDraft_btn = document.querySelector('#draft')
let composeSend_btn = document.querySelector('#send')

composeDraft_btn.addEventListener('click', composeDraft);
  
function composeDraft() {
  let message = `From: userId\r\n To: ${document.querySelector("#recipient").value}\r\n Subject: ${document.querySelector("#subject").value} \r\n\r\n
  ${document.querySelector("#msg_body").value}`;
  
  // The body needs to be base64url encoded.
  const encodedMessage = btoa(message)

  const reallyEncodedMessage = encodedMessage.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  let date = new Date();
  let date_time = `${
    date.getHours() + 1 > 12 ? date.getHours() + 1 - 12 : date.getHours()
  }:${date.getMinutes()} ${date.getHours() + 1 > 12 ? "PM" : "AM"}`;
  if (recipient === "") {
    alert("Please enter Recipient to save draft");
  } else {
   
    alert("Message saved as draft. Please check in Drafts");
    recipient = "";
    subject = "";
    message = "";
  }
}

composeSend_btn.addEventListener('click', composeSend);

function composeSend() {
  let recipient = document.querySelector("#recipient").value;
  let subject = document.querySelector("#subject").value;
  let message = document.querySelector("#msg_body").value;
  let date = new Date();
  let date_time = `${
    date.getHours() + 1 > 12 ? date.getHours() + 1 - 12 : date.getHours()
  }:${date.getMinutes()} ${date.getHours() + 1 > 12 ? "PM" : "AM"}`;
  if (recipient === "") {
    alert("Please enter Recipient to send");
  } else {
  Email.send({
        Host: "smtp.elasticemail.com", //host-2525
        Username: "tharunece95@gmail.com",
        Password: "DFD4DA7DE010242519BC295F9BF43845D36F",
        To: "tharuncoder95@gmail.com",
        From: "tharunece95@gmail.com",
        Subject: "This is the subject",
        Body: "And this is the body",
      }).then((message) => alert("Message Send", message));
    recipient = "";
    subject = "";
    message = "";
  }
}

  compose_btn.addEventListener('click', displayCompose);
 
function displayCompose() {
  info_body.innerHTML = "";
  let msg_compose = createTag("div", "row msg_compose");
  let msg_header = createTag("div", "col-lg-12 col-sm-12 msg_header ");
  msg_header.innerText = "New Message";
  let msg_to = createTag("div", "col-lg-12 col-sm-12 mt-2");
  msg_to.innerHTML = `<input type="email" id="recipient" placeholder="Recipient" class="form-control"/>`;
  let msg_subject = createTag("div", "col-lg-12 col-sm-12 mt-2");
  msg_subject.innerHTML = `<input type="text" id="subject" placeholder="Subject" class="form-control"/>`;
  let msg_body = createTag("div", "col-lg-12 col-sm-12 mt-2");
  msg_body.innerHTML = `<textarea id="msg_body" cols="30" rows="10" class="form-control"></textarea>`;
  let btns = createTag("div", "col-lg-12 col-sm-12 mt-2");
  btns.innerHTML = `<button class="btn btn-primary btn-sm composeSend-btn" id="send">Send</button>
  <button class="btn btn-secondary btn-sm composeDraft-btn" id="draft">Save as Draft</button>`;

  msg_compose.append(msg_header, msg_to, msg_subject, msg_body, btns);
  info_body.append(msg_compose);
}

 
}

// function sendDraft() {
//   send.push(...drafts);
//   drafts.length === 0;
//   info_body.innerHTML = "";
//   alert("Message Send. Plese check in send items");
// }



function createTag(ele, ele_class) {
  let element = document.createElement(ele);
  element.setAttribute("class", ele_class);
  return element;
}

function truncate(str) {
  if (str.length > 30) return str.substr(0, 30) + "...";
  else return str;
}

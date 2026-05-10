let currentUser = null;

function showSignup() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
}

function showLogin() {
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
}

function signup() {
  const user = document.getElementById("signupUser").value.trim();
  const pass = document.getElementById("signupPass").value.trim();

  if (!user || !pass) {
    alert("Please fill in all fields.");
    return;
  }

  if (localStorage.getItem(user)) {
    alert("Username already exists!");
    return;
  }

  localStorage.setItem(user, JSON.stringify({password: pass, bio: null}));
  alert("Account created successfully! You can now log in.");
  showLogin();
}

function login() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  const account = localStorage.getItem(user);
  if (!account) {
    alert("This username is not registered yet. Please sign up first.");
    showSignup();
    return;
  }

  const data = JSON.parse(account);
  if (data.password !== pass) {
    alert("Incorrect password!");
    return;
  }

  currentUser = user;
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("bioForm").style.display = "block";

  if (data.bio) {
    document.getElementById("name").value = data.bio.name;
    document.getElementById("address").value = data.bio.address;
    document.getElementById("phone").value = data.bio.phone;
    document.getElementById("guardianName").value = data.bio.guardianName;
    document.getElementById("guardianPhone").value = data.bio.guardianPhone;
    document.getElementById("facebook").value = data.bio.facebook;
    document.getElementById("instagram").value = data.bio.instagram;
    if (data.bio.photo) {
      document.getElementById("photoPreview").src = data.bio.photo;
      document.getElementById("photoPreview").style.display = "block";
    }
    generateQR(data.bio);
  }
}

function previewPhoto() {
  const file = document.getElementById("photo").files[0];
  const preview = document.getElementById("photoPreview");
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

function generateQR() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const guardianName = document.getElementById("guardianName").value;
  const guardianPhone = document.getElementById("guardianPhone").value;
  const facebook = document.getElementById("facebook").value;
  const instagram = document.getElementById("instagram").value;
  const photo = document.getElementById("photoPreview").src;

  const bioData = {name, address, phone, guardianName, guardianPhone, facebook, instagram, photo};
  localStorage.setItem(currentUser, JSON.stringify({
    password: JSON.parse(localStorage.getItem(currentUser)).password,
    bio: bioData
  }));

  let socialLinks = "";
  if (facebook) {
    socialLinks += `<p><strong>Facebook:</strong> <a href="${facebook}" target="_blank">${facebook}</a></p>`;
  }
  if (instagram) {
    socialLinks += `<p><strong>Instagram:</strong> <a href="https://instagram.com/${instagram}" target="_blank">@${instagram}</a></p>`;
  }

  const bioPage = `
    <html>
      <head>
        <title>${name}'s Biography</title>
        <style>
          body { font-family: Arial; background:#f9f9f9; text-align:center; padding:20px; }
          img { max-width:150px; border-radius:8px; margin:10px; }
          .card { background:#fff; padding:20px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.2); display:inline-block; }
          a { color:#ff6a88; text-decoration:none; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>${name}</h2>
          ${photo ? `<img src="${photo}">` : ""}
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>User Phone:</strong> ${phone}</p>
          <p><strong>Guardian:</strong> ${guardianName} (${guardianPhone})</p>
          ${socialLinks}
        </div>
      </body>
    </html>
  `;

  const bioDataUrl = "data:text/html;base64,"}
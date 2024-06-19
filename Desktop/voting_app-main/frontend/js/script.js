document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        name: signupForm.name.value,
        age: signupForm.age.value,
        email: signupForm.email.value,
        mobile: signupForm.mobile.value,
        address: signupForm.address.value,
        aadharCardNumber: signupForm.aadharCardNumber.value,
        password: signupForm.password.value,
        role: signupForm.role.value,
      };
      try {
        const response = await fetch("http://localhost:3000/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (response.ok) {
          alert("Signup successful!");
          window.location.href = "login.html";
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        aadharCardNumber: loginForm.aadharCardNumber.value,
        password: loginForm.password.value,
      };
      try {
        const response = await fetch("http://localhost:3000/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (response.ok) {
          localStorage.setItem("token", result.token);
          window.location.href = "profile.html";
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    });
  }

  if (window.location.pathname.endsWith("profile.html")) {
    fetchProfileData();
  }

  if (window.location.pathname.endsWith("candidates.html")) {
    fetchCandidates();
  }

  const updatePasswordForm = document.getElementById("updatePasswordForm");
  if (updatePasswordForm) {
    updatePasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const currentPassword = updatePasswordForm.currentPassword.value;
      const newPassword = updatePasswordForm.newPassword.value;

      try {
        const response = await fetch(
          "http://localhost:3000/user/profile/password",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
          }
        );
        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          updatePasswordForm.reset(); // Reset form fields
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    });
  }
});

async function fetchProfileData() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:3000/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    if (response.ok) {
      const profileData = document.getElementById("profileData");
      profileData.innerHTML = `
        <p>Aadhar Card Number: ${result.user.aadharCardNumber}</p>
        <p>Role: ${result.user.role}</p>
      `;
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
}

async function fetchCandidates() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Token not found. Please log in.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/candidates", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      if (response.ok) {
        const candidatesList = document.getElementById("candidatesList");
        candidatesList.innerHTML = result
          .map(
            (candidate) => `
              <div>
                <p>ID: ${candidate._id}</p>
                <p>Name: ${candidate.name}</p>
                <p>Party: ${candidate.party}</p>
                <p>Age: ${candidate.age}</p>
                <p>Vote Count: ${candidate.voteCount}</p>
              </div>
            `
          )
          .join("");
      } else {
        alert(`Error: ${result.error}`);
      }
    } else {
      const text = await response.text();
      throw new Error(`Unexpected response format: ${text}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

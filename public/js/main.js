document.querySelectorAll('.field input').forEach(input => {
  input.addEventListener('blur', () => {
    input.classList.toggle('invalid', !input.checkValidity());
  });
});


function checkPasswords() {
  const password = document.getElementById("f-pass").value;
  const confirmPassword = document.getElementById("f-pass2").value;

  const error = document.querySelector("#f-pass2 + .err");

  if (password !== confirmPassword) {
    error.innerText = "Password is not much!";
    error.style.display = "block";
    return;
  }

  error.style.display = "none";

  
  document.querySelector("form").submit();
  alert("Succesfully created new user");
}
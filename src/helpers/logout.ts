function logout(message = "An error has occured, logging out.") {
  alert(message);
  localStorage.clear();
  window.location.replace(window.location.origin);
}

export { logout };

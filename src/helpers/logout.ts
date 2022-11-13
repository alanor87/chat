function logout(message = "An error has occured, logging out.") {
  alert(message);
  sessionStorage.clear();
  window.location.replace(window.location.origin);
}

export { logout };

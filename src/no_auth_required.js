/***
 * @todo Redirect the user to main page if token is present.
 */
window.onload = function() {
    if(localStorage.getItem('token')) {
        window.location.href = '/';
    }
}